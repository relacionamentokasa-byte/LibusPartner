const {
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
  ShadingType,
  ImageRun
} = require('docx');
const fs = require('fs');
const path = require('path');

async function buildDefinitiveManual() {
  const primaryColor = '003366';
  const secondaryColor = '1E293B';
  const accentColor = 'E11D48';
  const lightBg = 'F8FAFC';
  const tableHeaderBg = '0F172A';

  const dir = path.resolve('manual_screenshots');

  // Os 6 prints reais com dados carregados e setas alinhadas
  const imgLogin = fs.readFileSync(path.join(dir, '01_login_annotated.png'));
  const imgCatalogo = fs.readFileSync(path.join(dir, 'final_passo0_catalogo.png'));
  const imgPasso1 = fs.readFileSync(path.join(dir, 'final_passo1_selecao.png'));
  const imgPasso2 = fs.readFileSync(path.join(dir, 'final_passo2_drawer.png'));
  const imgPasso3 = fs.readFileSync(path.join(dir, 'final_passo3_tecnica.png'));
  const imgPasso4 = fs.readFileSync(path.join(dir, 'final_passo4_economica.png'));
  const imgPasso5 = fs.readFileSync(path.join(dir, 'final_passo5_laudo.png'));

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: '334155' },
          paragraph: { spacing: { line: 300, after: 140 } }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children: [
          // Capa
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: 'MANUAL OPERACIONAL PASSO A PASSO',
                bold: true,
                size: 32,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'DO DUELO EM CAMPO À EMISSÃO DO LAUDO TÉCNICO',
                bold: true,
                size: 22,
                color: accentColor
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 260 },
            children: [
              new TextRun({
                text: 'Plataforma Libus Partner • Homologação de EPIs, TCO, ESG & WhatsApp',
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

          // 1. O Fluxo de Homologação em Campo
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 140 },
            children: [
              new TextRun({
                text: '1. O FLUXO COMPLETO DE HOMOLOGAÇÃO EM CAMPO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Este manual descreve o passo a passo exato que o especialista técnico ou gestor comercial executa ao realizar uma visita técnica com a plataforma Libus Partner:'
              })
            ]
          }),

          // Tabela resumo das 6 etapas operacionais
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Etapa', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Ação Realizada', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Resultado Esperado', bold: true, color: 'FFFFFF' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 1', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Catálogo Oficial & Consulta de C.A.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Consulta do portfólio Libus, família BLS e link oficial do Ministério do Trabalho.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 2', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Seleção do Cliente & Montagem da Bancada' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Definição da empresa, setor/posto de trabalho e participantes do ensaio.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 3', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Pareamento 1x1 (Libus x Concorrente)' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Confronto direto com a marca atual (3M, MSA) definindo Equivalência ou Upgrade.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 4', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Avaliação Prática de Notas (1 a 10)' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Pontuação de vedação, conforto e ergonomia coletada junto aos colaboradores.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 5', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Análise de TCO & Sustentabilidade ESG' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Cálculo de economia anual de aquisição e redução de resíduos descartados em Kg.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 6', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Homologação, PDF & Envio por WhatsApp' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Assinaturas em tela, emissão da folha executiva A4 e envio do link direto via WhatsApp.' })] })]
                  })
                ]
              })
            ]
          }),

          // Passo 0: Login
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '2. ACESSO INICIAL & IDIOMA (PT / ES)',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Acesse ' }),
              new TextRun({ text: 'https://libus-partner-brown.vercel.app/login', bold: true, color: accentColor }),
              new TextRun({ text: '. No primeiro acesso, entre com seu e-mail corporativo e a senha provisória ' }),
              new TextRun({ text: 'Libus@2026', bold: true }),
              new TextRun({ text: ', definindo sua nova senha pessoal.' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgLogin,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 1 — Tela de Login com [1] Seletor Bilíngue e [2] Credenciais Corporativas.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 1: Catálogo Oficial & Consulta de CA
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '3. PASSO 1: CATÁLOGO OFICIAL, LINHA BLS & CONSULTA DE C.A.',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Acessando a aba ' }),
              new TextRun({ text: '"Catálogo De-Para"', bold: true }),
              new TextRun({ text: ', o especialista visualiza todo o portfólio oficial da Libus com suas equivalências de mercado já mapeadas:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Destaque Linha BLS: ', bold: true, color: accentColor }),
              new TextRun({ text: 'A família "Proteção Respiratória (BLS)" fica fixada na 1ª posição da barra com indicador pulsante, reunindo 31 produtos (máscaras descartáveis PFF, semifaciais BLS 4000, faciais inteiras BLS 5600/5700 e cartuchos químicos com conexão baioneta B-LOCK).' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Botão Verde de C.A. Oficial: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Cada produto Libus possui um botão verde com o número do Certificado de Aprovação (ex: CA 49941, CA 41517). Clicar no botão abre diretamente o portal do Ministério do Trabalho comprovando a validade jurídica do equipamento.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[3] Botão "Homologar": ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Permite iniciar diretamente a homologação daquele produto contra concorrentes cadastrados (Falcon, 3M, MSA, etc.).' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgCatalogo,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 2 — Catálogo Oficial Libus com [1] Família BLS, [2] Consulta de CA no MTE e [3] Homologação Direta.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 2: Seleção de Produto e Bancada de Testes
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '4. PASSO 2: SELEÇÃO DE CLIENTE, EQUIPE & PRODUTO NA BANCADA',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Ao clicar em ' }),
              new TextRun({ text: '"+ Nova Avaliação"', bold: true }),
              new TextRun({ text: ', abre-se a tela de montagem do ensaio em campo:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Empresa & Equipe Participante: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Toque no card superior para selecionar o cliente cadastrado (ex: Indústria Metalúrgica Paulista, Alvorada Metais ou ArcelorMittal) e adicionar os colaboradores que participarão do teste no turno.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Famílias de Proteção: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Filtre a vitrine pela família desejada (Proteção Respiratória BLS, Cabeça, Visual, Auditiva ou Facial).' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[3] Botão "+ Parear 1x1": ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Localize o produto Libus que deseja propor para a planta e clique em "+ Parear 1x1" para abrir a gaveta de confronto.' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgPasso1,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 3 — Nova Avaliação: [1] Empresa/Equipe, [2] Filtro por Família e [3] Botão "+ Parear 1x1".',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 3: Drawer Lateral de Pareamento
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '5. PASSO 3: GAVETA DE PAREAMENTO (EQUIVALÊNCIA OU UPGRADE)',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'A gaveta lateral (Drawer) permite configurar as condições técnicas do duelo contra o concorrente:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Objetivo do Duelo (Equivalência vs Upgrade): ', bold: true, color: accentColor }),
              new TextRun({ text: 'Selecione "Equivalência" para demonstrar paridade técnica com menor custo, ou "★ Upgrade" quando a solução Libus entregar superioridade comprovada (ex: silicone cirúrgico, visor antirrisco, sistema drop-off).' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Concorrente em Uso: ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Selecione o fabricante (3M, MSA, Honeywell, Steelflex, etc.) e o modelo atualmente fornecido aos colaboradores.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[3] Botão "Adicionar à Bancada": ', bold: true, color: '059669' }),
              new TextRun({ text: 'Ao clicar, o par 1x1 sobe para a Bancada de Testes. Repita para outros EPIs se desejar avaliar múltiplos pares e clique em "Iniciar Avaliação Técnica".' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgPasso2,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 4 — Drawer Lateral: [1] Equivalência vs Upgrade, [2] Concorrente e [3] Adicionar à Bancada.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 4: Bancada de Testes - Tab Técnica
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '6. PASSO 4: BANCADA DE TESTES & PONTUAÇÃO TÉCNICA (1 A 10)',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Na tela da bancada técnica (' }),
              new TextRun({ text: '1. Avaliação Técnica', bold: true }),
              new TextRun({ text: '), o técnico e os colaboradores atribuem notas comparativas para cada critério:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Placar Superioridade % Libus: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Calculado em tempo real. Mostra a porcentagem exata de critérios em que a solução Libus obteve pontuação superior à do concorrente.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Pontuação Técnica de 1 a 10 por Critério: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Avalie vedação perimetral, conforto, ergonomia, controle de suor, durabilidade das tiras e facilidade de ajuste. A nota 10 ativa o selo de "★ Excelência Operacional".' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgPasso3,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 5 — Bancada Técnica com [1] Placar Superioridade e [2] Notas de 1 a 10 por Critério.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 5: Análise Econômica (TCO & Descarte ESG)
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '7. PASSO 5: ANÁLISE ECONÔMICA (TCO) & SUSTENTABILIDADE ESG',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Na aba ' }),
              new TextRun({ text: '"2. Análise Econômica"', bold: true }),
              new TextRun({ text: ', o sistema comprova que o EPI de maior durabilidade gera grande economia anual e reduz a geração de lixo industrial:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Proposta Libus: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Insira o preço unitário proposto e a durabilidade média observada em meses.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Concorrente Atual: ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Insira o preço unitário atual e a vida útil real do produto no posto.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Métrica ESG de Resíduos Evitados (Kg): ', bold: true, color: '059669' }),
              new TextRun({ text: 'O algoritmo calcula o total em Kg de resíduos sólidos que o cliente deixará de descartar no meio ambiente, além da economia com descarte industrial (MTR).' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgPasso4,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 6 — Análise Econômica de TCO com parâmetros de aquisição, durabilidade e impacto ESG.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 6: Laudo Oficial, Assinatura Digital, WhatsApp e PDF
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '8. PASSO 6: LAUDO HOMOLOGADO, WHATSAPP & IMPRESSÃO A4',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Na aba ' }),
              new TextRun({ text: '"3. Laudo Consolidado"', bold: true }),
              new TextRun({ text: ', o especialista clica em ' }),
              new TextRun({ text: '"Homologar e Assinar Laudo"', bold: true, color: accentColor }),
              new TextRun({ text: ', coleta as assinaturas digitais na tela (sua e do responsável do SESMT) e acessa o laudo finalizado com os botões de exportação:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Botão WhatsApp: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Abre o WhatsApp com mensagem formatada oficial contendo nome do cliente, especialista responsável, status homologado e o link direto para abertura do laudo online pelo comprador ou engenheiro.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Botão Imprimir / Gerar PDF: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Emite a folha executiva em padrão A4 oficial com fotos, notas comparativas, cálculo de TCO e as assinaturas digitais colhidas em campo.' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgPasso5,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 7 — Laudo Homologado Oficial com [1] Envio Direto via WhatsApp e [2] Impressão A4.',
                italic: true,
                size: 18,
                color: '64748B'
              })
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
  const outPath = path.resolve('..', 'Manual_do_Usuario_Libus_Partner.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('MANUAL_DEFINITIVO_GERADO_COM_SUCESSO:', outPath);
}

buildDefinitiveManual().catch(console.error);
