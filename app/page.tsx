'use client'
import { useState, useEffect } from 'react'
import { checkHealth } from '@/lib/api'
import QueryTab from '@/components/QueryTab'
import IngestTab from '@/components/IngestTab'
import FileTab from '@/components/FileTab'
import EvalTab from '@/components/EvalTab'

type Tab = 'query' | 'ingest' | 'file' | 'eval'

export default function Home() {
  const [tab, setTab] = useState<Tab>('query')
  const [health, setHealth] = useState<{ status: string; env: string; model: string; index: string } | null>(null)
  const [healthError, setHealthError] = useState(false)

  useEffect(() => {
    checkHealth()
      .then(d => { setHealth(d); setHealthError(false) })
      .catch(() => setHealthError(true))
  }, [])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'query',  label: 'Query' },
    { id: 'ingest', label: 'Ingest text' },
    { id: 'file',   label: 'Ingest file' },
    { id: 'eval',   label: 'Evaluate' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">RAG UI</h1>
            <p className="text-xs text-gray-400">Production RAG API</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${healthError ? 'bg-red-400' : health ? 'bg-green-400' : 'bg-gray-300'}`} />
            {health ? (
              <span className="text-xs text-gray-500">{health.env} · {health.model} · {health.index}</span>
            ) : healthError ? (
              <span className="text-xs text-red-500">API unreachable</span>
            ) : (
              <span className="text-xs text-gray-400">Connecting...</span>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {tab === 'query'  && <QueryTab />}
          {tab === 'ingest' && <IngestTab />}
          {tab === 'file'   && <FileTab />}
          {tab === 'eval'   && <EvalTab />}
        </div>
      </main>
    </div>
  )
}
