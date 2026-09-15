import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const productsDir = 'C:/Users/Ariel Matos/Projetos Ariel/Libus Partner/frontend/public/products';
const file = path.join(productsDir, 'libus_cartucho_g01.jpg');

async function test() {
  try {
    const image = await Jimp.read(file);
    console.log('Sucesso ao ler com Jimp:', image.width, 'x', image.height);
  } catch (err: any) {
    console.error('Erro ao ler com Jimp:', err.message);
  }
}
test();
