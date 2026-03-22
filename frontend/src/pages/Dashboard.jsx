import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SkillCard, { skills } from '../components/SkillCard'
import { getProgress, getRoadmap, getUserStats } from '../services/api'
import { Map as MapIcon, ChevronRight, Target, Flame, BarChart2, BookOpen, Layers, Trophy, Star } from 'lucide-react'

export default function Dashboard() {
  const [progress, setProgress] = useState(null)
  const [roadmapData, setRoadmapData] = useState([])
  const [userStats, setUserStats] = useState({ xp: 0, level: 'Novice', streak: 0 })

  useEffect(() => {
    getProgress().then(setProgress).catch(() => {})
    getRoadmap().then(setRoadmapData).catch(() => {})
    getUserStats().then(setUserStats).catch(() => {})
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="text-center py-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary-300 dark:via-accent-400 dark:to-primary-300 mb-3">
          APTIS B2 Preparation
        </h1>
        <p className="text-slate-600 dark:text-primary-300 text-lg">Your personal English exam study platform</p>
      </div>

      {/* Roadmap CTA */}
      <Link to="/roadmap" className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-primary-400/40 transition-all gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-emerald-500 dark:text-accent-400" />
            My Learning Roadmap
          </h2>
          <p className="text-slate-600 dark:text-primary-300 text-sm">Follow your A1 → A2 → B1 → B2 path — British Council aligned</p>
          {roadmapData.length > 0 && (() => {
            const done = roadmapData.filter(s => s.completed).length
            const total = roadmapData.length
            const pct = Math.round((done / total) * 100)
            return (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-primary-400 mb-2 font-medium">
                  <span>{done}/{total} sessions completed</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-primary-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })()}
        </div>
        <div className="flex justify-start sm:justify-end cursor-pointer">
          <ChevronRight className="w-10 h-10 text-slate-400 dark:text-white dark:opacity-60 group-hover:dark:opacity-100 group-hover:text-emerald-500 transition-all" />
        </div>
      </Link>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* XP & Level Card */}
        <div className="glass-card p-6 flex items-center justify-between group hover:border-primary-400/40 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-20 h-20 text-accent-400 rotate-12" />
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400/20 to-accent-600/20 border border-primary-500/20 flex items-center justify-center shadow-inner">
              <Star className="w-8 h-8 text-accent-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-primary-300 uppercase tracking-widest">Current Rank</h3>
              <p className="text-slate-800 dark:text-white font-black text-3xl mb-1">{userStats.level}</p>
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 bg-emerald-100 text-emerald-600 dark:bg-accent-500/20 rounded dark:text-accent-400 text-xs font-bold">{userStats.xp} XP Earned</div>
              </div>
            </div>
          </div>
          <Link to="/leaderboard" className="btn-glow bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-white/10 relative z-10">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Rankings
          </Link>
        </div>
        
        {/* Streak Card */}
        <div className="glass-card p-6 flex items-center justify-between group hover:border-orange-500/30 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-20 h-20 text-orange-500 -rotate-12" />
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-500/20 flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-500 flex-shrink-0" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-500/70 dark:text-orange-300/70 uppercase tracking-widest">Study Streak</h3>
              <p className="text-orange-500 dark:text-orange-400 font-black text-4xl leading-tight">{userStats.streak} <span className="text-lg font-bold">Days</span></p>
              <p className="text-xs text-orange-400/80 dark:text-orange-200/50 font-medium">Keep it up to level up!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {progress?.overall && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center flex flex-col items-center justify-center group hover:bg-white/5 transition-all">
            <p className="text-4xl font-black text-primary-400 mb-2">{progress.overall.total_questions || 0}</p>
            <p className="text-sm text-primary-300 font-medium">Questions Done</p>
          </div>
          <div className="glass-card p-5 text-center flex flex-col items-center justify-center group hover:bg-white/5 transition-all">
            <p className="text-4xl font-black text-emerald-400 mb-2">{progress.overall.accuracy || 0}%</p>
            <p className="text-sm text-primary-300 font-medium">Accuracy</p>
          </div>
          <div className="glass-card p-5 text-center col-span-2 sm:col-span-1 flex flex-col items-center justify-center group hover:bg-white/5 transition-all">
            <p className="text-4xl font-black text-accent-400 mb-2">{roadmapData.filter(s => s.completed).length}/{roadmapData.length}</p>
            <p className="text-sm text-primary-300 font-medium">Sessions Done</p>
          </div>
        </div>
      )}

      {/* Skills Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-500 dark:text-primary-400" />
          Practice Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map(s => (
            <SkillCard key={s.id} skill={s.id} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/mocktest"
          className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:border-red-500/40 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Mock Exam</h3>
          <p className="text-sm text-slate-500 dark:text-primary-300">Full test simulation</p>
        </Link>
        <Link
          to="/vocabulary"
          className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer hover:border-blue-500/40 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Vocabulary</h3>
          <p className="text-sm text-slate-500 dark:text-primary-300">Library & Notebook</p>
        </Link>
        <Link
          to="/flashcards"
          className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer border-emerald-200 dark:border-accent-500/30 bg-emerald-50 dark:bg-accent-600/5 hover:bg-emerald-100 dark:hover:bg-accent-600/10 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-200 dark:bg-accent-500/20 text-emerald-600 dark:text-accent-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Flashcards</h3>
          <p className="text-sm text-emerald-600 dark:text-accent-400 font-medium">SRS Review Ready</p>
        </Link>
      </div>

    </div>
  )
}
