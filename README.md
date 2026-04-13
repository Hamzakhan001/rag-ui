# RAG UI

Next.js frontend for your Production RAG API.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Configuration

Edit `.env.local` to point at your API:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Features

- **Query** — ask questions, see answers with sources and guardrail status
- **Ingest text** — paste text directly into your knowledge base
- **Ingest file** — upload PDF, DOCX, TXT, MD, HTML, CSV
- **Evaluate** — score answers for faithfulness and relevance
