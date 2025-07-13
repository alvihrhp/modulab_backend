import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

class LinksController {
  async getAllLinks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, pageSize = 10, search = "" } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const sizeNum = parseInt(pageSize as string) || 10;
      const skip = (pageNum - 1) * sizeNum;

      // Find all product IDs with at least one link matching the search (if search provided)
      let productWhere: any = { content_type: 'links' };
      let linkWhere: any = {};
      if (search) {
        linkWhere = {
          url: {
            contains: search as string,
            mode: 'insensitive',
          },
        };
      }

      // Find all products with content_type 'links' and at least one matching link (if search)
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            ...productWhere,
            ...(search
              ? {
                  links: {
                    some: linkWhere,
                  },
                }
              : {}),
          },
          skip,
          take: sizeNum,
          orderBy: { id: 'desc' },
          include: { links: true },
        }),
        prisma.product.count({
          where: {
            ...productWhere,
            ...(search
              ? {
                  links: {
                    some: linkWhere,
                  },
                }
              : {}),
          },
        }),
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

  async getLinkById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { links: true },
      });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async createLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, url } = req.body;
      if (!title || !url) {
        return res.status(400).json({ message: 'title and url are required' });
      }
      // 1. Create Product with content_type 'links'
      const product = await prisma.product.create({
        data: {
          content_type: 'links',
          title,
          description,
        },
      });
      // 2. Create ProductLink with product_id
      const link = await prisma.productLink.create({
        data: { product_id: product.id, url },
      });
      return res.status(201).json({ product, link });
    } catch (error) {
      next(error);
    }
  }

  async updateLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, product_id, url } = req.body;
      if (!product_id || !title || !url) {
        return res.status(400).json({ message: 'product_id, title, and url are required' });
      }
      // 1. Update Product
      const updatedProduct = await prisma.product.update({
        where: { id: Number(product_id) },
        data: { title, description },
      });
      // 2. Update ProductLink
      const updatedLink = await prisma.productLink.update({
        where: { id: Number(id) },
        data: { url },
      });
      return res.json({ product: updatedProduct, link: updatedLink });
    } catch (error) {
      next(error);
    }
  }

  async deleteLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { product_id } = req.body;
      if (!product_id) {
        return res.status(400).json({ message: 'product_id is required' });
      }
      // 1. Delete ProductLink by product_id
      await prisma.productLink.deleteMany({ where: { product_id: Number(product_id) } });
      // 2. Delete Product by product_id
      await prisma.product.delete({ where: { id: Number(product_id) } });
      return res.status(204).send();
    } catch (error) {
      // If error is because not found
      if (error && typeof error === 'object' && 'code' in error && (error as any).code === 'P2025') {
        return res.status(404).json({ message: 'Product or Link not found' });
      }
      next(error);
    }
  }
}

export default new LinksController(); 