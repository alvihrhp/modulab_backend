import express from 'express';
import imagesController from '../controllers/imagesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public GET routes
router.get('/:id', imagesController.getImageById);

// Protected routes (auth required)
router.get('/',authenticateToken, imagesController.getAllImages);
router.post('/', authenticateToken, imagesController.createImage);
router.put('/:id', authenticateToken, imagesController.updateImage);
router.delete('/:id', authenticateToken, imagesController.deleteImage); // delete single image by id

// DELETE /images/delete-all/:id - delete product and all images by product id
router.delete('/delete-all/:id', authenticateToken, imagesController.deleteAllImages);

export default router; 