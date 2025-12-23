# Kenmark ITan Solutions – AI Chatbot 🤖

[Live Demo Link](https://website-rag-chatbot-kmit.vercel.app/)

An AI-powered virtual assistant built for the official Kenmark ITan Solutions website.  
The chatbot answers user queries about company services, hosting, development, and FAQs using a Retrieval-Augmented Generation (RAG) approach.

---

## 🚀 Features

### Chatbot (User Side)
- Floating chat widget with modern UI
- Streaming AI responses (real-time typing)
- Session-based conversation memory
- Intent handling (greetings, thanks, help)
- Graceful fallback for unknown queries
- Auto-scroll and typing indicator
- Dark mode friendly design

### Admin Dashboard
- Upload Excel knowledge files (.xlsx)
- View most asked questions (analytics)
- Visual analytics using charts
- Knowledge sources: Website + Excel
- Clean, responsive admin UI

---

## 🧠 Architecture Overview

User → Chat UI → API Route (/api/chat)
↓
Intent Detection
↓
Knowledge Retrieval (RAG)
↓
LLM (Ollama – Local)
↓
Streamed Response

## 🛠 Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Chart.js

### Backend
- Next.js API Routes
- Session-based memory
- Analytics tracking

### AI / LLM
- Ollama (Mistral / LLaMA models)
- Retrieval-Augmented Generation (RAG)

### Data Sources
- Website content (static JSON)
- Excel files (.xlsx)

---

## 📂 Project Structure

app/
├─ api/
│ ├─ chat/
│ └─ admin/
├─ admin/
├─ page.tsx

components/
└─ ChatWidget.tsx

lib/
├─ retriever.ts
├─ llm.ts
├─ analytics.ts
├─ sessionMemory.ts
└─ intent.ts

data/
├─ website/
└─ knowledge.xlsx


---

## ⚙️ Setup Instructions (Local)

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Install & run Ollama
```
ollama run mistral
```
Ollama must be running on http://localhost:11434

### 3️⃣ Start the app
```
npm run dev
```
App runs on:
👉 http://localhost:3000

Admin dashboard:
👉 http://localhost:3000/admin


## 📊 Admin Usage

- Upload Excel knowledge files

- Monitor most asked questions

- Analytics update in real-time

- Knowledge updates reflected instantly

## 🌐 Deployment

- The application is deployed on Vercel.

- Frontend + API routes hosted on Vercel

- LLM inference runs locally via Ollama

For full cloud deployment, Ollama can be replaced with Groq/OpenRouter APIs.
