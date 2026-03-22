import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { createMockTest, getMockTest, submitMockAnswer, completeMockTest, getMockTests, importExamPDF, saveToNotebook } from '../services/api'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import { PenTool, Target, Layers, Headset, Edit3, Mic, Check, ArrowLeft, ArrowRight, Loader2, Rocket, Trophy, ThumbsUp, Zap, Clock, Upload, BookOpen, Bot, Lightbulb, FileText, Timer, ChevronLeft, ChevronRight, Square, Volume2, Sparkles } from 'lucide-react'
import QuestionCard from '../components/QuestionCard'

export default function MockTest() {
  const location = useLocation()
  const [view, setView] = useState('menu') // menu | confirm | test | results
  const [test, setTest] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState({})
  const [finalScore, setFinalScore] = useState(null)
  const [history, setHistory] = useState([])
  const [exporting, setExporting] = useState(false)
  const resultsRef = useRef(null)
  const [timer, setTimer] = useState(0)
  const [countdown, setCountdown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  useEffect(() => {
    getMockTests().then(setHistory).catch(() => {})
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    const testId = location.state?.loadTestId
    if (testId) {
      startTestById(testId)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  const startTestById = async (testId) => {
    setLoading(true)
    try {
      const full = await getMockTest(testId)
      setTest(full)
      setCurrentIdx(0)
      setAnswers({})
      setResults({})
      setFinalScore(null)
      setTimer(0)
      const durationSecs = (full.duration_minutes || 30) * 60
      setCountdown(durationSecs)
      setView('test')
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    } catch (err) {
      toast.error('Không thể tải đề thi: ' + err.message)
    }
    setLoading(false)
  }

  const handleTakeTestClick = (testNum, skill) => {
    setConfirming({ testNum, skill })
    setView('confirm')
  }

  const confirmStartTest = async () => {
    if (!confirming) return
    setLoading(true)
    try {
      const { testNum, skill } = confirming
      const created = await createMockTest({
        title: `Practice Test ${testNum} - ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
        skill: skill
      })
      const full = await getMockTest(created.id)
      setTest(full)
      setCurrentIdx(0)
      setAnswers({})
      setResults({})
      setFinalScore(null)
      setTimer(0)
      const durationSecs = (full.duration_minutes || 30) * 60
      setCountdown(durationSecs)
      setView('test')
      if (timerRef.current) clearInterval(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      countdownRef.current = setInterval(() => {
        setCountdown(c => (c <= 1 ? 0 : c - 1))
      }, 1000)
    } catch (err) {
      toast.error('Failed to create mock test')
    }
    setLoading(false)
  }

  const handleAnswer = async (mtqId, answer) => {
    setIsSubmitting(true)
    setAnswers(a => ({ ...a, [mtqId]: answer }))
    try {
      const res = await submitMockAnswer(test.id, mtqId, answer)
      setResults(r => ({ ...r, [mtqId]: res }))
      
      const q = test?.questions?.find(q => q.mtq_id === mtqId)
      if (q && !res.is_correct && q.skill.match(/grammar|vocabulary/i)) {
        await saveToNotebook({
          word: "Mistake: " + (q.question.length > 50 ? q.question.substring(0, 50) + "..." : q.question),
          definition: `Expected: ${res.correct_answer}. Explanation: ${res.explanation || 'Review this grammar/vocab point!'}`,
          example_sentence: q.question,
          notes: `Skill: ${q.skill}. Your wrong answer: ${answer}`,
          set_name: "Mistakes Bank ⚠️"
        }).then(() => toast.error('Saved to Mistakes Bank ⚠️')).catch(() => {})
      }
    } catch (err) {
      console.error('Submit error:', err)
      toast.error('Lỗi khi nộp bài. Chị vui lòng thử lại nhé!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const finishTest = async () => {
    clearInterval(timerRef.current)
    clearInterval(countdownRef.current)
    try {
      const res = await completeMockTest(test.id)
      setFinalScore(res)
      setView('results')
      getMockTests().then(setHistory).catch(() => {})
    } catch {
      setView('results')
    }
  }

  const formatTime = (s) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor((s % 3600) / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const formatCountdown = (s) => {
    if (s === null) return ''
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (countdown === 0 && view === 'test') {
      finishTest()
    }
  }, [countdown, view])

  const handleExportResults = async () => {
    if (!resultsRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(resultsRef.current, { backgroundColor: '#0f172a', scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width)
      pdf.save(`Aptis-Mock-Result-${test.id}.pdf`)
    } catch (err) {
      toast.error('Export failed')
    }
    setExporting(false)
  }

  const questions = test?.questions || []
  const currentQ = questions[currentIdx]

  if (view === 'menu') {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-red-500" /> Mock Exams
        </h1>
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 dark:text-primary-300">Select a practice module from the table below to begin simulating APTIS tests.</p>
          <div className="relative">
            <input 
              type="file" id="pdf-upload" className="hidden" accept="application/pdf"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setLoading(true);
                try {
                  const res = await importExamPDF(file);
                  toast.success(`Import thành công: ${res.title} (${res.question_count} câu hỏi)`);
                  getMockTests().then(setHistory);
                } catch (err) {
                  toast.error('Lỗi import: ' + err.message);
                }
                setLoading(false);
              }}
            />
            <label htmlFor="pdf-upload" className={`btn-glow bg-gradient-to-r from-accent-600 to-primary-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? 'Processing...' : 'Import Exam PDF'}
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto bg-[#f8f9fa] rounded-lg text-slate-800 shadow mt-6">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-4 text-left font-bold text-slate-700 uppercase tracking-widest text-sm bg-slate-50">MODULES</th>
                <th className="p-4 bg-slate-50 text-[#b4d465]">Grammar</th>
                <th className="p-4 bg-slate-50 text-[#3ab0b0]">Listening</th>
                <th className="p-4 bg-slate-50 text-[#2a5e3b]">Writing</th>
                <th className="p-4 bg-slate-50 text-[#c48c46]">Reading</th>
                <th className="p-4 bg-slate-50 text-[#a64d5c]">Speaking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[1, 2, 3, 4].map((testNum, idx) => (
                <tr key={testNum} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="p-5 text-left font-semibold text-slate-700">Practice test {testNum}</td>
                  {['grammar', 'listening', 'writing', 'reading', 'speaking'].map(s => (
                    <td key={s} className="p-5">
                      <button onClick={() => handleTakeTestClick(testNum, s)} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-1 px-4 rounded text-[10px] uppercase">Take Test</button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.filter(t => t.status === 'pending').length > 0 && (
          <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Aptis ESOL 2026 Full Mock Exams</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.filter(t => t.status === 'pending').map(t => (
                <div key={t.id} className="glass-card p-4 flex flex-col gap-3 border-slate-200 dark:border-accent-500/30 bg-white dark:bg-accent-500/5 hover:bg-slate-50 dark:hover:bg-accent-500/10 transition-colors">
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{t.title}</p>
                  <button onClick={() => { if(window.confirm('Bắt đầu bài thi Full Mock Test?')) startTestById(t.id) }} className="btn-glow bg-accent-600 hover:bg-accent-500 text-white w-full py-2 rounded-lg text-sm font-bold mt-auto">Start Exam</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.filter(t => t.status !== 'pending').length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 text-sm">Past Results</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.filter(t => t.status !== 'pending').map(t => (
                <div key={t.id} className="glass-card p-4 flex items-center justify-between hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-xs">{t.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-primary-300 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {new Date(t.completed_at || t.started_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-lg font-black ${t.score >= 70 ? 'text-emerald-500 dark:text-success-400' : 'text-slate-500 dark:text-primary-400'}`}>{t.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view === 'confirm' && confirming) {
    return (
      <div className="animate-fade-in space-y-6">
        <button onClick={() => setView('menu')} className="text-slate-500 dark:text-primary-300 hover:text-slate-800 dark:hover:text-white flex items-center gap-2 font-medium"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="glass-card p-8 text-center max-w-lg mx-auto border-t-4 border-t-emerald-500 dark:border-t-primary-500">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Start Mock Exam?</h2>
          <p className="text-slate-600 dark:text-primary-200 mb-8 text-lg">You are about to begin <strong>Practice Test {confirming.testNum}</strong> for the <strong className="capitalize text-emerald-600 dark:text-accent-300">{confirming.skill}</strong>.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setView('menu')} className="px-6 py-3 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 dark:bg-white/10 text-slate-700 dark:text-white transition-colors">Cancel</button>
            <button onClick={confirmStartTest} disabled={loading} className="cute-button-primary px-8 py-3 rounded-xl font-bold flex gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />} Start Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'results') {
    return (
      <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
        <div ref={resultsRef} className="glass-card p-8 text-center space-y-6 bg-white dark:bg-slate-800">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Exam Complete!</h2>
          <p className="text-5xl font-black text-emerald-500 dark:text-accent-400">{finalScore?.score || 0}%</p>
          <p className="text-slate-600 dark:text-primary-300">{finalScore?.correct} / {finalScore?.total} correct</p>
          <p className="text-slate-500 dark:text-primary-400 font-medium flex items-center justify-center gap-2"><Clock className="w-4 h-4" /> Time Taken: {formatTime(timer)}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setView('menu')} className="bg-slate-200 hover:bg-slate-300 dark:bg-white/10 text-slate-700 dark:text-white px-8 py-3 rounded-xl font-semibold transition-colors">Back to Menu</button>
            <button onClick={handleExportResults} disabled={exporting} className="btn-glow bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex gap-2">
              {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />} Download PDF
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between glass-card p-4 gap-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-emerald-500 dark:text-accent-400" />
          <span className="text-lg font-bold text-slate-800 dark:text-white">Mock Exam</span>
          <span className="text-sm bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-lg text-slate-600 dark:text-primary-300">{currentIdx + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl font-mono font-bold text-lg border flex items-center gap-2 ${countdown < 300 ? 'bg-red-50 dark:bg-red-500/20 border-red-500 text-red-500' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-primary-300'}`}>
            <Timer className="w-5 h-5" /> {formatCountdown(countdown)}
          </div>
          <button onClick={() => { if(window.confirm('Finish now?')) finishTest() }} className="bg-success-600 hover:bg-success-500 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> Finish
          </button>
        </div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2">
        <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${((currentIdx + (results[currentQ?.mtq_id] ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      {currentQ && (
        <QuestionCard
          key={currentQ.mtq_id}
          question={{...currentQ, skill: currentQ.skill.toLowerCase()}}
          questionIndex={currentIdx}
          onAnswer={(ans) => handleAnswer(currentQ.mtq_id, ans)}
          showResult={!!results[currentQ.mtq_id]}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
        <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="flex items-center gap-2 text-slate-500 dark:text-primary-300 hover:text-slate-800 dark:hover:text-white disabled:opacity-30"><ChevronLeft className="w-5 h-5" /> Previous</button>
        <button onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))} disabled={currentIdx === questions.length - 1 || (!results[currentQ?.mtq_id] && !results[currentQ?.mtq_id])} className="cute-button-primary px-8 py-2 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2">
          Next <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
