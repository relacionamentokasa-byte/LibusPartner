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

async function buildStepByStepManual() {
  const primaryColor = '003366';
  const secondaryColor = '1E293B';
  const accentColor = 'E11D48';
  const lightBg = 'F8FAFC';
  const tableHeaderBg = '0F172A';

  const imgLogin = fs.readFileSync(path.resolve('manual_screenshots', '01_login_annotated.png'));
  const imgPasso1 = fs.readFileSync(path.resolve('manual_screenshots', 'passo1_anotado.png'));
  const imgPasso2 = fs.readFileSync(path.resolve('manual_screenshots', 'passo2_anotado.png'));
  const imgPasso3 = fs.readFileSync(path.resolve('manual_screenshots', 'passo3_anotado.png'));
  const imgPasso4 = fs.readFileSync(path.resolve('manual_screenshots', 'passo4_anotado.png'));
  const imgPasso5 = fs.readFileSync(path.resolve('manual_screenshots', 'passo5_anotado.png'));

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
                text: 'GUIA OPERACIONAL PASSO A PASSO',
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

          // 1. Visão do Fluxo de Ponta a Ponta
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

          // Tabela resumo das 5 etapas operacionais
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 2', bold: true, color: accentColor })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 3', bold: true, color: accentColor })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 4', bold: true, color: accentColor })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'ETAPA 5', bold: true, color: accentColor })] })]
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

          // Passo 1: Seleção de Produto e Bancada
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '3. PASSO 1: SELECIONANDO O PRODUTO E MONTANDO A BANCADA',
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
              new TextRun({ text: ' no menu principal, o assistente abre a vitrine técnica integrada com a bancada de testes:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Cliente em Homologação: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Clique no card superior para selecionar a empresa industrial (ex: Indústria Metalúrgica Paulista, Alvorada Metais ou ArcelorMittal) e adicionar os colaboradores participantes do turno.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Botão "+ Parear 1x1": ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Localize na vitrine o equipamento Libus proposto (com seu código interno e número de C.A. visíveis) e clique em "+ Parear 1x1".' })
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
                text: 'Figura 2 — Vitrine de EPIs Libus e Bancada de Testes em Campo.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 2: Drawer Lateral de Pareamento
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '4. PASSO 2: CONFIGURANDO O CONCORRENTE & TIPO DE DUELO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'A gaveta lateral (Drawer) permite configurar o confronto técnico direto com o equipamento em uso no cliente:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Objetivo Técnico (Equivalência vs Upgrade): ', bold: true, color: accentColor }),
              new TextRun({ text: 'Selecione "Equivalência" para demonstrar que o EPI Libus atende à mesma especificação com menor custo, ou "★ Upgrade" quando a proposta Libus entrega durabilidade superior, vedação aprimorada ou maior conforto ergonômico.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Seleção do Concorrente & Confirmação: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Escolha a marca (3M, MSA, Honeywell, Steelflex) e o modelo. Em seguida, clique em "Adicionar à Bancada". O par sobe imediatamente para a bancada e você clica em "Iniciar Avaliação Técnica".' })
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
                text: 'Figura 3 — Drawer de Pareamento 1x1 com seleção de Equivalência ou Upgrade.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 3: Avaliação Técnica Prática
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '5. PASSO 3: AVALIAÇÃO TÉCNICA PRÁTICA EM CAMPO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Na bancada de avaliação (' }),
              new TextRun({ text: 'Aba 1. Avaliação Técnica', bold: true }),
              new TextRun({ text: '), o especialista coleta a percepção dos colaboradores no posto de trabalho:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Placar Superioridade em Tempo Real: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Conforme as notas são preenchidas, o sistema calcula automaticamente a porcentagem exata de critérios em que a solução Libus superou o produto concorrente.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Pílulas de Notas 1 a 10: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Avalie cada critério normativo (vedação, ergonomia, peso, fluxo de ar, conforto térmico). Basta tocar na nota com o polegar. A nota 10 ativa o selo de "★ Excelência Operacional".' })
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
                text: 'Figura 4 — Bancada Técnica de Avaliação com notas comparativas e índice de superioridade.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 4: Análise Econômica (TCO) & ESG
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '6. PASSO 4: MODELAGEM ECONÔMICA (TCO) & RESÍDUOS ESG',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Na ' }),
              new TextRun({ text: 'Aba 2. Análise Econômica', bold: true }),
              new TextRun({ text: ', o sistema comprova que o EPI com maior durabilidade reduz o custo anual e o passivo ambiental:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Proposta Libus: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Preencha o preço unitário proposto e a vida útil estimada observada em meses.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Produto Atual Concorrente: ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Informe o preço pago atualmente pelo cliente e a durabilidade real antes do descarte.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Métrica de Resíduos Evitados (Kg): ', bold: true, color: '059669' }),
              new TextRun({ text: 'O motor calcula o peso total de lixo industrial contaminado evitado pelo cliente ao adotar o produto Libus, fornecendo dados concretos para o relatório ESG da empresa.' })
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
                text: 'Figura 5 — Análise Econômica de TCO com projeção anualizada de economia e impacto de descarte.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 5: Laudo, PDF & WhatsApp
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '7. PASSO 5: HOMOLOGAÇÃO, LAUDO A4 & ENVIO NO WHATSAPP',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Ao avançar para a ' }),
              new TextRun({ text: 'Aba 3. Laudo Consolidado', bold: true }),
              new TextRun({ text: ', o especialista colhe a assinatura digital (sua e do responsável do SESMT na tela) e o sistema gera o laudo executivo oficial:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Compartilhamento via WhatsApp: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Com 1 clique no botão verde WhatsApp, o sistema abre o aplicativo já com mensagem formatada contendo nome da empresa, especialista responsável, status homologado e o link oficial do laudo online para o comprador ou engenheiro aprovar.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Imprimir / Gerar PDF A4: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Gera a folha executiva em alta resolução para arquivo físico, entrega formal ao SESMT, comitês de CIPA e auditorias trabalhistas.' })
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
                text: 'Figura 6 — Laudo Oficial Homologado com [1] Botão WhatsApp e [2] Impressão A4.',
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
  const outPath = path.resolve('..', 'Manual_do_Usuario_Libus_Partner_Passo_a_Passo.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('MANUAL_PASSO_A_PASSO_GERADO_COM_SUCESSO:', outPath);
}

buildStepByStepManual().catch(console.error);
