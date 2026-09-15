import { prisma } from '../lib/prisma.js';

async function run() {
  const manualFixes = [
    // Capacetes
    { manuf: 'Ultramaster', name: 'Classe B Aba Frontal', path: '/products/ultramaster_ultramaster.jpeg' },
    { manuf: 'Ledan', name: 'Capacete 2001', path: '/products/ledan_ledan.jpeg' },
    { manuf: 'Steelflex', name: 'Falcon', path: '/products/steeflex_falcon.jpeg' },
    { manuf: 'Steelflex', name: 'STX', path: '/products/steeflex_stx.jpeg' },
    { manuf: 'Steelflex', name: 'Work', path: '/products/steeflex_work.jpeg' },
    { manuf: 'Steelflex', name: 'Imola', path: '/products/steeflex_imola.jpeg' },
    { manuf: 'Steelflex', name: 'SWAT', path: '/products/steeflex_swat.jpeg' },
    { manuf: 'Steelflex', name: 'Shell Pro 300', path: '/products/steelfekx_shell_pro_300.jpeg' },
    { manuf: 'Steelflex', name: 'Shell Pro 400 Acoplado', path: '/products/steeflex_shell_pro_400.jpeg' },
    { manuf: 'Steelflex', name: 'Shell Max Acoplado', path: '/products/steeflex_shell_max.jpeg' },
    
    // 3M
    { manuf: '3M', name: 'H-700', path: '/products/3m_h700.jpeg' },
    { manuf: '3M', name: 'Pomp Muffler', path: '/products/3m_pomp_muffler.jpeg' },
    { manuf: '3M', name: 'Pomp Millenium', path: '/products/3m_pomp_milenium.jpeg' },
    { manuf: '3M', name: 'Pomp Muffler Acoplado', path: '/products/3m_pomp_muffler_acoplado.jpeg' },
    { manuf: '3M', name: 'Peltor H10P3E Acoplado', path: '/products/3m_peltor_h10p3e.png' },
    { manuf: '3M', name: 'Peltor H6P3E Acoplado', path: '/products/3m_peltor_h6p3e.jpeg' },
    { manuf: '3M', name: 'Peltor H9P3E Acoplado', path: '/products/3m_h9p3e.jpeg' },
    { manuf: '3M', name: 'Peltor H9P3E-02 Acoplado', path: '/products/3m_peltor_h9p3e_02.jpeg' },
    { manuf: '3M', name: 'Protetor Facial WP96 Cilíndrico', path: '/products/3m_facial_plano_3m.jpeg' },
    
    // Delta Plus
    { manuf: 'Delta Plus', name: 'Interlagos 2', path: '/products/delta_plus_interlagos2.png' },
    { manuf: 'Delta Plus', name: 'Inter Pro Acoplado', path: '/products/delta_plus_inter_pro_para_capacete.jpeg' },
    
    // Carbografite
    { manuf: 'Carbografite', name: 'Protetor Facial CG Bolha', path: '/products/carbografite_carbografite.jpeg' },
    { manuf: 'Carbografite', name: 'Protetor Facial CG 500', path: '/products/carbografite_carbografite_cg.jpeg' },

    // Super Safety & Summer Clean
    { manuf: 'Super Safety', name: 'Óculos SS2', path: '/products/ss2_super_safety.jpeg' },
    { manuf: 'Summer Clean', name: 'Óculos Summer', path: '/products/summer_clean_pro_safety.jpeg' },

    // Danny
    { manuf: 'Danny', name: 'Fênix', path: '/products/danny_fenix.jpeg' },

    // MSA
    { manuf: 'MSA', name: 'Kit XLS Acoplado', path: '/products/m_s_a_kit_xls.jpeg' },
    { manuf: 'MSA', name: 'Kit Mark V Acoplado', path: '/products/m_s_a_kit_markv.jpeg' },
    { manuf: 'MSA', name: 'Kit HPE Acoplado', path: '/products/m_s_a_kit_hpe.png' }
  ];

  for (const item of manualFixes) {
    const comp = await prisma.competitorProduct.findFirst({
      where: {
        manufacturer: { name: { contains: item.manuf } },
        name: { contains: item.name }
      }
    });

    if (comp) {
      await prisma.competitorProduct.update({
        where: { id: comp.id },
        data: { imageUrl: item.path }
      });
      console.log(`[REFINADO] ${item.manuf} - ${comp.name} -> ${item.path}`);
    } else {
      console.log(`[NAO ENCONTRADO] ${item.manuf} - ${item.name}`);
    }
  }

  await prisma.$disconnect();
}

run();
