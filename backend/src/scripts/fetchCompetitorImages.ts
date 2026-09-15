import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const prisma = new PrismaClient();
const competitorsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products/competitors';

if (!fs.existsSync(competitorsDir)) {
  fs.mkdirSync(competitorsDir, { recursive: true });
}

// Mapeamento de produtos concorrentes com imagens reais
const imagesToFetch = [
  { manuf: 'Delta Plus', name: 'Diamond V', filename: 'deltaplus_diamond_v.jpg', url: 'https://cdn.awsli.com.br/600x450/1183/1183204/produto/55331320/capacete-de-seguranca-diamond-v-delta-plus-ca-39050-x4fcf3p2r5.jpg' },
  { manuf: 'Plastcor', name: 'Capacete Plastcor com Jugular', filename: 'plastcor_capacete.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/capacete_de_seguranca_plastcor_classe_b_com_jugular_ca_31469_141_1_20200722161746.jpg' },
  { manuf: 'Ultramaster', name: 'Classe B Aba Frontal', filename: 'ultramaster_classe_b.jpg', url: 'https://images.tcdn.com.br/img/img_prod/693895/capacete_de_seguranca_classe_b_aba_frontal_ultra_master_ca_12389_47_1_20200720170044.jpg' },
  { manuf: 'Prosafety', name: 'Capacete Prosafety Aba Frontal', filename: 'prosafety_capacete.jpg', url: 'https://images.tcdn.com.br/img/img_prod/693895/capacete_aba_frontal_prosafety_ca_29792_1085_1_20201124114227.jpg' },
  { manuf: 'Danny', name: 'Águia', filename: 'danny_aguia.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_aguia_incolor_danny_ca_9722_191_1_20200722161750.jpg' },
  { manuf: 'Danny', name: 'Fênix', filename: 'danny_fenix.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_fenix_incolor_danny_ca_9722_193_1_20200722161750.jpg' },
  { manuf: 'Danny', name: 'Aerial', filename: 'danny_aerial.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_aerial_incolor_danny_ca_9722_189_1_20200722161749.jpg' },
  { manuf: 'Danny', name: 'Apollo', filename: 'danny_apollo.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_apollo_incolor_danny_ca_9722_190_1_20200722161750.jpg' },
  { manuf: '3M', name: 'Ampla Visão 2790', filename: '3m_2790.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_ampla_visao_3m_2790_anti_embacante_ca_14486_213_1_20200722161751.jpg' },
  { manuf: 'Kalipso', name: 'Jamaica', filename: 'kalipso_jamaica.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_jamaica_incolor_kalipso_ca_15649_199_1_20200722161750.jpg' },
  { manuf: 'Kalipso', name: 'Parati', filename: 'kalipso_parati.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_parati_incolor_kalipso_ca_15649_200_1_20200722161750.jpg' },
  { manuf: 'Kalipso', name: 'Veneza', filename: 'kalipso_veneza.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_veneza_incolor_kalipso_ca_15649_203_1_20200722161751.jpg' },
  { manuf: 'Kalipso', name: 'Tahiti', filename: 'kalipso_tahiti.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_tahiti_incolor_kalipso_ca_15649_202_1_20200722161751.jpg' },
  { manuf: 'MSA', name: 'Phoenix', filename: 'msa_phoenix.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_phoenix_incolor_msa_ca_14416_197_1_20200722161750.jpg' },
  { manuf: 'MSA', name: 'Altimiter', filename: 'msa_altimiter.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_altimiter_incolor_msa_ca_14416_196_1_20200722161750.jpg' },
  { manuf: 'Carbografite', name: 'Supervision', filename: 'carbografite_supervision.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_supervision_incolor_carbografite_ca_15649_205_1_20200722161751.jpg' },
  { manuf: 'Honeywell', name: 'Uvex Stealth Ampla Visão', filename: 'honeywell_uvex_stealth.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_ampla_visao_uvex_stealth_honeywell_ca_19072_215_1_20200722161751.jpg' },
  { manuf: 'Honeywell', name: 'Uvex Skyper', filename: 'honeywell_uvex_skyper.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_uvex_skyper_honeywell_ca_19072_210_1_20200722161751.jpg' },
  { manuf: 'Steelflex', name: 'SWAT', filename: 'steelflex_swat.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_swat_incolor_steelflex_ca_15649_207_1_20200722161751.jpg' },
  { manuf: 'Super Safety', name: 'Óculos SS2', filename: 'supersafety_ss2.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_de_seguranca_ss2_incolor_super_safety_ca_15649_206_1_20200722161751.jpg' },
  { manuf: 'Vicsa', name: 'Everest Ampla Visão', filename: 'vicsa_everest.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/oculos_ampla_visao_everest_vicsa_ca_19072_214_1_20200722161751.jpg' },
  { manuf: '3M', name: 'Peltor H9A', filename: '3m_peltor_h9a.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_de_ruidos_peltor_h9a_3m_ca_12188_153_1_20200722161747.jpg' },
  { manuf: '3M', name: 'Peltor H6A', filename: '3m_peltor_h6a.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_de_ruidos_peltor_h6a_3m_ca_12188_152_1_20200722161747.jpg' },
  { manuf: '3M', name: 'Pomp Muffler', filename: '3m_pomp_muffler.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_de_ruidos_pomp_muffler_3m_ca_14235_155_1_20200722161747.jpg' },
  { manuf: '3M', name: 'Peltor H9P3E Acoplado', filename: '3m_peltor_h9p3e.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_acoplavel_peltor_h9p3e_3m_ca_12188_162_1_20200722161748.jpg' },
  { manuf: '3M', name: 'Peltor H6P3E Acoplado', filename: '3m_peltor_h6p3e.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_acoplavel_peltor_h6p3e_3m_ca_12188_161_1_20200722161748.jpg' },
  { manuf: '3M', name: 'Peltor H10P3E Acoplado', filename: '3m_peltor_h10p3e.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_acoplavel_peltor_h10p3e_3m_ca_12188_160_1_20200722161748.jpg' },
  { manuf: 'MSA', name: 'XLS', filename: 'msa_xls.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_de_ruidos_xls_msa_ca_15624_157_1_20200722161747.jpg' },
  { manuf: 'MSA', name: 'HPE', filename: 'msa_hpe.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_de_ruidos_hpe_msa_ca_15624_156_1_20200722161747.jpg' },
  { manuf: 'Steelflex', name: 'Shell Pro 300', filename: 'steelflex_shell_300.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/abafador_de_ruidos_shell_pro_300_steelflex_ca_15624_158_1_20200722161748.jpg' },
  { manuf: '3M', name: 'Série 6200 Semifacial', filename: '3m_6200.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/respirador_semifacial_3m_serie_6200_ca_4115_230_1_20200722161752.jpg' },
  { manuf: '3M', name: 'Série 7502 Silicone', filename: '3m_7502.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/respirador_semifacial_silicone_3m_serie_7502_ca_12011_232_1_20200722161752.jpg' },
  { manuf: '3M', name: 'Série 6800 Facial Inteira', filename: '3m_6800.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/respirador_facial_inteira_3m_serie_6800_ca_7298_235_1_20200722161752.jpg' },
  { manuf: '3M', name: '6001 Vapores Orgânicos', filename: '3m_6001.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/cartucho_quimico_3m_6001_vapores_organicos_241_1_20200722161753.jpg' },
  { manuf: '3M', name: '6003 VO/GA', filename: '3m_6003.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/cartucho_quimico_3m_6003_vapores_organicos_e_gases_acidos_243_1_20200722161753.jpg' },
  { manuf: '3M', name: '2091 P3 Particulados', filename: '3m_2091.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/filtro_para_particulados_3m_2091_p3_250_1_20200722161753.jpg' },
  { manuf: 'Honeywell', name: 'Bionic Shield', filename: 'honeywell_bionic.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/protetor_facial_bionic_honeywell_ca_19072_180_1_20200722161749.jpg' },
  { manuf: 'MSA', name: 'Protetor Facial V-Gard 190', filename: 'msa_vgard_190.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/protetor_facial_v_gard_190_msa_ca_19072_182_1_20200722161749.jpg' },
  { manuf: 'Carbografite', name: 'Protetor Facial CG 500', filename: 'carbografite_cg500.jpg', url: 'https://images.tcdn.com.br/img/img_prod/700870/protetor_facial_cg_500_carbografite_ca_19072_178_1_20200722161749.jpg' }
];

function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
      }
    });
    req.on('error', () => {
      file.close();
      fs.unlink(dest, () => {});
      resolve(false);
    });
    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function run() {
  let successCount = 0;

  for (const item of imagesToFetch) {
    const destPath = path.join(competitorsDir, item.filename);
    const ok = await download(item.url, destPath);

    if (ok) {
      const comp = await prisma.competitorProduct.findFirst({
        where: {
          manufacturer: { name: { contains: item.manuf } },
          name: { contains: item.name }
        }
      });

      if (comp) {
        await prisma.competitorProduct.update({
          where: { id: comp.id },
          data: { imageUrl: '/products/competitors/' + item.filename }
        });
        console.log(`[OK] ${item.manuf} - ${item.name} -> /products/competitors/${item.filename}`);
        successCount++;
      } else {
        console.log(`[OK Download, Not in DB] ${item.manuf} - ${item.name}`);
      }
    } else {
      console.log(`[FAILED] ${item.manuf} - ${item.name}`);
    }
  }

  console.log(`\nFinalizado com sucesso! Total vinculado: ${successCount}`);
  await prisma.$disconnect();
}

run();
