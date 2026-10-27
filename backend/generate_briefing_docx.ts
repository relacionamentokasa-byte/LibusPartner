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
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

async function generateDocx() {
  const primaryColor = '003366'; // Azul corporativo
  const secondaryColor = '1E293B'; // Slate escuro
  const accentColor = '0284C7'; // Azul vibrante
  const lightBg = 'F8FAFC'; // Cinza muito claro para tabelas
  const borderColor = 'CBD5E1';

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
              after: 160
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
              top: 1440, // 2.54 cm
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // Header / Título Principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: 'MEMORIAL DESCRITIVO & BRIEFING TÉCNICO DE INVENÇÃO',
                bold: true,
                size: 32, // 16pt
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'DOCUMENTO BASE PARA REGISTRO DE PATENTE / PROGRAMA DE COMPUTADOR E DEFINIÇÃO DE MARCA',
                bold: true,
                size: 20, // 10pt
                color: '64748B'
              })
            ]
          }),

          // Divisor
          new Paragraph({
            spacing: { after: 280 },
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: 'CBD5E1'
              })
            ]
          }),

          // 1. Dados de Identificação e Enquadramento
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 160 },
            children: [
              new TextRun({
                text: '1. DADOS DE IDENTIFICAÇÃO E ENQUADRAMENTO LEGAL',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),

          // Tabela de Enquadramento
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Natureza do Ativo', bold: true, color: secondaryColor })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Programa de Computador (Software) com Aplicação e Método Industrial Aplicado.'
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Segmento Tecnológico', bold: true, color: secondaryColor })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Segurança e Saúde no Trabalho (SST), Engenharia Ocupacional e Tecnologia de Homologação de EPIs.'
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Base Normativa (Brasil)', bold: true, color: secondaryColor })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Lei de Propriedade Industrial (Lei nº 9.279/1996) e Lei de Proteção de Programa de Computador (Lei nº 9.609/1998).'
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Classificação IPC', bold: true, color: secondaryColor })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'G06Q 10/06 (Auditoria e Operações), G06Q 50/04 (Manufatura/Segurança) e G06F 21/64 (Integridade e Assinaturas).'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // 2. Memorial Descritivo do Problema
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: '2. MEMORIAL DESCRITIVO DO PROBLEMA TÉCNICO RESOLVIDO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'No setor industrial e de proteção ocupacional, os processos de validação e substituição de Equipamentos de Proteção Individual (EPIs) sofrem de deficiências técnicas crônicas que impactam diretamente a segurança dos colaboradores e a eficiência financeira das plantas industriais:'
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Subjetividade e Fragmentação: ', bold: true, color: secondaryColor }),
              new TextRun({
                text: 'Testes de campo de atenuação acústica, vedação respiratória e ergonomia são tradicionalmente registrados em cadernos ou planilhas isoladas, sem critérios matemáticos ponderados nem validação em tempo real com o Certificado de Aprovação (CA) emitido pelo Ministério do Trabalho e Emprego (MTE).'
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Miopia de Custo de Aquisição: ', bold: true, color: secondaryColor }),
              new TextRun({
                text: 'A indústria comumente decide compras apenas pelo preço unitário de prateleira, desconsiderando a frequência de trocas por falha prematura, os custos logísticos de descarte de resíduos industriais perigosos (MTR) e o montante de lixo sólido gerado no meio ambiente.'
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Insegurança Jurídica e Risco de Vazamento: ', bold: true, color: secondaryColor }),
              new TextRun({
                text: 'Laudos técnicos de campo carecem de aceite formal colhido diretamente no posto de trabalho. Simultaneamente, ferramentas convencionais não isolam as avaliações por técnico, expondo relatórios confidenciais entre técnicos que atendem plantas concorrentes.'
              })
            ]
          }),

          // 3. Arquitetura e Características Técnicas da Invenção
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: '3. ARQUITETURA E CARACTERÍSTICAS TÉCNICAS DA INVENÇÃO',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'A invenção consolida um ecossistema integrado suportado por quatro pilares tecnológicos proprietários:'
              })
            ]
          }),

          // Pilar A
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'A. Motor de Confronto Técnico Parametrizado (1x1)',
                bold: true,
                size: 24,
                color: accentColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Algoritmo proprietário de correlação direta entre o equipamento atualmente em uso (concorrente/incumbente) e a solução candidata à homologação. O motor processa matrizes de atributos ponderados: atenuação sonora (NRRsf), fatores de proteção respiratória atribuída (FMP), permeação química e ergonomia. O sistema classifica automaticamente o confronto entre '
              }),
              new TextRun({ text: 'Equivalência Direta', bold: true }),
              new TextRun({ text: ' ou ' }),
              new TextRun({ text: 'Upgrade Tecnológico', bold: true }),
              new TextRun({
                text: ', associando justificativa técnica auditável conectada ao banco oficial de CAs do MTE.'
              })
            ]
          }),

          // Pilar B
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'B. Algoritmo de TCO, Eficiência Operacional e Pegada Ecológica (ESG)',
                bold: true,
                size: 24,
                color: accentColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Equação de modelagem econômica multivariável que calcula o Custo Total de Posse (Total Cost of Ownership). Pondera a vida útil prática comprovada em campo versus vida útil nominal, quantificando o custo anual normalizado por colaborador. Incorpora de forma pioneira a '
              }),
              new TextRun({
                text: 'Métrica Algorítmica de Redução de Resíduos Sólidos (Kg)',
                bold: true
              }),
              new TextRun({
                text: ' e economia com taxas de descarte industrial/MTR, correlacionando o ganho financeiro à governança ESG corporativa.'
              })
            ]
          }),

          // Pilar C
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'C. Protocolo de Homologação com Coleta Vetorial Biométrica',
                bold: true,
                size: 24,
                color: accentColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Mecanismo de captura manuscrita digital em tela móvel/touchscreen de dupla parte: assinatura do Técnico Especialista e do Responsável do Cliente (Engenheiro de Segurança, Médico do Trabalho ou SESMT). Os vetores gráficos são selados com Timestamp UTC imutável, georreferenciamento e dados funcionais, emitindo um Laudo Técnico de Homologação com validade jurídica formal.'
              })
            ]
          }),

          // Pilar D
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'D. Sistema de Isolamento Lógico Operacional (Blindagem RBAC)',
                bold: true,
                size: 24,
                color: accentColor
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Controle de acesso rigoroso em nível de modelo de dados ('
              }),
              new TextRun({ text: 'Row-Level RBAC', bold: true }),
              new TextRun({
                text: '). O técnico de campo opera em ambiente estritamente segregado, visualizando única e exclusivamente os testes por ele conduzidos em seus clientes designados. Gestores e administradores contam com visão analítica consolidada de indicadores de conversão, auditoria de processos e desempenho operacional sem cross-contamination de dados em campo.'
              })
            ]
          }),

          // 4. Impacto Industrial e Relevância Inventiva
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: '4. IMPACTO INDUSTRIAL E RELEVÂNCIA INVENTIVA',
                bold: true,
                size: 26,
                color: primaryColor
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Segurança Jurídica e Trabalhista: ', bold: true, color: secondaryColor }),
              new TextRun({
                text: 'Cria lastro pericial incontestável de entrega, adaptação e aceitação do trabalhador quanto ao EPI, reduzindo passivos trabalhistas.'
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Decisão Pautada em Engenharia e Finanças: ', bold: true, color: secondaryColor }),
              new TextRun({
                text: 'Desloca a negociação da guerra de preços para a comprovação científica de ganho de vida útil, proteção ao trabalhador e redução de descarte ambiental.'
              })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Base para Registro de Marca e Patente: ', bold: true, color: secondaryColor }),
              new TextRun({
                text: 'A clareza técnica e os diferenciais algorítmicos contidos neste memorial fornecem subsídio integral aos advogados de PI para o depósito junto ao INPI e para a consolidação do nome comercial oficial da ferramenta.'
              })
            ]
          }),

          // Rodapé informativo
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
                text: 'Libus Partner — Documento Técnico Confidencial',
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
  const outputPath = path.resolve('..', 'Briefing_Tecnico_Patente_Libus_Partner.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('DOCX_GERADO_COM_SUCESSO:', outputPath);
}

generateDocx().catch(err => {
  console.error('ERRO_AO_GERAR_DOCX:', err);
  process.exit(1);
});
