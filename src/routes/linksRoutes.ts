import express from 'express';
import linksController from '../controllers/linksController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Tambahkan middleware authenticateToken ke semua route
    

// GET /links/:id - get link by id
router.get('/:id', linksController.getLinkById);
// GET /links - get all links
router.get('/', authenticateToken, linksController.getAllLinks);
// POST /links - create new link
router.post('/', authenticateToken, linksController.createLink);
// PUT /links/:id - update link by id
router.put('/:id', authenticateToken, linksController.updateLink);
// DELETE /links/:id - delete link by id
router.delete('/:id', authenticateToken, linksController.deleteLink);

export default router; 