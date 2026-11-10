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

async function buildIllustratedManual() {
  const primaryColor = '003366';
  const secondaryColor = '1E293B';
  const accentColor = 'E11D48';
  const lightBg = 'F8FAFC';
  const tableHeaderBg = '0F172A';

  const imgLogin = fs.readFileSync(path.resolve('manual_screenshots', '01_login_annotated.png'));
  const imgDashboard = fs.readFileSync(path.resolve('manual_screenshots', '02_dashboard_annotated.png'));
  const imgCatalog = fs.readFileSync(path.resolve('manual_screenshots', '03_catalog_annotated.png'));
  const imgLaudo = fs.readFileSync(path.resolve('manual_screenshots', '05_laudo_annotated.png'));

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
                text: 'MANUAL OPERACIONAL ILUSTRADO DO USUÁRIO',
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
                text: 'GUIA PRÁTICO COM TELAS ANOTADAS & FLUXO DE CAMPO',
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
                text: 'Plataforma Libus Partner • Edição Bilíngue (PT/ES) • PWA Mobile & Desktop',
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

          // 1. Visão Geral
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 140 },
            children: [
              new TextRun({
                text: '1. VISÃO GERAL & PERFIS DE ACESSO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'O Libus Partner é a plataforma oficial desenvolvida para padronizar e acelerar os testes de homologação de EPIs em campo. A ferramenta compara produtos Libus x concorrentes (3M, MSA, Honeywell), calcula a economia anualizada de TCO e redução de descarte de resíduos em Kg, selando o relatório com dupla assinatura digital.'
              })
            ]
          }),

          // Tabela de Perfis
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Perfil', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Público', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Escopo e Permissões', bold: true, color: 'FFFFFF' })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Especialistas técnicos e promotores em campo.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Acesso estritamente aos seus próprios laudos. Não visualiza testes de outros técnicos (isolamento RBAC).' })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Líderes comerciais e gerentes regionais.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Visão executiva total de todas as avaliações da equipe, gestão dos usuários técnicos e exportação consolidada.' })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'Engenharia corporativa e administração de TI.' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Governança global, auditoria de segurança e gestão do catálogo mestre de produtos.' })] })]
                  })
                ]
              })
            ]
          }),

          // 2. Tela de Login Anotada
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '2. ACESSO AO SISTEMA & SELETOR DE IDIOMA',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Link oficial: ' }),
              new TextRun({ text: 'https://libus-partner-brown.vercel.app/login', bold: true, color: accentColor }),
              new TextRun({ text: ' • Senha provisória padrão: ' }),
              new TextRun({ text: 'Libus@2026', bold: true, color: primaryColor }),
              new TextRun({ text: ' (troca obrigatória no primeiro acesso).' })
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
                text: 'Figura 1 — Tela de Login com [1] Seletor Bilíngue (PT/ES) e [2] Credenciais Corporativas.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // 3. Dashboard Anotado
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '3. PAINEL PRINCIPAL (DASHBOARD EXECUTIVO)',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'O painel consolida o volume de testes realizados, quantidade de empresas atendidas, índice de aceitação dos colaboradores (TAU) e histórico recente de homologações com status em tempo real.'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgDashboard,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 2 — Painel com [1] Botão de Nova Avaliação e [2] Indicadores de Campo / SESMT.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // 4. Catálogo Anotado
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '4. CATÁLOGO OFICIAL & CONSULTA DIRETA DE C.A.',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'No catálogo, a linha de Proteção Respiratória (BLS) está destacada em 1º lugar com 31 modelos. Cada produto Libus possui um botão verde oficial com o número do C.A. que direciona à consulta no Ministério do Trabalho.'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgCatalog,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 3 — Catálogo com [1] Família BLS em Destaque, [2] Consulta de C.A. e [3] Homologação Direta.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // 5. Laudo e Compartilhamento WhatsApp
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '5. LAUDO HOMOLOGADO, PDF & COMPARTILHAMENTO VIA WHATSAPP',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Ao concluir a avaliação com as assinaturas digitais, o laudo oficial fica disponível para exportação em dois canais principais: envio instantâneo via WhatsApp e emissão em PDF no padrão executivo A4.'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun({
                data: imgLaudo,
                transformation: { width: 560, height: 350 }
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'Figura 4 — Laudo Homologado com [1] Botão de Envio via WhatsApp e [2] Impressão A4.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // 6. Instalação PWA
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '6. INSTALAÇÃO COMO APLICATIVO NO CELULAR (PWA)',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Android (Google Chrome): ', bold: true }),
              new TextRun({ text: 'Abra o link, toque no menu de 3 pontinhos e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'iPhone / iPad (Safari): ', bold: true }),
              new TextRun({ text: 'Abra o link, toque no botão de Compartilhar (quadrado com seta para cima) e escolha "Adicionar à Tela de Início".' })
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
  console.log('MANUAL_ILUSTRADO_GERADO_COM_SUCESSO:', outPath);
}

buildIllustratedManual().catch(console.error);
