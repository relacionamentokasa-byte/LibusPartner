/**
 * Cliente de Integração com o Odoo ERP (Libus)
 * Suporta comunicação JSON-RPC / XML-RPC com autenticação por API Key ou senha de usuário.
 *
 * Modelos Odoo suportados:
 * - product.product / product.template (Catálogo de EPIs Libus)
 * - res.partner (Empresas / Clientes)
 * - crm.lead (Oportunidades de Homologação)
 * - sale.order / sale.order.line (Cotações e Propostas Comerciais Pós-Homologação)
 */

export interface OdooConfig {
  url: string;
  db: string;
  username: string;
  apiKey: string;
}

export interface OdooProductSyncInput {
  id: number;
  name: string;
  default_code?: string; // Código Interno SKU
  barcode?: string;
  list_price?: number;
  categ_id?: [number, string];
  active?: boolean;
}

export interface OdooPartnerInput {
  name: string;
  tradeName?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export interface OdooProposalInput {
  partnerId: number;
  evaluationId: string;
  companyName: string;
  technicianName: string;
  notes?: string;
  items: Array<{
    odooProductId: number;
    quantity: number;
    priceUnit: number;
  }>;
}

export class OdooClient {
  private config: OdooConfig;
  private uid: number | null = null;

  constructor(config?: Partial<OdooConfig>) {
    this.config = {
      url: config?.url || process.env.ODOO_URL || '',
      db: config?.db || process.env.ODOO_DB || '',
      username: config?.username || process.env.ODOO_USERNAME || '',
      apiKey: config?.apiKey || process.env.ODOO_API_KEY || ''
    };
  }

  public isConfigured(): boolean {
    return !!(this.config.url && this.config.db && this.config.username && this.config.apiKey);
  }

  /**
   * Chamada JSON-RPC genérica para endpoints do Odoo (/jsonrpc)
   */
  private async jsonRpcCall<T>(service: 'common' | 'object', method: string, args: any[]): Promise<T> {
    if (!this.config.url) {
      throw new Error('URL do Odoo não configurada (ODOO_URL no .env)');
    }

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service,
        method,
        args
      },
      id: Math.floor(Math.random() * 1000000)
    };

    const response = await fetch(`${this.config.url.replace(/\/+$/, '')}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Falha HTTP ao comunicar com Odoo: ${response.status} ${response.statusText}`);
    }

    const data: any = await response.json();

    if (data.error) {
      const msg = data.error.data?.message || data.error.message || 'Erro desconhecido retornado pelo Odoo';
      throw new Error(`[Odoo Error]: ${msg}`);
    }

    return data.result as T;
  }

  /**
   * Autenticação no Odoo e obtenção do UID de sessão
   */
  public async authenticate(): Promise<number> {
    if (this.uid) return this.uid;

    if (!this.isConfigured()) {
      throw new Error('Configurações incompletas do Odoo (ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY)');
    }

    const uid = await this.jsonRpcCall<number | false>(
      'common',
      'authenticate',
      [this.config.db, this.config.username, this.config.apiKey, {}]
    );

    if (!uid) {
      throw new Error('Falha na autenticação com o Odoo. Verifique ODOO_DB, ODOO_USERNAME e ODOO_API_KEY.');
    }

    this.uid = uid;
    return uid;
  }

  /**
   * Executa métodos em modelos Odoo (execute_kw)
   */
  public async executeKw<T>(model: string, method: string, args: any[] = [], kwargs: Record<string, any> = {}): Promise<T> {
    const uid = await this.authenticate();
    return await this.jsonRpcCall<T>('object', 'execute_kw', [
      this.config.db,
      uid,
      this.config.apiKey,
      model,
      method,
      args,
      kwargs
    ]);
  }

  /**
   * Busca produtos Libus no Odoo por categoria ou SKU
   */
  public async fetchLibusProducts(domain: any[] = [], fields: string[] = ['id', 'name', 'default_code', 'list_price', 'categ_id', 'active']): Promise<OdooProductSyncInput[]> {
    return await this.executeKw<OdooProductSyncInput[]>(
      'product.product',
      'search_read',
      [domain],
      { fields, limit: 200 }
    );
  }

  /**
   * Localiza ou cadastra uma empresa cliente como res.partner no Odoo
   */
  public async syncPartner(partner: OdooPartnerInput): Promise<number> {
    // 1. Tentar localizar por CNPJ se informado
    if (partner.cnpj) {
      const cleanCnpj = partner.cnpj.replace(/\D/g, '');
      const existing: any[] = await this.executeKw(
        'res.partner',
        'search_read',
        [[['vat', 'ilike', cleanCnpj]]],
        { fields: ['id', 'name'], limit: 1 }
      );
      if (existing.length > 0) {
        return existing[0].id;
      }
    }

    // 2. Tentar localizar por Nome Fantasia / Razão Social
    const nameSearch: any[] = await this.executeKw(
      'res.partner',
      'search_read',
      [[['name', 'ilike', partner.name]]],
      { fields: ['id', 'name'], limit: 1 }
    );
    if (nameSearch.length > 0) {
      return nameSearch[0].id;
    }

    // 3. Criar novo parceiro no Odoo
    const partnerId = await this.executeKw<number>('res.partner', 'create', [{
      name: partner.name,
      is_company: true,
      email: partner.email || false,
      phone: partner.phone || false,
      city: partner.city || false,
      vat: partner.cnpj || false,
      comment: 'Cadastrado automaticamente via plataforma Libus Partner'
    }]);

    return partnerId;
  }

  /**
   * Cria uma Oportunidade no CRM do Odoo (crm.lead) a partir de uma Homologação
   */
  public async createCrmOpportunity(data: {
    partnerId: number;
    title: string;
    description: string;
    expectedRevenue?: number;
  }): Promise<number> {
    const leadId = await this.executeKw<number>('crm.lead', 'create', [{
      name: data.title,
      partner_id: data.partnerId,
      description: data.description,
      expected_revenue: data.expectedRevenue || 0,
      type: 'opportunity',
      priority: '2'
    }]);

    return leadId;
  }

  /**
   * Cria uma Cotação / Ordem de Venda (sale.order) no Odoo pós-laudo
   */
  public async createSaleOrder(proposal: OdooProposalInput): Promise<number> {
    const orderLines = proposal.items.map(item => [
      0,
      0,
      {
        product_id: item.odooProductId,
        product_uom_qty: item.quantity,
        price_unit: item.priceUnit
      }
    ]);

    const orderId = await this.executeKw<number>('sale.order', 'create', [{
      partner_id: proposal.partnerId,
      note: `Cotação gerada automaticamente a partir do laudo homologado na plataforma Libus Partner.\nAvaliação ID: ${proposal.evaluationId}\nEspecialista: ${proposal.technicianName}\n\nObservações: ${proposal.notes || 'N/A'}`,
      order_line: orderLines
    }]);

    return orderId;
  }
}

export const odooClient = new OdooClient();
