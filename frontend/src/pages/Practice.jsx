import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import AudioRecorder from '../components/AudioRecorder'
import { skills } from '../components/SkillCard'
import { getQuestions, submitAnswer, saveToNotebook } from '../services/api'
import { ArrowLeft, ArrowRight, Trophy, ThumbsUp, Zap, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Practice() {
  const { skill } = useParams()
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState('B2') // Default to target B2

  useEffect(() => {
    if (skill) {
      setLoading(true)
      setCurrentIdx(0)
      setResult(null)
      setScore({ correct: 0, total: 0 })
      getQuestions(skill, difficulty, 10)
        .then(setQuestions)
        .catch(() => setQuestions([]))
        .finally(() => setLoading(false))
    }
  }, [skill, difficulty])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = async (answer) => {
    setIsSubmitting(true)
    const q = questions[currentIdx]
    try {
      const res = await submitAnswer(q.id, answer)
      setResult(res)
      setScore(s => ({
        correct: s.correct + (res.is_correct ? 1 : 0),
        total: s.total + 1
      }))

      // Intelligent Mistake Notebook feature
      if (!res.is_correct && q.skill.match(/grammar|vocabulary/i)) {
        await saveToNotebook({
          word: "Mistake: " + (q.question.length > 50 ? q.question.substring(0, 50) + "..." : q.question),
          definition: `Expected: ${res.correct_answer}. Explanation: ${res.explanation || 'Review this grammar/vocab point!'}`,
          example_sentence: q.question,
          notes: `Skill: ${q.skill}. Your wrong answer: ${answer}`,
          set_name: "Mistakes Bank ⚠️"
        }).then(() => toast.error('Saved to Mistakes Bank ⚠️'))
          .catch(() => {})
      }
    } catch {
      setResult({ is_correct: null, explanation: 'Answer submitted (no auto-check for this type).' })
      setScore(s => ({ ...s, total: s.total + 1 }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    setResult(null)
    setCurrentIdx(i => i + 1)
  }

  // Skill selector
  if (!skill) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-6">Choose a Skill</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(s => (
            <Link
              key={s.id}
              to={`/practice/${s.id}`}
              className="glass-card p-8 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className={`w-20 h-20 rounded-2xl ${s.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{s.label}</h3>
              <p className="text-primary-300">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  let currentSkill = skills.find(s => s.id === skill)
  
  // Custom logic to handle targeted grammar subskills gracefully
  if (!currentSkill && skill?.startsWith('grammar_')) {
    const formattedName = skill.replace('grammar_', '').replace(/_/g, ' ')
    const capitalizedOptions = formattedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    
    currentSkill = { 
      id: skill, 
      label: capitalizedOptions + ' Grammar', 
      icon: <span className="text-xl">✍️</span>, 
      color: 'skill-grammar' 
    }
  }

  const currentQ = questions[currentIdx]
  const finished = currentIdx >= questions.length && questions.length > 0

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/practice" className="text-primary-300 hover:text-white text-xl p-1 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={`w-10 h-10 rounded-xl ${currentSkill?.color} flex items-center justify-center text-xl`}>
            {currentSkill?.icon}
          </div>
          <h1 className="text-2xl font-bold text-white">{currentSkill?.label} Practice</h1>
        </div>

        {/* Difficulty Selector */}
        {!finished && (
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {['A1', 'A2', 'B1', 'B2'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${difficulty === lvl ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-primary-400 hover:text-primary-200'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        )}

        {questions.length > 0 && !finished && (
          <span className="text-primary-300 font-medium">
            {currentIdx + 1} / {questions.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {questions.length > 0 && (
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${currentSkill?.color}`}
            style={{ width: `${((currentIdx + (result ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      )}

      {loading && <p className="text-center text-primary-300 py-12">Loading questions...</p>}

      {/* Question */}
      {!loading && currentQ && !finished && (
        <>
          <QuestionCard
            key={currentQ.id}
            question={currentQ}
            onAnswer={handleAnswer}
            showResult={result}
            questionIndex={currentIdx}
            isSubmitting={isSubmitting}
          />
          {currentQ.type === 'audio_response' && <AudioRecorder />}
          {result && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="btn-glow bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold text-lg inline-flex items-center gap-2"
              >
                {currentIdx + 1 < questions.length ? <>Next <ArrowRight className="w-5 h-5" /></> : 'See Results'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Results */}
      {finished && (
        <div className="glass-card p-8 text-center max-w-lg mx-auto">
          <div className="mb-6 flex justify-center text-yellow-400">
            {score.correct === score.total ? <Trophy className="w-20 h-20" /> : score.correct > score.total / 2 ? <ThumbsUp className="w-20 h-20" /> : <Zap className="w-20 h-20 text-orange-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Practice Complete!</h2>
          <p className="text-4xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
            {score.correct} / {score.total}
          </p>
          <p className="text-primary-300 mb-8 text-lg">
            {score.correct === score.total
              ? 'Perfect score! Excellent work!'
              : score.correct > score.total / 2
              ? 'Good job! Keep practising to improve.'
              : 'Keep going! Practice makes perfect.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { setCurrentIdx(0); setResult(null); setScore({ correct: 0, total: 0}); getQuestions(skill, difficulty, 5).then(setQuestions); }}
              className="btn-glow bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Practice Again
            </button>
            <Link
              to="/practice"
              className="btn-glow bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Skills
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
