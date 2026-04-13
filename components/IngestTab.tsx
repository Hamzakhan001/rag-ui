'use client'
import { useState } from 'react'
import { ingestText } from '@/lib/api'

export default function IngestTab() {
  const [text, setText] = useState('')
  const [source, setSource] = useState('manual')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await ingestText(text, source)
      setResult(data)
      setText('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text to ingest</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Paste any text to add to your knowledge base..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Source name</label>
          <input
            value={source}
            onChange={e => setSource(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-5 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Ingesting...' : 'Ingest →'}
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">Ingested successfully</p>
          <p className="text-xs text-green-600 mt-1">{result.chunks} chunks created</p>
        </div>
      )}
    </form>
  )
}
