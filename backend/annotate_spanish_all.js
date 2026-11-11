const sharp = require('sharp');
const path = require('path');

const dir = path.resolve('manual_screenshots_es');

async function annotateSpanishAll() {
  // 1. LOGIN EM ESPANHOL
  {
    const input = path.join(dir, '01_login_es.png');
    const output = path.join(dir, '01_login_es_annotated.png');
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
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- 1. Selector de Idioma ES activo -->
        <rect x="1450" y="420" width="245" height="70" rx="14" fill="none" stroke="#E11D48" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 1880 340 Q 1760 360 1705 435" fill="none" stroke="#E11D48" stroke-width="6" marker-end="url(#arr-rose)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1870" y="290" width="450" height="76" rx="14" fill="#0F172A" stroke="#E11D48" stroke-width="3"/>
          <circle cx="1908" cy="328" r="22" fill="#E11D48"/>
          <text x="1908" y="336" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1942" y="322" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Selector de Idioma (ES)</text>
          <text x="1942" y="348" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Español activo para filiales LATAM</text>
        </g>

        <!-- 2. Credenciales -->
        <rect x="895" y="790" width="765" height="235" rx="16" fill="none" stroke="#0284C7" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 640 850 Q 770 870 885 890" fill="none" stroke="#0284C7" stroke-width="6" marker-end="url(#arr-sky)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="230" y="810" width="400" height="76" rx="14" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
          <circle cx="268" cy="848" r="22" fill="#0284C7"/>
          <text x="268" y="856" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="302" y="842" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Acceso Corporativo</text>
          <text x="302" y="868" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Correo corporativo y contraseña</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 1. 01_login_es_annotated.png gerado');
  }

  // 2. CATÁLOGO EM ESPANHOL
  {
    const input = path.join(dir, '03_catalog_es.png');
    const output = path.join(dir, '03_catalog_es_annotated.png');
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
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- 1. Destaque Linha BLS -->
        <rect x="1080" y="460" width="490" height="75" rx="16" fill="none" stroke="#E11D48" stroke-width="5" stroke-dasharray="10,6" filter="url(#sh)"/>
        <path d="M 1720 390 Q 1630 390 1575 460" fill="none" stroke="#E11D48" stroke-width="6" marker-end="url(#arr-rose)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1710" y="340" width="460" height="82" rx="14" fill="#0F172A" stroke="#E11D48" stroke-width="3"/>
          <circle cx="1750" cy="381" r="22" fill="#E11D48"/>
          <text x="1750" y="389" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1786" y="373" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Línea BLS Respiratoria</text>
          <text x="1786" y="401" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Protección respiratoria fija en 1º lugar</text>
        </g>

        <!-- 2. Botão Certificado de Aprovação / Homologação -->
        <rect x="1055" y="750" width="170" height="45" rx="10" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 800 772 L 1045 772" fill="none" stroke="#059669" stroke-width="6" marker-end="url(#arr-green)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="370" y="731" width="420" height="82" rx="14" fill="#0F172A" stroke="#059669" stroke-width="3"/>
          <circle cx="410" cy="772" r="22" fill="#059669"/>
          <text x="410" y="780" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="446" y="764" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Certificación Oficial CA</text>
          <text x="446" y="792" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Enlace directo a homologación oficial</text>
        </g>

        <!-- 3. Botão Homologar do Card -->
        <rect x="2560" y="785" width="220" height="55" rx="12" fill="none" stroke="#0284C7" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 2380 740 Q 2470 750 2550 795" fill="none" stroke="#0284C7" stroke-width="6" marker-end="url(#arr-sky)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="2020" y="690" width="370" height="82" rx="14" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
          <circle cx="2060" cy="731" r="22" fill="#0284C7"/>
          <text x="2060" y="739" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">3</text>
          <text x="2096" y="723" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Homologar Directo</text>
          <text x="2096" y="751" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Inicie el duelo 1x1 en planta</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 2. 03_catalog_es_annotated.png gerado');
  }

  // 3. NUEVA EVALUACIÓN (04_nueva_evaluacion_es.png)
  {
    const input = path.join(dir, '04_nueva_evaluacion_es.png');
    const output = path.join(dir, '04_nueva_evaluacion_es_annotated.png');
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
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- 1. Empresa y Planta en Homologación -->
        <rect x="650" y="210" width="1320" height="125" rx="16" fill="none" stroke="#E11D48" stroke-width="5" stroke-dasharray="10,6" filter="url(#sh)"/>
        <path d="M 460 210 Q 550 210 635 255" fill="none" stroke="#E11D48" stroke-width="6" marker-end="url(#arr-rose)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="80" y="170" width="400" height="82" rx="14" fill="#0F172A" stroke="#E11D48" stroke-width="3"/>
          <circle cx="120" cy="211" r="22" fill="#E11D48"/>
          <text x="120" y="219" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="156" y="203" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Empresa y Planta</text>
          <text x="156" y="231" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Seleccione cliente y participantes</text>
        </g>

        <!-- 2. Familias de EPPs -->
        <rect x="650" y="520" width="1210" height="95" rx="16" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="10,6" filter="url(#sh)"/>
        <path d="M 460 550 Q 550 550 635 565" fill="none" stroke="#059669" stroke-width="6" marker-end="url(#arr-green)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="80" y="510" width="390" height="82" rx="14" fill="#0F172A" stroke="#059669" stroke-width="3"/>
          <circle cx="120" cy="551" r="22" fill="#059669"/>
          <text x="120" y="559" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="156" y="543" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Familias de EPP</text>
          <text x="156" y="571" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Filtre por Resp. (BLS), Cabeza, etc.</text>
        </g>

        <!-- 3. Botón + Parear 1x1 -->
        <rect x="645" y="1180" width="365" height="60" rx="12" fill="none" stroke="#0284C7" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 460 1210 L 635 1210" fill="none" stroke="#0284C7" stroke-width="6" marker-end="url(#arr-sky)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="80" y="1170" width="390" height="82" rx="14" fill="#0F172A" stroke="#0284C7" stroke-width="3"/>
          <circle cx="120" cy="1211" r="22" fill="#0284C7"/>
          <text x="120" y="1219" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">3</text>
          <text x="156" y="1203" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Botón &quot;+ Parear 1x1&quot;</text>
          <text x="156" y="1231" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Elija el producto Libus propuesto</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 3. 04_nueva_evaluacion_es_annotated.png gerado');
  }

  // 4. INFORME LAUDO EM ESPANHOL COM WHATSAPP & IMPRIMIR (08_informe_laudo_es.png)
  {
    const input = path.join(dir, '08_informe_laudo_es.png');
    const output = path.join(dir, '08_informe_laudo_es_annotated.png');
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
            <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- Botón WhatsApp -->
        <rect x="2110" y="255" width="270" height="72" rx="14" fill="none" stroke="#059669" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 1940 180 Q 2030 180 2100 255" fill="none" stroke="#059669" stroke-width="6" marker-end="url(#arr-green)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="1540" y="140" width="410" height="82" rx="14" fill="#0F172A" stroke="#059669" stroke-width="3"/>
          <circle cx="1580" cy="181" r="22" fill="#059669"/>
          <text x="1580" y="189" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="1616" y="173" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Envío Directo WhatsApp</text>
          <text x="1616" y="201" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Comparta el informe online en 1 toque</text>
        </g>

        <!-- Botón Imprimir / PDF -->
        <rect x="2395" y="255" width="380" height="72" rx="14" fill="none" stroke="#0F172A" stroke-width="5" stroke-dasharray="8,6" filter="url(#sh)"/>
        <path d="M 2585 160 L 2585 245" fill="none" stroke="#0F172A" stroke-width="6" marker-end="url(#arr-slate)" filter="url(#sh)"/>
        <g filter="url(#sh)">
          <rect x="2400" y="80" width="370" height="82" rx="14" fill="#0F172A" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="2440" cy="121" r="22" fill="#0284C7"/>
          <text x="2440" y="129" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>
          <text x="2476" y="113" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF">Imprimir / Generar PDF</text>
          <text x="2476" y="141" font-family="Arial, sans-serif" font-size="15" fill="#94A3B8">Emisión oficial de la hoja A4</text>
        </g>
      </svg>
    `);
    await sharp(input).composite([{ input: svg }]).toFile(output);
    console.log('✓ 4. 08_informe_laudo_es_annotated.png gerado');
  }

  console.log('🎉 Todas as anotações em espanhol foram concluídas com sucesso!');
}

annotateSpanishAll().catch(console.error);
