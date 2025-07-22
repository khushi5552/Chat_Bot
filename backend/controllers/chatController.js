const { pool } = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const ollamaService = require('../services/ollamaService');

async function createChat(req, res) {
  try {
    const { title } = req.body;
    const chatTitle = title || 'New Chat';

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO chats (title) VALUES ($1) RETURNING *',
      [chatTitle]
    );
    client.release();

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
}

async function getChats(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM chats ORDER BY updated_at DESC'
    );
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
}

async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;

    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
      [chatId]
    );
    client.release();

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function sendMessage(req, res) {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const client = await pool.connect();

    // Save user message
    await client.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'user', message]
    );

    // Update chat timestamp
    await client.query(
      'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [chatId]
    );

    // Auto-title chat if it's the first message
    const chatResult = await client.query(
      'SELECT title FROM chats WHERE id = $1',
      [chatId]
    );

    if (chatResult.rows[0]?.title === 'New Chat') {
      const autoTitle = message.length > 50
        ? message.substring(0, 47) + '...'
        : message;

      await client.query(
        'UPDATE chats SET title = $1 WHERE id = $2',
        [autoTitle, chatId]
      );
    }

    client.release();

    // Set up streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*',
    });

    let assistantMessage = '';

    await ollamaService.generateResponse(message, (chunk) => {
      assistantMessage += chunk;
      res.write(chunk);
    });

    const assistantClient = await pool.connect();
    await assistantClient.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)',
      [chatId, 'assistant', assistantMessage]
    );
    assistantClient.release();

    res.end();
  } catch (error) {
    console.error('Error sending message:', error);

    if (!res.headersSent) {
      // If streaming not started, send JSON error
      res.status(500).json({ error: 'Failed to send message' });
    } else {
      // If streaming started, send "retry" message as last chunk
      res.write('retry');
      res.end();
    }
  }
}

async function stopGeneration(req, res) {
  try {
    ollamaService.stopGeneration();
    res.json({ message: 'Generation stopped' });
  } catch (error) {
    console.error('Error stopping generation:', error);
    res.status(500).json({ error: 'Failed to stop generation' });
  }
}

async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    const client = await pool.connect();
    await client.query('DELETE FROM chats WHERE id = $1', [chatId]);
    client.release();
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
}

async function renameChat(req, res) {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const client = await pool.connect();
    await client.query('UPDATE chats SET title = $1 WHERE id = $2', [title, chatId]);
    client.release();
    res.json({ message: 'Chat renamed successfully' });
  } catch (error) {
    console.error('Error renaming chat:', error);
    res.status(500).json({ error: 'Failed to rename chat' });
  }
}

module.exports = {
  createChat,
  getChats,
  getChatMessages,
  sendMessage,
  stopGeneration,
  deleteChat,
  renameChat,
};
  