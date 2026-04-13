const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function checkHealth() {
  const r = await fetch(`${BASE}/health`)
  if (!r.ok) throw new Error('API unreachable')
  return r.json()
}

export async function queryRAG(question: string, topK: number, runEval: boolean) {
  const r = await fetch(`${BASE}/api/v1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: topK, run_eval: runEval }),
  })
  if (!r.ok) {
    const e = await r.json()
    throw new Error(e.detail || 'Query failed')
  }
  return r.json()
}

export async function ingestText(text: string, source: string) {
  const r = await fetch(`${BASE}/api/v1/ingest/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, source }),
  })
  if (!r.ok) {
    const e = await r.json()
    throw new Error(e.detail || 'Ingest failed')
  }
  return r.json()
}

export async function ingestFile(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch(`${BASE}/api/v1/ingest/file`, { method: 'POST', body: fd })
  if (!r.ok) {
    const e = await r.json()
    throw new Error(e.detail || 'File ingest failed')
  }
  return r.json()
}

export async function deleteDocuments(ids: string[]) {
  const r = await fetch(`${BASE}/api/v1/ingest/documents`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  if (!r.ok) {
    const e = await r.json()
    throw new Error(e.detail || 'Delete failed')
  }
  return r.json()
}

export async function evaluate(question: string, answer: string, context: string[]) {
  const r = await fetch(`${BASE}/api/v1/eval`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, context }),
  })
  if (!r.ok) {
    const e = await r.json()
    throw new Error(e.detail || 'Eval failed')
  }
  return r.json()
}
