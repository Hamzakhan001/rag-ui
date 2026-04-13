'use client'
import { useState } from 'react'
import { queryRAG } from '@/lib/api'

export default function QueryTab() {
  const [question, setQuestion] = useState('')
  const [topK, setTopK] = useState(5)
  const [runEval, setRunEval] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await queryRAG(question, topK, runEval)
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          placeholder="Ask anything about your documents..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Top K</label>
          <input
            type="number"
            value={topK}
            onChange={e => setTopK(Number(e.target.value))}
            min={1} max={20}
            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mt-4">
          <input type="checkbox" checked={runEval} onChange={e => setRunEval(e.target.checked)} className="rounded" />
          Run evaluation
        </label>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="ml-auto mt-4 px-5 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Asking...' : 'Ask →'}
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {result && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium">Answer</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                result.guardrail?.action === 'allow' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>{result.guardrail?.action || 'allow'}</span>
              <span className="text-xs text-gray-400">{Math.round(result.latency_ms)}ms</span>
            </div>
          </div>
          <div className="p-4 text-sm leading-relaxed text-gray-800">{result.answer}</div>

          {result.sources?.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Sources ({result.sources.length})</p>
              <div className="space-y-2">
                {result.sources.map((s: any, i: number) => (
                  <div key={i} className="text-xs text-gray-500 border-l-2 border-gray-200 pl-2">
                    <span className="font-medium text-gray-700">{s.metadata?.source || s.metadata?.filename || 'unknown'}</span>
                    {' — '}{(s.content || '').slice(0, 150)}...
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.eval_scores && (
            <div className="border-t border-gray-100 px-4 py-3 flex gap-6">
              <div className="text-xs text-gray-500">Faithfulness <span className="font-medium text-gray-800">{Math.round((result.eval_scores.faithfulness || 0) * 100)}%</span></div>
              <div className="text-xs text-gray-500">Relevance <span className="font-medium text-gray-800">{Math.round((result.eval_scores.relevance || 0) * 100)}%</span></div>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
