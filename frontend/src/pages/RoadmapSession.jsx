import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import Confetti from 'react-confetti'
import QuestionCard from '../components/QuestionCard'
import AiTutor from '../components/AiTutor'
import GrammarTenses from './GrammarTenses'
import { submitAnswer } from '../services/api'
import { PartyPopper, CheckCircle2, Target, BookOpen, ArrowDown, Edit3, Save, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

export default function RoadmapSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [results, setResults] = useState({})
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetch(`/api/roadmap/questions/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { toast.error(data.error); navigate('/roadmap'); return; }
        setSession(data.session)
        setQuestions(data.questions)
        setLoading(false)
      })
      .catch(() => { setLoading(false); navigate('/roadmap') })
  }, [sessionId])

  const handleAnswer = async (questionId, answer) => {
    try {
      const data = await submitAnswer(questionId, answer)
      setResults(r => ({ ...r, [questionId]: data }))
    } catch {}
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await fetch(`/api/roadmap/${sessionId}/complete`, { method: 'POST' })
    } catch {}
    setFinished(true)
    setCompleting(false)
  }

  const allAnswered = questions.length > 0 && questions.every(q => results[q.id])
  const currentQ = questions[currentIdx]

  if (loading) return <div className="text-center py-20 text-primary-300">Loading session...</div>

  if (finished) {
    const correct = Object.values(results).filter(r => r.is_correct).length
    return (
      <div className="max-w-xl mx-auto glass-card p-10 text-center animate-fade-in relative overflow-hidden">
        <Confetti width={1000} height={800} recycle={false} numberOfPieces={500} gravity={0.15} style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }} />
        <div className="flex justify-center mb-6">
          <PartyPopper className="w-16 h-16 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
        <p className="text-5xl font-black text-accent-400 mb-2">{correct}/{questions.length}</p>
        <p className="text-primary-300 mb-6">{session?.title}</p>
        <p className="text-success-400 font-semibold mb-6 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Next session has been unlocked!
        </p>
        <button
          onClick={() => navigate('/roadmap')}
          className="btn-glow bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 max-w-xs mx-auto relative z-10"
        >
          Back to Roadmap <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-4">
      {/* Header */}
      <div className="glass-card p-4 flex items-center gap-3">
        <button onClick={() => navigate('/roadmap')} className="text-primary-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div>
          <h1 className="font-bold text-white">{session?.title}</h1>
          <p className="text-xs text-primary-400">{session?.stage} · 🇬🇧 {session?.bc_ref}</p>
        </div>
        <span className="ml-auto text-primary-300 text-sm">{currentIdx + 1}/{questions.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-emerald-500 to-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${questions.length ? ((currentIdx + (results[currentQ?.id] ? 1 : 0)) / questions.length) * 100 : 0}%` }}
        />
      </div>

      {/* Objectives */}
      {session?.objectives && (
        <div className="bg-accent-500/10 border border-accent-400/20 rounded-xl p-4 text-sm text-accent-300 flex items-start gap-3">
          <Target className="w-5 h-5 flex-shrink-0 text-accent-400" />
          <div>
            <strong className="block mb-1">Session Goal:</strong> 
            <span className="leading-relaxed">{session.objectives}</span>
          </div>
        </div>
      )}

      {/* Theory Content Or Custom Components */}
      {session?.bc_ref === 'GRAMMAR_HUB' && currentIdx === 0 ? (
        <div className="mb-6 animate-fade-in">
          <GrammarTenses isEmbedded={true} />
          <div className="mt-6 p-4 bg-white/5 rounded-lg text-sm font-medium text-primary-300 flex items-center gap-2">
            Cuộn xuống dưới để bắt đầu làm bài tập áp dụng <ArrowDown className="w-4 h-4 text-primary-400 animate-bounce" />
          </div>
        </div>
      ) : session?.theory_content && currentIdx === 0 && (
        <div className="glass-card p-6 border-primary-500/30 bg-primary-500/5 animate-fade-in mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-primary-400" /> Lý thuyết &amp; Mẹo làm bài
          </h2>
          <div className="prose-theory text-primary-100 text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                h3: ({children}) => <h3 className="text-white font-bold text-base mt-4 mb-2 border-b border-primary-500/30 pb-1">{children}</h3>,
                strong: ({children}) => <strong className="text-accent-300 font-bold">{children}</strong>,
                em: ({children}) => <em className="text-primary-300">{children}</em>,
                ul: ({children}) => <ul className="list-disc list-inside space-y-1 mt-2">{children}</ul>,
                li: ({children}) => <li className="text-primary-200">{children}</li>,
                p: ({children}) => <p className="mb-3 text-primary-200">{children}</p>,
                code: ({children}) => <code className="bg-white/10 rounded px-2 py-0.5 text-accent-300 text-xs font-mono">{children}</code>,
              }}
            >
              {session.theory_content}
            </ReactMarkdown>
          </div>
          <div className="mt-6 p-4 bg-white/5 rounded-lg text-sm font-medium text-primary-300 flex items-center gap-2">
            Cuộn xuống dưới để bắt đầu làm bài tập áp dụng <ArrowDown className="w-4 h-4 text-primary-400 animate-bounce" />
          </div>
        </div>
      )}

      {/* Session Notes */}
      {currentIdx === 0 && (
        <SessionNotes sessionId={sessionId} />
      )}

      {/* Question */}
      {currentQ && (
        <div>
          <QuestionCard question={currentQ} onAnswer={handleAnswer} showResult={results[currentQ.id]} />
          <AiTutor
            question={currentQ}
            currentAnswer={results[currentQ.id]?.user_answer}
            correctAnswer={currentQ.correct_answer}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Prev
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            className="btn-glow bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : allAnswered ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="btn-glow bg-gradient-to-r from-success-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            {completing ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Check className="w-5 h-5" /> Complete Session</>}
          </button>
        ) : (
          <span className="text-primary-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-lg">Answer all to complete</span>
        )}
      </div>
    </div>
  )
}

// ─── Session Notes Component ─────────────────────────────────────────────────
function SessionNotes({ sessionId }) {
  const key = `notes_session_${sessionId}`
  const [notes, setNotes] = useState(() => localStorage.getItem(key) || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem(key, notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="glass-card p-4 mb-4 mt-8">
      <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-accent-400" /> Ghi chú của bạn
        </div>
        <span className="text-primary-400 font-normal text-xs">(lưu tự động sau khi nhấn Save)</span>
      </h3>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Ghi lại điểm quan trọng bạn muốn nhớ từ bài học này..."
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-primary-500 resize-none focus:outline-none focus:border-primary-500/50"
      />
      <button
        onClick={handleSave}
        className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${saved ? 'bg-success-600 text-white' : 'bg-primary-600 hover:bg-primary-500 text-white'}`}
      >
        {saved ? <><Check className="w-4 h-4" /> Đã lưu!</> : <><Save className="w-4 h-4" /> Lưu ghi chú</>}
      </button>
    </div>
  )
}
