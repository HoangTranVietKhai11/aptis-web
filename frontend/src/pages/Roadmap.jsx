import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Map, PenTool, BookOpen, Layers, Headset, Edit3, Mic, Check, Lock, ArrowRight, Target, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CertificateModal from '../components/CertificateModal'

const STAGE_COLORS = {
  'A1-A2': 'from-emerald-600 to-teal-600',
  'B1-B2': 'from-primary-600 to-accent-600',
}

const getSkillIcon = (skill) => {
  switch (skill) {
    case 'grammar': return <PenTool className="w-5 h-5" />
    case 'vocabulary': return <BookOpen className="w-5 h-5" />
    case 'reading': return <Layers className="w-5 h-5" />
    case 'listening': return <Headset className="w-5 h-5" />
    case 'writing': return <Edit3 className="w-5 h-5" />
    case 'speaking': return <Mic className="w-5 h-5" />
    default: return <BookOpen className="w-5 h-5" />
  }
}

export default function Roadmap() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeRoadmap, setActiveRoadmap] = useState('Aptis Tiên Phong [Chị Phương]')
  const [activeStage, setActiveStage] = useState('A1-A2')
  const [showCert, setShowCert] = useState(false)

  useEffect(() => {
    fetch('/api/roadmap')
      .then(r => r.json())
      .then(data => { 
        setSessions(data)
        const names = Array.from(new Set(data.map(s => s.roadmap_name || 'Standard Roadmap')))
        if (names.length > 0 && !names.includes(activeRoadmap)) {
          setActiveRoadmap(names.includes('Aptis Tiên Phong [Chị Phương]') ? 'Aptis Tiên Phong [Chị Phương]' : names[0])
        }
        setLoading(false) 
      })
      .catch(() => setLoading(false))
  }, [])

  // 1. Get unique roadmap names
  const roadmapNames = Array.from(new Set(sessions.map(s => s.roadmap_name || 'Standard Roadmap')))

  // 2. Filter sessions by active roadmap
  const roadmapSessions = sessions.filter(s => (s.roadmap_name || 'Standard Roadmap') === activeRoadmap)

  // 3. Group filtered sessions by stage
  const stageGroups = roadmapSessions.reduce((acc, s) => {
    if (!acc[s.stage]) acc[s.stage] = []
    acc[s.stage].push(s)
    return acc
  }, {})

  const stages = Object.keys(stageGroups).sort()
  
  // Ensure active stage is valid for the current roadmap
  useEffect(() => {
    if (stages.length > 0 && !stages.includes(activeStage)) {
      setActiveStage(stages[0])
    }
  }, [activeRoadmap, stages, activeStage])

  const currentSessions = stageGroups[activeStage] || []
  const isRoadmapComplete = roadmapSessions.length > 0 && roadmapSessions.every(s => s.completed)


  const stageProgress = (stage) => {
    const s = stageGroups[stage] || []
    const done = s.filter(x => x.completed).length
    return { done, total: s.length, pct: s.length ? Math.round((done / s.length) * 100) : 0 }
  }

  if (loading) return <div className="text-center py-20 text-primary-300">Loading roadmap...</div>

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Map className="w-8 h-8 text-emerald-500 dark:text-primary-400" />
            {activeRoadmap}
          </h1>
          <p className="text-slate-500 dark:text-primary-300 mt-1">Personalized strategy for your APTIS goal</p>
        </div>
        {/* Roadmap Selector & Cert Button */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {isRoadmapComplete && (
            <button 
              onClick={() => setShowCert(true)} 
              className="btn-glow bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 w-fit animate-pulse"
            >
              <Award className="w-5 h-5" />
              Nhận Chứng Chỉ
            </button>
          )}
          
          {roadmapNames.length > 1 && (
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <label className="text-xs font-semibold text-slate-500 dark:text-primary-400 uppercase tracking-wider text-right">Select Roadmap</label>
              <select 
                value={activeRoadmap}
                onChange={(e) => setActiveRoadmap(e.target.value)}
                className="bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-primary-500"
              >
                {roadmapNames.map(name => (
                  <option key={name} value={name} className="bg-white dark:bg-slate-900">{name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-3 flex-wrap">
        {stages.map(stage => {
          const prog = stageProgress(stage)
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeStage === stage
                  ? `bg-green-500 dark:bg-gradient-to-r dark:${STAGE_COLORS[stage] || 'from-primary-600 to-accent-600'} text-white shadow-lg`
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-primary-300 hover:bg-slate-200 dark:hover:bg-white/15'
              }`}
            >
              {stage} <span className="text-xs opacity-75 bg-black/10 dark:bg-black/20 px-2 py-0.5 rounded-md">{prog.done}/{prog.total}</span>
            </button>
          )
        })}
      </div>

      {/* Stage Progress Bar */}
      {(() => {
        const prog = stageProgress(activeStage)
        if (prog.total === 0) return null;
        return (
          <div className="glass-card p-4">
            <div className="flex justify-between text-sm text-slate-600 dark:text-primary-300 mb-2 font-medium">
              <span>{activeStage} Stage Progress</span>
              <span>{prog.done}/{prog.total} sessions completed ({prog.pct}%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-3">
              <div
                className={`bg-green-500 dark:bg-gradient-to-r dark:${STAGE_COLORS[activeStage] || 'from-primary-600 to-accent-600'} h-3 rounded-full transition-all`}
                style={{ width: `${prog.pct}%` }}
              />
            </div>
          </div>
        )
      })()}

      {/* Sessions Grid */}
      <motion.div layout className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {currentSessions.length > 0 ? (
            currentSessions.map((session, index) => {
              const isLocked = !session.unlocked && !session.completed
              const isDone = session.completed
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  key={session.id}
                  className={`glass-card p-5 transition-all ${
                  isDone ? 'border-success-400/30 bg-success-500/5' :
                  isLocked ? 'opacity-60 cursor-not-allowed' :
                  'hover:border-primary-400/40 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Session Number */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                    isDone ? 'bg-success-500/20 text-success-400' :
                    isLocked ? 'bg-white/5 text-primary-500' :
                    `bg-gradient-to-br ${STAGE_COLORS[activeStage] || 'from-primary-600 to-accent-600'} text-white`
                  }`}>
                    {isDone ? <Check className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : session.session_number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-emerald-500 dark:text-primary-400 bg-emerald-50 dark:bg-white/5 p-1.5 rounded-lg">
                        {getSkillIcon(session.skill)}
                      </span>
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">{session.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        activeStage === 'A1-A2' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                      }`}>
                        {activeStage}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-primary-300 text-sm mb-3 mt-2">{session.description}</p>
                    {session.objectives && (
                      <div className="flex items-start gap-1.5 text-emerald-600 dark:text-primary-400 text-xs bg-emerald-50 dark:bg-black/20 p-2 rounded-lg inline-block">
                        <Target className="w-3.5 h-3.5 inline-block -mt-0.5" /> <span className="font-medium italic">{session.objectives}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 self-center">
                    {isDone ? (
                      <span className="text-emerald-500 dark:text-success-400 font-semibold text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> Completed
                      </span>
                    ) : isLocked ? (
                      <span className="text-slate-400 dark:text-primary-500 text-sm flex items-center gap-1">
                        <Lock className="w-4 h-4" /> Locked
                      </span>
                    ) : (
                      <Link
                        to={`/roadmap/session/${session.id}`}
                        className={`bg-gradient-to-r ${STAGE_COLORS[activeStage] || 'from-primary-600 to-accent-600'} text-white px-5 py-2.5 rounded-lg font-semibold text-sm btn-glow flex items-center gap-2`}
                      >
                        Start <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-primary-400 bg-white/5 rounded-2xl border border-dashed border-white/10"
          >
            No sessions found for this stage in {activeRoadmap}.
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      <CertificateModal 
        isOpen={showCert} 
        onClose={() => setShowCert(false)} 
        roadmapName={activeRoadmap} 
      />
    </div>
  )
}
