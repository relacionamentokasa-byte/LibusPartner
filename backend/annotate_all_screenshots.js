const sharp = require('sharp');
const path = require('path');

const outDir = path.resolve('manual_screenshots');

async function annotateAll() {
  // 1. ANOTAR LOGIN
  {
    const input = path.join(outDir, '01_login.png');
    const output = path.join(outDir, '01_login_annotated.png');
    const meta = await sharp(input).metadata();
    const svg = Buffer.from(`
      <svg width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arr-rose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#E11D48"/>
          </marker>
          <marker id="arr-sky" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284C7"/>
          </marker>
          <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/>
          </filter>
        </defs>

        <rect x="1450" y="420" width="245" height="70" rx="14" fill="none" stroke="#E11D48" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 1880 340 Q 1760 360 1705 435" fill="none" stroke="#E11D48" stroke-width="6" marker-end="url(#arr-rose)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1870" y="290" width="430" height="76" rx="14" fill="#0F172A" stroke="#E11D48" stroke-width="3"/>
          <circle cx="1908" cy="328" r="22" fill="#E11D48"/>
          <text x="1908" y="336" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1942" y="322" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Seletor Bilíngue (PT / ES)</text>
          <text x="1942" y="348" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Alterne entre Português e Espanhol</text>
        </g>

        <rect x="895" y="790" width="765" height="235" rx="16" fill="none" stroke="#0284C7" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 640 850 Q 770 870 885 890" fill="none" stroke="#0284C7" stroke-width="6" marker-end="url(#arr-sky)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="250" y="810" width="380" height="76" rx="14" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
          <circle cx="288" cy="848" r="22" fill="#0284C7"/>
          <text x="288" y="856" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="322" y="842" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Acesso Corporativo</text>
          <text x="322" y="868" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">E-mail corporativo e senha pessoal</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 01_login_annotated gerado');
  }

  // 2. ANOTAR DASHBOARD REAL
  {
    const input = path.join(outDir, '02_dashboard_real.png');
    const output = path.join(outDir, '02_dashboard_annotated.png');
    const meta = await sharp(input).metadata();
    const svg = Buffer.from(`
      <svg width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arr-rose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#E11D48"/>
          </marker>
          <marker id="arr-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
          </marker>
          <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/>
          </filter>
        </defs>

        <rect x="2380" y="270" width="370" height="90" rx="16" fill="none" stroke="#E11D48" stroke-width="5" stroke-dasharray="10,6" filter="url(#sh)"/>
        <path d="M 2200 180 Q 2320 180 2400 260" fill="none" stroke="#E11D48" stroke-width="6" marker-end="url(#arr-rose)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1800" y="140" width="410" height="82" rx="14" fill="#0F172A" stroke="#E11D48" stroke-width="3"/>
          <circle cx="1840" cy="181" r="22" fill="#E11D48"/>
          <text x="1840" y="189" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1876" y="173" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Nova Avaliacao</text>
          <text x="1876" y="201" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Inicie um novo teste em 1 clique</text>
        </g>

        <rect x="620" y="440" width="2130" height="190" rx="18" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="10,6" filter="url(#sh)"/>
        <path d="M 400 500 Q 520 480 610 520" fill="none" stroke="#059669" stroke-width="6" marker-end="url(#arr-green)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="40" y="460" width="400" height="82" rx="14" fill="#0F172A" stroke="#059669" stroke-width="3"/>
          <circle cx="80" cy="501" r="22" fill="#059669"/>
          <text x="80" y="509" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="116" y="493" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Indicadores Executivos</text>
          <text x="116" y="521" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Volume, clientes, aceitacao TAU e marcas</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 02_dashboard_annotated gerado');
  }

  // 3. ANOTAR CATÁLOGO REAL
  {
    const input = path.join(outDir, '03_catalog_real.png');
    const output = path.join(outDir, '03_catalog_annotated.png');
    const meta = await sharp(input).metadata();
    const svg = Buffer.from(`
      <svg width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arr-rose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#E11D48"/>
          </marker>
          <marker id="arr-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
          </marker>
          <marker id="arr-sky" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284C7"/>
          </marker>
          <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/>
          </filter>
        </defs>

        <!-- Destaque BLS em 1º Lugar -->
        <rect x="910" y="380" width="490" height="90" rx="16" fill="none" stroke="#E11D48" stroke-width="5" stroke-dasharray="10,6" filter="url(#sh)"/>
        <path d="M 1580 300 Q 1460 320 1405 380" fill="none" stroke="#E11D48" stroke-width="6" marker-end="url(#arr-rose)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1570" y="250" width="460" height="82" rx="14" fill="#0F172A" stroke="#E11D48" stroke-width="3"/>
          <circle cx="1610" cy="291" r="22" fill="#E11D48"/>
          <text x="1610" y="299" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1646" y="283" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Destaque Linha BLS</text>
          <text x="1646" y="311" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Protecao Respiratoria fixa em 1º lugar</text>
        </g>

        <!-- Botao verde de C.A. Oficial MTE -->
        <rect x="910" y="695" width="220" height="56" rx="12" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 680 724 L 900 724" fill="none" stroke="#059669" stroke-width="6" marker-end="url(#arr-green)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="250" y="682" width="420" height="82" rx="14" fill="#0F172A" stroke="#059669" stroke-width="3"/>
          <circle cx="290" cy="723" r="22" fill="#059669"/>
          <text x="290" y="731" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="326" y="715" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Consulta Oficial de C.A.</text>
          <text x="326" y="743" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Link direto ao Ministerio do Trabalho</text>
        </g>

        <!-- Botao Homologar Duelo Direto -->
        <rect x="2510" y="680" width="220" height="65" rx="14" fill="none" stroke="#0284C7" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 2330 630 Q 2420 650 2500 685" fill="none" stroke="#0284C7" stroke-width="6" marker-end="url(#arr-sky)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1980" y="580" width="360" height="82" rx="14" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
          <circle cx="2020" cy="621" r="22" fill="#0284C7"/>
          <text x="2020" y="629" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">3</text>
          <text x="2056" y="613" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Homologacao Direta</text>
          <text x="2056" y="641" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Inicie o teste 1x1 em campo</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 03_catalog_annotated gerado');
  }

  // 4. ANOTAR LAUDO REAL COM BOTÕES WHATSAPP E IMPRIMIR
  {
    const input = path.join(outDir, '05_laudo_real.png');
    const output = path.join(outDir, '05_laudo_annotated.png');
    const meta = await sharp(input).metadata();
    const svg = Buffer.from(`
      <svg width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arr-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
          </marker>
          <marker id="arr-slate" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0F172A"/>
          </marker>
          <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/>
          </filter>
        </defs>

        <!-- Botao WhatsApp -->
        <rect x="2090" y="215" width="220" height="70" rx="14" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 1940 150 Q 2020 150 2085 220" fill="none" stroke="#059669" stroke-width="6" marker-end="url(#arr-green)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1560" y="110" width="390" height="82" rx="14" fill="#0F172A" stroke="#059669" stroke-width="3"/>
          <circle cx="1600" cy="151" r="22" fill="#059669"/>
          <text x="1600" y="159" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1636" y="143" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Envio Direto WhatsApp</text>
          <text x="1636" y="171" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Compartilhe o laudo online em 1 toque</text>
        </g>

        <!-- Botao Imprimir / PDF -->
        <rect x="2330" y="215" width="310" height="70" rx="14" fill="none" stroke="#0F172A" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 2485 130 L 2485 205" fill="none" stroke="#0F172A" stroke-width="6" marker-end="url(#arr-slate)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="2300" y="50" width="370" height="82" rx="14" fill="#0F172A" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="2340" cy="91" r="22" fill="#0284C7"/>
          <text x="2340" y="99" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="2376" y="83" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Imprimir / Gerar PDF</text>
          <text x="2376" y="111" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Emissao oficial da folha A4</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 05_laudo_annotated gerado');
  }

  console.log('🎉 Todas as imagens foram anotadas com sucesso!');
}

annotateAll().catch(console.error);
