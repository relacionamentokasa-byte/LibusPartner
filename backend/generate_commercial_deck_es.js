const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function createCommercialDeckES() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" (16:9 widescreen)

  // PALETA OFICIAL BRANDBOOK LIBUS (Manual 2022 + Uso Gradient 2026):
  const COLOR_MAIN_DARK   = '0F1821';
  const COLOR_DEEP_BG     = '0A101D';
  const COLOR_MID_SLATE   = '142C3E';
  const COLOR_CARD_DARK   = '1A2634';
  const COLOR_ACCENT_PINK = 'E5004E';
  const COLOR_GREEN_OK    = '059669';
  const COLOR_SKY         = '0284C7';
  const COLOR_TEXT_WHITE  = 'FFFFFF';
  const COLOR_TEXT_MUTED  = '94A3B8';

  // HIERARQUIA TIPOGRÁFICA BRANDBOOK LIBUS:
  const FONT_HEAD = 'Avenir Next';
  const FONT_BODY = 'Montserrat';

  const dirES = path.resolve('manual_screenshots_es');
  const dirPT = path.resolve('manual_screenshots');

  const imgLogin    = path.join(dirES, '01_login_es_annotated.png');
  const imgCatalogo = path.join(dirES, '03_catalog_es_annotated.png');
  const imgPasso1   = path.join(dirES, '04_nueva_evaluacion_es_annotated.png');
  const imgPasso2   = path.join(dirPT, 'final_passo2_drawer.png');
  const imgPasso3   = path.join(dirPT, 'final_passo3_tecnica.png');
  const imgPasso4   = path.join(dirPT, 'final_passo4_economica.png');
  const imgPasso5   = path.join(dirES, '08_informe_laudo_es_annotated.png');

  // ==========================================
  // SLIDE 1: PORTADA INSTITUCIONAL EJECUTIVA
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addShape(pres.ShapeType.rect, {
      x: 0.8, y: 1.0, w: 0.12, h: 5.5,
      fill: { color: COLOR_ACCENT_PINK },
      line: { color: COLOR_ACCENT_PINK }
    });

    slide.addText('LIBUS PARTNER', {
      x: 1.2, y: 1.2, w: 10.5, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 16, bold: true, color: COLOR_ACCENT_PINK,
      charSpacing: 4, isTextBox: true
    });

    slide.addText('INGENIERÍA DE SEGURIDAD &\nHOMOLOGACIÓN TÉCNICA DE EPP', {
      x: 1.2, y: 1.8, w: 11.0, h: 1.8,
      fontFace: FONT_HEAD, fontSize: 38, bold: true, color: COLOR_TEXT_WHITE,
      isTextBox: true
    });

    slide.addText('La plataforma digital que transforma los ensayos prácticos en planta en decisiones irrefutables de inversión, respaldo normativo (IRAM / EN / ANSI), reducción de TCO y sostenibilidad ESG.', {
      x: 1.2, y: 3.8, w: 9.8, h: 1.0,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR_TEXT_MUTED,
      isTextBox: true
    });

    const pillars = [
      { num: '01', title: 'DUELO 1x1 AUDITABLE', desc: 'Confrontación técnica directa contra 3M, MSA, Honeywell con verificación de homologación.' },
      { num: '02', title: 'MOTOR TCO & ESG', desc: 'Comprobación de menor costo anual y reducción real de masa de residuos en Kg.' },
      { num: '03', title: 'DOBLE FIRMA EN PANTALLA', desc: 'Homologación legal inmediata con conformidad de HSE / Planta y envío directo por WhatsApp.' }
    ];

    pillars.forEach((p, i) => {
      const px = 1.2 + (i * 3.7);
      slide.addShape(pres.ShapeType.roundRect, {
        x: px, y: 5.1, w: 3.4, h: 1.5,
        rectRadius: 0.15,
        fill: { color: COLOR_CARD_DARK },
        line: { color: COLOR_MID_SLATE, width: 1 }
      });
      slide.addText(p.num, {
        x: px + 0.25, y: 5.25, w: 3.0, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
      });
      slide.addText(p.title, {
        x: px + 0.25, y: 5.6, w: 3.0, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
      });
      slide.addText(p.desc, {
        x: px + 0.25, y: 5.95, w: 3.0, h: 0.55,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR_TEXT_MUTED, isTextBox: true
      });
    });

    slide.addNotes('Presentación para el mercado hispanohablante: Enfatizar que Libus Partner une la ingeniería de producto con la rentabilidad financiera en planta.');
  }

  // ==========================================
  // SLIDE 2: EL DILEMA DE LA INDUSTRIA (EL PROBLEMA)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('EL ESCENARIO TRADICIONAL EN PLANTA', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('¿Por qué falla el modelo convencional de compra de EPP?', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 30, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    const problems = [
      {
        tag: 'FALTA DE MÉTRICA TÉCNICA',
        title: 'Decisiones Subjetivas',
        desc: 'Pruebas prácticas en papel o planillas aisladas sin criterios ponderados de sellado, confort y ergonomía. HSE no cuenta con datos cuantitativos de adaptación del trabajador.',
        stat: '72%',
        statLabel: 'de los ensayos en planta no generan informe auditable'
      },
      {
        tag: 'LA TRAMPA DEL PRECIO',
        title: 'Miopía del Costo Unitario',
        desc: 'Comprar el EPP más económico genera recambios prematuros por incomodidad y rotura rápida. La empresa compra 3 a 5 veces más unidades y termina gastando mucho más al año.',
        stat: '3x a 5x',
        statLabel: 'más recambios en EPPs de bajo costo inicial'
      },
      {
        tag: 'PASIVO ESG Y LEGAL',
        title: 'Residuos y Riesgo Laboral',
        desc: 'Descarte masivo de residuos industriales peligrosos sin control y ausencia de registro formal firmado que acredite la capacitación y entrega al operario.',
        stat: '100%',
        statLabel: 'de exposición a reclamos sin respaldo pericial'
      }
    ];

    problems.forEach((p, i) => {
      const bx = 0.9 + (i * 3.9);
      slide.addShape(pres.ShapeType.roundRect, {
        x: bx, y: 2.2, w: 3.65, h: 4.4,
        rectRadius: 0.2,
        fill: { color: COLOR_CARD_DARK },
        line: { color: COLOR_MID_SLATE, width: 1.5 }
      });

      slide.addText(p.tag, {
        x: bx + 0.3, y: 2.5, w: 3.05, h: 0.3,
        fontFace: FONT_HEAD, fontSize: 10, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 1.5, isTextBox: true
      });
      slide.addText(p.title, {
        x: bx + 0.3, y: 2.85, w: 3.05, h: 0.5,
        fontFace: FONT_HEAD, fontSize: 18, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
      });
      slide.addText(p.desc, {
        x: bx + 0.3, y: 3.45, w: 3.05, h: 1.6,
        fontFace: FONT_BODY, fontSize: 12, color: COLOR_TEXT_MUTED, isTextBox: true
      });

      slide.addShape(pres.ShapeType.line, {
        x: bx + 0.3, y: 5.15, w: 3.05, h: 0,
        line: { color: COLOR_MID_SLATE, width: 1 }
      });

      slide.addText(p.stat, {
        x: bx + 0.3, y: 5.35, w: 3.05, h: 0.6,
        fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
      });
      slide.addText(p.statLabel, {
        x: bx + 0.3, y: 5.95, w: 3.05, h: 0.45,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR_TEXT_MUTED, isTextBox: true
      });
    });

    slide.addNotes('El argumento central de venta: Demostrar que el costo real de un EPP no es lo que cuesta comprarlo, sino cuántos recambios exige al año.');
  }

  // ==========================================
  // SLIDE 3: LA SOLUCIÓN LIBUS PARTNER
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addText('LA REVOLUCIÓN EN HOMOLOGACIÓN DE EPP', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Libus Partner: Ingeniería Consultiva en Tiempo Real', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 30, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    const diffs = [
      { title: 'Matriz de Equivalencia Directa', desc: 'Más de 168 competidores mapeados (3M, MSA, Honeywell, Steelflex) para confrontación inmediata.' },
      { title: 'Línea BLS Respiratoria en 1º Lugar', desc: '31 modelos de alto rendimiento: descartables, semifaciales, faciales completas y filtros químicos B-LOCK.' },
      { title: 'Motor TCO y Residuos Evitados (Kg)', desc: 'Demuestra el ahorro anualizado de compra y la reducción cuantificable de desecho ambiental (ESG).' },
      { title: 'Doble Firma Digital en Pantalla', desc: 'Cierre pericial en el puesto de trabajo con firma táctil de HSE y envío instantáneo por WhatsApp.' }
    ];

    diffs.forEach((d, i) => {
      const dy = 2.2 + (i * 1.15);
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.9, y: dy, w: 5.8, h: 1.0,
        rectRadius: 0.12,
        fill: { color: COLOR_CARD_DARK },
        line: { color: COLOR_MID_SLATE, width: 1 }
      });
      slide.addText(d.title, {
        x: 1.2, y: dy + 0.15, w: 5.3, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 14, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
      });
      slide.addText(d.desc, {
        x: 1.2, y: dy + 0.48, w: 5.3, h: 0.45,
        fontFace: FONT_BODY, fontSize: 11, color: COLOR_TEXT_MUTED, isTextBox: true
      });
    });

    if (fs.existsSync(imgLogin)) {
      slide.addImage({
        path: imgLogin,
        x: 7.1, y: 2.2, w: 5.3, h: 4.6
      });
    }

    slide.addNotes('Destacar que la plataforma es 100% bilingüe y accesible desde cualquier navegador o smartphone sin necesidad de instalar apps pesadas.');
  }

  // ==========================================
  // SLIDE 4: CATÁLOGO OFICIAL & LÍNEA BLS
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('PORTAFOLIO Y TECNOLOGÍA NORMATIVA', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Catálogo Oficial con Línea BLS en 1º Lugar y Consulta de Homologación', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    if (fs.existsSync(imgCatalogo)) {
      slide.addImage({
        path: imgCatalogo,
        x: 0.9, y: 2.1, w: 7.2, h: 4.6
      });
    }

    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.4, y: 2.1, w: 4.0, h: 4.6,
      rectRadius: 0.2,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1.5 }
    });

    slide.addText('VENTAJAS DEL CATÁLOGO', {
      x: 8.7, y: 2.35, w: 3.4, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 2, isTextBox: true
    });

    const catalogPoints = [
      { num: '1', title: 'Línea BLS Respiratoria Priorizada', text: '31 soluciones especializadas: mascarillas autofiltrantes, semifaciales BLS 4000, faciales completas 5600/5700 y filtros químicos con conexión B-LOCK.' },
      { num: '2', title: 'Botón Oficial de Certificación', text: 'Enlace directo a los certificados de homologación oficial, garantizando respaldo técnico ante auditorías de seguridad e higiene.' },
      { num: '3', title: 'Homologación Directa 1x1', text: 'Permite iniciar el ensayo comparativo directamente desde la ficha del producto hacia la bancada de planta.' }
    ];

    catalogPoints.forEach((cp, idx) => {
      const cy = 2.8 + (idx * 1.25);
      slide.addText(cp.num, {
        x: 8.7, y: cy, w: 0.4, h: 0.4,
        fontFace: FONT_HEAD, fontSize: 16, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
      });
      slide.addText(cp.title, {
        x: 9.15, y: cy, w: 2.95, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
      });
      slide.addText(cp.text, {
        x: 9.15, y: cy + 0.35, w: 2.95, h: 0.75,
        fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
      });
    });

    slide.addNotes('Resaltar la fuerza de la línea BLS de respiración como producto de alto valor tecnológico en plantas industriales.');
  }

  // ==========================================
  // SLIDE 5: PASO 1 & 2 - BANCADA Y PAREAMIENTO
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addText('PASO A PASO OPERATIVO', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('De la Configuración del Cliente al Duelo 1x1 en Planta', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    if (fs.existsSync(imgPasso1)) {
      slide.addImage({
        path: imgPasso1,
        x: 0.9, y: 2.1, w: 5.6, h: 3.5
      });
    }
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.9, y: 5.75, w: 5.6, h: 1.15,
      rectRadius: 0.12,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1 }
    });
    slide.addText('PASO 1: CLIENTE, PUESTO Y PRODUCTO', {
      x: 1.1, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
    });
    slide.addText('Selecciona la planta industrial, puesto de trabajo y trabajadores del turno. En la vitrina, hace clic en "+ Parear 1x1".', {
      x: 1.1, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    if (fs.existsSync(imgPasso2)) {
      slide.addImage({
        path: imgPasso2,
        x: 6.8, y: 2.1, w: 5.6, h: 3.5
      });
    }
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 5.75, w: 5.6, h: 1.15,
      rectRadius: 0.12,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1 }
    });
    slide.addText('PASO 2: EQUIVALENCIA O UPGRADE', {
      x: 7.0, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
    });
    slide.addText('El panel lateral clasifica el duelo en paridad técnica o evolución tecnológica con fundamentación frente al EPP actual.', {
      x: 7.0, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    slide.addNotes('Explicar el concepto de Upgrade: Cuando Libus ofrece un producto con mayores prestaciones técnicas que resuelve un problema recurrente del cliente.');
  }

  // ==========================================
  // SLIDE 6: PASSO 3 & 4 - PUNTUACIÓN Y TCO
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('INTELIGENCIA MATEMÁTICA Y ESG', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Evaluación Práctica con Trabajadores y Modelado Económico TCO', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    if (fs.existsSync(imgPasso3)) {
      slide.addImage({
        path: imgPasso3,
        x: 0.9, y: 2.1, w: 5.6, h: 3.5
      });
    }
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.9, y: 5.75, w: 5.6, h: 1.15,
      rectRadius: 0.12,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1 }
    });
    slide.addText('PASO 3: PUNTUACIÓN DE 1 A 10', {
      x: 1.1, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
    });
    slide.addText('Los operarios puntúan sellado, confort, peso y ajuste. La plataforma calcula el % de superioridad técnica en tiempo real.', {
      x: 1.1, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    if (fs.existsSync(imgPasso4)) {
      slide.addImage({
        path: imgPasso4,
        x: 6.8, y: 2.1, w: 5.6, h: 3.5
      });
    }
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8, y: 5.75, w: 5.6, h: 1.15,
      rectRadius: 0.12,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1 }
    });
    slide.addText('PASO 4: MODELADO DE TCO Y RESIDUOS', {
      x: 7.0, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_GREEN_OK, isTextBox: true
    });
    slide.addText('Calcula el ahorro anualizado por mayor durabilidad y la masa de residuos en Kg evitada, demostrando el ROI al área de Compras.', {
      x: 7.0, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    slide.addNotes('El cálculo de TCO es la llave de cierre comercial: Traslada la discusión del precio por unidad al costo total anual por puesto.');
  }

  // ==========================================
  // SLIDE 7: INFORME HOMOLOGADO, FIRMA Y WHATSAPP
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addText('SEGURIDAD JURÍDICA Y DISTRIBUCIÓN INMEDIATA', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Informe Oficial Homologado con Envío Instantáneo por WhatsApp', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    if (fs.existsSync(imgPasso5)) {
      slide.addImage({
        path: imgPasso5,
        x: 0.9, y: 2.1, w: 7.2, h: 4.6
      });
    }

    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.4, y: 2.1, w: 4.0, h: 4.6,
      rectRadius: 0.2,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1.5 }
    });

    slide.addText('FORMALIZACIÓN EN PLANTA', {
      x: 8.7, y: 2.35, w: 3.4, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_GREEN_OK, charSpacing: 2, isTextBox: true
    });

    const closurePoints = [
      { title: 'Doble Firma Biométrica', text: 'Captura en la pantalla táctil la firma del Especialista Libus (con cláusula de inducción técnica) y del Responsable de HSE de la planta.' },
      { title: 'Botón WhatsApp Directo', text: 'Genera un mensaje formal con el enlace del informe digital para enviarlo al instante a Compras y Dirección.' },
      { title: 'Hoja Ejecutiva A4 / PDF', text: 'Documento oficial con código de registro único, trazabilidad y validez pericial ante inspecciones laborales.' }
    ];

    closurePoints.forEach((cp, idx) => {
      const cy = 2.8 + (idx * 1.25);
      slide.addText(`0${idx + 1}`, {
        x: 8.7, y: cy, w: 0.45, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 14, bold: true, color: COLOR_GREEN_OK, isTextBox: true
      });
      slide.addText(cp.title, {
        x: 9.2, y: cy, w: 2.9, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
      });
      slide.addText(cp.text, {
        x: 9.2, y: cy + 0.35, w: 2.9, h: 0.75,
        fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
      });
    });

    slide.addNotes('El comprador recibe el informe en su celular antes de que el especialista salga de la planta.');
  }

  // ==========================================
  // SLIDE 8: CASO DE ÉXITO & ROI
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('RESULTADOS REALES COMPROBADOS EN CLIENTES', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Caso Práctico: Industria Siderúrgica y Metalmecánica Pesada', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    const metrics = [
      { label: 'SUPERIORIDAD TÉCNICA', val: '+100%', sub: 'Preferencia unánime en sellado y confort respiratorio' },
      { label: 'AHORRO ANUAL (TCO)', val: 'USD 48.000', sub: 'Reducción drástica en el volumen anual de compras' },
      { label: 'REDUCCIÓN DE RESIDUOS (ESG)', val: '-1.480 kg', sub: 'Masa de desechos industriales contaminados eliminada' },
      { label: 'TIEMPO DE HOMOLOGACIÓN', val: '-80%', sub: 'De semanas en papel a emisión en el mismo día' }
    ];

    metrics.forEach((m, i) => {
      const mx = 0.9 + (i * 2.9);
      slide.addShape(pres.ShapeType.roundRect, {
        x: mx, y: 2.2, w: 2.7, h: 2.1,
        rectRadius: 0.15,
        fill: { color: COLOR_CARD_DARK },
        line: { color: COLOR_MID_SLATE, width: 1.5 }
      });
      slide.addText(m.label, {
        x: mx + 0.2, y: 2.4, w: 2.3, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 9.5, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 1, isTextBox: true
      });
      slide.addText(m.val, {
        x: mx + 0.2, y: 2.75, w: 2.3, h: 0.75,
        fontFace: FONT_HEAD, fontSize: 26, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
      });
      slide.addText(m.sub, {
        x: mx + 0.2, y: 3.55, w: 2.3, h: 0.55,
        fontFace: FONT_BODY, fontSize: 10, color: COLOR_TEXT_MUTED, isTextBox: true
      });
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.9, y: 4.6, w: 11.4, h: 2.0,
      rectRadius: 0.15,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_ACCENT_PINK, width: 1.5 }
    });
    slide.addText('LA PROMESA DE VALOR DE LIBUS:', {
      x: 1.2, y: 4.85, w: 10.8, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 2, isTextBox: true
    });
    slide.addText('"No vendemos simplemente EPPs de catálogo. Ingresamos a la planta del cliente con nuestros especialistas, sometemos nuestras soluciones a los ensayos más rigurosos junto al operario y demostramos matemáticamente que una protección superior genera rentabilidad económica y sustentabilidad ambiental."', {
      x: 1.2, y: 5.2, w: 10.8, h: 1.1,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR_TEXT_WHITE, italic: true, isTextBox: true
    });

    slide.addNotes('Cierre con credibilidad técnica e impacto en el balance de la empresa.');
  }

  // ==========================================
  // SLIDE 9: CONCLUSIÓN & PRÓXIMOS PASOS (CTA)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addShape(pres.ShapeType.rect, {
      x: 0.8, y: 1.0, w: 0.12, h: 5.5,
      fill: { color: COLOR_ACCENT_PINK },
      line: { color: COLOR_ACCENT_PINK }
    });

    slide.addText('PRÓXIMO PASO', {
      x: 1.2, y: 1.2, w: 10.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 13, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('¿Coordinamos una homologación piloto en su planta?', {
      x: 1.2, y: 1.7, w: 10.5, h: 1.2,
      fontFace: FONT_HEAD, fontSize: 34, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    slide.addText('Nuestro equipo técnico disponibiliza muestras certificadas, acompaña los ensayos en los puestos de trabajo críticos y emite el Informe Ejecutivo de TCO y ESG sin costo para su empresa.', {
      x: 1.2, y: 3.1, w: 9.8, h: 0.9,
      fontFace: FONT_BODY, fontSize: 15, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.2, y: 4.3, w: 10.5, h: 2.2,
      rectRadius: 0.2,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1.5 }
    });

    slide.addText('CONTACTO Y ACCESO A LA PLATAFORMA:', {
      x: 1.5, y: 4.55, w: 9.9, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 2, isTextBox: true
    });

    slide.addText('Plataforma Online: https://libus-partner-brown.vercel.app\nDivisión de Ingeniería de Seguridad y Aplicación — Libus Latinoamérica\nAtención consultiva en Argentina, Brasil, Chile, Perú, Colombia y México.', {
      x: 1.5, y: 4.95, w: 9.9, h: 1.2,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    slide.addNotes('Llamado a la acción: Cerrar con un compromiso de prueba piloto en un sector crítico de la planta.');
  }

  const outPptx = path.resolve('..', 'Presentacion_Comercial_Libus_Partner_ES.pptx');
  await pres.writeFile({ fileName: outPptx });
  console.log('PPTX_ES_GERADO_COM_SUCESSO:', outPptx);
}

createCommercialDeckES().catch(console.error);
