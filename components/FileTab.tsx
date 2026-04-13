'use client'
import { useState, useRef } from 'react'
import { ingestFile } from '@/lib/api'

export default function FileTab() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await ingestFile(file)
      setResult({ ...data, filename: file.name })
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload file</label>
        <p className="text-xs text-gray-400 mb-3">Supported: PDF, DOCX, TXT, MD, HTML, CSV — max 25 MB</p>
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {file ? (
            <div>
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">Click to select a file</p>
              <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,.html,.csv"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !file}
        className="w-full py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading & ingesting...' : 'Upload & ingest →'}
      </button>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">{result.filename} ingested</p>
          <p className="text-xs text-green-600 mt-1">{result.chunks} chunks created</p>
        </div>
      )}
    </form>
  )
}
