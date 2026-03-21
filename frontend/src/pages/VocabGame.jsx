import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, RefreshCw, Trophy, ArrowLeft, Gamepad2, Shuffle, Grid, Type, BrainCircuit, Activity, Timer } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Confetti from 'react-confetti'

const API = '/api'

async function apiFetch(path) {
  try {
    const res = await fetch(API + path)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Reusable countdown hook: calls onExpire when time runs out
function useCountdown(timeLimit, onExpire) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const expiredRef = useRef(false)

  useEffect(() => {
    setTimeLeft(timeLimit)
    expiredRef.current = false
  }, [timeLimit])

  useEffect(() => {
    if (!timeLimit) return // 0 = no limit
    if (timeLeft <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true
        onExpire()
      }
      return
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, timeLimit])

  return timeLeft
}

// Visual timer bar
function TimerBar({ timeLeft, timeLimit }) {
  if (!timeLimit) return null
  const pct = (timeLeft / timeLimit) * 100
  const isUrgent = timeLeft <= 10
  return (
    <div className="flex items-center gap-3">
      <Timer className={`w-5 h-5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-primary-400'}`} />
      <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${
            isUrgent ? 'bg-red-500' : pct > 60 ? 'bg-success-500' : 'bg-warn-400'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono font-bold text-lg w-10 text-right ${isUrgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
        {timeLeft}s
      </span>
    </div>
  )
}

// -------------------------------------------------------------
// GAME 1: WORD MATCH
// -------------------------------------------------------------
function WordMatch({ words, onBack, wordCount = 5, timeLimit = 0 }) {
  const [playingWords, setPlayingWords] = useState([])
  const [playingDefs, setPlayingDefs] = useState([])
  const [selectedWord, setSelectedWord] = useState(null)
  const [selectedDef, setSelectedDef] = useState(null)
  const [matchedIds, setMatchedIds] = useState([])
  const [wrongMatch, setWrongMatch] = useState(false)
  const [score, setScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  useEffect(() => { startNewGame() }, [])

  const startNewGame = () => {
    const chosen = shuffle([...words]).slice(0, wordCount)
    const wordsCol = chosen.map(w => ({ id: w.id, text: w.word }))
    const defsCol = chosen.map(w => ({ id: w.id, text: w.definition || w.example_sentence }))
    setPlayingWords(shuffle(wordsCol))
    setPlayingDefs(shuffle(defsCol))
    setMatchedIds([])
    setSelectedWord(null)
    setSelectedDef(null)
    setGameWon(false)
    setTimeUp(false)
  }

  const timeLeft = useCountdown(timeUp || gameWon ? 0 : timeLimit, () => setTimeUp(true))

  useEffect(() => {
    if (selectedWord && selectedDef) {
      if (selectedWord === selectedDef) {
        setMatchedIds(prev => [...prev, selectedWord])
        setSelectedWord(null)
        setSelectedDef(null)
        setScore(s => s + 10)
        if (matchedIds.length + 1 === playingWords.length) setTimeout(() => setGameWon(true), 500)
      } else {
        setWrongMatch(true)
        setScore(s => Math.max(0, s - 2))
        setTimeout(() => {
          setWrongMatch(false)
          setSelectedWord(null)
          setSelectedDef(null)
        }, 600)
      }
    }
  }, [selectedWord, selectedDef])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4">
        <button onClick={onBack} className="text-primary-300 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Shuffle className="w-5 h-5 text-accent-400" /> Word Match</h2>
        <div className="flex items-center gap-4">
          <span className="text-success-400 font-bold flex items-center gap-1"><Trophy className="w-4 h-4" /> {score}</span>
          <button onClick={startNewGame} className="text-primary-300 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>
      {timeLimit > 0 && <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />}
      <div className="glass-card p-6 min-h-[400px] flex flex-col justify-center">
        {(timeUp && !gameWon) ? (
          <div className="text-center space-y-4">
            <Timer className="w-20 h-20 text-red-400 mx-auto" />
            <h2 className="text-3xl font-bold text-red-400">Time's Up!</h2>
            <p className="text-xl text-primary-300">Score: <span className="text-white font-bold">{score}</span></p>
            <button onClick={startNewGame} className="btn-glow bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4">Try Again</button>
          </div>
        ) : gameWon ? (
          <div className="text-center space-y-4">
            <Check className="w-20 h-20 text-success-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Perfect Match!</h2>
            <button onClick={startNewGame} className="btn-glow bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4">Play Again</button>
            <Confetti recycle={false} numberOfPieces={300} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {playingWords.map(w => !matchedIds.includes(w.id) && (
                <motion.button key={`w_${w.id}`} layout onClick={() => setSelectedWord(w.id)}
                  animate={{ x: selectedWord === w.id && wrongMatch ? [-5,5,-5,5,0] : 0 }}
                  className={`w-full p-4 rounded-xl font-bold border-2 ${selectedWord === w.id ? 'bg-primary-500 text-white border-primary-400' : 'bg-white/5 text-primary-100 border-white/10'}`}>
                  {w.text}
                </motion.button>
              ))}
            </div>
            <div className="space-y-3">
              {playingDefs.map(d => !matchedIds.includes(d.id) && (
                <motion.button key={`d_${d.id}`} layout onClick={() => setSelectedDef(d.id)}
                  animate={{ x: selectedDef === d.id && wrongMatch ? [-5,5,-5,5,0] : 0 }}
                  className={`w-full p-4 rounded-xl text-sm border-2 ${selectedDef === d.id ? 'bg-accent-600 text-white border-accent-400' : 'bg-white/5 text-primary-200 border-white/10'}`}>
                  {d.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// GAME 2: WORD SCRAMBLE
// -------------------------------------------------------------
function WordScramble({ words, onBack, wordCount = 5 }) {
  const [pool, setPool] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [currentWord, setCurrentWord] = useState(null)
  const [scrambled, setScrambled] = useState([])
  const [userGuess, setUserGuess] = useState([])
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => { startNewGame() }, [])

  const startNewGame = () => {
    const chosen = shuffle([...words]).slice(0, wordCount)
    setPool(chosen)
    setCurrentIdx(0)
    setScore(0)
    setWon(false)
    setupWord(chosen[0])
  }

  const setupWord = (w) => {
    setCurrentWord(w)
    const letters = w.word.split('').map((char, i) => ({ id: i, char }))
    setScrambled(shuffle([...letters]))
    setUserGuess([])
  }

  const pickLetter = (ltr) => {
    setScrambled(s => s.filter(x => x.id !== ltr.id))
    setUserGuess(g => [...g, ltr])
  }

  const returnLetter = (ltr) => {
    setUserGuess(g => g.filter(x => x.id !== ltr.id))
    setScrambled(s => [...s, ltr])
  }

  useEffect(() => {
    if (currentWord && userGuess.length === currentWord.word.length) {
      const spelled = userGuess.map(x => x.char).join('')
      if (spelled.toLowerCase() === currentWord.word.toLowerCase()) {
        setScore(s => s + 20)
        setTimeout(() => {
          if (currentIdx + 1 < pool.length) {
            setCurrentIdx(i => i + 1)
            setupWord(pool[currentIdx + 1])
          } else {
            setWon(true)
          }
        }, 800)
      } else {
        setShake(true)
        setScore(s => Math.max(0, s - 5))
        setTimeout(() => {
          setShake(false)
          setScrambled(s => [...s, ...userGuess].sort((a,b)=>Math.random()-0.5))
          setUserGuess([])
        }, 600)
      }
    }
  }, [userGuess])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4">
        <button onClick={onBack} className="text-primary-300 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Type className="w-5 h-5 text-accent-400" /> Word Scramble</h2>
        <div className="flex items-center gap-4">
          <span className="text-success-400 font-bold flex items-center gap-1"><Trophy className="w-4 h-4" /> {score}</span>
          <button onClick={startNewGame} className="text-primary-300 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="glass-card p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
        {won ? (
           <div className="space-y-4">
             <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
             <h2 className="text-3xl font-bold text-white">Scramble Master!</h2>
             <button onClick={startNewGame} className="btn-glow bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4">Play Again</button>
             <Confetti recycle={false} numberOfPieces={300} />
           </div>
        ) : currentWord && (
          <div className="max-w-xl w-full space-y-12">
            <div>
              <span className="text-primary-400 font-bold text-sm uppercase tracking-widest">{currentIdx + 1} / 5</span>
              <p className="text-lg text-white mt-2 font-medium bg-black/20 p-4 rounded-xl">"{currentWord.definition || currentWord.example_sentence}"</p>
            </div>
            
            <motion.div animate={{ x: shake ? [-10,10,-10,10,0] : 0 }} className="flex flex-wrap justify-center gap-2 min-h-[60px] p-4 bg-white/5 rounded-2xl border border-dashed border-white/20">
              <AnimatePresence>
                {userGuess.map(ltr => (
                  <motion.button layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={`g_${ltr.id}`} onClick={() => returnLetter(ltr)}
                    className="w-12 h-12 bg-primary-500 text-white font-black text-xl rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
                    {ltr.char}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-2">
              <AnimatePresence>
                {scrambled.map(ltr => (
                  <motion.button layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={`s_${ltr.id}`} onClick={() => pickLetter(ltr)}
                    className="w-12 h-12 bg-white/10 text-primary-200 font-bold text-xl rounded-lg shadow-sm hover:bg-white/20 hover:text-white transition-all flex items-center justify-center">
                    {ltr.char}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// GAME 3: MEMORY FLIP
// -------------------------------------------------------------
function MemoryFlip({ words, onBack, wordCount = 6 }) {
  const [cards, setCards] = useState([])
  const [flippedIds, setFlippedIds] = useState([])
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)

  useEffect(() => { startNewGame() }, [])

  const startNewGame = () => {
    const chosen = shuffle([...words]).slice(0, wordCount)
    let deck = []
    chosen.forEach(w => {
      deck.push({ id: `w_${w.id}`, pairId: w.id, text: w.word, isWord: true, flipped: false, matched: false })
      deck.push({ id: `d_${w.id}`, pairId: w.id, text: w.definition || w.example_sentence, isWord: false, flipped: false, matched: false })
    })
    setCards(shuffle(deck))
    setFlippedIds([])
    setScore(0)
    setWon(false)
  }

  const handleFlip = (id) => {
    if (flippedIds.length >= 2 || flippedIds.includes(id)) return
    
    const clickedCard = cards.find(c => c.id === id)
    if (clickedCard.matched) return

    const newFlipped = [...flippedIds, id]
    setFlippedIds(newFlipped)
    setCards(c => c.map(card => card.id === id ? { ...card, flipped: true } : card))

    if (newFlipped.length === 2) {
      const [id1, id2] = newFlipped
      const card1 = cards.find(c => c.id === id1)
      const card2 = cards.find(c => c.id === id2)
      
      if (card1.pairId === card2.pairId && card1.isWord !== card2.isWord) {
        setTimeout(() => {
          setCards(c => c.map(card => card.pairId === card1.pairId ? { ...card, matched: true } : card))
          setFlippedIds([])
          setScore(s => s + 15)
        }, 600)
      } else {
        setTimeout(() => {
          setCards(c => c.map(card => (card.id === id1 || card.id === id2) ? { ...card, flipped: false } : card))
          setFlippedIds([])
          setScore(s => Math.max(0, s - 3))
        }, 1200)
      }
    }
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setTimeout(() => setWon(true), 500)
    }
  }, [cards])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4">
        <button onClick={onBack} className="text-primary-300 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Grid className="w-5 h-5 text-accent-400" /> Memory Flip</h2>
        <div className="flex items-center gap-4">
          <span className="text-success-400 font-bold flex items-center gap-1"><Trophy className="w-4 h-4" /> {score}</span>
          <button onClick={startNewGame} className="text-primary-300 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="glass-card p-6 min-h-[400px] flex flex-col items-center justify-center">
        {won ? (
           <div className="text-center space-y-4">
             <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
             <h2 className="text-3xl font-bold text-white">Sharp Memory!</h2>
             <button onClick={startNewGame} className="btn-glow bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4">Play Again</button>
             <Confetti recycle={false} numberOfPieces={300} />
           </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            {cards.map(c => (
              <div key={c.id} className="relative h-32 perspective-1000" onClick={() => handleFlip(c.id)}>
                <motion.div animate={{ rotateY: c.flipped || c.matched ? 180 : 0 }} transition={{ duration: 0.4 }} className="w-full h-full preserve-3d cursor-pointer">
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
                    <Grid className="w-8 h-8 text-white/30" />
                  </div>
                  {/* Back */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl p-3 flex items-center justify-center text-center shadow-lg border-2 ${c.matched ? 'bg-success-500/20 border-success-500 text-success-400' : c.isWord ? 'bg-primary-600 border-primary-500 text-white' : 'bg-accent-600 border-accent-500 text-white'} `}>
                    <p className={`font-bold ${c.isWord ? 'text-lg' : 'text-xs'}`}>{c.text}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// GAME 4: MULTIPLE CHOICE QUIZ
// -------------------------------------------------------------
function WordQuiz({ words, onBack, wordCount = 5 }) {
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)
  const [selectedOpt, setSelectedOpt] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)

  useEffect(() => { startNewGame() }, [])

  const startNewGame = () => {
    const chosen = shuffle([...words]).slice(0, wordCount) // N questions
    const qs = chosen.map(w => {
      let distractors = shuffle(words.filter(x => x.id !== w.id)).slice(0, 3)
      let options = shuffle([w, ...distractors])
      return { answer: w, options }
    })
    setQuestions(qs)
    setCurrentIdx(0)
    setScore(0)
    setWon(false)
    setSelectedOpt(null)
    setIsCorrect(null)
  }

  const handleSelect = (opt) => {
    if (selectedOpt) return // prevent double click
    setSelectedOpt(opt)
    
    const ans = questions[currentIdx].answer
    const correct = opt.id === ans.id
    setIsCorrect(correct)

    if (correct) {
      setScore(s => s + 10)
    } else {
      setScore(s => Math.max(0, s - 5))
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(i => i + 1)
        setSelectedOpt(null)
        setIsCorrect(null)
      } else {
        setWon(true)
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4">
        <button onClick={onBack} className="text-primary-300 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-accent-400" /> Word Quiz</h2>
        <div className="flex items-center gap-4">
          <span className="text-success-400 font-bold flex items-center gap-1"><Trophy className="w-4 h-4" /> {score}</span>
          <button onClick={startNewGame} className="text-primary-300 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="glass-card p-6 min-h-[400px] flex flex-col justify-center text-center">
        {won ? (
           <div className="text-center space-y-4">
             <BrainCircuit className="w-20 h-20 text-accent-400 mx-auto" />
             <h2 className="text-3xl font-bold text-white">Quiz Finished!</h2>
             <p className="text-lg text-primary-300">Your total score: {score}</p>
             <button onClick={startNewGame} className="btn-glow bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4">Play Again</button>
             <Confetti recycle={false} numberOfPieces={300} />
           </div>
        ) : questions.length > 0 && (
          <div className="max-w-2xl mx-auto w-full space-y-8">
            <div>
              <span className="text-primary-400 font-bold text-sm uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
              <h3 className="text-2xl text-white font-medium mt-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                "{questions[currentIdx].answer.definition || questions[currentIdx].answer.example_sentence}"
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {questions[currentIdx].options.map((opt, i) => {
                let btnStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                if (selectedOpt) {
                   if (opt.id === questions[currentIdx].answer.id) {
                     btnStyle = 'bg-success-500/20 border-success-500 text-success-400'
                   } else if (opt.id === selectedOpt.id && !isCorrect) {
                     btnStyle = 'bg-red-500/20 border-red-500 text-red-500'
                   } else {
                     btnStyle = 'opacity-50 border-white/5 pointer-events-none text-white'
                   }
                }

                return (
                  <button key={i} onClick={() => handleSelect(opt)} disabled={!!selectedOpt}
                    className={`w-full p-4 rounded-xl font-bold border-2 transition-all ${btnStyle}`}>
                    {opt.word}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// GAME 5: HANGMAN 
// -------------------------------------------------------------
function Hangman({ words, onBack, wordCount = 1 }) {
  const [currentWord, setCurrentWord] = useState(null)
  const [guessedChars, setGuessedChars] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  
  const maxMistakes = 6
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  useEffect(() => { startNewGame() }, [])

  const startNewGame = () => {
    const chosen = shuffle([...words])[0] // process 1 word at a time
    setCurrentWord(chosen)
    setGuessedChars([])
    setMistakes(0)
    setWon(false)
    setLost(false)
  }

  useEffect(() => {
    // Check win/lose
    if (currentWord && !won && !lost) {
      const spelledArr = currentWord.word.toUpperCase().split('')
      const isWon = spelledArr.every(chr => guessedChars.includes(chr) || !/[A-Z]/.test(chr))
      if (isWon) {
        setScore(s => s + 20)
        setWon(true)
      } else if (mistakes >= maxMistakes) {
        setLost(true)
      }
    }
  }, [guessedChars, mistakes])

  const handleGuess = (chr) => {
    if (guessedChars.includes(chr) || won || lost) return
    
    setGuessedChars(prev => [...prev, chr])
    const spells = currentWord.word.toUpperCase().split('')
    if (!spells.includes(chr)) {
      setMistakes(m => m + 1)
      setScore(s => Math.max(0, s - 2))
    }
  }

  // Draw simple stickman
  const drawHangman = () => {
    const parts = [
      <line key="base" x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="4"/>,     // 0
      <line key="pole" x1="50" y1="90" x2="50" y2="10" stroke="currentColor" strokeWidth="4"/>,     // 1
      <line key="top" x1="50" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="4"/>,      // 2
      <line key="rope" x1="80" y1="10" x2="80" y2="30" stroke="currentColor" strokeWidth="2"/>,      // 3
      <circle key="head" cx="80" cy="40" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>, // 4
      <line key="body" x1="80" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="4"/>,      // 5
      <line key="arms" x1="70" y1="60" x2="90" y2="60" stroke="currentColor" strokeWidth="4"/>       // 6
    ]
    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto text-red-400">
        {parts.slice(0, mistakes + 1)}
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4">
        <button onClick={onBack} className="text-primary-300 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-accent-400" /> Hangman</h2>
        <div className="flex items-center gap-4">
          <span className="text-success-400 font-bold flex items-center gap-1"><Trophy className="w-4 h-4" /> {score}</span>
          <button onClick={startNewGame} className="text-primary-300 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="glass-card p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
        {won ? (
           <div className="space-y-4">
             <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
             <h2 className="text-3xl font-bold text-success-400">You Saved Them!</h2>
             <p className="text-xl font-mono text-white tracking-widest">{currentWord.word}</p>
             <button onClick={startNewGame} className="btn-glow bg-primary-600 text-white px-6 py-2 rounded-xl font-bold mt-4">Next Word</button>
             <Confetti recycle={false} numberOfPieces={300} />
           </div>
        ) : lost ? (
           <div className="space-y-4">
             {drawHangman()}
             <h2 className="text-3xl font-bold text-red-500 mt-4">Game Over!</h2>
             <p className="text-lg text-primary-200">The word was:</p>
             <p className="text-2xl font-black text-white">{currentWord.word}</p>
             <button onClick={startNewGame} className="btn-glow bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-bold mt-4">Try Again</button>
           </div>
        ) : currentWord && (
          <div className="max-w-2xl w-full space-y-8">
            <div className="flex justify-between items-end">
              <div className="w-1/3"></div>
              <div className="w-1/3 text-center">{drawHangman()}</div>
              <div className="w-1/3 text-right">
                <span className="text-xl font-bold text-red-400">{mistakes} / {maxMistakes}</span>
              </div>
            </div>

            <p className="text-lg text-white font-medium bg-black/20 p-4 rounded-xl">Hint: "{currentWord.definition || currentWord.example_sentence}"</p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {currentWord.word.toUpperCase().split('').map((char, i) => {
                const isRevealed = guessedChars.includes(char) || !/[A-Z]/.test(char)
                return (
                  <div key={i} className="w-10 h-12 flex items-end justify-center border-b-4 border-white pb-1 text-2xl font-black text-white">
                    {isRevealed ? char : ''}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-6">
              {alphabet.map(letter => {
                const isGuessed = guessedChars.includes(letter)
                const isCorrect = isGuessed && currentWord.word.toUpperCase().includes(letter)
                const isWrong = isGuessed && !currentWord.word.toUpperCase().includes(letter)

                let btnStyle = 'bg-white/10 hover:bg-white/20 text-white'
                if (isCorrect) btnStyle = 'bg-success-500 text-white opacity-50 cursor-not-allowed border-success-400'
                if (isWrong) btnStyle = 'bg-black/50 text-white/20 opacity-30 cursor-not-allowed'

                return (
                  <button key={letter} disabled={isGuessed} onClick={() => handleGuess(letter)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all shadow-sm ${btnStyle}`}>
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// MAIN COMPONENT: HUB
// -------------------------------------------------------------
export default function VocabGame() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null)
  const [wordCount, setWordCount] = useState(10)
  const [timeLimit, setTimeLimit] = useState(60)
  const [searchParams] = useSearchParams()
  const setName = searchParams.get('set_name') // from Flashcards "Play Minigame"

  useEffect(() => {
    const load = async () => {
      let data
      if (setName) {
        // Load words from the specific imported CSV set
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/vocabulary/notebook?set_name=${encodeURIComponent(setName)}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        data = res.ok ? await res.json() : null
      } else {
        // Load from the global vocabulary library
        data = await apiFetch('/vocabulary')
      }
      if (data) setWords(data)
      setLoading(false)
    }
    load()
  }, [setName])

  if (loading) return <div className="text-center py-20 text-white animate-pulse">Loading Games...</div>
  if (words.length < 4) return (
    <div className="text-center py-20 text-white space-y-4">
      <p>Not enough words to play{setName ? ` in "${setName}"` : ''}. Need at least 4 words.</p>
      <Link to="/vocabulary" className="btn-glow bg-primary-600 text-white px-6 py-3 rounded-xl font-bold inline-block">Go to Vocabulary</Link>
    </div>
  )

  if (mode === 'match') return <WordMatch words={words} onBack={() => setMode(null)} wordCount={Math.min(wordCount, words.length)} timeLimit={timeLimit} />
  if (mode === 'scramble') return <WordScramble words={words} onBack={() => setMode(null)} wordCount={Math.min(wordCount, words.length)} timeLimit={timeLimit} />
  if (mode === 'memory') return <MemoryFlip words={words} onBack={() => setMode(null)} wordCount={Math.min(wordCount, words.length)} timeLimit={timeLimit} />
  if (mode === 'quiz') return <WordQuiz words={words} onBack={() => setMode(null)} wordCount={Math.min(wordCount, words.length)} timeLimit={timeLimit} />
  if (mode === 'hangman') return <Hangman words={words} onBack={() => setMode(null)} wordCount={Math.min(wordCount, words.length)} timeLimit={timeLimit} />

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative pt-4 pb-10">
      <div className="flex justify-between items-center text-center">
        <Link to={setName ? '/flashcards' : '/vocabulary'} className="text-primary-300 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1 text-center pr-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary-400" /> Minigame Hub
          </h1>
          {setName && (
            <p className="text-accent-400 text-sm mt-1">📁 Playing with words from: <span className="font-bold">{setName}</span> ({words.length} words)</p>
          )}
        </div>
      </div>

      {/* Settings Row */}
      <div className="glass-card flex flex-col divide-y divide-white/5">
        {/* Word Count Selector */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-primary-300 font-semibold whitespace-nowrap w-44">Số từ mỗi ván:</span>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20, 30, 40].map(n => {
              const disabled = n > words.length
              return (
                <button
                  key={n}
                  disabled={disabled}
                  onClick={() => setWordCount(n)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    disabled
                      ? 'opacity-30 cursor-not-allowed bg-white/5 text-primary-400'
                      : wordCount === n
                      ? 'bg-accent-600 text-white shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-primary-200'
                  }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
          <span className="text-primary-500 text-sm ml-auto">{words.length} từ có sẵn</span>
        </div>

        {/* Time Limit Selector */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-primary-300 font-semibold whitespace-nowrap w-44 flex items-center gap-2"><Timer className="w-4 h-4"/> Thời gian (đếm ngược):</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '30s', val: 30 },
              { label: '60s', val: 60 },
              { label: '90s', val: 90 },
              { label: '120s', val: 120 },
              { label: 'Không giới hạn', val: 0 },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setTimeLimit(opt.val)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  timeLimit === opt.val
                    ? 'bg-accent-600 text-white shadow-lg scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-primary-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => setMode('match')} className="glass-card p-6 group cursor-pointer hover:border-primary-500/50 transition-all flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Shuffle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Word Match</h3>
          <p className="text-primary-300 text-sm">Nối từ tiếng Anh với định nghĩa.</p>
        </div>

        <div onClick={() => setMode('scramble')} className="glass-card p-6 group cursor-pointer hover:border-accent-500/50 transition-all flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Type className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Word Scramble</h3>
          <p className="text-primary-300 text-sm">Sắp xếp các chữ cái để tạo từ đúng.</p>
        </div>

        <div onClick={() => setMode('memory')} className="glass-card p-6 group cursor-pointer hover:border-emerald-500/50 transition-all flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Grid className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Memory Flip</h3>
          <p className="text-primary-300 text-sm">Lật các thẻ bài để tìm cặp từ và nghĩa.</p>
        </div>

        <div onClick={() => setMode('quiz')} className="glass-card p-6 group cursor-pointer hover:border-blue-500/50 transition-all flex flex-col items-center text-center lg:col-span-1 md:col-start-1 md:col-end-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Word Quiz</h3>
          <p className="text-primary-300 text-sm">Trắc nghiệm chọn từ dựa trên định nghĩa.</p>
        </div>

        <div onClick={() => setMode('hangman')} className="glass-card p-6 group cursor-pointer hover:border-red-500/50 transition-all flex flex-col items-center text-center lg:col-span-1 md:col-start-2 md:col-end-3">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Hangman</h3>
          <p className="text-primary-300 text-sm">Đoán chữ cái để cứu người treo cổ.</p>
        </div>
      </div>
    </div>
  )
}
