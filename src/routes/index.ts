import express from 'express';
import authRoutes from './authRoutes';
import imagesRoutes from './imagesRoutes';
import linksRoutes from './linksRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' });
});

// Auth routes
router.use('/auth', authRoutes);
// Images routes
router.use('/images', imagesRoutes);
// Links routes
router.use('/links', linksRoutes);

export default router;
