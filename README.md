# TextGen-AI (Angular + Node.js + MongoDB + Gemini)

A full-stack AI chat project that uses:
- **Frontend:** Angular (standalone components)
- **Backend:** Node.js + Express
- **Database:** MongoDB (local instance)
- **LLM Provider:** Google Gemini API key

## Project Structure

```
.
├── backend
│   ├── src
│   │   ├── config/db.js
│   │   ├── controllers/chatController.js
│   │   ├── models/Chat.js
│   │   ├── routes/chatRoutes.js
│   │   └── server.js
│   └── .env.example
└── frontend
    └── src
        └── app
```

## 1) Run MongoDB locally

Make sure MongoDB is running on:

`mongodb://127.0.0.1:27017/textgen_ai`

If needed, update the URI in `backend/.env`.

## 2) Backend Setup

```bash
cd backend
cp .env.example .env
```

Set your Gemini API key in `backend/.env`:

```env
GEMINI_API_KEY=your_real_gemini_api_key
```

Install and start backend:

```bash
npm install
npm run dev
```

Backend base URL: `http://localhost:5000`

## 3) Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:4200`

## API Endpoints

- `GET /api/health`
- `GET /api/chats`
- `POST /api/chats`
- `GET /api/chats/:id`
- `POST /api/chats/:id/message`

## Notes

- Chat messages are saved in MongoDB.
- The backend calls Gemini using your API key and returns model replies.
- CORS is enabled for local development.
