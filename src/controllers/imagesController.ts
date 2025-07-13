import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

class ImagesController {
  async getAllImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, pageSize = 10, search = "" } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const sizeNum = parseInt(pageSize as string) || 10;
      const skip = (pageNum - 1) * sizeNum;

      // Query Product with content_type 'images', search, pagination
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            content_type: 'images',
            title: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
          skip,
          take: sizeNum,
          orderBy: { id: 'desc' },
          include: {
            images: true, // include all images for this product
          },
        }),
        prisma.product.count({
          where: {
            content_type: 'images',
            title: {
              contains: search as string,
              mode: 'insensitive',
            },
          },
        })
      ]);

      return res.json({
        data: products,
        total,
        page: pageNum,
        pageSize: sizeNum,
        totalPages: Math.ceil(total / sizeNum),
      });
    } catch (error) {
      next(error);
    }
  }
  async getImageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { images: true },
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } catch (error) {
      next(error);
    }
  }
  async createImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, images } = req.body;
      if (!title || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: 'Title and images are required' });
      }
      // 1. Insert ke Product
      const product = await prisma.product.create({
        data: {
          content_type: 'images',
          title,
          description,
        },
      });
      // 2. Insert ke ProductImage
      const createdImages = await prisma.productImage.createMany({
        data: images.map((img: string) => ({
          product_id: product.id,
          image: img,
        })),
      });
      // 3. Return data
      return res.status(201).json({
        product,
        imagesCount: createdImages.count,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, images } = req.body;
      // 1. Update Product
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: { title, description },
      });
      // 2. Insert new images if provided
      let createdImages = null;
      if (Array.isArray(images) && images.length > 0) {
        createdImages = await prisma.productImage.createMany({
          data: images.map((img: string) => ({
            product_id: Number(id),
            image: img,
          })),
        });
      }
      // 3. Return updated product with all images
      const productWithImages = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { images: true },
      });
      return res.json({ product: productWithImages, imagesAdded: createdImages?.count || 0 });
    } catch (error) {
      next(error);
    }
  }
  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await prisma.productImage.delete({
        where: { id: Number(id) },
      });
      if (!deleted) {
        return res.status(404).json({ message: 'Image not found' });
      }
      return res.status(204).send();
    } catch (error) {
      // If error is because not found
      if (error && typeof error === 'object' && 'code' in error && (error as any).code === 'P2025') {
        return res.status(404).json({ message: 'Image not found' });
      }
      next(error);
    }
  }
  async deleteAllImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Delete all ProductImages for this product
      await prisma.productImage.deleteMany({ where: { product_id: Number(id) } });
      // Delete the Product itself
      await prisma.product.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch (error) {
      // If error is because not found
      if (error && typeof error === 'object' && 'code' in error && (error as any).code === 'P2025') {
        return res.status(404).json({ message: 'Product not found' });
      }
      next(error);
    }
  }
}

export default new ImagesController(); 