import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import RoadmapSession from './pages/RoadmapSession'
import Practice from './pages/Practice'
import MockTest from './pages/MockTest'
import Vocabulary from './pages/Vocabulary'
import VocabGame from './pages/VocabGame'
import Flashcards from './pages/Flashcards'
import Progress from './pages/Progress'
import Leaderboard from './pages/Leaderboard'
import AdminPanel from './pages/AdminPanel'
import GrammarTenses from './pages/GrammarTenses'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <BrowserRouter>
        <div className="min-h-screen bg-slate-900/10">
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <main className="max-w-5xl mx-auto px-4 pb-8 pt-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/roadmap/session/:sessionId" element={<RoadmapSession />} />
              <Route path="/grammar" element={<GrammarTenses />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/practice/:skill" element={<Practice />} />
              <Route path="/mocktest" element={<MockTest />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/vocab-game" element={<VocabGame />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
