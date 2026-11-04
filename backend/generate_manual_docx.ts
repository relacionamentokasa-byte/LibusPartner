import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

async function generateManualDocx() {
  const primaryColor = '003366'; // Azul Libus Corporativo
  const secondaryColor = '1E293B'; // Slate Escuro
  const accentColor = 'E11D48'; // Libus Magenta
  const lightBg = 'F8FAFC';
  const tableHeaderBg = '0F172A';

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 22, // 11pt
            color: '334155'
          },
          paragraph: {
            spacing: {
              line: 300,
              after: 140
            }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // Capa / Cabeçalho
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: 'MANUAL OPERACIONAL DO USUÁRIO & GUIA DE CAMPO',
                bold: true,
                size: 32,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'PLATAFORMA LIBUS PARTNER — ENGENHARIA DE SEGURANÇA & HOMOLOGAÇÃO TÉCNICA',
                bold: true,
                size: 20,
                color: accentColor
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Versão 2.0 • Edição Bilíngue (Brasil & América Latina) • Compatível com PC, Tablet e Celular (PWA)',
                size: 18,
                color: '64748B',
                italic: true
              })
            ]
          }),

          new Paragraph({
            spacing: { after: 260 },
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: 'CBD5E1'
              })
            ]
          }),

          // 1. Visão Geral e Objetivo
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 140 },
            children: [
              new TextRun({
                text: '1. VISÃO GERAL & OBJETIVO DA PLATAFORMA',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'O '
              }),
              new TextRun({ text: 'Libus Partner', bold: true }),
              new TextRun({
                text: ' é a ferramenta oficial de campo da Libus desenvolvida para transformar testes práticos de EPI em laudos técnicos e econômicos auditáveis com validade jurídica. O sistema substitui fichas em papel e planilhas desconexas por um ecossistema digital que automatiza o confronto 1x1 com concorrentes (3M, MSA, Honeywell), mensura o Custo Total de Posse (TCO), calcula a pegada ecológica (redução de descarte de resíduos em Kg) e colhe a dupla assinatura biométrica em tela.'
              })
            ]
          }),

          // Tabela de Perfis de Acesso
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Perfil de Acesso', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Público-Alvo', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Escopo de Visibilidade & Ações', bold: true, color: 'FFFFFF' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'TÉCNICO', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Especialistas e promotores técnicos em campo.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Visualiza e altera estritamente os laudos iniciados por ele mesmo (Row-Level RBAC). Não acessa dados de terceiros.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'GESTOR', bold: true, color: primaryColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Gerentes comerciais e líderes técnicos regionais.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Visão executiva total de todos os testes da equipe, gestão de usuários técnicos, aprovação de laudos e exportação.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ADMIN', bold: true, color: '059669' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Gestores de TI e Engenharia Corporativa.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Controle de governança mestre, trilha de auditoria de segurança global e configuração do catálogo.' })] })]
                  })
                ]
              })
            ]
          }),

          // 2. Primeiro Acesso e Segurança
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '2. PRIMEIRO ACESSO & SEGURANÇA DA CONTA',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Acesse o endereço oficial: ' }),
              new TextRun({ text: 'https://libus-partner-brown.vercel.app/login', bold: true, color: accentColor }),
              new TextRun({ text: ' através de qualquer navegador moderno (Chrome, Safari, Edge ou Firefox).' })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Insira seu ' }),
              new TextRun({ text: 'E-mail Corporativo cadastrado', bold: true }),
              new TextRun({ text: ' e a senha provisória padrão: ' }),
              new TextRun({ text: 'Libus@2026', bold: true, color: primaryColor }),
              new TextRun({ text: '.' })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. ' }),
              new TextRun({ text: 'Troca Obrigatória de Senha: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Por diretriz de compliance e proteção de dados, no primeiro login o sistema bloqueará a tela e exigirá que você cadastre uma senha pessoal definitiva com no mínimo 8 dígitos, combinando letras e números.' })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. ' }),
              new TextRun({ text: 'Seletor de Idioma (Português / Espanhol): ', bold: true }),
              new TextRun({ text: 'No canto superior direito da tela de login e no topo de todas as páginas internas, clique nos botões ' }),
              new TextRun({ text: '🇧🇷 PT', bold: true }),
              new TextRun({ text: ' ou ' }),
              new TextRun({ text: '🇪🇸 ES', bold: true }),
              new TextRun({ text: ' para alternar todo o vocabulário, termos normativos (NR-6 vs. IRAM/EN/ANSI) e relatórios.' })
            ]
          }),

          // 3. Catálogo de Produtos e Consulta de CA
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '3. CATÁLOGO DE PRODUTOS & CONSULTA DE C.A.',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'A aba ' }),
              new TextRun({ text: 'Catálogo De-Para (/catalog)', bold: true }),
              new TextRun({ text: ' reúne o portfólio completo de EPIs Libus e matrizes de conversão:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Destaque Prioritário BLS: ', bold: true, color: accentColor }),
              new TextRun({ text: 'A linha de Proteção Respiratória (BLS) está posicionada na 1ª coluna com badge de identificação, reunindo 31 modelos entre máscaras descartáveis PFF, semifaciais (BLS 4000), faciais inteiras (BLS 5600/5700) e cartuchos químicos com engate baioneta B-LOCK.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Botão de Consulta Direta de CA: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Cada produto Libus homologado possui um botão verde ' }),
              new TextRun({ text: '[CA 00000]', bold: true }),
              new TextRun({ text: ' que abre com um toque o portal oficial do Ministério do Trabalho comprovando validade, laudo de ensaio e conformidade jurídica.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Ficha Técnica Completa: ', bold: true }),
              new TextRun({ text: 'Clicando no card ou na foto do produto, abre-se a gaveta técnica com especificações detalhadas, peso, normas aplicadas e relação de concorrentes diretos.' })
            ]
          }),

          // 4. Passo a Passo: Criação de Nova Avaliação
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '4. PASSO A PASSO: CRIANDO UMA AVALIAÇÃO EM CAMPO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'O assistente de avaliação orienta o especialista em 4 etapas rápidas:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Etapa 1 — Seleção da Empresa: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Escolha a planta industrial cadastrada (ex: Alvorada Metais) ou cadastre uma nova empresa na hora informando CNPJ e contato do SESMT.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Etapa 2 — Posto de Trabalho & Risco: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Selecione o setor operacional avaliado (Usinagem CNC, Soldagem, Pintura, Manutenção) para direcionar o teste aos riscos reais da função.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Etapa 3 — Participantes do Ensaio: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Registre os nomes e cargos dos colaboradores que vão calçar e testar o equipamento no turno produtivo.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Etapa 4 — Duelo Comparativo (1x1): ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Selecione o produto atualmente utilizado na fábrica (ex: Concorrente 3M ou MSA) e a alternativa Libus proposta. O sistema classifica como ' }),
              new TextRun({ text: 'Equivalência Direta', bold: true }),
              new TextRun({ text: ' ou ' }),
              new TextRun({ text: 'Upgrade Tecnológico', bold: true, color: accentColor }),
              new TextRun({ text: ' caso ofereça benefício adicional comprovado.' })
            ]
          }),

          // 5. Execução do Teste, TCO e Assinatura
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '5. AUDITORIA TÉCNICA, ANÁLISE ECONÔMICA (TCO) & ESG',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Aba 1 • Avaliação Técnica (Pílulas 1 a 10): ', bold: true }),
              new TextRun({ text: 'No celular ou tablet, avalie com os colaboradores os critérios práticos (vedação, ergonomia, peso, campo visual e facilidade de ajuste). Toque nos botões numéricos com o polegar. A nota 10 representa excelência operacional.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Aba 2 • Análise Econômica (TCO & Descarte): ', bold: true }),
              new TextRun({ text: 'Informe o preço de aquisição e a vida útil média em meses observada no posto de trabalho. O motor de cálculo gera a ' }),
              new TextRun({ text: 'Economia Anual Projetada', bold: true, color: '059669' }),
              new TextRun({ text: ' e a métrica de sustentabilidade: ' }),
              new TextRun({ text: 'Redução de Resíduos Sólidos Descartados (Kg)', bold: true }),
              new TextRun({ text: ' com base no menor número de trocas.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Aba 3 • Laudo Consolidado & Assinatura em Tela: ', bold: true }),
              new TextRun({ text: 'Ao finalizar, clique no botão ' }),
              new TextRun({ text: 'Homologar e Assinar Laudo', bold: true, color: accentColor }),
              new TextRun({ text: '. O modal coleta a assinatura manuscrita do especialista responsável (com termo de instrução prévia NR-6) e passa o aparelho para o responsável do SESMT assinar na tela com o dedo ou caneta stylus.' })
            ]
          }),

          // 6. Compartilhamento via WhatsApp e Impressão
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '6. EMISSÃO DE LAUDO, IMPRESSÃO A4 & ENVIO NO WHATSAPP',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Na tela do laudo finalizado (' }),
              new TextRun({ text: 'EvaluationReport', bold: true }),
              new TextRun({ text: '), o técnico e o gestor dispõem de ferramentas de exportação imediata:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Botão WhatsApp: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Gera instantaneamente uma mensagem formatada oficial para enviar ao comprador ou engenheiro do cliente contendo: Nome da Empresa, Especialista Responsável, Status Homologado e o link direto para abertura do laudo online.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Botão Imprimir / Gerar PDF: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Gera a folha executiva no padrão A4 oficial para arquivo físico, auditorias sindicais, CIPA ou envio em anexo por e-mail.' })
            ]
          }),

          // 7. Uso no Celular (Instalação como Aplicativo PWA)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '7. COMO INSTALAR COMO APLICATIVO NO CELULAR (PWA)',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Para utilizar o Libus Partner em campo como um aplicativo nativo (sem barra de navegação do browser):' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'No Android (Google Chrome): ', bold: true }),
              new TextRun({ text: 'Abra o link do sistema, toque nos 3 pontinhos no canto superior direito e selecione ' }),
              new TextRun({ text: '"Instalar aplicativo"', bold: true }),
              new TextRun({ text: ' ou ' }),
              new TextRun({ text: '"Adicionar à tela inicial"', bold: true }),
              new TextRun({ text: '.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'No iPhone / iPad (Safari): ', bold: true }),
              new TextRun({ text: 'Abra o link do sistema, toque no botão de Compartilhar (ícone com quadrado e seta para cima) e escolha ' }),
              new TextRun({ text: '"Adicionar à Tela de Início"', bold: true }),
              new TextRun({ text: '.' })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'O ícone do Libus Partner aparecerá na tela do seu celular com navegação ultra rápida e barra inferior fixa adaptada ao toque.' })
            ]
          }),

          // Rodapé
          new Paragraph({
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: 'CBD5E1'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Libus do Brasil • Divisão de Engenharia de Segurança & Aplicação • 2026',
                italic: true,
                size: 18,
                color: '94A3B8'
              })
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('..', 'Manual_do_Usuario_Libus_Partner.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('MANUAL_GERADO_COM_SUCESSO:', outputPath);
}

generateManualDocx().catch(err => {
  console.error('ERRO_AO_GERAR_MANUAL:', err);
  process.exit(1);
});
