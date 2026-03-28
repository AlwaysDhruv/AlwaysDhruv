import { Router } from 'express';
import { createChat, getChatById, listChats, sendMessage } from '../controllers/chatController.js';

const router = Router();

router.get('/', listChats);
router.post('/', createChat);
router.get('/:id', getChatById);
router.post('/:id/message', sendMessage);

export default router;
