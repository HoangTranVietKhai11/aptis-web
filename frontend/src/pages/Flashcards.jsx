import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getNotebook, reviewWord } from '../services/api'
import { PartyPopper, Zap, RotateCcw, Clock, CheckCircle2, Layers, ChevronDown, Volume2, Gamepad2 } from 'lucide-react'

async function fetchSets() {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/vocabulary/sets', {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
  if (!res.ok) return []
  return res.json()
}

async function fetchNotebook(reviewOnly, setName) {
  const token = localStorage.getItem('token')
  const params = new URLSearchParams()
  if (reviewOnly) params.set('review_only', 'true')
  if (setName) params.set('set_name', setName)
  const res = await fetch(`/api/vocabulary/notebook?${params}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
  if (!res.ok) return []
  return res.json()
}

function speak(text, rate = 1) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-GB'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

export default function Flashcards() {
  const [sets, setSets] = useState([])
  const [selectedSet, setSelectedSet] = useState('') // '' = all due for review
  const [reviewAll, setReviewAll] = useState(false)
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    fetchSets().then(setSets)
  }, [])

  const startReview = async () => {
    setLoading(true)
    const reviewOnly = !reviewAll && !selectedSet
    const data = await fetchNotebook(reviewOnly, selectedSet)
    setWords(data)
    setCurrentIndex(0)
    setShowAnswer(false)
    setFinished(false)
    setStarted(true)
    setLoading(false)
  }

  const handleReview = async (quality) => {
    const word = words[currentIndex]
    await reviewWord(word.id, quality)
    if (currentIndex + 1 < words.length) {
      const nextWord = words[currentIndex + 1]
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
      // Auto-pronounce next word
      setTimeout(() => speak(nextWord.word, 0.9), 300)
    } else {
      setFinished(true)
    }
  }

  // Set selector screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-8 h-8 text-accent-400" />
          <h1 className="text-3xl font-bold text-white">Flashcards</h1>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div>
            <label className="text-primary-300 text-sm font-semibold block mb-2">Choose a Flashcard Set</label>
            <div className="relative">
              <select
                value={selectedSet}
                onChange={e => setSelectedSet(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-400 appearance-none pr-10"
              >
                <option value="" className="bg-slate-900">📚 All words due for review (SRS)</option>
                {sets.map(s => (
                  <option key={s.set_name} value={s.set_name} className="bg-slate-900">
                    📁 {s.set_name} ({s.count} words)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
            </div>
          </div>

          {selectedSet && (
            <div className="flex items-center gap-3 text-sm text-primary-300">
              <CheckCircle2 className="w-4 h-4 text-accent-400" />
              Reviewing all {sets.find(s => s.set_name === selectedSet)?.count || '?'} words in "{selectedSet}"
            </div>
          )}

          {!selectedSet && (
            <label className="flex items-center gap-3 text-sm text-primary-300 cursor-pointer">
              <input
                type="checkbox"
                checked={reviewAll}
                onChange={e => setReviewAll(e.target.checked)}
                className="w-4 h-4 accent-accent-500"
              />
              Review ALL words (not just ones due today)
            </label>
          )}

          <button
            onClick={startReview}
            className="w-full btn-glow bg-gradient-to-r from-accent-600 to-primary-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <Layers className="w-5 h-5" /> Start Review
          </button>

          {sets.length === 0 && (
            <p className="text-primary-400 text-sm text-center">
              No imported sets yet. Go to{' '}
              <Link to="/vocabulary" className="text-accent-400 underline">Vocabulary → Import CSV</Link>{' '}
              to add your own word sets!
            </p>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-center py-20 text-primary-300">Loading your cards...</div>

  if (words.length === 0) {
    return (
      <div className="glass-card p-10 text-center animate-fade-in flex flex-col items-center justify-center">
        <PartyPopper className="w-16 h-16 text-yellow-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">All caught up!</h2>
        <p className="text-primary-300 mb-6">No words to review right now. Add more from the library or import a CSV!</p>
        <div className="flex gap-3">
          <button onClick={() => setStarted(false)} className="btn-glow bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold">← Back to Sets</button>
          <Link to="/vocabulary" className="btn-glow bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
            Go to Vocabulary
          </Link>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="glass-card p-10 text-center animate-fade-in flex flex-col items-center justify-center">
        <Zap className="w-16 h-16 text-accent-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Review Complete!</h2>
        <p className="text-primary-300 mb-6 font-medium">Great job! You've reviewed {words.length} words{selectedSet ? ` from "${selectedSet}"` : ''} today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setStarted(false)} className="btn-glow bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            ← Choose Another Set
          </button>
          <button onClick={() => { setCurrentIndex(0); setShowAnswer(false); setFinished(false) }} className="btn-glow bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Review Again
          </button>
          <Link
            to={selectedSet ? `/vocab-game?set_name=${encodeURIComponent(selectedSet)}` : '/vocab-game'}
            className="btn-glow bg-gradient-to-r from-accent-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Gamepad2 className="w-5 h-5" /> Play Minigame{selectedSet ? ` (${words.length} words)` : ''}
          </Link>
        </div>
      </div>
    )
  }


  const currentWord = words[currentIndex]

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Flashcards</h1>
          {selectedSet && <p className="text-accent-400 text-sm mt-0.5">📁 {selectedSet}</p>}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-primary-300">{currentIndex + 1} / {words.length}</span>
          <button onClick={() => setStarted(false)} className="text-xs text-primary-400 hover:text-white underline">Change Set</button>
        </div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex) / words.length) * 100}%` }}
        />
      </div>

      <div
        className={`glass-card min-h-[300px] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${showAnswer ? 'border-primary-400/40 bg-primary-600/5' : ''}`}
        onClick={() => {
          if (!showAnswer) {
            setShowAnswer(true)
            speak(currentWord.word, 0.85)
          }
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-4xl font-bold text-white">{currentWord.word}</h2>
          <button
            onClick={e => { e.stopPropagation(); speak(currentWord.word, 0.85) }}
            className="text-primary-400 hover:text-accent-400 transition-colors"
            title="Nghe phát âm"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {showAnswer ? (
          <div className="animate-fade-in w-full space-y-4">
            <div className="h-px bg-white/10 w-full my-4" />
            <p className="text-xl text-primary-100">{currentWord.definition}</p>
            {currentWord.example_sentence && (
              <p className="text-primary-300 italic">"{currentWord.example_sentence}"</p>
            )}
            {currentWord.notes && (
              <p className="text-accent-300 text-sm">Note: {currentWord.notes}</p>
            )}
          </div>
        ) : (
          <p className="text-primary-400 animate-pulse-slow">Click to show answer</p>
        )}
      </div>

      {showAnswer && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          <button
            onClick={() => handleReview(1)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-4 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1.5"><RotateCcw className="w-4 h-4" /> Again</div>
            <span className="block text-[10px] uppercase font-bold text-red-400/70 tracking-wider">Forgot</span>
          </button>
          <button
            onClick={() => handleReview(3)}
            className="bg-warn-500/20 hover:bg-warn-500/30 text-warn-400 py-4 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Good</div>
            <span className="block text-[10px] uppercase font-bold text-warn-400/70 tracking-wider">Remembered</span>
          </button>
          <button
            onClick={() => handleReview(5)}
            className="bg-success-500/20 hover:bg-success-500/30 text-success-400 py-4 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Easy</div>
            <span className="block text-[10px] uppercase font-bold text-success-400/70 tracking-wider">Perfect</span>
          </button>
        </div>
      )}
    </div>
  )
}
