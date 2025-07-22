# Chat_Bot
A chatbot project using react.js ,node.js  and postgresql
# ChatGPT-Style Local Chat App

A modern, production-ready ChatGPT clone built with Next.js frontend and Express.js backend, powered by Ollama for local LLM inference.

## Features

✅ **Real-time Streaming Chat**: Streams responses token by token for smooth UX
✅ **Chat Management**: Create, list, and manage multiple chat sessions
✅ **Auto-titling**: Automatically names chats from first message
✅ **Persistent Storage**: PostgreSQL database for chat history
✅ **Modern UI**: Clean, responsive design matching ChatGPT's interface
✅ **Local LLM**: Powered by Ollama (no external API keys needed)
✅ **Production Ready**: Proper error handling, loading states, and performance optimizations

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **LLM**: Ollama (local inference)
- **Styling**: Tailwind CSS with custom components

## Prerequisites

Before running the app, make sure you have the following installed:

### 1. Install Ollama
```bash
# Visit https://ollama.com/download and install for your OS
# Or use these quick install commands:

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Pull and Run the LLM Model
```bash
# Pull the Gemma model (lightweight, good for local development)
ollama pull gemma:1b

# Test the model
ollama run gemma:1b
```

### 3. Install PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database and user
sudo -u postgres createdb chatgpt_clone
sudo -u postgres psql -c "CREATE USER username WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE chatgpt_clone TO username;"
```

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
git clone <your-repo>
cd chatgpt-clone
npm install
```

### 2. Configure Environment Variables
Copy `.env.local` and update with your database credentials:

```bash
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=chatgpt_clone

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:1b

# API Configuration
BACKEND_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Initialize Database
```bash
# Option 1: Let the app initialize tables automatically (recommended)
# Tables will be created when you first run the backend

# Option 2: Manually run the schema
psql -d chatgpt_clone -f db/schema.sql
```

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Runs on http://localhost:3000
npm run dev:backend   # Runs on http://localhost:3001
```

## Usage

1. **Open the app** at `http://localhost:3000`
2. **Click "New Chat"** to start a conversation
3. **Type your message** and press Enter to send
4. **Watch the response** stream in real-time
5. **Switch between chats** using the sidebar

## API Endpoints

- `POST /api/chat` - Create a new chat session
- `GET /api/chats` - List all chats
- `GET /api/chat/:chatId` - Get messages for a specific chat
- `POST /api/chat/:chatId/message` - Send a message (streams response)
- `POST /api/chat/:chatId/stop` - Stop ongoing generation

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main chat interface
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Sidebar.tsx        # Chat list sidebar
│   ├── ChatWindow.tsx     # Main chat area
│   ├── MessageBubble.tsx  # Individual message display
│   └── ui/                # shadcn/ui components
├── backend/               # Express.js backend
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── services/          # Business logic (Ollama integration)
│   └── db/                # Database connection and setup
├── types/                 # TypeScript type definitions
├── db/                    # Database schema and migrations
└── README.md              # This file
```

## Key Features Explained

### 🔄 **Real-time Streaming**
Messages stream token by token using Server-Sent Events, providing immediate feedback and a smooth user experience.

### 💾 **Persistent Chat History**
All chats and messages are stored in PostgreSQL with proper indexing for fast retrieval.

### 🏷️ **Smart Auto-titling**
Chats are automatically titled based on the first message, with fallback to "New Chat".

### 🛑 **Generation Control**
Users can stop ongoing generation with the stop button, preventing unwanted long responses.

### 📱 **Responsive Design**
Works seamlessly on desktop, tablet, and mobile devices.

## Troubleshooting

### Ollama Issues
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
killall ollama
ollama serve

# Test model directly
curl http://localhost:11434/api/generate -d '{"model":"gemma:1b","prompt":"Hello"}'
```

### Database Issues
```bash
# Check PostgreSQL status
pg_isready

# Connect to database
psql -d chatgpt_clone -U username

# View tables
\dt
```

### Port Issues
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Ollama: `http://localhost:11434`

Make sure these ports are available or update the configuration.





