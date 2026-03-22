import { useState, useEffect, useRef } from 'react'
import { Play, CheckCircle, Clock, ChevronRight, Video, Info, Lock, PenTool, BookOpen, ExternalLink, Send, Sparkles, FileText, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getVideos, updateVideoProgress, getVideoNotes, addVideoNote, updateVideoTranscript, generateAIVideoPractice } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function VideoLessons() {
  const { isLoggedIn, user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [watchTime, setWatchTime] = useState(0)
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [showTranscriptEdit, setShowTranscriptEdit] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    loadVideos()
  }, [isLoggedIn])

  useEffect(() => {
    if (selectedVideo) {
      loadNotes(selectedVideo.id)
      setTranscript(selectedVideo.transcript || '')
    }
  }, [selectedVideo, isLoggedIn])

  const loadVideos = async () => {
    try {
      const data = await getVideos()
      
      const parsedData = data.map(v => ({
        ...v,
        chapters: v.chapters ? JSON.parse(v.chapters) : []
      }))

      // If not logged in, overlay localStorage progress
      if (!isLoggedIn) {
        const guestProgress = JSON.parse(localStorage.getItem('aptis_guest_video_progress') || '{}')
        const merged = parsedData.map(v => ({
          ...v,
          ...(guestProgress[v.id] || {})
        }))
        setVideos(merged)
      } else {
        setVideos(parsedData)
      }
      setLoading(false)
    } catch (err) {
      toast.error('Không thể tải danh sách video: ' + err.message)
      setLoading(false)
    }
  }

  const loadNotes = async (videoId) => {
    if (isLoggedIn) {
      try {
        const data = await getVideoNotes(videoId)
        setNotes(data)
      } catch (err) {
        console.error('Failed to load notes:', err)
      }
    } else {
      const guestNotes = JSON.parse(localStorage.getItem('aptis_guest_video_notes') || '{}')
      setNotes(guestNotes[videoId] || [])
    }
  }

  const handleUpdateTranscript = async () => {
    if (!selectedVideo) return
    try {
      await updateVideoTranscript(selectedVideo.id, transcript)
      toast.success('Đã cập nhật Transcript!')
      setShowTranscriptEdit(false)
      // Update local state for the transcript immediately
      setSelectedVideo(prev => ({ ...prev, transcript: transcript }))
      setVideos(prev => prev.map(v => v.id === selectedVideo.id ? { ...v, transcript: transcript } : v))
    } catch (err) {
      toast.error('Lỗi khi cập nhật Transcript: ' + err.message)
    }
  }

  const handleGenerateAI = async () => {
    if (!selectedVideo) return
    if (!transcript.trim()) {
      setShowTranscriptEdit(true)
      toast.error('Vui lòng cung cấp Transcript trước khi tạo bài tập AI.')
      return
    }

    setIsGenerating(true)
    try {
      const res = await generateAIVideoPractice(selectedVideo.id, {
        skill: 'grammar', 
        difficulty: 'B1',
        limit: 5
      })
      toast.success(`AI đã tạo thành công ${res.count} câu hỏi luyện tập!`)
    } catch (err) {
      toast.error('AI thất bại: ' + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveNote = async () => {
    if (!newNote.trim() || !selectedVideo) return

    const noteData = {
      content: newNote,
      timestamp_seconds: watchTime
    }

    try {
      if (isLoggedIn) {
        const savedNote = await addVideoNote(selectedVideo.id, noteData)
        setNotes([...notes, savedNote].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds))
      } else {
        const guestNotes = JSON.parse(localStorage.getItem('aptis_guest_video_notes') || '{}')
        const videoNotes = guestNotes[selectedVideo.id] || []
        const newGuestNote = {
          ...noteData,
          id: Date.now(),
          created_at: new Date().toISOString()
        }
        guestNotes[selectedVideo.id] = [...videoNotes, newGuestNote].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds)
        localStorage.setItem('aptis_guest_video_notes', JSON.stringify(guestNotes))
        setNotes(guestNotes[selectedVideo.id])
      }
      setNewNote('')
      toast.success('Đã lưu ghi chú!')
    } catch (err) {
      toast.error('Lỗi khi lưu ghi chú: ' + err.message)
    }
  }

  const formatTime = (seconds) => {
    const caps = Math.floor(seconds)
    const m = Math.floor(caps / 60)
    const s = caps % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Handle periodic progress sync
  useEffect(() => {
    if (selectedVideo) {
      // Start timer to track "pseudo" watch time
      setWatchTime(selectedVideo.watched_seconds || 0)
      
      timerRef.current = setInterval(() => {
        setWatchTime(prev => prev + 5)
      }, 5000) 
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [selectedVideo?.id])

  // Sync with backend
  useEffect(() => {
    if (selectedVideo && watchTime > (selectedVideo.watched_seconds || 0)) {
      const sync = async () => {
        if (isLoggedIn) {
          try {
            await updateVideoProgress(selectedVideo.id, {
              watched_seconds: watchTime,
              is_completed: false
            })
          } catch (err) {
            console.error('Failed to sync progress:', err)
          }
        } else {
          const guestProgress = JSON.parse(localStorage.getItem('aptis_guest_video_progress') || '{}')
          guestProgress[selectedVideo.id] = {
            ...selectedVideo,
            watched_seconds: watchTime,
            is_completed: selectedVideo.is_completed || false
          }
          localStorage.setItem('aptis_guest_video_progress', JSON.stringify(guestProgress))
          setVideos(prev => prev.map(v => v.id === selectedVideo.id ? { ...v, watched_seconds: watchTime } : v))
        }
      }
      const timeout = setTimeout(sync, 2000)
      return () => clearTimeout(timeout)
    }
  }, [watchTime, selectedVideo?.id, isLoggedIn])

  const handleMarkComplete = async (video) => {
    const newStatus = {
      is_completed: true,
      watched_seconds: video.total_seconds || 3600
    }

    try {
      if (isLoggedIn) {
        await updateVideoProgress(video.id, newStatus)
      } else {
        const guestProgress = JSON.parse(localStorage.getItem('aptis_guest_video_progress') || '{}')
        guestProgress[video.id] = { ...video, ...newStatus }
        localStorage.setItem('aptis_guest_video_progress', JSON.stringify(guestProgress))
      }
      toast.success('Đã đánh dấu hoàn thành!')
      loadVideos()
    } catch (err) {
      toast.error('Lỗi: ' + err.message)
    }
  }

  if (loading) return <div className="text-center py-20 text-primary-300">Đang tải bài giảng...</div>

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-emerald-500 dark:text-primary-400" />
            Bài Giảng Video - Quốc Anh
          </h1>
          <p className="text-slate-500 dark:text-primary-300 mt-1">Hệ thống bài giảng ôn luyện APTIS trực tuyến</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {selectedVideo && (
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="btn-glow bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'AI đang tạo...' : 'Tạo bài tập AI'}
            </button>
          )}

          {selectedVideo && selectedVideo.practice_link && (
            <Link
              to={selectedVideo.practice_link}
              className="btn-glow bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 w-fit"
            >
              <PenTool className="w-5 h-5" />
              Luyện Tập Ngay
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {selectedVideo ? (
            <div className="space-y-6">
              {/* Player */}
              <div className="glass-card overflow-hidden aspect-video relative bg-black rounded-3xl shadow-2xl border-0 ring-1 ring-white/10">
                <iframe
                  src={selectedVideo.video_url}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  title={selectedVideo.title}
                />
              </div>

              {/* Title & Info */}
              <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedVideo.title}</h2>
                    <p className="text-slate-500 dark:text-primary-300 text-sm mt-2 leading-relaxed">
                      {selectedVideo.description || 'Bài giảng chi tiết giúp bạn nắm vững các kỹ thuật và chiến thuật đạt điểm cao trong kỳ thi APTIS.'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                      <button
                      onClick={() => handleMarkComplete(selectedVideo)}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                          selectedVideo.is_completed
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-primary-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                      >
                      <CheckCircle className="w-4 h-4" />
                      {selectedVideo.is_completed ? 'Đã học xong' : 'Đánh dấu hoàn thành'}
                      </button>

                      <button
                        onClick={() => setShowTranscriptEdit(!showTranscriptEdit)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 dark:text-primary-400 hover:text-primary-600 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        {showTranscriptEdit ? 'Đóng Transcript' : (selectedVideo.transcript ? 'Xem Transcript' : 'Thêm Transcript')}
                      </button>
                  </div>
                </div>

                {/* Transcript Editor */}
                <AnimatePresence>
                  {showTranscriptEdit && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-700 dark:text-primary-200">Bản ghi âm bài giảng (Transcript)</h4>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">AI dùng nội dung này để tạo bài tập</span>
                      </div>
                      <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Hãy dán nội dung bài giảng tại đây để AI có thể 'đọc' và tự động tạo bài tập luyện tập bám sát nội dung thầy giảng..."
                        className="w-full h-40 bg-slate-50 dark:bg-black/20 border-0 rounded-2xl p-4 text-sm font-light leading-relaxed text-slate-600 dark:text-primary-300 focus:ring-2 focus:ring-emerald-500 transition-all custom-scrollbar"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleUpdateTranscript}
                          className="btn-glow bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Lưu Transcript
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chapters & Notes Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chapters */}
                {selectedVideo.chapters && selectedVideo.chapters.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-emerald-500" />
                      Mục lục bài giảng
                    </h3>
                    <div className="space-y-2">
                       {selectedVideo.chapters.map((ch, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-default">
                           <span className="text-slate-700 dark:text-primary-200 text-sm font-medium">{ch.label}</span>
                           <span className="text-xs font-mono bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-slate-500 dark:text-primary-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                             {formatTime(ch.time)}
                           </span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* Personal Notes */}
                <div className="glass-card p-6 flex flex-col min-h-[300px]">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                    <PenTool className="w-5 h-5 text-orange-500" />
                    Ghi chú cá nhân
                  </h3>
                  
                  <div className="flex-1 space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {notes.length === 0 ? (
                        <p className="text-center text-slate-400 dark:text-primary-500 text-sm italic py-10">Chưa có ghi chú nào.</p>
                    ) : (
                        notes.map((n, i) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        Tại {formatTime(n.timestamp_seconds)}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-primary-200 leading-relaxed">{n.content}</p>
                            </div>
                        ))
                    )}
                  </div>

                  <div className="relative mt-auto">
                    <input 
                        type="text" 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveNote()}
                        placeholder="Ghi chú điều quan trọng..."
                        className="w-full bg-slate-100 dark:bg-white/10 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 transition-all text-slate-700 dark:text-white"
                    />
                    <button 
                        onClick={handleSaveNote}
                        disabled={!newNote.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-orange-500 text-white rounded-xl disabled:opacity-50 hover:scale-105 transition-transform"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-card aspect-video flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 dark:bg-white/5 border-dashed border-2">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10"
              >
                <Play className="w-12 h-12 text-emerald-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-700 dark:text-white">Chào mừng bạn trở lại học lớp Quốc Anh!</h3>
              <p className="text-slate-500 dark:text-primary-400 mt-3 max-w-sm leading-relaxed">
                Hãy chọn bài giảng bên phải để bắt đầu ôn tập. Hệ thống sẽ tự động lưu lại tiến độ học tập của bạn.
              </p>
            </div>
          )}
        </div>

        {/* Playlist Area */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                Danh sách bài giảng
            </h3>
            <span className="text-[10px] font-bold text-primary-500">{videos.length} videos</span>
          </div>
          
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 custom-scrollbar">
            {videos.map((video, idx) => {
              const isActive = selectedVideo?.id === video.id
              const progress = video.is_completed ? 100 : Math.min(100, Math.round((video.watched_seconds || 0) / 3600 * 100))
              
              return (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left glass-card p-4 transition-all hover:translate-x-1 flex gap-4 relative overflow-hidden group ${
                    isActive ? 'border-primary-500/50 bg-primary-500/5 ring-1 ring-primary-500/20' : 'hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />}
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold transition-transform group-hover:scale-110 ${
                    video.is_completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-primary-300'
                  }`}>
                    {video.is_completed ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate text-sm mb-2 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-white'}`}>
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-700 ${video.is_completed ? 'bg-emerald-500' : 'bg-primary-500'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-primary-500 italic">{progress}%</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {!isLoggedIn && (
            <div className="glass-card p-4 bg-orange-50/50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20">
                <p className="text-[11px] text-orange-700 dark:text-orange-400 leading-tight">
                    <strong>Mẹo:</strong> Đăng nhập để đồng bộ tiến độ và ghi chú lên đám mây, giúp bạn học trên nhiều thiết bị khác nhau.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
