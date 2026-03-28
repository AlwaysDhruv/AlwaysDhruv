import { Chat } from '../models/Chat.js';

const buildGeminiEndpoint = () => {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in backend environment variables.');
  }

  const response = await fetch(`${buildGeminiEndpoint()}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini API returned an empty response.');
  }

  return text;
};

export const listChats = async (_req, res) => {
  const chats = await Chat.find().sort({ updatedAt: -1 }).select('_id title updatedAt createdAt');
  res.json(chats);
};

export const getChatById = async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  res.json(chat);
};

export const createChat = async (_req, res) => {
  const chat = await Chat.create({ title: 'New Chat', messages: [] });
  res.status(201).json(chat);
};

export const sendMessage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ message: 'prompt is required and must be a string.' });
  }

  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  chat.messages.push({ role: 'user', content: prompt });

  try {
    const aiText = await callGemini(prompt);

    chat.messages.push({ role: 'assistant', content: aiText });

    if (chat.title === 'New Chat') {
      chat.title = prompt.slice(0, 40) || 'New Chat';
    }

    await chat.save();

    return res.json({
      chatId: chat._id,
      reply: aiText,
      messages: chat.messages
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message || 'Failed to get response from Gemini.' });
  }
};
