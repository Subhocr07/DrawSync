import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createCanvas, listCanvases, getCanvas, saveStrokes, getMessages } from '../controllers/canvasController.js';

const router = Router();

router.use(requireAuth);
router.post('/', createCanvas);
router.get('/', listCanvases);
router.get('/:id', getCanvas);
router.put('/:id/strokes', saveStrokes);
router.get('/:id/messages', getMessages);

export default router;


