'use client'
import { useState } from 'react'
import { evaluate } from '@/lib/api'

export default function EvalTab() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || !answer.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const chunks = context.split('\n').filter(l => l.trim())
      const data = await evaluate(question, answer, chunks)
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const faithPct = result ? Math.round((result.faithfulness || 0) * 100) : 0
  const relPct   = result ? Math.round((result.relevance    || 0) * 100) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Original question..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Answer to evaluate</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Context chunks <span className="font-normal text-gray-400">(one per line)</span></label>
        <textarea
          value={context}
          onChange={e => setContext(e.target.value)}
          rows={4}
          placeholder="Paste the retrieved chunks that were used..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !question.trim() || !answer.trim()}
        className="w-full py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Evaluating...' : 'Evaluate →'}
      </button>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {result && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-sm font-medium">Evaluation scores</div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-semibold text-gray-900">{faithPct}%</div>
              <div className="text-xs text-gray-500 mt-1">Faithfulness</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: `${faithPct}%` }} />
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-semibold text-gray-900">{relPct}%</div>
              <div className="text-xs text-gray-500 mt-1">Relevance</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full" style={{ width: `${relPct}%` }} />
              </div>
            </div>
          </div>
          {result.note && <div className="px-4 pb-3 text-xs text-gray-400">{result.note}</div>}
        </div>
      )}
    </form>
  )
}
