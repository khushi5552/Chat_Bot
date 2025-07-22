const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController.createChat);
router.get('/chats', chatController.getChats);
router.get('/chat/:chatId', chatController.getChatMessages);
router.post('/chat/:chatId/message', chatController.sendMessage);
router.post('/chat/:chatId/stop', chatController.stopGeneration);
router.delete('/chat/:chatId', chatController.deleteChat);
router.put('/chat/:chatId', chatController.renameChat);

module.exports = router;
