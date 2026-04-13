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
      .then((d) => {
        setHealth(d)
        setHealthError(false)
      })
      .catch(() => setHealthError(true))
  }, [])

  const tabs: { id: Tab; label: string; eyebrow: string }[] = [
    { id: 'query', label: 'Ask', eyebrow: 'Query workspace' },
    { id: 'ingest', label: 'Ingest Text', eyebrow: 'Manual input' },
    { id: 'file', label: 'Ingest File', eyebrow: 'Document upload' },
    { id: 'eval', label: 'Evaluate', eyebrow: 'Quality scoring' },
  ]

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-5 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur md:flex md:flex-col">
          <div className="border-b border-[var(--border)] pb-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Production RAG</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">Knowledge Console</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Query documents, ingest new sources, and inspect answer quality in one workspace.
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  tab === t.id
                    ? 'border-[var(--border-strong)] bg-[var(--surface-strong)] shadow-sm'
                    : 'border-transparent hover:border-[var(--border)] hover:bg-white/60'
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{t.eyebrow}</p>
                <p className="mt-1 text-sm font-medium">{t.label}</p>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-[var(--border)] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">API status</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${healthError ? 'bg-rose-500' : health ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              {health ? (
                <span className="text-sm text-[var(--muted)]">{health.env} · {health.model}</span>
              ) : healthError ? (
                <span className="text-sm text-rose-600">API unreachable</span>
              ) : (
                <span className="text-sm text-[var(--muted)]">Checking connection...</span>
              )}
            </div>
            {health && (
              <p className="mt-2 text-xs text-[var(--muted)]">Index: {health.index}</p>
            )}
          </div>
        </aside>

        <main className="flex-1 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.07)] backdrop-blur md:p-6">
          <header className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Workspace</p>
              <h2 className="mt-2 text-2xl font-semibold">
                {tabs.find((t) => t.id === tab)?.label}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 md:hidden">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    tab === t.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-[var(--border)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </header>

          <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 md:p-6">
            {tab === 'query' && <QueryTab />}
            {tab === 'ingest' && <IngestTab />}
            {tab === 'file' && <FileTab />}
            {tab === 'eval' && <EvalTab />}
          </section>
        </main>
      </div>
    </div>
  )
}
