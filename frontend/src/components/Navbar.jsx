import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Disclosure, Transition } from '@headlessui/react'
import { Home, Map as MapIcon, PenTool, Target, BookOpen, Layers, BarChart, Shield, Sun, Moon, Flame, Star, Menu, X, Headphones } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/roadmap', label: 'Roadmap', icon: MapIcon },
  { to: '/practice', label: 'Practice', icon: PenTool },
  { to: '/mocktest', label: 'Mock Exam', icon: Target },
  { to: '/listening', label: 'Listening', icon: Headphones },
  { to: '/vocabulary', label: 'Vocab', icon: BookOpen },
  { to: '/flashcards', label: 'Cards', icon: Layers },
  { to: '/progress', label: 'Progress', icon: BarChart },
]

export default function Navbar({ toggleTheme, theme }) {
  const { pathname } = useLocation()
  const { user, isLoggedIn } = useAuth()

  return (
    <Disclosure as="nav" className="glass-card sticky top-0 z-50 mx-2 mt-2 mb-4 rounded-xl">
      {({ open }) => (
        <>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-4 shrink-0">
              <Link to="/" className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-green-400 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent flex items-center gap-2">
                <Target className="w-6 h-6 text-emerald-500 dark:text-primary-400" />
                APTIS
              </Link>
              
              {isLoggedIn && (
                <div className="hidden md:flex items-center gap-3">
                  <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2" title="Daily Streak">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-bold text-orange-400">{user.streak_count || 0}</span>
                  </div>
                  <div className="bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2" title="XP Points">
                    <Star className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-bold text-primary-400">{user.xp || 0} XP</span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:flex gap-1 items-center justify-end flex-wrap">
              {links.map(l => {
                const Icon = l.icon
                const isActive = pathname === l.to || (l.to !== '/' && pathname.startsWith(l.to))
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-emerald-500 dark:bg-primary-500 text-white shadow-lg shadow-emerald-500/30 dark:shadow-primary-500/30'
                        : 'text-slate-600 dark:text-primary-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {l.label}
                  </Link>
                )
              })}

              {/* Admin link */}
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ml-2 ${
                  pathname === '/admin'
                    ? 'bg-emerald-600/10 dark:bg-accent-600/40 text-emerald-600 dark:text-white'
                    : 'text-emerald-600 dark:text-accent-400 hover:bg-emerald-50 dark:hover:bg-accent-500/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-primary-300 hover:text-white"
                title="Toggle Light/Dark Mode"
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-primary-300 hover:text-white"
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Disclosure.Button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-primary-300 hover:text-white">
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Disclosure.Button>
            </div>
          </div>

          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="lg:hidden px-4 pb-4 space-y-2">
              {links.map(l => {
                const Icon = l.icon
                const isActive = pathname === l.to || (l.to !== '/' && pathname.startsWith(l.to))
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-emerald-500 dark:bg-primary-500 text-white'
                        : 'text-slate-600 dark:text-primary-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {l.label}
                  </Link>
                )
              })}
              <Link
                to="/admin"
                className={`px-4 py-3 rounded-xl text-base font-bold transition-all flex items-center gap-3 mt-4 ${
                  pathname === '/admin'
                    ? 'bg-emerald-100 dark:bg-accent-600 text-emerald-700 dark:text-white'
                    : 'text-emerald-600 dark:text-accent-400 hover:bg-emerald-50 dark:hover:bg-accent-500/10'
                }`}
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </Link>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
