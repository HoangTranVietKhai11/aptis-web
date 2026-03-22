import { useState, useRef } from 'react'
import { Sparkles, Check, Smile, Lightbulb, Mic, Volume2, Square, Loader2 } from 'lucide-react'

export default function QuestionCard({ question, onAnswer, showResult, questionIndex, isSubmitting }) {
  const [selected, setSelected] = useState(null)
  const [textAnswer, setTextAnswer] = useState('')

  const handleSelect = (opt) => {
    if (showResult || isSubmitting) return
    setSelected(opt)
    onAnswer(opt)
  }

  const handleTextSubmit = () => {
    if (!textAnswer.trim() || isSubmitting) return
    onAnswer(textAnswer.trim())
  }

  const [isPlaying, setIsPlaying] = useState(false)
  const currentAudioRef = useRef(null)

  const handlePlayTTS = async () => {
    // Announce question number before playing (like real Aptis exam)
    const textToRead = question.transcript || question.question
    const questionNum = questionIndex != null ? questionIndex + 1 : null
    const preamble = questionNum ? `Question ${questionNum}. Ready? Now listen. ` : 'Now listen. '
    const fullText = preamble + textToRead
    
    setIsPlaying(true)
    handleStopTTS() // Stop any previous playback

    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(fullText)}&lang=en`)
      if (!res.ok) throw new Error('API TTS Error')
      const data = await res.json()
      if (!data.audio || data.audio.length === 0) throw new Error('No audio returned')

      const playSequence = (audioSegments, index) => {
        if (index >= audioSegments.length) {
          setIsPlaying(false)
          return
        }
        const audio = new Audio('data:audio/mp3;base64,' + audioSegments[index].base64)
        currentAudioRef.current = audio
        audio.onended = () => playSequence(audioSegments, index + 1)
        audio.onerror = () => setIsPlaying(false)
        audio.play().catch(err => {
          console.error('Audio play blocked:', err)
          setIsPlaying(false)
        })
      }
      playSequence(data.audio, 0)
    } catch (err) {
      console.warn('TTS API failed, falling back to browser synthesis:', err)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullText)
        utterance.lang = 'en-GB'
        utterance.rate = 0.9
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        window.speechSynthesis.speak(utterance)
      } else {
        setIsPlaying(false)
      }
    }
  }

  const handleStopTTS = () => {
    setIsPlaying(false)
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const isRecordingRef = useRef(false)
  const finalTranscriptRef = useRef('')

  const handleStartRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome/Edge hoặc nhập tay.')
      return
    }
    
    isRecordingRef.current = true
    setIsRecording(true)
    finalTranscriptRef.current = transcript ? transcript + ' ' : '' // Keep existing text if any

    const startRecognition = () => {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.interimResults = true
      recognition.continuous = true

      recognition.onresult = (e) => {
        let interim = ''
        let finalSegment = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalSegment += e.results[i][0].transcript + ' '
          } else {
            interim += e.results[i][0].transcript
          }
        }
        
        if (finalSegment) {
          finalTranscriptRef.current += finalSegment
        }
        setTranscript((finalTranscriptRef.current + interim).trim())
      }

      recognition.onerror = (e) => {
        if (e.error === 'no-speech') return; // Ignore silence errors
        console.error(e)
        if (e.error !== 'aborted') {
          isRecordingRef.current = false
          setIsRecording(false)
        }
      }

      recognition.onend = () => {
        if (isRecordingRef.current) {
          // Restart automatically if user still wants to record
          try { startRecognition() } catch (err) {}
        } else {
          setIsRecording(false)
        }
      }
      
      try { recognition.start() } catch (err) {}
      window.currentRecognition = recognition
    }

    startRecognition()
  }

  const handleStopRecord = () => {
    isRecordingRef.current = false
    setIsRecording(false)
    if (window.currentRecognition) {
      window.currentRecognition.stop()
    }
  }

  const isCorrect = (opt) => showResult && opt === question.correct_answer
  const isWrong = (opt) => showResult && opt === selected && opt !== question.correct_answer

  if (question.type === 'text_input' || question.type === 'audio_response') {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex justify-between items-start mb-4 gap-4">
          <p className="text-lg font-medium leading-relaxed whitespace-pre-line">{question.question}</p>
          {question.skill === 'listening' && (
            <button
              onClick={isPlaying ? handleStopTTS : handlePlayTTS}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-accent-500/20 text-accent-400 hover:bg-accent-500/30'}`}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
              {isPlaying ? 'Dừng phát' : 'Nghe Audio'}
            </button>
          )}
        </div>
        
        {/* TEXT RESPONSE */}
        {question.type === 'text_input' && (
          <>
            <div className="relative">
              <textarea
                className="w-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-800 dark:text-primary-100 placeholder-slate-400 focus:outline-none focus:border-primary-400 resize-none min-h-[150px] shadow-sm transition-all text-lg leading-relaxed"
                placeholder="Write your answer here..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (!textAnswer) return;
                  try {
                    const res = await fetch('/api/ai/rephrase', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ text: textAnswer })
                    });
                    if (res.status === 429) {
                      toast.error('AI đang bận, chị vui lòng đợi 30 giây rồi bấm lại nhé! ⏳');
                      return;
                    }
                    const data = await res.json();
                    if (data.rephrased) setTextAnswer(data.rephrased);
                  } catch (err) {
                    console.error('Rephrase error:', err);
                  }
                }}
                className="absolute bottom-4 right-4 bg-primary-600/50 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all backdrop-blur flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" /> Rephrase
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-primary-300">
                {textAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                onClick={handleTextSubmit}
                disabled={isSubmitting || showResult}
                className={`cute-button-primary px-8 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:transform-none disabled:cursor-not-allowed w-full sm:w-auto mt-4 sm:mt-0 ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Vui lòng chờ...</>
                ) : (
                  <><Check className="w-5 h-5" /> Submit</>
                )}
              </button>
            </div>
          </>
        )}

        {/* AUDIO RESPONSE */}
        {question.type === 'audio_response' && (
          <div className="space-y-6">
            <div className={`flex flex-col items-center justify-center p-8 transition-all duration-500 ${isRecording ? 'cute-card scale-[1.02]' : 'bg-white/5 border-2 border-dashed border-primary-500/20 rounded-3xl hover:border-primary-400/50'}`}>
              <div className="relative mb-4">
                <button
                  onClick={isRecording ? handleStopRecord : handleStartRecord}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl z-10 ${
                    isRecording 
                      ? 'bg-rose-500 hover:bg-rose-600 cute-recording-indicator scale-110' 
                      : 'bg-gradient-to-br from-pink-400 to-rose-400 hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-10 h-10 text-white fill-current animate-pulse" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
              </div>
              <p className={`font-bold text-lg text-center transition-colors ${isRecording ? 'text-rose-500 animate-pulse' : 'text-primary-400 dark:text-primary-300'}`}>
                {isRecording ? 'Listening (Tap to stop)...' : 'Tap to record answer'}
              </p>
              {!isRecording && !transcript && (
                 <p className="text-sm text-primary-400/70 mt-2">Take a deep breath and speak clearly 🌸</p>
              )}
            </div>
            
            {(transcript || !isRecording) && (
              <div className="relative mt-6 animate-fade-in group">
                <div className="flex items-center gap-2 mb-3">
                  <Smile className="w-5 h-5 text-emerald-500" />
                  <p className="text-sm font-bold text-slate-700 dark:text-primary-300">Transcript (Edit if needed ✨):</p>
                </div>
                <textarea
                  className="w-full bg-white dark:bg-white/5 border-2 border-pink-100 dark:border-white/10 rounded-2xl p-5 text-slate-800 dark:text-primary-100 placeholder-slate-400 focus:outline-none focus:border-pink-400 dark:focus:border-primary-400 resize-none min-h-[120px] shadow-sm transition-all text-lg leading-relaxed"
                  placeholder="Your words will appear magically here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/5 mt-6">
              <button
                onClick={() => {
                  if (!transcript.trim()) return
                  onAnswer(transcript.trim())
                }}
                disabled={!transcript.trim() || isSubmitting}
                className="cute-button-primary px-8 py-4 flex items-center gap-3 text-lg disabled:opacity-50 disabled:hover:transform-none disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    AI Reviewing...
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-6 gap-4">
        <p className="text-lg font-medium leading-relaxed whitespace-pre-line">{question.question}</p>
        {question.skill === 'listening' && (
          <button
            onClick={isPlaying ? handleStopTTS : handlePlayTTS}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-accent-500/20 text-accent-400 hover:bg-accent-500/30'}`}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
            {isPlaying ? 'Dừng phát' : 'Nghe Audio'}
          </button>
        )}
      </div>
      <div className="grid gap-3">
        {(question.options || []).map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={!!showResult}
            className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all border ${
              isCorrect(opt)
                ? 'bg-emerald-50 border-emerald-400 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                : isWrong(opt)
                ? 'bg-rose-50 border-rose-400 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                : selected === opt
                ? 'bg-primary-50 border-primary-400 text-primary-700 dark:bg-primary-600/30 dark:text-white'
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-primary-100 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            <span className="mr-3 inline-block w-7 h-7 text-center leading-7 rounded-full bg-white/10 text-sm">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (question.explanation || showResult.ai_feedback) && (() => {
        let aiData = null;
        const hasAi = !!showResult.ai_feedback;
        
        if (hasAi) {
          try { 
            if (showResult.ai_feedback.startsWith('{')) {
              aiData = JSON.parse(showResult.ai_feedback);
            }
          } catch(e) {}
        }

        return (
          <div className={`mt-6 p-6 ${hasAi ? 'cute-card' : 'bg-amber-50/50 border border-amber-100'} dark:bg-slate-900/80 rounded-2xl space-y-5 animate-fade-in`}>
            {hasAi && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Smile className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <span className="font-black text-slate-800 dark:text-white text-sm">Aptis Evaluator ✨</span>
                      <p className="text-xs text-slate-500 dark:text-primary-400 font-medium">Feedback for {question.skill}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {aiData?.band && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-xl text-sm font-black shadow-sm">
                        Target: {aiData.band}
                      </span>
                    )}
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">
                      {showResult.score}/50
                    </span>
                  </div>
                </div>

                {aiData?.traits && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
                    {Object.entries(aiData.traits).map(([trait, score]) => (
                      <div key={trait} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-primary-300">
                          <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-500/10">{score}/5</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden shadow-inner">
                          <div 
                            style={{ width: `${(score/5) * 100}%` }}
                            className="h-full bg-green-500 transition-all duration-1000 ease-out rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-slate-700 dark:text-primary-100 text-[15px] leading-relaxed space-y-4 pt-2">
                  <div className="flex gap-3 items-start bg-gray-50/50 dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="font-medium italic">"{aiData?.feedback || showResult.ai_feedback}"</p>
                  </div>
                  
                  {aiData?.suggestions && (
                    <div className="flex gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 shadow-sm">
                      <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 dark:text-emerald-100 font-medium">Tip: {aiData.suggestions}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {question.explanation && (
              <div className={`text-slate-600 dark:text-primary-300 text-sm italic flex gap-3 ${hasAi ? 'border-t border-slate-100 dark:border-white/5 pt-4' : ''}`}>
                <Lightbulb className={`w-5 h-5 flex-shrink-0 ${hasAi ? 'text-amber-500' : 'text-amber-600'}`} />
                <p className="font-medium text-[15px] leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
