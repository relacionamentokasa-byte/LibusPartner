import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.js';

export const catalogRouter = Router();
catalogRouter.use(authMiddleware);

// Famílias e Categorias
catalogRouter.get('/families', async (req: Request, res: Response) => {
  const families = await prisma.productFamily.findMany({
    include: {
      categories: {
        include: {
          _count: {
            select: { libusProducts: true, competitorProducts: true }
          }
        }
      }
    }
  });
  return res.json({ families });
});

// Produtos Libus
catalogRouter.get('/libus-products', async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined;
  const products = await prisma.libusProduct.findMany({
    where: {
      active: true,
      ...(categoryId ? { categoryId } : {})
    },
    include: {
      category: { include: { family: true } },
      attributeValues: { include: { attribute: true } },
      equivalences: {
        include: {
          competitorProduct: { include: { manufacturer: true } }
        }
      }
    },
    orderBy: { name: 'asc' }
  });
  return res.json({ products });
});

// Produtos Concorrentes
catalogRouter.get('/competitor-products', async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined;
  const manufacturerId = req.query.manufacturerId as string | undefined;

  const products = await prisma.competitorProduct.findMany({
    where: {
      active: true,
      ...(categoryId ? { categoryId } : {}),
      ...(manufacturerId ? { manufacturerId } : {})
    },
    include: {
      manufacturer: true,
      category: { include: { family: true } },
      attributeValues: { include: { attribute: true } }
    },
    orderBy: { name: 'asc' }
  });
  return res.json({ products });
});

// De-Para / Equivalências
catalogRouter.get('/equivalences', async (req: Request, res: Response) => {
  const libusProductId = req.query.libusProductId as string | undefined;

  const equivalences = await prisma.productEquivalence.findMany({
    where: {
      active: true,
      ...(libusProductId ? { libusProductId } : {})
    },
    include: {
      libusProduct: {
        include: {
          category: { include: { family: true } },
          attributeValues: { include: { attribute: true } }
        }
      },
      competitorProduct: {
        include: {
          manufacturer: true,
          category: { include: { family: true } },
          attributeValues: { include: { attribute: true } }
        }
      }
    }
  });
  return res.json({ equivalences });
});

// Criar produto concorrente customizado ou existente na hora
catalogRouter.post('/competitor-products', async (req: Request, res: Response) => {
  const { name, manufacturerName, categoryId, caNumber } = req.body;
  if (!name || !manufacturerName || !categoryId) {
    return res.status(400).json({ error: 'Nome, fabricante e categoria são obrigatórios' });
  }

  // 1. Encontrar ou criar fabricante
  let manufacturer = await prisma.competitorManufacturer.findFirst({
    where: { name: { equals: manufacturerName.trim() } }
  });

  if (!manufacturer) {
    manufacturer = await prisma.competitorManufacturer.create({
      data: { name: manufacturerName.trim(), active: true }
    });
  }

  // 2. Encontrar ou criar produto concorrente
  let product = await prisma.competitorProduct.findFirst({
    where: {
      name: { equals: name.trim() },
      manufacturerId: manufacturer.id,
      categoryId
    },
    include: {
      manufacturer: true,
      category: { include: { family: true } }
    }
  });

  if (!product) {
    product = await prisma.competitorProduct.create({
      data: {
        name: name.trim(),
        manufacturerId: manufacturer.id,
        categoryId,
        caNumber: caNumber ? String(caNumber).trim() : null,
        description: 'Cadastrado diretamente na homologação'
      },
      include: {
        manufacturer: true,
        category: { include: { family: true } }
      }
    });
  }

  return res.status(201).json({ product });
});

// Critérios / Atributos por Categoria
catalogRouter.get('/categories/:id/attributes', async (req: Request, res: Response) => {
  const attributes = await prisma.technicalAttribute.findMany({
    where: { categoryId: req.params.id },
    orderBy: { orderIndex: 'asc' }
  });
  return res.json({ attributes });
});

// Atualização de Imagem / Foto de Produto Libus (Upload pelo Gestor / Admin)
catalogRouter.patch('/libus-products/:id/image', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { imageUrl, imageBase64 } = req.body;

  try {
    let finalImageUrl = imageUrl;

    if (imageBase64) {
      // Salvar arquivo físico com fundo transparente se enviado via base64
      const fs = await import('fs');
      const path = await import('path');
      const { Jimp } = await import('jimp');

      const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `custom_libus_${id}_${Date.now()}.png`;
        const targetPath = path.join(process.cwd(), '..', 'frontend', 'public', 'products', filename);
        const localPath = path.join(process.cwd(), 'frontend', 'public', 'products', filename);
        const savePath = fs.existsSync(path.dirname(targetPath)) ? targetPath : localPath;

        const image = await Jimp.read(buffer);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Remoção automática de fundo branco
        image.scan(0, 0, width, height, function (x: number, y: number, idx: number) {
          const red = this.bitmap.data[idx + 0];
          const green = this.bitmap.data[idx + 1];
          const blue = this.bitmap.data[idx + 2];
          const alpha = this.bitmap.data[idx + 3];

          if (red > 232 && green > 232 && blue > 232) {
            this.bitmap.data[idx + 3] = 0;
          } else if (red > 210 && green > 210 && blue > 210 && Math.abs(red - green) < 14 && Math.abs(green - blue) < 14) {
            const factor = (255 - Math.max(red, green, blue)) / 45;
            this.bitmap.data[idx + 3] = Math.round(alpha * Math.max(0, Math.min(1, factor)));
          }
        });

        await (image as any).write(savePath);
        finalImageUrl = `/products/${filename}`;
      }
    }

    const updated = await prisma.libusProduct.update({
      where: { id },
      data: { imageUrl: finalImageUrl }
    });

    return res.json({ product: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao atualizar foto do produto' });
  }
});

// Atualização de Imagem / Foto de Produto Concorrente (Upload pelo Gestor / Admin)
catalogRouter.patch('/competitor-products/:id/image', roleMiddleware(['ADMIN', 'GESTOR']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { imageUrl, imageBase64 } = req.body;

  try {
    let finalImageUrl = imageUrl;

    if (imageBase64) {
      const fs = await import('fs');
      const path = await import('path');
      const { Jimp } = await import('jimp');

      const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `custom_comp_${id}_${Date.now()}.png`;
        const targetPath = path.join(process.cwd(), '..', 'frontend', 'public', 'products', filename);
        const localPath = path.join(process.cwd(), 'frontend', 'public', 'products', filename);
        const savePath = fs.existsSync(path.dirname(targetPath)) ? targetPath : localPath;

        const image = await Jimp.read(buffer);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Remoção automática de fundo branco
        image.scan(0, 0, width, height, function (x: number, y: number, idx: number) {
          const red = this.bitmap.data[idx + 0];
          const green = this.bitmap.data[idx + 1];
          const blue = this.bitmap.data[idx + 2];
          const alpha = this.bitmap.data[idx + 3];

          if (red > 232 && green > 232 && blue > 232) {
            this.bitmap.data[idx + 3] = 0;
          } else if (red > 210 && green > 210 && blue > 210 && Math.abs(red - green) < 14 && Math.abs(green - blue) < 14) {
            const factor = (255 - Math.max(red, green, blue)) / 45;
            this.bitmap.data[idx + 3] = Math.round(alpha * Math.max(0, Math.min(1, factor)));
          }
        });

        await (image as any).write(savePath);
        finalImageUrl = `/products/${filename}`;
      }
    }

    const updated = await prisma.competitorProduct.update({
      where: { id },
      data: { imageUrl: finalImageUrl }
    });

    return res.json({ product: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Erro ao atualizar foto do concorrente' });
  }
});
