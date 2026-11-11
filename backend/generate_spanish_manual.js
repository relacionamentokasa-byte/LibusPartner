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

async function buildSpanishManual() {
  const primaryColor = '003366';
  const secondaryColor = '1E293B';
  const accentColor = 'E11D48';
  const lightBg = 'F8FAFC';
  const tableHeaderBg = '0F172A';

  const dirES = path.resolve('manual_screenshots_es');
  const dirPT = path.resolve('manual_screenshots');

  // Imagens reais em espanhol e com setas alinhadas
  const imgLogin    = fs.readFileSync(path.join(dirES, '01_login_es_annotated.png'));
  const imgCatalogo = fs.readFileSync(path.join(dirES, '03_catalog_es_annotated.png'));
  const imgPasso1   = fs.readFileSync(path.join(dirES, '04_nueva_evaluacion_es_annotated.png'));
  const imgPasso2   = fs.readFileSync(path.join(dirPT, 'final_passo2_drawer.png'));
  const imgPasso3   = fs.readFileSync(path.join(dirPT, 'final_passo3_tecnica.png'));
  const imgPasso4   = fs.readFileSync(path.join(dirPT, 'final_passo4_economica.png'));
  const imgPasso5   = fs.readFileSync(path.join(dirES, '08_informe_laudo_es_annotated.png'));

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Montserrat', size: 22, color: '334155' },
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
          // Portada
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 120 },
            children: [
              new TextRun({
                text: 'GUÍA OPERATIVA PASO A PASO',
                bold: true,
                size: 32,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'DEL DUELO EN PLANTA A LA EMISIÓN DEL INFORME TÉCNICO',
                bold: true,
                size: 22,
                color: accentColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 260 },
            children: [
              new TextRun({
                text: 'Plataforma Libus Partner • Homologación de EPP, TCO, Sostenibilidad ESG y WhatsApp',
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

          // 1. Flujo de Homologación en Planta
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 140 },
            children: [
              new TextRun({
                text: '1. EL FLUJO COMPLETO DE HOMOLOGACIÓN EN PLANTA',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Este manual describe el paso a paso exacto que el especialista técnico o asesor comercial ejecuta al realizar una visita técnica con la plataforma Libus Partner en plantas industriales de América Latina:'
              })
            ]
          }),

          // Tabla resumen de 6 pasos en español
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Paso', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: tableHeaderBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Acción Operativa', bold: true, color: 'FFFFFF' })] })]
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
                    children: [new Paragraph({ children: [new TextRun({ text: 'PASO 1', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Catálogo Oficial y Línea BLS' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Consulta del portafolio Libus, línea respiratoria BLS y certificados de homologación.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'PASO 2', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Selección de Cliente y Puesto de Trabajo' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Definición de la planta industrial, puesto operativo y operarios participantes.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'PASO 3', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Duelo 1x1 (Libus vs Competidor)' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Confrontación con la marca en uso (3M, MSA) definiendo Equivalencia o Upgrade.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'PASO 4', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Evaluación Técnica de Campo (1 a 10)' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Puntuación de sellado, confort y ergonomía con cálculo de superioridad %.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'PASO 5', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Modelado de TCO y Residuos ESG (Kg)' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Cálculo de ahorro anual de compras y masa de residuos industriales evitada.' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'PASO 6', bold: true, color: accentColor })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Homologación, PDF y Envío por WhatsApp' })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Doble firma en pantalla, emisión de hoja ejecutiva A4 y envío directo por WhatsApp.' })] })]
                  })
                ]
              })
            ]
          }),

          // Paso 0: Login en Español
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '2. ACCESO AL SISTEMA Y SELECTOR DE IDIOMA (PT / ES)',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Acceda a ' }),
              new TextRun({ text: 'https://libus-partner-brown.vercel.app/login', bold: true, color: accentColor }),
              new TextRun({ text: '. En el primer acceso, ingrese con su correo corporativo y la contraseña provisoria ' }),
              new TextRun({ text: 'Libus@2026', bold: true }),
              new TextRun({ text: ', definiendo su nueva contraseña personal e intransferible.' })
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
                text: 'Figura 1 — Pantalla de Acceso con [1] Selector de Idioma (ES) y [2] Credenciales Corporativas.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Paso 1: Catálogo en Español
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '3. PASO 1: CATÁLOGO OFICIAL, LÍNEA BLS Y HOMOLOGACIÓN',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'En la sección ' }),
              new TextRun({ text: '"Catálogo Comparativo"', bold: true }),
              new TextRun({ text: ', el especialista visualiza todo el portafolio Libus y sus equivalencias de mercado:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Línea BLS Respiratoria Priorizada: ', bold: true, color: accentColor }),
              new TextRun({ text: 'La familia "Protección Respiratoria (BLS)" permanece en 1º lugar con 31 soluciones técnicas (mascarillas autofiltrantes, semifaciales BLS 4000, faciales completas 5600/5700 y filtros químicos con conexión baioneta B-LOCK).' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Certificación Oficial CA: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Cada producto Libus cuenta con un botón verde con el número de certificación oficial. Al hacer clic se accede directamente a la comprobación de vigencia normativa.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[3] Botón "Homologar": ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Permite iniciar de manera directa el ensayo comparativo contra los competidores registrados en planta.' })
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
                text: 'Figura 2 — Catálogo Oficial con [1] Línea BLS en 1º lugar, [2] Certificación Oficial y [3] Homologación Directa.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Paso 2: Selección de Producto y Puesto
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '4. PASSO 2: SELECCIÓN DE CLIENTE, PUESTO Y PRODUCTO EN BANCADA',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Al presionar ' }),
              new TextRun({ text: '"+ Nueva Evaluación"', bold: true }),
              new TextRun({ text: ', se abre el configurador de prueba en planta:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Empresa y Planta: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Haga clic en la tarjeta superior para seleccionar el cliente (ej: ArcelorMittal, Industria Metalúrgica o Alvorada Metais) y registrar a los trabajadores del turno.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Familias de EPP: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Filtre la vitrina por la categoría requerida (Protección Respiratoria BLS, Cabeza, Visual, Auditiva o Facial).' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[3] Botón "+ Parear 1x1": ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Seleccione el EPP Libus que desea proponer y presione "+ Parear 1x1" para abrir el panel de configuración del duelo.' })
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
                text: 'Figura 3 — Nueva Evaluación: [1] Empresa/Planta, [2] Familias de EPP y [3] Botón "+ Parear 1x1".',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Paso 3: Drawer Lateral de Pareamiento
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '5. PASO 3: PANEL LATERAL (EQUIVALENCIA O MEJORA TECNOLÓGICA)',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'El panel lateral (Drawer) permite definir las condiciones técnicas frente al competidor actual:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Objetivo Técnico (Equivalencia vs Upgrade): ', bold: true, color: accentColor }),
              new TextRun({ text: 'Seleccione "Equivalencia" para demostrar igual o mejor prestación con menor costo, o "★ Upgrade" cuando Libus ofrece mayor tecnología (silicona quirúrgica, visor antirrayas, sistema drop-off o sellado ergonómico superior).' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Competidor en Uso: ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Seleccione el fabricante (3M, MSA, Honeywell, Steelflex) y el modelo utilizado actualmente por los operarios.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[3] Botón "Adicionar a la Bancada": ', bold: true, color: '059669' }),
              new TextRun({ text: 'Al hacer clic, el par sube a la Bancada de Ensayos. Puede agregar más EPPs y luego presionar "Iniciar Evaluación Técnica".' })
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
                text: 'Figura 4 — Panel Lateral: [1] Equivalencia o Upgrade, [2] Competidor en uso y [3] Adicionar a la Bancada.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Paso 4: Bancada Técnica - Puntuación
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '6. PASSO 4: BANCADA TÉCNICA Y PUNTUACIÓN PRÁCTICA (1 A 10)',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'En la bancada de pruebas (' }),
              new TextRun({ text: 'Pestaña 1. Evaluación Técnica', bold: true }),
              new TextRun({ text: '), los operarios asignan puntajes comparativos según su experiencia real en el puesto:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Marcador de Superioridad % Libus: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Se calcula en tiempo real e indica el porcentaje exacto de criterios en los que la solución Libus superó al competidor.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Puntuación de 1 a 10 por Criterio: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Evalúe sellado facial, confort al tacto, peso, respirabilidad y durabilidad de arneses. La nota 10 activa la insignia "★ Excelencia Operativa".' })
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
                text: 'Figura 5 — Bancada Técnica con [1] Marcador de Superioridad y [2] Notas de 1 a 10 por Criterio.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Paso 5: Análise Econômica TCO & ESG
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '7. PASSO 5: ANÁLISIS ECONÓMICO (TCO) Y SOSTENIBILIDAD ESG',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'En la pestaña ' }),
              new TextRun({ text: '"2. Análisis Económico"', bold: true }),
              new TextRun({ text: ', la plataforma demuestra que un EPP con mayor vida útil reduce el gasto anual y los desechos industriales:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Propuesta Libus: ', bold: true, color: accentColor }),
              new TextRun({ text: 'Ingrese el precio unitario cotizado y la durabilidad estimada observada en meses.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Competidor Actual: ', bold: true, color: '0284C7' }),
              new TextRun({ text: 'Ingrese el precio unitario abonado por la empresa y la duración real en el puesto.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: 'Métrica ESG de Residuos Evitados (Kg): ', bold: true, color: '059669' }),
              new TextRun({ text: 'El motor calcula la masa total en Kg de residuos sólidos que la planta dejará de desechar al año, generando datos concretos para los reportes de sostenibilidad corporativa.' })
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
                text: 'Figura 6 — Análisis Económico de TCO con parámetros de costo, durabilidad y ahorro anualizado.',
                italic: true,
                size: 18,
                color: '64748B'
              })
            ]
          }),

          // Passo 6: Laudo Oficial, Assinatura Digital, WhatsApp e PDF A4
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 140 },
            children: [
              new TextRun({
                text: '8. PASSO 6: INFORME HOMOLOGADO, WHATSAPP E IMPRESIÓN A4',
                bold: true,
                size: 26,
                color: primaryColor,
                font: 'Avenir Next'
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'En la pestaña ' }),
              new TextRun({ text: '"3. Informe Consolidado"', bold: true }),
              new TextRun({ text: ', el especialista presiona ' }),
              new TextRun({ text: '"Homologar y Firmar Informe"', bold: true, color: accentColor }),
              new TextRun({ text: ', captura las firmas biométricas en pantalla (suya y de HSE de la planta) y accede al informe finalizado con los canales de exportación inmediata:' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[1] Botón WhatsApp: ', bold: true, color: '059669' }),
              new TextRun({ text: 'Abre WhatsApp con mensaje corporativo formateado con los datos de la planta, especialista responsable, condición de homologado y el enlace directo para que el comprador o gerente revise el informe online.' })
            ]
          }),
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: '[2] Botón Imprimir / Generar PDF: ', bold: true, color: secondaryColor }),
              new TextRun({ text: 'Emite la hoja ejecutiva en tamaño A4 oficial con registro único, notas comparativas, TCO y las firmas digitales de respaldo.' })
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
                text: 'Figura 7 — Informe Oficial Homologado con [1] Envío Directo por WhatsApp y [2] Impresión A4.',
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
                text: 'Libus Latinoamérica • División de Ingeniería de Seguridad y Aplicación • 2026',
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
  const outPath = path.resolve('..', 'Manual_del_Usuario_Libus_Partner_ES.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('MANUAL_ES_GERADO_COM_SUCESSO:', outPath);
}

buildSpanishManual().catch(console.error);
