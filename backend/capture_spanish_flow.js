const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureSpanishScreenshots() {
  const outDir = path.resolve('manual_screenshots_es');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });
  const page = await browser.newPage();

  // Forçar idioma espanhol no localStorage antes de cada navegação
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('libus_lang', 'es');
  });

  // 1. Tela de Login em Espanhol
  console.log('1. Capturando tela de login em espanhol...');
  await page.goto('https://libus-partner-brown.vercel.app/login', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '01_login_es.png') });

  // Realizar login com waitForFunction em vez de waitForNavigation
  console.log('Realizando login...');
  await page.type('input[type="email"]', 'admin@libus.com.br');
  await page.type('input[type="password"]', 'libus123');
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => !window.location.pathname.includes('/login'), { timeout: 30000 });
  console.log('Login concluído!');

  // 2. Dashboard em Espanhol
  console.log('2. Capturando Dashboard em espanhol...');
  await page.goto('https://libus-partner-brown.vercel.app/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '02_dashboard_es.png') });

  // 3. Catálogo em Espanhol
  console.log('3. Capturando Catálogo em espanhol...');
  await page.goto('https://libus-partner-brown.vercel.app/catalog', { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => !document.body.innerText.includes('Cargando catálogo') && !document.body.innerText.includes('Carregando catálogo'), { timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '03_catalog_es.png') });

  // 4. Nova Avaliação em Espanhol (Vitrine & Bancada)
  console.log('4. Capturando Nova Avaliação em espanhol...');
  await page.goto('https://libus-partner-brown.vercel.app/evaluations/new', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, '04_nueva_evaluacion_es.png') });

  // 5. Drawer de Pareamento 1x1 em Espanhol
  console.log('5. Abrindo Drawer de Pareamento 1x1...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('*'));
    const btn = buttons.find(el => el.textContent && (el.textContent.includes('Parear 1x1') || el.textContent.includes('+ Parear')));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  if (clicked) {
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outDir, '05_drawer_pareamiento_es.png') });
  }

  // 6. Bancada de Testes - Tab Técnica em Espanhol
  console.log('6. Capturando Avaliação Técnica em espanhol...');
  await page.goto('https://libus-partner-brown.vercel.app/evaluations/60dbbe0f-b876-432e-abca-c99fad2c10a3', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, '06_evaluacion_tecnica_es.png') });

  // 7. Análise Econômica em Espanhol
  console.log('7. Clicando na Tab 2. Análisis Económico...');
  const tabBtns = await page.$$('button');
  for (const tb of tabBtns) {
    const txt = await page.evaluate(el => el.textContent, tb);
    if (txt && (txt.includes('Análisis Económico') || txt.includes('Análise Econômica'))) {
      await tb.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '07_analisis_economico_es.png') });

  // 8. Laudo Oficial Homologado em Espanhol (Folha A4 com WhatsApp)
  console.log('8. Capturando Laudo Oficial em espanhol...');
  await page.goto('https://libus-partner-brown.vercel.app/evaluations/5732f454-8451-4c17-a224-702519f8fbcf/report', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#printable-report-sheet', { timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: path.join(outDir, '08_informe_laudo_es.png') });

  await browser.close();
  console.log('✓ Todas as telas em espanhol foram capturadas com sucesso!');
}

captureSpanishScreenshots().catch(console.error);
