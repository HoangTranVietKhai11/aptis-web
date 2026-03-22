import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import { skills } from '../components/SkillCard'
import { getQuestions, submitAnswer, saveToNotebook, generateAiPractice } from '../services/api'
import { ArrowLeft, ArrowRight, Trophy, ThumbsUp, Zap, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Practice() {
  const { skill } = useParams()
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [result, setResult] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0, aiScore: 0 })
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState('B2') // Default to target B2

  useEffect(() => {
    if (skill) {
      setLoading(true)
      setCurrentIdx(0)
      setResult(null)
      setScore({ correct: 0, total: 0, aiScore: 0 })
      getQuestions(skill, difficulty, 10)
        .then(setQuestions)
        .catch(() => setQuestions([]))
        .finally(() => setLoading(false))
    }
  }, [skill, difficulty])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAnswer = async (answer) => {
    setIsSubmitting(true)
    const q = questions[currentIdx]
    try {
      const res = await submitAnswer(q.id, answer)
      setResult(res)
      setScore(s => ({
        correct: s.correct + (res.is_correct ? 1 : 0),
        total: s.total + 1,
        aiScore: (s.aiScore || 0) + (res.score || 0)
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

  const handleGenerateAi = async () => {
    setIsGenerating(true)
    try {
      const data = await generateAiPractice(skill, difficulty, 20)
      if (data?.questions?.length > 0) {
        setQuestions(data.questions)
        setCurrentIdx(0)
        setResult(null)
        setScore({ correct: 0, total: 0, aiScore: 0 })
      }
    } catch (err) {
      console.error('AI generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Skill selector
  if (!skill) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Choose a Skill</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(s => (
            <Link
              key={s.id}
              to={`/practice/${s.id}`}
              className="glass-card skill-card-mochi p-8 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className={`w-20 h-20 rounded-2xl ${s.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{s.label}</h3>
              <p className="text-slate-500 dark:text-primary-300">{s.desc}</p>
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
          <Link to="/practice" className="text-slate-400 dark:text-primary-300 hover:text-slate-800 dark:hover:text-white text-xl p-1 bg-slate-100 dark:bg-white/5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={`w-10 h-10 rounded-xl ${currentSkill?.color} flex items-center justify-center text-xl`}>
            {currentSkill?.icon}
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{currentSkill?.label} Practice</h1>
        </div>

        {/* Actions (Difficulty & AI) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!finished && (
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
              {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${difficulty === lvl ? 'cute-button-primary shadow-lg' : 'text-slate-500 hover:text-slate-800 dark:text-primary-400 dark:hover:text-primary-200'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
          
          {/* Global AI Generate Button */}
          {!finished && (
            <button
              onClick={handleGenerateAi}
              disabled={isGenerating}
              title="Nhờ AI soạn thêm 20 câu hỏi mới cho phần này"
              className={`px-3 py-1.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm ${
                isGenerating 
                  ? 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500 cursor-not-allowed border border-transparent' 
                  : 'cute-button-primary border border-primary-200 dark:border-primary-500/30'
              }`}
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-yellow-100 dark:text-yellow-400 fill-current" />}
              <span className="hidden sm:inline">{isGenerating ? 'Đang soạn...' : 'AI Sinh đề'}</span>
            </button>
          )}
        </div>

        {questions.length > 0 && !finished && (
          <span className="text-slate-500 dark:text-primary-300 font-medium">
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

      {/* Empty State / Not Found */}
      {!loading && questions.length === 0 && (
        <div className="glass-card p-12 text-center max-w-lg mx-auto mt-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Chưa có câu hỏi nào!</h2>
          <p className="text-slate-500 dark:text-primary-300 mb-8">
            Kho dữ liệu hiện tại đang trống đối với kỹ năng <strong>{currentSkill?.label || skill}</strong> ở trình độ <strong>{difficulty}</strong>.
          </p>
          <button
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="cute-button-primary px-8 py-3 rounded-2xl inline-flex items-center justify-center gap-2 text-lg font-bold disabled:opacity-60 w-full"
          >
            {isGenerating ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> AI đang soạn đề...</>
            ) : (
              <><Zap className="w-5 h-5" /> ✨ Nhờ AI soạn 20 câu mới</>
            )}
          </button>
        </div>
      )}

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

          {result && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="cute-button-primary px-8 py-3 rounded-2xl font-bold text-lg inline-flex items-center gap-2"
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
          <div className="mb-6 flex justify-center text-yellow-500 dark:text-yellow-400">
            {score.correct === score.total ? <Trophy className="w-20 h-20" /> : score.correct > score.total / 2 ? <ThumbsUp className="w-20 h-20" /> : <Zap className="w-20 h-20 text-orange-500 dark:text-orange-400" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Practice Complete!</h2>
          {['speaking', 'writing'].includes(skill) && score.total > 0 ? (
            <>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-green-400 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-4">
                Avg Score: {Math.round(score.aiScore / score.total)} / 50
              </p>
              <p className="text-slate-500 dark:text-primary-300 mb-8 text-lg font-bold">
                {Math.round(score.aiScore / score.total) >= 43 ? 'Band C (Excellent)' : 
                 Math.round(score.aiScore / score.total) >= 33 ? 'Band B2 (Very Good)' :
                 Math.round(score.aiScore / score.total) >= 23 ? 'Band B1 (Good)' :
                 Math.round(score.aiScore / score.total) >= 13 ? 'Band A2 (Basic)' : 'Band A1 (Beginner)'}
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-green-400 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent mb-4">
                {score.correct} / {score.total}
              </p>
              <p className="text-slate-500 dark:text-primary-300 mb-8 text-lg">
                {score.correct === score.total
                  ? 'Perfect score! Excellent work!'
                  : score.correct > score.total / 2
                  ? 'Good job! Keep practising to improve.'
                  : 'Keep going! Practice makes perfect.'}
              </p>
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="cute-button-primary px-8 py-3 rounded-2xl inline-flex items-center justify-center gap-2 w-full sm:w-auto text-lg font-bold disabled:opacity-60"
            >
              {isGenerating ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> AI đang soạn đề...</>
              ) : (
                <><Zap className="w-5 h-5" /> ✨ Sinh đề mới bằng AI (20 câu)</>
              )}
            </button>
            <button
              onClick={() => { setCurrentIdx(0); setResult(null); setScore({ correct: 0, total: 0, aiScore: 0 }); getQuestions(skill, difficulty, 10).then(setQuestions); }}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white px-8 py-3 rounded-2xl font-bold inline-flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
            >
              <RefreshCw className="w-5 h-5" /> Làm lại đề cũ
            </button>
            <Link
              to="/practice"
              className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-white px-8 py-3 rounded-2xl font-bold inline-flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Skills
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
