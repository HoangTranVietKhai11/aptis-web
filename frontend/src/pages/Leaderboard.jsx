import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, ArrowLeft, Star, Medal, Crown, Flame, Target } from 'lucide-react'
import { getLeaderboard } from '../services/api'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then(setLeaders)
      .finally(() => setLoading(false))
  }, [])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400" />
      case 2: return <Medal className="w-8 h-8 text-slate-300 fill-slate-300" />
      case 3: return <Medal className="w-8 h-8 text-amber-600 fill-amber-600" />
      default: return <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-primary-300">{rank}</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-300 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
          <h1 className="text-3xl font-black text-white">Global Leaderboard</h1>
        </div>
      </div>

      {/* Podium (Top 3) */}
      {!loading && leaders.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-12">
          {/* 2nd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col items-center text-center order-2 md:order-1 border-slate-300/20"
          >
            <div className="mb-4 relative">
              {getRankIcon(2)}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-300 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-[#0f172a]">2</div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{leaders[1].name}</h3>
            <p className="text-primary-400 text-xs uppercase tracking-widest font-bold mb-3">{leaders[1].level}</p>
            <div className="px-4 py-1.5 bg-white/5 rounded-full text-accent-400 font-black text-sm">{leaders[1].xp} XP</div>
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col items-center text-center order-1 md:order-2 border-yellow-400/40 bg-yellow-400/5 ring-4 ring-yellow-400/10 scale-110 relative z-10"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
               <Crown className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </div>
            <div className="mb-4 pt-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-black text-gray-900">{leaders[0].name[0]}</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-white mb-1">{leaders[0].name}</h3>
            <p className="text-yellow-400 text-sm uppercase tracking-widest font-black mb-4">{leaders[0].level}</p>
            <div className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-full font-black text-lg shadow-lg shadow-yellow-400/20">{leaders[0].xp} XP</div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex flex-col items-center text-center order-3 border-amber-600/20"
          >
            <div className="mb-4 relative">
              {getRankIcon(3)}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-600 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-[#0f172a]">3</div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{leaders[2].name}</h3>
            <p className="text-primary-400 text-xs uppercase tracking-widest font-bold mb-3">{leaders[2].level}</p>
            <div className="px-4 py-1.5 bg-white/5 rounded-full text-accent-400 font-black text-sm">{leaders[2].xp} XP</div>
          </motion.div>
        </div>
      )}

      {/* Full List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-400" />
            Top 10 Performers
          </h2>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-12 text-center text-primary-400 font-bold animate-pulse">Loading rankings...</div>
          ) : (
            leaders.map((u, i) => (
              <div key={u.id} className={`p-5 flex items-center justify-between transition-colors hover:bg-white/5 ${i < 3 ? 'bg-primary-500/5' : ''}`}>
                <div className="flex items-center gap-5">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(i + 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{u.name}</h4>
                    <p className="text-[10px] uppercase font-bold text-primary-400 tracking-tighter">{u.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-accent-400">{u.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-primary-500 font-bold uppercase">Points</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 text-center glass-card border-dashed border-primary-500/20">
        <p className="text-primary-300 text-sm">
          Earn XP by completing <span className="text-white font-bold">Mock Exams (+100)</span>, 
          <span className="text-white font-bold"> Roadmap Sessions (+50)</span>, and 
          <span className="text-white font-bold"> Practice Questions (+10)</span>.
        </p>
      </div>
    </div>
  )
}
