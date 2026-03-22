import { useState, useEffect, useRef } from 'react'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController } from 'chart.js'
import { getProgress, getProgressHistory, getRoadmap } from '../services/api'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import { Loader2, FileText, BarChart2, Map, PenTool, BookOpen, Headset, Edit3, Mic, TrendingUp, ArrowRight, Bot } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController)

const SKILL_COLORS = {
  grammar: '#818cf8',
  reading: '#4ade80',
  listening: '#fbbf24',
  writing: '#f0abfc',
  speaking: '#f87171',
}

export default function Progress() {
  const [progress, setProgress] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [tab, setTab] = useState('stats')
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef(null)
  const doughnutRef = useRef(null)
  const barRef = useRef(null)
  const doughnutChart = useRef(null)
  const barChart = useRef(null)

  const handleExport = async () => {
    if (!reportRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('Aptis-Progress-Report.pdf')
    } catch (err) {
      console.error('Export error:', err)
      toast.error('Failed to export PDF. Check console for details.')
    }
    setExporting(false)
  }

  useEffect(() => {
    getProgress().then(setProgress).catch(() => {})
    getRoadmap().then(setRoadmap).catch(() => {})
  }, [])

  useEffect(() => {
    if (!progress?.skills?.length) return

    // Doughnut chart
    if (doughnutRef.current) {
      if (doughnutChart.current) doughnutChart.current.destroy()
      doughnutChart.current = new Chart(doughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: progress.skills.map(s => s.skill.charAt(0).toUpperCase() + s.skill.slice(1)),
          datasets: [{
            data: progress.skills.map(s => s.total_questions),
            backgroundColor: progress.skills.map(s => SKILL_COLORS[s.skill] || '#818cf8'),
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#c7d2fe', padding: 16 } }
          }
        }
      })
    }

    // Bar chart
    if (barRef.current) {
      if (barChart.current) barChart.current.destroy()
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: progress.skills.map(s => s.skill.charAt(0).toUpperCase() + s.skill.slice(1)),
          datasets: [{
            label: 'Accuracy %',
            data: progress.skills.map(s => s.accuracy),
            backgroundColor: progress.skills.map(s => SKILL_COLORS[s.skill] || '#818cf8'),
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100, ticks: { color: '#a5b4fc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#a5b4fc' }, grid: { display: false } }
          },
          plugins: {
            legend: { display: false }
          }
        }
      })
    }

    return () => {
      if (doughnutChart.current) doughnutChart.current.destroy()
      if (barChart.current) barChart.current.destroy()
    }
  }, [progress])

  // Roadmap tab now redirects

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Progress</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="cute-button-primary px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
        >
          {exporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</> : <><FileText className="w-4 h-4" /> Export Report</>}
        </button>
      </div>

      <div ref={reportRef} className="space-y-6 p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-transparent">

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('stats')} className={`px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${tab === 'stats' ? 'bg-emerald-500 dark:bg-primary-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-primary-300 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
          <BarChart2 className="w-5 h-5" /> Statistics
        </button>
        <Link to="/roadmap" className="px-5 py-3 rounded-xl font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-primary-300 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center gap-2 transition-all hover:text-slate-800 dark:hover:text-white">
          <Map className="w-5 h-5" /> Roadmap <ArrowRight className="w-4 h-4 opacity-70" />
        </Link>
      </div>

      {tab === 'stats' && (
        <>
          {/* Radar Chart & AI Insights */}
          {progress?.skills?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Phân tích Năng lực Tổng quan</h3>
                <p className="text-sm text-slate-500 mb-2 text-center">Độ đồng đều giữa 5 kỹ năng chính</p>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={progress.skills.map(s => ({
                      subject: s.skill.charAt(0).toUpperCase() + s.skill.slice(1),
                      A: s.accuracy || 0,
                      fullMark: 100,
                    }))}>
                      <PolarGrid stroke="#94a3b8" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Accuracy"
                        dataKey="A"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="#34d399"
                        fillOpacity={0.6}
                      />
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Độ chính xác']}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-card p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Gợi ý lộ trình (AI Insights)</h3>
                </div>
                {(() => {
                  const sorted = [...progress.skills].sort((a, b) => a.accuracy - b.accuracy);
                  const weakest = sorted[0];
                  const strongest = sorted[sorted.length - 1];
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                        <span className="font-bold text-red-600 dark:text-red-400">⚠️ Kỹ năng yếu: {weakest?.skill} ({weakest?.accuracy || 0}%)</span>
                        <p className="text-sm mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                          Đây là kỹ năng bạn cần tập trung cải thiện nhất. Mở mục Practice và sử dụng tính năng "Sinh Đề AI" để luyện thật nhiều dạng bài này nhé!
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">🔥 Thế mạnh: {strongest?.skill} ({strongest?.accuracy || 0}%)</span>
                        <p className="text-sm mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                          Phong độ của bạn ở phần này rất xuất sắc! Hãy tự tin giữ vững phong độ khi thi thật.
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Overall Stats */}
          {progress?.overall && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="glass-card p-5 text-center">
                <p className="text-3xl font-bold text-emerald-500 dark:text-primary-400">{progress.overall.total_questions || 0}</p>
                <p className="text-sm text-slate-500 dark:text-primary-300 mt-1">Total Questions</p>
              </div>
              <div className="glass-card p-5 text-center">
                <p className="text-3xl font-bold text-emerald-500 dark:text-success-400">{progress.overall.correct_answers || 0}</p>
                <p className="text-sm text-slate-500 dark:text-primary-300 mt-1">Correct</p>
              </div>
              <div className="glass-card p-5 text-center col-span-2 sm:col-span-1">
                <p className="text-3xl font-bold text-emerald-500 dark:text-accent-400">{progress.overall.accuracy || 0}%</p>
                <p className="text-sm text-slate-500 dark:text-primary-300 mt-1">Accuracy</p>
              </div>
            </div>
          )}
          {/* Error Heatmap */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Skill Weakness Heatmap</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <div className="text-xs font-bold text-emerald-600 dark:text-primary-400 uppercase tracking-tighter">Skill / Part</div>
                  {[1, 2, 3, 4, 5].map(p => (
                    <div key={p} className="text-center text-xs font-bold text-emerald-600 dark:text-primary-400 uppercase">Part {p}</div>
                  ))}
                </div>
                {['grammar', 'reading', 'listening', 'writing', 'speaking'].map(skill => (
                  <div key={skill} className="grid grid-cols-6 gap-2 mb-2 items-center">
                    <div className="text-sm font-medium text-slate-800 dark:text-white capitalize">{skill}</div>
                    {[1, 2, 3, 4, 5].map(part => {
                      const skillData = progress?.skills?.find(s => s.skill === skill);
                      const count = skillData?.total_questions || 0;
                      const acc = skillData?.accuracy || 100;
                      const intensity = count > 0 ? (100 - acc) / 100 : 0;
                      return (
                        <div 
                          key={part}
                          className="h-12 rounded-lg transition-all border border-white/5 flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: intensity > 0.7 ? `rgba(239, 68, 68, ${intensity})` : 
                                             intensity > 0.4 ? `rgba(245, 158, 11, ${intensity})` :
                                             intensity > 0 ? `rgba(34, 197, 94, ${intensity})` : 'rgba(255,255,255,0.03)'
                          }}
                          title={`${skill} part ${part}: ${Math.round(acc)}% accuracy`}
                        >
                          {intensity > 0 ? `${Math.round(acc)}%` : '-'}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs text-primary-400 italic">
              * Intensity shows where you need more practice (Red = Weak, Green = Strong).
            </p>
          </div>

          {/* Skill breakdown */}
          {progress?.skills?.length > 0 && (
            <div className="grid gap-3">
              {progress.skills.map(s => (
                <div key={s.skill} className="glass-card p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className={`w-12 h-12 rounded-xl skill-${s.skill} flex items-center justify-center text-white`}>
                    {s.skill === 'grammar' ? <PenTool className="w-6 h-6" /> : s.skill === 'reading' ? <BookOpen className="w-6 h-6" /> : s.skill === 'listening' ? <Headset className="w-6 h-6" /> : s.skill === 'writing' ? <Edit3 className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-800 dark:text-white capitalize">{s.skill}</span>
                      <span className="text-slate-500 dark:text-primary-300 text-sm">{s.correct_answers}/{s.total_questions} correct</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
                      <div className={`h-2 rounded-full skill-${s.skill}`} style={{ width: `${s.accuracy}%` }} />
                    </div>
                  </div>
                  <span className="text-xl font-bold text-slate-800 dark:text-white">{s.accuracy}%</span>
                </div>
              ))}
            </div>
          )}

          {(!progress?.skills || progress.skills.length === 0) && (
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center">
              <TrendingUp className="w-16 h-16 text-emerald-500/50 dark:text-primary-500/50 mb-4" />
              <p className="text-slate-600 dark:text-primary-300 text-lg">No progress data yet. Start practising to see your stats!</p>
            </div>
          )}
        </>
      )}

      {tab === 'roadmap' && (
        <div className="glass-card p-8 text-center flex flex-col items-center justify-center">
          <Map className="w-16 h-16 text-emerald-500/50 dark:text-primary-500/50 mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Go to your Roadmap</h2>
          <p className="text-slate-600 dark:text-primary-300 mb-8 max-w-md mx-auto text-lg">Your full A1-A2 → B1-B2 learning path with session unlocking is on the dedicated Roadmap page.</p>
          <Link to="/roadmap" className="cute-button-primary px-8 py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
            Open Roadmap <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
      </div>
    </div>
  )
}
