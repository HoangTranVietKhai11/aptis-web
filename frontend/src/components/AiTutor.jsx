import { useState, useRef } from 'react'
import { Smile } from 'lucide-react'

export default function AiTutor({ question, currentAnswer, correctAnswer }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const endRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: question?.id,
          question_text: question?.question,
          user_message: userMsg,
          user_answer: currentAnswer,
          correct_answer: correctAnswer,
        })
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'ai', text: data.response || 'Sorry, I could not process that.' }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'AI Tutor is temporarily unavailable.' }])
    }
    setLoading(false)
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-emerald-600 dark:text-accent-400 hover:text-emerald-500 dark:hover:text-accent-300 text-sm font-semibold transition-colors"
      >
        <Smile className="w-5 h-5" />
        {open ? 'Hide AI Tutor' : 'Ask AI Tutor for help'}
      </button>

      {open && (
        <div className="mt-3 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-accent-400/20 rounded-xl overflow-hidden">
          {/* Chat History */}
          <div className="p-4 max-h-64 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <p className="text-slate-500 dark:text-primary-400 text-sm italic text-center">
                Ask anything — why this answer is correct, how to improve, grammar tips...
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && <Smile className="w-5 h-5 flex-shrink-0 text-emerald-500 dark:text-accent-400 mt-1" />}
                <div className={`max-w-[85%] px-4 py-2 rounded-xl text-sm ${
                  m.role === 'user'
                    ? 'bg-emerald-500 dark:bg-primary-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-white/10 text-slate-800 dark:text-primary-100 rounded-bl-none shadow-sm dark:shadow-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start items-center">
                <Smile className="w-5 h-5 flex-shrink-0 text-emerald-500 dark:text-accent-400" />
                <div className="bg-white dark:bg-white/10 px-4 py-2 rounded-xl text-slate-500 dark:text-primary-300 text-sm animate-pulse shadow-sm dark:shadow-none">Thinking...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="flex border-t border-slate-200 dark:border-white/10">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about this question..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-primary-500 outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 text-emerald-600 dark:text-accent-400 hover:text-emerald-500 dark:hover:text-accent-300 disabled:opacity-40 font-bold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
