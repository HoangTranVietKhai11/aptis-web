import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, PenTool, Layers, Check, Loader2, Trash2, Library, Book, Gamepad2, Upload, FileText, X, CheckCircle2, Volume2 } from 'lucide-react'

function speak(word) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(word)
  u.lang = 'en-GB'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

const API = '/api'

async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    })
    const text = await res.text()
    if (!res.ok) {
      console.error(`API Error ${path}:`, text)
      return null
    }
    return JSON.parse(text)
  } catch (err) {
    console.error(`Fetch Error ${path}:`, err)
    return null
  }
}

const THEMES = [
  'Work & Career', 'Travel & Transport', 'Education & Learning',
  'Health & Lifestyle', 'Environment & Nature', 'Technology & Media', 'Social Life & Culture'
]

export default function Vocabulary() {
  const [tab, setTab] = useState('library')
  const [words, setWords] = useState([])
  const [notebook, setNotebook] = useState([])
  const [search, setSearch] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newWord, setNewWord] = useState({ word: '', definition: '', example_sentence: '', part_of_speech: '', theme: 'Work & Career' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // CSV Import State
  const [showImport, setShowImport] = useState(false)
  const [importSetName, setImportSetName] = useState('')
  const [importRows, setImportRows] = useState([])
  const [importStatus, setImportStatus] = useState(null) // {imported, skipped}
  const [importError, setImportError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    const t = setTimeout(loadWords, 300)
    return () => clearTimeout(t)
  }, [search, selectedTheme])

  const loadAll = async () => {
    setLoading(true)
    setError(null)
    const [v, n] = await Promise.all([
      apiFetch('/vocabulary'),
      apiFetch('/vocabulary/notebook'),
    ])
    setWords(v || [])
    setNotebook(n || [])
    setLoading(false)
  }

  const loadWords = async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedTheme) params.set('theme', selectedTheme)
    const q = params.toString()
    const v = await apiFetch(`/vocabulary${q ? '?' + q : ''}`)
    if (v) setWords(v)
  }

  const handleAddWord = async () => {
    if (!newWord.word.trim()) return
    if (tab === 'library') {
      await apiFetch('/vocabulary', { method: 'POST', body: JSON.stringify(newWord) })
    } else {
      await apiFetch('/vocabulary/notebook', { method: 'POST', body: JSON.stringify(newWord) })
    }
    setNewWord({ word: '', definition: '', example_sentence: '', part_of_speech: '', theme: 'Work & Career' })
    setShowAdd(false)
    loadAll()
  }

  const handleSaveToNotebook = async (w) => {
    await apiFetch('/vocabulary/notebook', {
      method: 'POST',
      body: JSON.stringify({ word: w.word, definition: w.definition, example_sentence: w.example_sentence, vocabulary_id: w.id })
    })
    loadAll()
  }

  const handleDelete = async (id) => {
    const path = tab === 'library' ? `/vocabulary/${id}` : `/vocabulary/notebook/${id}`
    await apiFetch(path, { method: 'DELETE' })
    loadAll()
  }

  const displayWords = Array.isArray(tab === 'library' ? words : notebook) ? (tab === 'library' ? words : notebook) : []

  const handleCSVFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n').filter(l => l.trim())
      const rows = []
      for (const line of lines) {
        // Support tab and comma delimited
        const parts = line.includes('\t')
          ? line.split('\t')
          : line.split(',')
        const word = parts[0]?.replace(/^"|"$/g, '').trim()
        const definition = parts[1]?.replace(/^"|"$/g, '').trim() || ''
        const example_sentence = parts[2]?.replace(/^"|"$/g, '').trim() || ''
        const notes = parts[3]?.replace(/^"|"$/g, '').trim() || ''
        if (word) rows.push({ word, definition, example_sentence, notes })
      }
      // Remove header row if first word is 'word'
      if (rows.length > 0 && rows[0].word.toLowerCase() === 'word') rows.shift()
      setImportRows(rows)
      setImportStatus(null)
      setImportError(null)
    }
    reader.readAsText(file)
  }

  const handleImportSubmit = async () => {
    if (!importSetName.trim()) { setImportError('Please enter a set name.'); return }
    if (importRows.length === 0) { setImportError('No valid rows found in the CSV.'); return }
    const res = await apiFetch('/vocabulary/import-csv', {
      method: 'POST',
      body: JSON.stringify({ set_name: importSetName.trim(), rows: importRows })
    })
    if (res?.success) {
      setImportStatus(res)
      setImportRows([])
      setImportSetName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadAll()
    } else {
      setImportError('Import failed. Please check your file format.')
    }
  }

  if (error) {
    return <div className="p-10 text-red-400">Error: {error}</div>
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-3xl font-bold text-white">Vocabulary</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTab('library')}
          className={`px-5 py-3 rounded-xl font-semibold text-lg transition-all flex items-center gap-2 ${tab === 'library' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white/5 text-primary-300 hover:bg-white/10'}`}
        >
          <Library className="w-5 h-5" /> Word Library ({words.length})
        </button>
        <button
          onClick={() => setTab('notebook')}
          className={`px-5 py-3 rounded-xl font-semibold text-lg transition-all flex items-center gap-2 ${tab === 'notebook' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white/5 text-primary-300 hover:bg-white/10'}`}
        >
          <PenTool className="w-5 h-5" /> My Notebook ({notebook.length})
        </button>
        <button
          onClick={() => { setShowImport(!showImport); setImportStatus(null); setImportError(null) }}
          className={`px-5 py-3 rounded-xl font-semibold text-lg transition-all flex items-center gap-2 ${showImport ? 'bg-accent-600 text-white shadow-lg' : 'bg-white/5 text-primary-300 hover:bg-white/10'}`}
        >
          <Upload className="w-5 h-5" /> Import CSV
        </button>
      </div>

      {/* Search + Filter + Actions */}
      <div className="flex gap-3 flex-wrap items-center">
        {tab === 'library' && (
          <>
            <input
              type="text"
              placeholder="Search words..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300/50 focus:outline-none focus:border-primary-400"
            />
            <select
              value={selectedTheme}
              onChange={e => setSelectedTheme(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-400"
            >
              <option value="" className="bg-slate-900">All Themes</option>
              {(THEMES || []).map(t => (
                <option key={t} value={t} className="bg-slate-900">
                  {t}
                </option>
              ))}
            </select>
          </>
        )}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-glow bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {showAdd ? 'Cancel' : '+ Add Word'}
        </button>
        <Link
          to="/vocab-game"
          className="bg-accent-600/20 hover:bg-accent-600/40 border border-accent-500/30 text-accent-300 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
        >
          <Gamepad2 className="w-5 h-5" /> Minigame
        </Link>
        <Link
          to="/flashcards"
          className="btn-glow bg-gradient-to-r from-accent-600 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Layers className="w-5 h-5" /> Flashcards
        </Link>
      </div>

      {/* CSV Import Panel */}
      {showImport && (
        <div className="glass-card p-6 space-y-4 border border-accent-500/20">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-accent-300 flex items-center gap-2"><Upload className="w-5 h-5" /> Import Flashcard Set from CSV</h2>
            <button onClick={() => setShowImport(false)} className="text-primary-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          {importStatus && (
            <div className="bg-success-500/10 border border-success-400/30 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success-400" />
              <p className="text-success-300 font-semibold">✅ Imported {importStatus.imported} words! {importStatus.skipped > 0 && `(${importStatus.skipped} skipped)`}</p>
            </div>
          )}
          {importError && <p className="text-red-400 text-sm">{importError}</p>}

          <div>
            <label className="text-primary-300 text-sm font-semibold block mb-1">Set Name *</label>
            <input
              type="text"
              placeholder="e.g. IELTS Vocabulary Week 1, Business English..."
              value={importSetName}
              onChange={e => setImportSetName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-300/50 focus:outline-none focus:border-accent-400"
            />
          </div>

          <div>
            <label className="text-primary-300 text-sm font-semibold block mb-1">Upload CSV File</label>
            <p className="text-primary-400 text-xs mb-2">Format: <code className="bg-white/10 px-1 rounded">word, definition, example sentence (optional), notes (optional)</code> — one row per line. First row can be a header (will be skipped automatically).</p>
            <div
              className="border-2 border-dashed border-white/10 hover:border-accent-500/50 rounded-xl p-6 text-center cursor-pointer transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleCSVFile(e.dataTransfer.files[0]) }}
            >
              <FileText className="w-10 h-10 text-primary-400 mx-auto mb-2" />
              <p className="text-primary-300">Click or drag & drop your .csv file here</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={e => handleCSVFile(e.target.files[0])}
              />
            </div>
          </div>

          {importRows.length > 0 && (
            <div>
              <p className="text-primary-300 text-sm font-semibold mb-2">Preview: {importRows.length} words ready to import</p>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-3 py-2 text-primary-400">#</th>
                      <th className="text-left px-3 py-2 text-primary-400">Word</th>
                      <th className="text-left px-3 py-2 text-primary-400">Definition</th>
                      <th className="text-left px-3 py-2 text-primary-400">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="px-3 py-2 text-primary-500">{i + 1}</td>
                        <td className="px-3 py-2 text-white font-medium">{row.word}</td>
                        <td className="px-3 py-2 text-primary-200">{row.definition}</td>
                        <td className="px-3 py-2 text-primary-400 italic">{row.example_sentence}</td>
                      </tr>
                    ))}
                    {importRows.length > 20 && (
                      <tr><td colSpan={4} className="px-3 py-2 text-primary-400 text-center">...and {importRows.length - 20} more rows</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <button
                onClick={handleImportSubmit}
                className="mt-4 btn-glow bg-accent-600 hover:bg-accent-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <Upload className="w-5 h-5" /> Import {importRows.length} words into "{importSetName || 'My Set'}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Word *" value={newWord.word} onChange={e => setNewWord({ ...newWord, word: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-primary-300/50 focus:outline-none focus:border-primary-400" />
            <input placeholder="Part of speech (noun, verb...)" value={newWord.part_of_speech} onChange={e => setNewWord({ ...newWord, part_of_speech: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-primary-300/50 focus:outline-none focus:border-primary-400" />
          </div>
          <input placeholder="Definition" value={newWord.definition} onChange={e => setNewWord({ ...newWord, definition: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-primary-300/50 focus:outline-none focus:border-primary-400" />
          <input placeholder="Example sentence" value={newWord.example_sentence} onChange={e => setNewWord({ ...newWord, example_sentence: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-primary-300/50 focus:outline-none focus:border-primary-400" />
          <select value={String(newWord.theme)} onChange={e => setNewWord({ ...newWord, theme: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-400">
            {(THEMES || []).map(t => <option key={String(t)} value={String(t)} className="bg-slate-900">{String(t)}</option>)}
          </select>
          <div className="flex gap-3">
            <button onClick={handleAddWord} className="bg-success-500 hover:bg-success-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> Save
            </button>
            <button onClick={() => setShowAdd(false)} className="bg-white/10 hover:bg-white/15 text-white px-6 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Words List */}
      {loading ? (
        <p className="text-center text-primary-300 py-12 text-lg flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading vocabulary...
        </p>
      ) : error ? (
        <p className="text-center text-red-400 py-12">{error}</p>
      ) : displayWords.length === 0 ? (
        <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
          <Book className="w-16 h-16 text-primary-500/50 mb-4" />
          <p className="text-primary-300 text-lg">No words found. Add some or try a different filter!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {(displayWords || []).map(w => (
            <div key={w.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-bold text-white">{w.word}</h3>
                  <button
                    onClick={() => speak(w.word)}
                    className="text-primary-400 hover:text-accent-400 transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {w.part_of_speech && (
                    <span className="text-xs bg-primary-600/30 text-primary-300 px-2 py-0.5 rounded-full">{w.part_of_speech}</span>
                  )}
                  {w.theme && (
                    <span className="text-xs bg-accent-600/20 text-accent-400 px-2 py-0.5 rounded-full">{w.theme}</span>
                  )}
                  {w.mastery !== undefined && (
                    <span className="text-xs bg-success-500/20 text-success-400 px-2 py-0.5 rounded-full">Level {w.level || 1}</span>
                  )}
                </div>
                {w.definition && <p className="text-primary-200 text-sm">{w.definition}</p>}
                {w.example_sentence && <p className="text-primary-300 text-sm italic mt-1">"{w.example_sentence}"</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {tab === 'library' && (
                  <button onClick={() => handleSaveToNotebook(w)}
                    className="bg-accent-600/30 hover:bg-accent-600/50 text-accent-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    + Notebook
                  </button>
                )}
                <button onClick={() => handleDelete(w.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
