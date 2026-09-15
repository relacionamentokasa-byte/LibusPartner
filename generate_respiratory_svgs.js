const fs = require('fs');

const svgs = {
  'libus_resp_g01.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M130 130 C130 105, 270 105, 270 130 L270 235 C270 260, 130 260, 130 235 Z" fill="#334155" stroke="#0f172a" stroke-width="6"/>
    <rect x="130" y="170" width="140" height="35" fill="#0f172a"/>
    <text x="200" y="193" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16">G01 • VO</text>
    <ellipse cx="200" cy="130" rx="70" ry="20" fill="#475569" stroke="#0f172a" stroke-width="5"/>
    <ellipse cx="200" cy="125" rx="35" ry="9" fill="#1e293b"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">LIBUS G01</text>
    <text x="200" y="318" text-anchor="middle" fill="#e11d48" font-family="sans-serif" font-weight="700" font-size="13">VAPORES ORGÂNICOS</text>
  </svg>`,

  'libus_resp_g02.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M130 130 C130 105, 270 105, 270 130 L270 235 C270 260, 130 260, 130 235 Z" fill="#334155" stroke="#0f172a" stroke-width="6"/>
    <rect x="130" y="170" width="140" height="35" fill="#eab308"/>
    <text x="200" y="193" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="16">G02 • GA</text>
    <ellipse cx="200" cy="130" rx="70" ry="20" fill="#475569" stroke="#0f172a" stroke-width="5"/>
    <ellipse cx="200" cy="125" rx="35" ry="9" fill="#1e293b"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">LIBUS G02</text>
    <text x="200" y="318" text-anchor="middle" fill="#d97706" font-family="sans-serif" font-weight="700" font-size="13">GASES ÁCIDOS</text>
  </svg>`,

  'libus_resp_g03.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M130 130 C130 105, 270 105, 270 130 L270 235 C270 260, 130 260, 130 235 Z" fill="#334155" stroke="#0f172a" stroke-width="6"/>
    <rect x="130" y="170" width="70" height="35" fill="#0f172a"/>
    <rect x="200" y="170" width="70" height="35" fill="#eab308"/>
    <text x="200" y="193" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="14">G03 • VO/GA</text>
    <ellipse cx="200" cy="130" rx="70" ry="20" fill="#475569" stroke="#0f172a" stroke-width="5"/>
    <ellipse cx="200" cy="125" rx="35" ry="9" fill="#1e293b"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">LIBUS G03</text>
    <text x="200" y="318" text-anchor="middle" fill="#e11d48" font-family="sans-serif" font-weight="700" font-size="13">VAPORES &amp; GASES ÁCIDOS</text>
  </svg>`,

  'libus_resp_p3.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="200" cy="175" r="75" fill="#e11d48" stroke="#9f1239" stroke-width="6"/>
    <circle cx="200" cy="175" r="50" fill="#f43f5e" stroke="#e11d48" stroke-width="3"/>
    <circle cx="200" cy="175" r="22" fill="#881337"/>
    <text x="200" y="181" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16">P3 R</text>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">FILTRO P3</text>
    <text x="200" y="318" text-anchor="middle" fill="#e11d48" font-family="sans-serif" font-weight="700" font-size="13">ALTA EFICIÊNCIA MECÂNICA</text>
  </svg>`,

  'libus_resp_p3_alivio.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="200" cy="175" r="75" fill="#9f1239" stroke="#4c0519" stroke-width="6"/>
    <circle cx="200" cy="175" r="50" fill="#881337" stroke="#9f1239" stroke-width="3"/>
    <circle cx="200" cy="175" r="22" fill="#0f172a"/>
    <text x="200" y="181" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="14">P3+VO</text>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">FILTRO P3 ALÍVIO</text>
    <text x="200" y="318" text-anchor="middle" fill="#e11d48" font-family="sans-serif" font-weight="700" font-size="13">P3 COM CARVÃO ATIVADO</text>
  </svg>`,

  'libus_resp_9000_tpe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M150 120 Q200 90 250 120 Q270 200 240 240 Q200 265 160 240 Q130 200 150 120 Z" fill="#475569" stroke="#1e293b" stroke-width="6"/>
    <circle cx="200" cy="210" r="20" fill="#0f172a"/>
    <circle cx="160" cy="180" r="16" fill="#0f172a"/>
    <circle cx="240" cy="180" r="16" fill="#0f172a"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">SÉRIE 9000 TPE</text>
    <text x="200" y="318" text-anchor="middle" fill="#e11d48" font-family="sans-serif" font-weight="700" font-size="13">MÁSCARA SEMIFACIAL</text>
  </svg>`,

  'libus_resp_9000_silicone.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M150 120 Q200 90 250 120 Q270 200 240 240 Q200 265 160 240 Q130 200 150 120 Z" fill="#0284c7" stroke="#0369a1" stroke-width="6"/>
    <circle cx="200" cy="210" r="20" fill="#0c4a6e"/>
    <circle cx="160" cy="180" r="16" fill="#0c4a6e"/>
    <circle cx="240" cy="180" r="16" fill="#0c4a6e"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">SÉRIE 9000 SILICONE</text>
    <text x="200" y="318" text-anchor="middle" fill="#0284c7" font-family="sans-serif" font-weight="700" font-size="13">CONFORTO ERGONÔMICO</text>
  </svg>`,

  'libus_resp_9000_full.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <rect x="135" y="90" width="130" height="150" rx="30" fill="#38bdf8" opacity="0.35" stroke="#0284c7" stroke-width="5"/>
    <path d="M125 80 Q200 55 275 80 Q295 195 255 250 Q200 275 145 250 Q105 195 125 80 Z" fill="none" stroke="#0f172a" stroke-width="8"/>
    <circle cx="200" cy="215" r="22" fill="#0f172a"/>
    <circle cx="145" cy="185" r="16" fill="#0f172a"/>
    <circle cx="255" cy="185" r="16" fill="#0f172a"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">FACIAL INTEIRA 9000</text>
    <text x="200" y="318" text-anchor="middle" fill="#e11d48" font-family="sans-serif" font-weight="700" font-size="13">VISOR PANORÂMICO CLASSE 2</text>
  </svg>`,

  // 3M
  '3m_cartucho_6001.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M130 130 C130 105, 270 105, 270 130 L270 235 C270 260, 130 260, 130 235 Z" fill="#475569" stroke="#1e293b" stroke-width="6"/>
    <rect x="130" y="170" width="140" height="35" fill="#0f172a"/>
    <text x="200" y="193" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="16">3M 6001</text>
    <ellipse cx="200" cy="130" rx="70" ry="20" fill="#64748b" stroke="#1e293b" stroke-width="5"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M SÉRIE 6001</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">VAPORES ORGÂNICOS</text>
  </svg>`,

  '3m_cartucho_6002.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M130 130 C130 105, 270 105, 270 130 L270 235 C270 260, 130 260, 130 235 Z" fill="#475569" stroke="#1e293b" stroke-width="6"/>
    <rect x="130" y="170" width="140" height="35" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="200" y="193" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="16">3M 6002</text>
    <ellipse cx="200" cy="130" rx="70" ry="20" fill="#64748b" stroke="#1e293b" stroke-width="5"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M SÉRIE 6002</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">GASES ÁCIDOS</text>
  </svg>`,

  '3m_cartucho_6003.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M130 130 C130 105, 270 105, 270 130 L270 235 C270 260, 130 260, 130 235 Z" fill="#475569" stroke="#1e293b" stroke-width="6"/>
    <rect x="130" y="170" width="70" height="35" fill="#0f172a"/>
    <rect x="200" y="170" width="70" height="35" fill="#eab308"/>
    <text x="200" y="193" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="14">3M 6003</text>
    <ellipse cx="200" cy="130" rx="70" ry="20" fill="#64748b" stroke="#1e293b" stroke-width="5"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M SÉRIE 6003</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">VO / GA COMBINADO</text>
  </svg>`,

  '3m_filtro_2091.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="200" cy="175" r="75" fill="#f43f5e" stroke="#be123c" stroke-width="6"/>
    <circle cx="200" cy="175" r="50" fill="#fb7185" stroke="#f43f5e" stroke-width="3"/>
    <circle cx="200" cy="175" r="22" fill="#881337"/>
    <text x="200" y="181" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="15">2091 P3</text>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M 2091 P3</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">FILTRO P3 DISCO</text>
  </svg>`,

  '3m_filtro_2097.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="200" cy="175" r="75" fill="#be123c" stroke="#881337" stroke-width="6"/>
    <circle cx="200" cy="175" r="50" fill="#9f1239" stroke="#be123c" stroke-width="3"/>
    <circle cx="200" cy="175" r="22" fill="#0f172a"/>
    <text x="200" y="181" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="14">2097 P3</text>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M 2097 P3</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">P3 ALÍVIO DE ODORES</text>
  </svg>`,

  '3m_serie_6200.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M150 120 Q200 90 250 120 Q270 200 240 240 Q200 265 160 240 Q130 200 150 120 Z" fill="#64748b" stroke="#334155" stroke-width="6"/>
    <circle cx="200" cy="210" r="20" fill="#0f172a"/>
    <circle cx="160" cy="180" r="16" fill="#0f172a"/>
    <circle cx="240" cy="180" r="16" fill="#0f172a"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M SÉRIE 6200</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">SEMIFACIAL ELASTÔMERO</text>
  </svg>`,

  '3m_serie_7502.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <path d="M150 120 Q200 90 250 120 Q270 200 240 240 Q200 265 160 240 Q130 200 150 120 Z" fill="#0369a1" stroke="#0c4a6e" stroke-width="6"/>
    <circle cx="200" cy="210" r="20" fill="#0c4a6e"/>
    <circle cx="160" cy="180" r="16" fill="#0c4a6e"/>
    <circle cx="240" cy="180" r="16" fill="#0c4a6e"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M SÉRIE 7502</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">SEMIFACIAL SILICONE</text>
  </svg>`,

  '3m_serie_6800.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="#f8fafc" rx="32"/>
    <rect x="30" y="30" width="340" height="340" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <rect x="135" y="90" width="130" height="150" rx="30" fill="#38bdf8" opacity="0.35" stroke="#0284c7" stroke-width="5"/>
    <path d="M125 80 Q200 55 275 80 Q295 195 255 250 Q200 275 145 250 Q105 195 125 80 Z" fill="none" stroke="#334155" stroke-width="8"/>
    <circle cx="200" cy="215" r="22" fill="#0f172a"/>
    <circle cx="145" cy="185" r="16" fill="#0f172a"/>
    <circle cx="255" cy="185" r="16" fill="#0f172a"/>
    <text x="200" y="295" text-anchor="middle" fill="#0f172a" font-family="sans-serif" font-weight="900" font-size="20">3M SÉRIE 6800</text>
    <text x="200" y="318" text-anchor="middle" fill="#dc2626" font-family="sans-serif" font-weight="700" font-size="13">FACIAL INTEIRA</text>
  </svg>`
};

for (const [name, content] of Object.entries(svgs)) {
  fs.writeFileSync('frontend/public/products/' + name, content, 'utf8');
  console.log('Saved SVG:', name);
}
