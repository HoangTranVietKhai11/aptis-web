import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Download } from 'lucide-react'
import Confetti from 'react-confetti'

export default function CertificateModal({ isOpen, onClose, roadmapName }) {
  const [userName, setUserName] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const certificateRef = useRef(null)

  if (!isOpen) return null

  const handlePrint = () => {
    window.print() // Print view triggered
  }

  // Current Date formatting
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:bg-white print:p-0">
        <div className="print:hidden"><Confetti recycle={false} numberOfPieces={500} /></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border-2 border-accent-500/50 rounded-2xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white"
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-primary-300 hover:text-white z-10 bg-black/20 p-2 rounded-full print:hidden">
            <X className="w-6 h-6" />
          </button>

          {!isGenerated ? (
            <div className="p-10 text-center space-y-6 print:hidden">
              <Award className="w-24 h-24 text-accent-500 mx-auto" />
              <h2 className="text-3xl font-extrabold text-white">Congratulations!</h2>
              <p className="text-xl text-primary-200">You have successfully completed</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                {roadmapName}
              </p>
              
              <div className="max-w-md mx-auto mt-8 p-6 glass-card text-left space-y-4">
                <label className="block text-primary-300 text-sm font-bold">Enter your full name for the certificate:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Nguyen Van A"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                />
                <button 
                  disabled={!userName.trim()}
                  onClick={() => setIsGenerated(true)}
                  className="w-full btn-glow bg-gradient-to-r from-accent-600 to-pink-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  <Award className="w-5 h-5" /> Generate My Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center print:p-0">
              {/* Printable Certificate Area */}
              <div 
                ref={certificateRef}
                className="w-full aspect-[1.414/1] bg-white text-slate-900 p-8 sm:p-12 relative flex flex-col justify-center items-center text-center border-[12px] sm:border-[16px] border-slate-900 print:h-screen print:w-screen print:border-[16px] print:border-slate-800"
                style={{ 
                  backgroundImage: `radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)`,
                  fontFamily: 'serif'
                }}
              >
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-l-4 border-accent-600"></div>
                <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-r-4 border-accent-600"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-16 sm:h-16 border-b-4 border-l-4 border-accent-600"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 sm:w-16 sm:h-16 border-b-4 border-r-4 border-accent-600"></div>
                
                <Award className="w-16 h-16 sm:w-20 sm:h-20 text-accent-600 mb-4 sm:mb-6 opacity-80" />
                
                <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificate of Completion
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-500 italic mb-6 sm:mb-8 mt-2 sm:mt-4">
                  This is to proudly certify that
                </p>
                
                <h2 className="text-4xl sm:text-6xl font-black text-accent-700 mb-6 sm:mb-8 border-b-2 border-accent-200 pb-2 inline-block px-8 sm:px-12" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>
                  {userName}
                </h2>
                
                <p className="text-lg sm:text-xl text-slate-500 italic mb-3 sm:mb-4">
                  has successfully completed the comprehensive training roadmap
                </p>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8 sm:mb-12 px-4">
                  {roadmapName}
                </h3>
                
                <div className="flex justify-between w-full max-w-2xl mt-auto px-4 sm:px-12">
                  <div className="text-center">
                    <div className="border-b-2 border-slate-400 w-32 sm:w-48 mb-2 pb-2 text-base sm:text-lg font-bold text-slate-700">{today}</div>
                    <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 font-bold">Date</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-slate-400 w-32 sm:w-48 mb-2 pb-2 flex justify-center">
                       {/* Mock Signature */}
                       <span className="font-bold text-xl sm:text-2xl text-slate-800" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>Aptis Master</span>
                    </div>
                    <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 font-bold">Lead Instructor</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8 print:hidden w-full max-w-2xl px-4 sm:px-12">
                  <button onClick={() => setIsGenerated(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all">
                    Edit Name
                  </button>
                  <button onClick={handlePrint} className="flex-1 btn-glow bg-primary-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> Save as PDF
                  </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
