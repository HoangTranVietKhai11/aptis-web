import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Headphones, Play, Square, Volume2, VolumeX, ChevronLeft, ChevronRight,
  Timer, Check, RotateCcw, BarChart3, ArrowLeft, Trophy, AlertCircle,
  CheckCircle2, XCircle, Loader2, BookOpen, Sparkles, Mic, Info
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTS = {
  1: { name: 'Information Recognition', color: '#6366f1', bg: 'from-violet-600 to-indigo-600', light: 'bg-violet-50 text-violet-700 border-violet-200', badge: 'bg-violet-100 text-violet-700', total: 7 },
  2: { name: 'Information Matching',    color: '#0ea5e9', bg: 'from-sky-500 to-cyan-600',       light: 'bg-sky-50 text-sky-700 border-sky-200',         badge: 'bg-sky-100 text-sky-700',     total: 6 },
  3: { name: 'Inference – Discussion',  color: '#f59e0b', bg: 'from-amber-500 to-orange-500',   light: 'bg-amber-50 text-amber-700 border-amber-200',   badge: 'bg-amber-100 text-amber-700', total: 6 },
  4: { name: 'Inference – Monologue',   color: '#10b981', bg: 'from-emerald-500 to-teal-600',   light: 'bg-emerald-50 text-emerald-700 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', total: 6 },
}

const EXAM_DURATION = 40 * 60 // 40 minutes in seconds
const MAX_PLAYS = 2

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const getLetter = (i) => String.fromCharCode(65 + i)

// ─── Audio Player Hook ────────────────────────────────────────────────────────
function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const stop = useCallback(() => {
    setIsPlaying(false)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const play = useCallback(async (text) => {
    stop()
    setIsPlaying(true)
    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=en`)
      if (!res.ok) throw new Error('TTS API error')
      const data = await res.json()
      if (!data.audio?.length) throw new Error('No audio')

      const playSeq = (segs, i) => {
        if (i >= segs.length) { setIsPlaying(false); return }
        const audio = new Audio('data:audio/mp3;base64,' + segs[i].base64)
        audioRef.current = audio
        audio.onended = () => playSeq(segs, i + 1)
        audio.onerror = () => setIsPlaying(false)
        audio.play().catch(() => setIsPlaying(false))
      }
      playSeq(data.audio, 0)
    } catch {
      // Fallback to Web Speech
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(text)
        utt.lang = 'en-GB'; utt.rate = 0.88
        utt.onend = () => setIsPlaying(false)
        utt.onerror = () => setIsPlaying(false)
        window.speechSynthesis.speak(utt)
      } else {
        setIsPlaying(false)
      }
    }
  }, [stop])

  useEffect(() => () => stop(), [stop])
  return { isPlaying, play, stop }
}

// ─── Waveform Animation ───────────────────────────────────────────────────────
function Waveform({ active }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-150"
          style={{
            width: 3,
            backgroundColor: active ? '#6366f1' : '#cbd5e1',
            height: active ? `${10 + Math.sin(i * 0.9) * 14 + Math.random() * 8}px` : '6px',
            animation: active ? `wave ${0.6 + i * 0.08}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
    </div>
  )
}

// ─── Part Badge ───────────────────────────────────────────────────────────────
function PartBadge({ part }) {
  const p = PARTS[part]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${p.light}`}>
      <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
      Part {part}: {p.name}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ListeningTest() {
  const navigate = useNavigate()
  const [view, setView] = useState('intro')       // intro | test | results
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})       // { qId: optionStr }
  const [playCounts, setPlayCounts] = useState({}) // { qId: number }
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION)
  const [results, setResults] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef(null)
  const { isPlaying, play, stop } = useAudioPlayer()
  const currentQ = questions[currentIdx]

  // ─── Load questions from backend ────────────────────────────────────────────
  const loadQuestions = useCallback(() => {
    setLoading(true)
    fetch('/api/listening/questions')
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions || [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Không thể tải câu hỏi. Vui lòng kiểm tra server.')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // ─── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== 'test') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleFinish(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [view])

  // ─── Play audio for a question ───────────────────────────────────────────────
  const handlePlay = useCallback((q, idx) => {
    const count = playCounts[q.id] || 0
    if (count >= MAX_PLAYS) return
    const partName = PARTS[q.part]?.name || `Part ${q.part}`
    const qNum = idx + 1
    const ttsText = `Part ${q.part}, ${partName}. Question ${qNum}. ${q.question}. Now choose your answer.`
    play(ttsText)
    setPlayCounts(pc => ({ ...pc, [q.id]: count + 1 }))
  }, [playCounts, play])

  // ─── Select an answer ────────────────────────────────────────────────────────
  const handleSelect = (qId, opt) => {
    if (results) return
    setAnswers(a => ({ ...a, [qId]: opt }))
  }

  // ─── Finish exam ─────────────────────────────────────────────────────────────
  const handleFinish = useCallback(async () => {
    clearInterval(timerRef.current)
    stop()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/listening/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      const data = await res.json()
      setResults(data)
      setView('results')
    } catch {
      // Compute locally if API fails
      let correct = 0
      const byPart = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 }, 4: { correct: 0, total: 0 } }
      const review = questions.map(q => {
        const ua = answers[q.id]
        const ok = ua === q.correct_answer
        if (ok) correct++
        if (byPart[q.part]) { byPart[q.part].total++; if (ok) byPart[q.part].correct++ }
        return { id: q.id, part: q.part, correct_answer: q.correct_answer, user_answer: ua, is_correct: ok }
      })
      setResults({ total: questions.length, correct, score: Math.round((correct / questions.length) * 100), byPart, review })
      setView('results')
    }
    setSubmitting(false)
  }, [answers, questions, stop, submitting])

  // ── Group questions by part ───────────────────────────────────────────────────
  const byPart = { 1: [], 2: [], 3: [], 4: [] }
  questions.forEach(q => { if (byPart[q.part]) byPart[q.part].push(q) })
  const answeredCount = Object.keys(answers).length
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0

  // ──────────────────────────────────────────────────────────────────────────────
  // VIEW: INTRO
  // ──────────────────────────────────────────────────────────────────────────────
  if (view === 'intro') {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto space-y-6 py-4">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-purple-200 text-sm font-semibold tracking-widest uppercase">APTIS ESOL General</p>
                <h1 className="text-3xl font-black">Listening Test</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              {[['25', 'Questions'], ['40', 'Minutes'], ['4', 'Parts'], ['2×', 'Max Plays']].map(([val, lab]) => (
                <div key={lab} className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                  <p className="text-2xl font-black">{val}</p>
                  <p className="text-purple-200 text-xs font-medium">{lab}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Part Breakdown */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-500" /> Chi tiết 4 phần thi
          </h2>
          <div className="space-y-3">
            {Object.entries(PARTS).map(([num, p]) => (
              <div key={num} className={`flex items-start gap-4 p-4 rounded-xl border ${p.light}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{ background: p.color }}>
                  {num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-xs opacity-75 mt-0.5">
                    {num === '1' && 'Nghe thông tin cụ thể: số, giờ, tên, ngày tháng'}
                    {num === '2' && 'Ghép nối thông tin chi tiết từ hội thoại'}
                    {num === '3' && 'Suy luận thái độ và ý định từ hội thoại 2 người'}
                    {num === '4' && 'Suy luận sâu từ độc thoại dài'}
                  </p>
                </div>
                <span className="font-black text-lg shrink-0">{p.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="glass-card p-5 space-y-3">
          <h2 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-500" /> Lưu ý trước khi thi
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {[
              'Mỗi đoạn audio được nghe tối đa 2 lần — đúng với thi thật APTIS.',
              'Tổng thời gian: 40 phút. Đồng hồ đếm ngược tự động nộp bài khi hết giờ.',
              'Tất cả câu hỏi đều là trắc nghiệm 4 lựa chọn (A, B, C, D).',
              'Sử dụng tai nghe để nghe rõ nhất. Đảm bảo âm thanh hoạt động trước khi bắt đầu.',
            ].map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : questions.length === 0 ? (
          <div className="glass-card p-6 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
            <p className="font-semibold">Chưa có câu hỏi Listening.</p>
            <p className="text-sm mt-1">Vui lòng chạy script seed: <code className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs">node backend/scripts/seed_listening.js</code></p>
          </div>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 dark:bg-white/10 text-slate-700 dark:text-white transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button
              onClick={() => { setView('test'); setTimeLeft(EXAM_DURATION) }}
              className="flex-1 py-3 rounded-xl font-black text-white shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              <Sparkles className="w-5 h-5" /> Bắt đầu thi ({questions.length} câu)
            </button>
          </div>
        )}
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // VIEW: RESULTS
  // ──────────────────────────────────────────────────────────────────────────────
  if (view === 'results' && results) {
    const score = results.score || 0
    const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
    const scoreLabel = score >= 80 ? 'Xuất sắc! 🎉' : score >= 70 ? 'Tốt! 👏' : score >= 50 ? 'Khá ổn 💪' : 'Cần luyện thêm 📚'
    const reviewMap = {}
    ;(results.review || []).forEach(r => { reviewMap[r.id] = r })

    return (
      <div className="animate-fade-in max-w-3xl mx-auto space-y-6 py-4">
        {/* Score Card */}
        <div className="glass-card p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Kết quả Listening</h2>
          <div className="flex justify-center">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="2.5"
                  strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black" style={{ color: scoreColor }}>{score}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{results.correct}/{results.total}</span>
              </div>
            </div>
          </div>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{scoreLabel}</p>
        </div>

        {/* Per-Part Breakdown */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" /> Kết quả theo phần
          </h3>
          {Object.entries(PARTS).map(([num, p]) => {
            const pd = results.byPart?.[num] || { correct: 0, total: p.total }
            const pct = pd.total > 0 ? Math.round((pd.correct / pd.total) * 100) : 0
            return (
              <div key={num} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: p.color }}>{num}</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200">{pd.correct}/{pd.total}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Q&A Review */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-black text-slate-800 dark:text-white">Xem lại câu trả lời</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {questions.map((q, i) => {
              const r = reviewMap[q.id]
              const ok = r?.is_correct
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${ok ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30' : 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30'}`}>
                  <div className="flex items-start gap-3">
                    {ok ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">Q{i + 1}</span>
                        <PartBadge part={q.part} />
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium line-clamp-2 mb-2">{q.question.split('\n').pop()}</p>
                      {!ok && (
                        <div className="space-y-1 text-xs">
                          <p className="text-rose-600 dark:text-rose-400">Bạn chọn: <strong>{r?.user_answer || '(không trả lời)'}</strong></p>
                          <p className="text-emerald-600 dark:text-emerald-400">Đáp án đúng: <strong>{q.correct_answer}</strong></p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 dark:bg-white/10 text-slate-700 dark:text-white transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Trang chủ
          </button>
          <button
            onClick={() => { 
              setAnswers({}); 
              setPlayCounts({}); 
              setCurrentIdx(0); 
              setResults(null); 
              setTimeLeft(EXAM_DURATION); 
              setView('test');
              loadQuestions();
            }}
            className="flex-1 py-3 rounded-xl font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại
          </button>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // VIEW: TEST
  // ──────────────────────────────────────────────────────────────────────────────
  if (!currentQ) return null

  const playCount = playCounts[currentQ.id] || 0
  const canPlay = playCount < MAX_PLAYS && !isPlaying
  const isCurrentPlaying = isPlaying
  const currentPart = PARTS[currentQ.part]
  const isUrgent = timeLeft < 5 * 60

  return (
    <div className="animate-fade-in space-y-4 max-w-4xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between glass-card px-5 py-3 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Headphones className="w-5 h-5 text-violet-500" />
          <span className="font-black text-slate-800 dark:text-white">Listening Test</span>
          <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 font-medium">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-black text-base border transition-colors ${isUrgent ? 'bg-red-50 border-red-400 text-red-600 dark:bg-red-500/20 dark:border-red-400 dark:text-red-400' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200'}`}>
            <Timer className="w-4 h-4" />
            {fmtTime(timeLeft)}
          </div>
          {/* Finish */}
          <button
            onClick={() => { if (window.confirm('Nộp bài ngay bây giờ?')) handleFinish() }}
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Nộp bài
          </button>
        </div>
      </div>

      {/* ── Progress Bar ─────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-slate-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 to-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Part Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(PARTS).map(([num, p]) => {
          const pqs = byPart[num] || []
          const answered = pqs.filter(q => answers[q.id]).length
          const isCurrent = pqs.some((q, i) => questions.indexOf(q) === currentIdx)
          return (
            <button
              key={num}
              onClick={() => {
                const firstIdx = questions.findIndex(q => q.part === parseInt(num))
                if (firstIdx !== -1) setCurrentIdx(firstIdx)
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isCurrent
                  ? `text-white border-transparent shadow-sm`
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
              style={isCurrent ? { background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` } : {}}
            >
              <span>Part {num}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${isCurrent ? 'bg-white/25' : 'bg-slate-100 dark:bg-white/10'}`}>
                {answered}/{p.total}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Question Card ────────────────────────────────────────────────────── */}
      <div className="glass-card p-6 space-y-5">
        {/* Part label + Q number */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <PartBadge part={currentQ.part} />
          <span className="text-sm font-black text-slate-500 dark:text-slate-400">Câu {currentIdx + 1}</span>
        </div>

        {/* Audio Player */}
        <div className={`rounded-2xl border-2 p-5 transition-all duration-300 ${isCurrentPlaying ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${isCurrentPlaying ? 'bg-violet-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                {isCurrentPlaying
                  ? <Square className="w-5 h-5 text-white fill-white" />
                  : <Volume2 className={`w-5 h-5 ${playCount >= MAX_PLAYS ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'}`} />
                }
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                  {isCurrentPlaying ? 'Đang phát...' : playCount >= MAX_PLAYS ? 'Đã nghe đủ 2 lần' : 'Nhấn để nghe audio'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Waveform active={isCurrentPlaying} />
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${playCount >= MAX_PLAYS ? 'bg-slate-200 dark:bg-white/10 text-slate-500' : 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300'}`}>
                    {playCount}/{MAX_PLAYS} lần
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isCurrentPlaying ? (
                <button
                  onClick={stop}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-red-600 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Square className="w-4 h-4 fill-current" /> Dừng
                </button>
              ) : (
                <button
                  onClick={() => handlePlay(currentQ, currentIdx)}
                  disabled={!canPlay}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                    !canPlay
                      ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/10'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:opacity-90'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  {playCount === 0 ? 'Nghe Audio' : `Nghe lần ${playCount + 1}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dialogue/Scenario Text */}
        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" /> Nội dung hội thoại / tình huống:
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">{currentQ.question}</p>
        </div>

        {/* MCQ Options */}
        <div className="space-y-2.5">
          {(currentQ.options || []).map((opt, i) => {
            const selected = answers[currentQ.id] === opt
            return (
              <button
                key={i}
                onClick={() => handleSelect(currentQ.id, opt)}
                className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-3 group ${
                  selected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-200 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:bg-violet-500/10'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 transition-all ${selected ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20'}`}>
                  {getLetter(i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Question Navigator ───────────────────────────────────────────────── */}
      <div className="glass-card p-4">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">Nhảy đến câu hỏi:</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const isAns = !!answers[q.id]
            const isCur = i === currentIdx
            const p = PARTS[q.part]
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                title={`Q${i + 1} – Part ${q.part}`}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border-2 ${
                  isCur
                    ? 'text-white border-transparent scale-110 shadow-md'
                    : isAns
                    ? 'text-white border-transparent opacity-90 hover:opacity-100'
                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-violet-300'
                }`}
                style={isCur || isAns ? { background: isCur ? p.color : p.color + 'bb' } : {}}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-500 inline-block" /> Đang xem</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-300 inline-block" /> Đã trả lời</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-slate-300 inline-block" /> Chưa trả lời</span>
        </div>
      </div>

      {/* ── Navigation Arrows ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Câu trước
        </button>
        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          {answeredCount} / {questions.length} đã trả lời
        </span>
        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition-opacity"
          >
            Câu tiếp <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => { if (window.confirm('Nộp bài? Bạn đã trả lời ' + answeredCount + '/' + questions.length + ' câu.')) handleFinish() }}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Nộp bài
          </button>
        )}
      </div>
    </div>
  )
}
