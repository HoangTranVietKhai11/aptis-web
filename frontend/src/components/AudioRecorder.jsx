import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Mic, Square, Volume2 } from 'lucide-react'

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data)
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.current.start()
      setRecording(true)
      setAudioUrl(null)
      setDuration(0)
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
    } catch (err) {
      toast.error('Microphone access required for speaking practice.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop()
      setRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="btn-glow bg-red-500 hover:bg-red-400 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3"
          >
            <Mic className="w-6 h-6" /> Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="btn-glow bg-gray-600 hover:bg-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3"
          >
            <Square className="w-5 h-5 fill-current" /> Stop ({formatTime(duration)})
          </button>
        )}
        {recording && (
          <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse-slow" />
        )}
      </div>
      {audioUrl && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-primary-300 mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" /> Your recording ({formatTime(duration)})
          </p>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  )
}
