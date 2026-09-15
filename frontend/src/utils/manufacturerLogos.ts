export function getManufacturerLogo(name?: string | null): string | null {
  if (!name) return null;
  const n = name.toLowerCase().trim();

  if (n.includes('3m')) return '/manufacturers/3m.png';
  if (n.includes('camper')) return '/manufacturers/camper.png';
  if (n.includes('carbografite')) return '/manufacturers/carbografite.png';
  if (n.includes('danny')) return '/manufacturers/danny.png';
  if (n.includes('delta')) return '/manufacturers/deltaplus.svg';
  if (n.includes('elastobor')) return '/manufacturers/elastobor.png';
  if (n.includes('honeywell') || n.includes('howard')) return '/manufacturers/honeywell.png';
  if (n.includes('kalipso')) return '/manufacturers/kalipso.png';
  if (n.includes('ledan')) return '/manufacturers/ledan.png';
  if (n.includes('maxi royal') || n.includes('royal max') || n.includes('maxiroyal')) return '/manufacturers/maxiroyal.png';
  if (n.includes('msa')) return '/manufacturers/msa.png';
  if (n.includes('plastcor')) return '/manufacturers/plastcor.png';
  if (n.includes('prosafety') || n.includes('pro safety')) return '/manufacturers/prosafety.png';
  if (n.includes('steelflex') || n.includes('steel flex')) return '/manufacturers/steelflex.png';
  if (n.includes('super safety') || n.includes('supersafety')) return '/manufacturers/supersafety.png';
  if (n.includes('tecmater') || n.includes('tec mater') || n.includes('tecmaster')) return '/manufacturers/tecmater.png';
  if (n.includes('ultramaster') || n.includes('ultra master') || n.includes('ump')) return '/manufacturers/ultramaster.png';
  if (n.includes('vicsa')) return '/manufacturers/vicsa.png';

  return null;
}

