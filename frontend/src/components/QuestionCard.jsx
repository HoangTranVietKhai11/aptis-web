import { useState, useRef } from 'react'
import { Sparkles, Check, Bot, Lightbulb, Mic, Volume2, Square, Loader2 } from 'lucide-react'

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

  const handlePlayTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ phát âm thanh.')
      return
    }
    window.speechSynthesis.cancel()
    // Play transcript (dialogue/passage) if available, otherwise fall back to question text
    const textToRead = question.transcript || question.question
    // Announce question number before playing (like real Aptis exam)
    const questionNum = questionIndex != null ? questionIndex + 1 : null
    const preamble = questionNum ? `Question ${questionNum}. Ready? Now listen. ` : 'Now listen. '
    const fullText = preamble + textToRead
    const utterance = new SpeechSynthesisUtterance(fullText)
    utterance.lang = 'en-GB' // British English for Aptis
    utterance.rate = 0.9     // Slightly slower for clarity
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleStopTTS = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
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
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-primary-100 placeholder-primary-300/50 focus:outline-none focus:border-primary-400 resize-none min-h-[150px]"
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
                className={`btn-glow bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 disabled:opacity-50 ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> AI đang chấm điểm...</>
                ) : (
                  <><Check className="w-5 h-5" /> Submit</>
                )}
              </button>
            </div>
          </>
        )}

        {/* AUDIO RESPONSE */}
        {question.type === 'audio_response' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary-500/30 rounded-2xl bg-primary-900/10">
              <button
                onClick={isRecording ? handleStopRecord : handleStartRecord}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30' 
                    : 'bg-primary-500 hover:bg-primary-400 btn-glow'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className={`mt-4 font-semibold ${isRecording ? 'text-red-400 animate-pulse' : 'text-primary-300'}`}>
                {isRecording ? 'Đang ghi âm (Bấm để dừng)...' : 'Bấm để ghi âm câu trả lời'}
              </p>
            </div>
            
            {(transcript || !isRecording) && (
              <div className="relative mt-4">
                <p className="text-sm font-semibold text-primary-400 mb-2">Bản dịch giọng nói (Bạn có thể sửa lại bằng tay nếu cần):</p>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-primary-100 placeholder-primary-300/50 focus:outline-none focus:border-primary-400 resize-none min-h-[100px]"
                  placeholder="Speak to see text here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  if (!transcript.trim()) return
                  onAnswer(transcript.trim())
                }}
                disabled={!transcript.trim()}
                className="btn-glow bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <Check className="w-5 h-5" /> Submit Answer
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
                ? 'bg-success-500/20 border-success-400 text-success-400'
                : isWrong(opt)
                ? 'bg-red-500/20 border-red-400 text-red-400'
                : selected === opt
                ? 'bg-primary-600/30 border-primary-400 text-white'
                : 'bg-white/5 border-white/10 text-primary-100 hover:bg-white/10 hover:border-white/20'
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
        try { 
          if (showResult.ai_feedback && showResult.ai_feedback.startsWith('{')) {
            aiData = JSON.parse(showResult.ai_feedback);
          }
        } catch(e) {}

        return (
          <div className="mt-4 p-5 bg-slate-900/50 border border-primary-500/20 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent-400" />
                <span className="font-bold text-white uppercase text-xs tracking-widest">Aptis AI Evaluator</span>
              </div>
              <div className="flex items-center gap-3">
                {aiData?.band && (
                  <span className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-black shadow-lg shadow-primary-900/40">
                    Target: {aiData.band}
                  </span>
                )}
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">
                  {showResult.score}/50
                </span>
              </div>
            </div>

            {aiData?.traits && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-y border-white/5">
                {Object.entries(aiData.traits).map(([trait, score]) => (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter text-primary-300">
                      <span>{trait.replace(/_/g, ' ')}</span>
                      <span>{score}/5</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(score/5) * 100}%` }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-primary-100 text-sm leading-relaxed space-y-3">
              <p className="font-medium text-white/90 italic">"{aiData?.feedback || showResult.ai_feedback}"</p>
              {aiData?.suggestions && (
                <div className="flex gap-2 p-3 bg-accent-500/10 rounded-xl border border-accent-500/20">
                  <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-accent-100 font-medium">Tip: {aiData.suggestions}</p>
                </div>
              )}
            </div>

            {question.explanation && (
              <div className="text-primary-300 text-xs italic flex gap-3 border-t border-white/5 pt-3">
                <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
