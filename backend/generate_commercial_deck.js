const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

async function createCommercialDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" (16:9 widescreen)

  // PALETA OFICIAL DO BRANDBOOK LIBUS (Manual 2022 + Uso Gradient 2026):
  // - Corporativo Principal: #0F1821 (Azul Noite Profundo / Charcoal Libus)
  // - Corporativo Acento: #E5004E (Magenta Libus)
  // - Tons Secundários Gradient: #0A101D (90%), #142C3E (80%), #1D303F (60%), #2A465C (40%)
  // - Fundos Neutros / Textos: #FFFFFF, #F8FAFC, #94A3B8, #64748B, #10B981 (Verde Aprovação / CA / WhatsApp)
  const COLOR_MAIN_DARK   = '0F1821';
  const COLOR_DEEP_BG     = '0A101D';
  const COLOR_MID_SLATE   = '142C3E';
  const COLOR_CARD_DARK   = '1A2634';
  const COLOR_ACCENT_PINK = 'E5004E';
  const COLOR_GREEN_OK    = '059669';
  const COLOR_SKY         = '0284C7';
  const COLOR_TEXT_WHITE  = 'FFFFFF';
  const COLOR_TEXT_MUTED  = '94A3B8';
  const COLOR_TEXT_DARK   = '0F1821';
  const COLOR_CARD_LIGHT  = 'F8FAFC';
  const COLOR_BORDER_LINE = 'E2E8F0';

  // HIERARQUIA TIPOGRÁFICA OFICIAL DO BRANDBOOK LIBUS:
  // - Principal / Títulos: Avenir Next (ou Avenir)
  // - Complementar / Subtítulos e Textos de apoio: Montserrat
  const FONT_HEAD = 'Avenir Next';
  const FONT_BODY = 'Montserrat';

  const dir = path.resolve('manual_screenshots');
  const imgLogin    = path.join(dir, '01_login_annotated.png');
  const imgCatalogo = path.join(dir, 'final_passo0_catalogo.png');
  const imgPasso1   = path.join(dir, 'final_passo1_selecao.png');
  const imgPasso2   = path.join(dir, 'final_passo2_drawer.png');
  const imgPasso3   = path.join(dir, 'final_passo3_tecnica.png');
  const imgPasso4   = path.join(dir, 'final_passo4_economica.png');
  const imgPasso5   = path.join(dir, 'final_passo5_laudo.png');

  // ==========================================
  // SLIDE 1: CAPA INSTITUCIONAL EXECUTIVA
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    // Card decorativo sutil
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

    slide.addText('ENGENHARIA DE SEGURANÇA &\nHOMOLOGAÇÃO TÉCNICA DE EPIS', {
      x: 1.2, y: 1.8, w: 11.0, h: 1.8,
      fontFace: FONT_HEAD, fontSize: 38, bold: true, color: COLOR_TEXT_WHITE,
      isTextBox: true
    });

    slide.addText('A plataforma digital que transforma testes de campo em decisões irrefutáveis de investimento, conformidade legal (NR-6 / MTE), redução de TCO e sustentabilidade ESG.', {
      x: 1.2, y: 3.8, w: 9.8, h: 1.0,
      fontFace: FONT_BODY, fontSize: 16, color: COLOR_TEXT_MUTED,
      isTextBox: true
    });

    // 3 Pilares em cards inferiores
    const pillars = [
      { num: '01', title: 'DUELO 1x1 AUDITÁVEL', desc: 'Confronto técnico direto com 3M, MSA, Honeywell e validação de C.A.' },
      { num: '02', title: 'MOTOR TCO & ESG', desc: 'Comprovação de menor custo anual e redução real de resíduos em Kg' },
      { num: '03', title: 'DUPLA ASSINATURA EM TELA', desc: 'Homologação jurídica imediata com aceite formal do SESMT e envio WhatsApp' }
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

    slide.addNotes('Apresentação de abertura: Posicionar o Libus Partner não apenas como software, mas como ferramenta consultiva de engenharia que protege a vida do trabalhador e o orçamento da indústria.');
  }

  // ==========================================
  // SLIDE 2: O DILEMA DA INDÚSTRIA (O PROBLEMA)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('O CENÁRIO TRADICIONAL NA INDÚSTRIA', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Por que o modelo convencional de compra de EPIs falha?', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 30, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    const problems = [
      {
        tag: 'FALTA DE MÉTRICA TÉCNICA',
        title: 'Decisões no "Achismo"',
        desc: 'Testes práticos em papel ou cadernos sem critérios objetivos de vedação, conforto e ergonomia. O SESMT não consegue mensurar o ganho real de adaptação do trabalhador.',
        stat: '72%',
        statLabel: 'dos testes em fábrica não geram laudo rastreável'
      },
      {
        tag: 'A ARMADILHA DO PREÇO',
        title: 'Miopia de Custo de Prateleira',
        desc: 'Comprar o EPI mais barato gera trocas prematuras por desconforto e ruptura rápida. O cliente compra 3 vezes mais unidades e gasta muito mais no ano.',
        stat: '3x a 5x',
        statLabel: 'mais descartes em EPIs de baixo custo'
      },
      {
        tag: 'PASSIVO ESG & JURÍDICO',
        title: 'Resíduos e Risco Trabalhista',
        desc: 'Descarte massivo de resíduos industriais contaminados sem controle (custo de MTR) e ausência de termo formal assinado atestando treinamento e entrega (NR-6).',
        stat: '100%',
        statLabel: 'de exposição a passivos em caso de acidente'
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

    slide.addNotes('Slide focado na dor do cliente: Mostrar que comprar EPI barato custa mais caro no fechamento do ano.');
  }

  // ==========================================
  // SLIDE 3: A SOLUÇÃO LIBUS PARTNER
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addText('A REVOLUÇÃO EM HOMOLOGAÇÃO DE EPIS', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Libus Partner: Engenharia Consultiva em Tempo Real', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 30, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    // Coluna Esquerda: 4 Diferenciais
    const diffs = [
      { title: 'Matriz de Equivalência Direta', desc: 'Mais de 168 concorrentes mapeados (3M, MSA, Honeywell, Steelflex) para confronto imediato.' },
      { title: 'Destaque Linha BLS Respiratória', desc: '31 modelos de alta performance: descartáveis, semifaciais, faciais completas e filtros químicos.' },
      { title: 'Motor TCO & Cálculo de Resíduos (Kg)', desc: 'Demonstra a economia anualizada de compra e o peso exato de descarte eliminado (ESG).' },
      { title: 'Validação Oficial com C.A. no MTE', desc: 'Link direto em tempo real para o portal oficial do Ministério do Trabalho com 1 clique.' }
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

    // Coluna Direita: Imagem da tela de login anotada
    if (fs.existsSync(imgLogin)) {
      slide.addImage({
        path: imgLogin,
        x: 7.1, y: 2.2, w: 5.3, h: 4.6
      });
    }

    slide.addNotes('Apresentar a tecnologia da plataforma: Interface moderna, bilíngue (Brasil e América Latina), compatível com celulares e computadores.');
  }

  // ==========================================
  // SLIDE 4: CATÁLOGO OFICIAL & DESTAQUE BLS
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('PORTFÓLIO E TECNOLOGIA NORMATIVA', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Catálogo Oficial com Linha BLS em 1º Lugar e Consulta de C.A.', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    // Imagem do Catálogo Anotado à Esquerda
    if (fs.existsSync(imgCatalogo)) {
      slide.addImage({
        path: imgCatalogo,
        x: 0.9, y: 2.1, w: 7.2, h: 4.6
      });
    }

    // Painel de Destaques à Direita
    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.4, y: 2.1, w: 4.0, h: 4.6,
      rectRadius: 0.2,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1.5 }
    });

    slide.addText('DESTAQUES DO CATÁLOGO', {
      x: 8.7, y: 2.35, w: 3.4, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 2, isTextBox: true
    });

    const catalogPoints = [
      { num: '1', title: 'Linha BLS Respiratória Fixada', text: '31 soluções completas entre descartáveis PFF, semifaciais BLS 4000, faciais inteiras 5600/5700 e filtros químicos B-LOCK.' },
      { num: '2', title: 'Botão Verde de C.A. Oficial', text: 'Link direto e clicável para o portal oficial do Ministério do Trabalho, comprovando conformidade e vigência legal.' },
      { num: '3', title: 'Homologação Direta 1x1', text: 'Botão de ação rápida que puxa o produto selecionado diretamente para a bancada de testes em campo.' }
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

    slide.addNotes('Enfatizar a agilidade para o técnico em campo: Ele tem na mão o catálogo completo, o CA oficial e a matriz de concorrentes sem precisar consultar papéis.');
  }

  // ==========================================
  // SLIDE 5: PASSO 1 & 2 - BANCADA DE HOMOLOGAÇÃO & PAREAMENTO
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addText('PASSO A PASSO OPERACIONAL', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Da Montagem da Bancada à Definição do Duelo 1x1', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    // Dois cards lado a lado com os passos
    // Card Esquerda: Passo 1 (Vitrine & Seleção)
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
    slide.addText('ETAPA 1: SELEÇÃO DO CLIENTE & PRODUTO', {
      x: 1.1, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
    });
    slide.addText('Define a planta industrial, setor/posto de trabalho e participantes do ensaio. Na vitrine, clica em "+ Parear 1x1".', {
      x: 1.1, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    // Card Direita: Passo 2 (Drawer Lateral de Pareamento)
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
    slide.addText('ETAPA 2: EQUIVALÊNCIA OU UPGRADE', {
      x: 7.0, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
    });
    slide.addText('Gaveta lateral classifica o confronto em paridade ou evolução tecnológica com concorrente em uso (3M, MSA, Steelflex).', {
      x: 7.0, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    slide.addNotes('Demonstrar a flexibilidade: O cliente pode montar duelos individuais ou pacotes com múltiplos EPIs ao mesmo tempo.');
  }

  // ==========================================
  // SLIDE 6: PASSO 3 & 4 - AVALIAÇÃO TÉCNICA E TCO
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('INTELIGÊNCIA MATEMÁTICA & ESG', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Avaliação Prática em Campo e Modelagem de TCO / Sustentabilidade', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    // Imagem da Avaliação Técnica à Esquerda
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
    slide.addText('ETAPA 3: PONTUAÇÃO TÉCNICA 1 A 10', {
      x: 1.1, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, isTextBox: true
    });
    slide.addText('Colaboradores atribuem notas práticas para vedação, conforto e peso. O sistema calcula a % de superioridade Libus em tempo real.', {
      x: 1.1, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    // Imagem da Análise Econômica à Direita
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
    slide.addText('ETAPA 4: MOTOR DE TCO E RESÍDUOS ESG', {
      x: 7.0, y: 5.85, w: 5.2, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_GREEN_OK, isTextBox: true
    });
    slide.addText('Calcula economia anualizada e o peso de resíduos sólidos evitados (Kg), comprovando o retorno do investimento para o comprador.', {
      x: 7.0, y: 6.15, w: 5.2, h: 0.6,
      fontFace: FONT_BODY, fontSize: 10.5, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    slide.addNotes('Momento de destaque no fechamento comercial: Provar cientificamente que mesmo quando a Libus tem valor de prateleira superior, o custo anual é menor pela durabilidade.');
  }

  // ==========================================
  // SLIDE 7: LAUDO HOMOLOGADO, ASSINATURA & WHATSAPP
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addText('SEGURANÇA JURÍDICA E AGILIDADE DE DISTRIBUIÇÃO', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Laudo Oficial Homologado com Envio Imediato por WhatsApp', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    // Imagem do Laudo Anotado à Esquerda
    if (fs.existsSync(imgPasso5)) {
      slide.addImage({
        path: imgPasso5,
        x: 0.9, y: 2.1, w: 7.2, h: 4.6
      });
    }

    // Painel de Fechamento à Direita
    slide.addShape(pres.ShapeType.roundRect, {
      x: 8.4, y: 2.1, w: 4.0, h: 4.6,
      rectRadius: 0.2,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1.5 }
    });

    slide.addText('FORMALIZAÇÃO EM CAMPO', {
      x: 8.7, y: 2.35, w: 3.4, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_GREEN_OK, charSpacing: 2, isTextBox: true
    });

    const closurePoints = [
      { title: 'Dupla Assinatura Biométrica', text: 'Coleta na tela do aparelho a assinatura do Especialista Libus (com termo NR-6) e do Responsável pelo SESMT do cliente.' },
      { title: 'Compartilhamento WhatsApp', text: 'Botão verde gera mensagem oficial formatada com link de consulta direta para envio imediato ao comprador e diretoria.' },
      { title: 'Folha Executiva A4 para PDF', text: 'Documento oficial impresso ou em PDF com registro único, rastreabilidade e validade perante fiscalizações.' }
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

    slide.addNotes('Enfatizar a velocidade: O teste termina na fábrica e o comprador já recebe o laudo no WhatsApp antes mesmo do técnico sair da portaria.');
  }

  // ==========================================
  // SLIDE 8: CASO DE SUCESSO & ROI COMPROVADO
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_DEEP_BG };

    slide.addText('RESULTADOS REAIS COMPROVADOS EM CLIENTES', {
      x: 0.9, y: 0.8, w: 11.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Caso Prático: Indústria Siderúrgica & Metalurgia Pesada', {
      x: 0.9, y: 1.2, w: 11.5, h: 0.8,
      fontFace: FONT_HEAD, fontSize: 28, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    // 4 Big Numbers de Impacto
    const metrics = [
      { label: 'SUPERIORIDADE TÉCNICA', val: '+100%', sub: 'Preferência unânime em vedação e respiração' },
      { label: 'ECONOMIA ANUAL (TCO)', val: 'R$ 248 mil', sub: 'Redução drástica no volume anual de compras' },
      { label: 'REDUÇÃO DE DESCARTE (ESG)', val: '-1.480 kg', sub: 'Massa de resíduos industriais contaminados eliminada' },
      { label: 'TEMPO DE HOMOLOGAÇÃO', val: '-80%', sub: 'De semanas em papel para emissão no mesmo dia' }
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

    // Caixa inferior de depoimento / garantia Libus
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.9, y: 4.6, w: 11.4, h: 2.0,
      rectRadius: 0.15,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_ACCENT_PINK, width: 1.5 }
    });
    slide.addText('A PROMESSA DE VALOR DA LIBUS:', {
      x: 1.2, y: 4.85, w: 10.8, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 2, isTextBox: true
    });
    slide.addText('"Nós não vendemos apenas EPIs de catálogo. Entramos no chão de fábrica do cliente com nossa equipe de especialistas, submetemos nossas soluções aos mais rigorosos ensaios práticos ao lado do trabalhador e provamos matematicamente que proteção superior gera retorno financeiro e sustentabilidade ambiental."', {
      x: 1.2, y: 5.2, w: 10.8, h: 1.1,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR_TEXT_WHITE, italic: true, isTextBox: true
    });

    slide.addNotes('Slide de consolidação do valor comercial: Fecha a venda com dados e credibilidade.');
  }

  // ==========================================
  // SLIDE 9: CONCLUSÃO & PRÓXIMOS PASSOS (CTA)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: COLOR_MAIN_DARK };

    slide.addShape(pres.ShapeType.rect, {
      x: 0.8, y: 1.0, w: 0.12, h: 5.5,
      fill: { color: COLOR_ACCENT_PINK },
      line: { color: COLOR_ACCENT_PINK }
    });

    slide.addText('PRÓXIMO PASSO', {
      x: 1.2, y: 1.2, w: 10.5, h: 0.4,
      fontFace: FONT_HEAD, fontSize: 13, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 3, isTextBox: true
    });
    slide.addText('Vamos agendar uma homologação piloto na sua fábrica?', {
      x: 1.2, y: 1.7, w: 10.5, h: 1.2,
      fontFace: FONT_HEAD, fontSize: 34, bold: true, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    slide.addText('Nossa equipe técnica disponibiliza amostras normatizadas, acompanha os testes no posto de trabalho e emite o Laudo Executivo de TCO e ESG sem custo para a sua empresa.', {
      x: 1.2, y: 3.1, w: 9.8, h: 0.9,
      fontFace: FONT_BODY, fontSize: 15, color: COLOR_TEXT_MUTED, isTextBox: true
    });

    // Box de contato e acesso
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.2, y: 4.3, w: 10.5, h: 2.2,
      rectRadius: 0.2,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_MID_SLATE, width: 1.5 }
    });

    slide.addText('CONTATO & ACESSO À PLATAFORMA:', {
      x: 1.5, y: 4.55, w: 9.9, h: 0.3,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: COLOR_ACCENT_PINK, charSpacing: 2, isTextBox: true
    });

    slide.addText('Plataforma Online: https://libus-partner-brown.vercel.app\nDivisão de Engenharia de Segurança & Aplicação — Libus do Brasil\nSuporte e Atendimento Consultivo em toda a América Latina (Brasil, Argentina, Chile, Peru, Colômbia e México)', {
      x: 1.5, y: 4.95, w: 9.9, h: 1.2,
      fontFace: FONT_BODY, fontSize: 13, color: COLOR_TEXT_WHITE, isTextBox: true
    });

    slide.addNotes('Call to Action: Convidar o decisor a testar em um posto de trabalho crítico para comprovar o método.');
  }

  const outPptx = path.resolve('..', 'Apresentacao_Comercial_Libus_Partner.pptx');
  await pres.writeFile({ fileName: outPptx });
  console.log('PPTX_GERADO_COM_SUCESSO:', outPptx);
}

createCommercialDeck().catch(console.error);
