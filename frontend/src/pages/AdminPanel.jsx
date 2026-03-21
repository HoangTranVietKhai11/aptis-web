import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAdminUsers, deleteAdminUser, changeUserRole, getAdminStats, importExamPDF, getMockTests } from '../services/api'
import { Shield, FileText, Users, Search, BookOpen, Layers, Headset, Edit3, Mic, Clipboard, Folder, Loader2, Rocket, AlertTriangle, CheckCircle2, Bot, Wrench, Check, RefreshCw, Clock, Play, Target, ArrowDown, ArrowUp, Trash2, FileEdit } from 'lucide-react'

export default function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('import') // 'users' | 'import'
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  // Import state
  const [importFile, setImportFile] = useState(null)
  const [importSkill, setImportSkill] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [mockTests, setMockTests] = useState([])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tab === 'users') {
        const [u, s] = await Promise.all([getAdminUsers(), getAdminStats()])
        setUsers(u)
        setStats(s)
      } else {
        const tests = await getMockTests()
        setMockTests(tests)
      }
    } catch (err) {
      setError('Không thể tải dữ liệu: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [tab])

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa người dùng "${name}"?`)) return
    try {
      await deleteAdminUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      setActionMsg(`✅ Đã xóa user ${name}`)
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    }
    setTimeout(() => setActionMsg(''), 3000)
  }

  const handleRoleChange = async (id, newRole, name) => {
    try {
      await changeUserRole(id, newRole)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
      setActionMsg(`✅ Đã đổi role của ${name} thành ${newRole}`)
    } catch (err) {
      setActionMsg(`❌ ${err.message}`)
    }
    setTimeout(() => setActionMsg(''), 3000)
  }

  const handleImportPDF = async (e) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    setImportResult(null)
    setError('')
    try {
      const result = await importExamPDF(importFile, importSkill)
      setImportResult(result)
      setActionMsg(`✅ Import thành công: ${result.question_count} câu hỏi`)
      setImportFile(null)
      // Refresh mock tests list
      const tests = await getMockTests()
      setMockTests(tests)
    } catch (err) {
      setError('❌ Import thất bại: ' + err.message)
    } finally {
      setImporting(false)
    }
    setTimeout(() => setActionMsg(''), 5000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-accent-500" /> Admin Panel
          </h1>
          <p className="text-primary-300 text-sm mt-1">Xin chào, <span className="text-accent-400 font-semibold">{user?.name}</span></p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('import')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            tab === 'import' ? 'bg-accent-600/40 text-white' : 'text-primary-300 bg-white/5 hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4" /> Import Đề Thi
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            tab === 'users' ? 'bg-accent-600/40 text-white' : 'text-primary-300 bg-white/5 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" /> Quản lý Users
        </button>
      </div>

      {actionMsg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${
          actionMsg.startsWith('✅')
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {actionMsg}
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium border bg-red-500/10 border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      {/* ─── Import Tab ─── */}
      {tab === 'import' && (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" /> Import Đề Thi PDF
            </h2>
            <p className="text-primary-300 text-sm mb-4">
              Upload file PDF đề thi APTIS. AI sẽ tự động trích xuất câu hỏi và tạo Mock Test cho học viên làm bài.
            </p>

            <form onSubmit={handleImportPDF} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary-400 uppercase tracking-wider">Kỹ năng</label>
                  <select
                    value={importSkill}
                    onChange={(e) => setImportSkill(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-500 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 font-semibold">Tự động nhận diện</option>
                    <option value="grammar" className="bg-slate-900 font-semibold">Grammar & Vocabulary</option>
                    <option value="reading" className="bg-slate-900 font-semibold">Reading</option>
                    <option value="listening" className="bg-slate-900 font-semibold">Listening</option>
                    <option value="writing" className="bg-slate-900 font-semibold">Writing</option>
                    <option value="speaking" className="bg-slate-900 font-semibold">Speaking</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary-400 uppercase tracking-wider">File PDF</label>
                  <label className="block">
                    <div className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-3 ${
                      importFile
                        ? 'border-accent-500/50 bg-accent-500/5'
                        : 'border-white/10 hover:border-white/20 bg-white/2'
                    }`}>
                      {importFile ? (
                        <>
                          <Clipboard className="w-6 h-6 text-accent-400" />
                          <span className="text-accent-400 font-semibold text-sm truncate max-w-[200px]">{importFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Folder className="w-6 h-6 text-primary-400" />
                          <span className="text-primary-300 font-medium text-sm">Chọn file PDF...</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!importFile || importing}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {importing ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý... (có thể mất 10-30 giây)</> : <><Rocket className="w-5 h-5" /> Import Đề Thi</>}
              </button>
            </form>

            {/* Import result */}
            {importResult && (
              <div className={`mt-4 p-4 rounded-xl border ${
                importResult.parsed_by === 'manual_parser'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <h3 className={`font-bold mb-2 flex items-center gap-2 ${
                  importResult.parsed_by === 'manual_parser' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {importResult.parsed_by === 'manual_parser' ? <><AlertTriangle className="w-5 h-5" /> Import hoàn tất (parser thủ công)</> : <><CheckCircle2 className="w-5 h-5" /> Import thành công!</>}
                </h3>
                {importResult.note && (
                  <p className="text-yellow-300 text-xs mb-3 leading-relaxed">{importResult.note}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-primary-300">Tên bài thi:</div>
                  <div className="text-white font-medium">{importResult.title}</div>
                  <div className="text-primary-300">Số câu hỏi:</div>
                  <div className="text-white font-medium">{importResult.question_count}</div>
                  <div className="text-primary-300">Mock Test ID:</div>
                  <div className="text-white font-medium">#{importResult.id}</div>
                  <div className="text-primary-300">Phân tích bởi:</div>
                  <div className="text-white font-medium flex items-center gap-1">
                    {importResult.parsed_by === 'ai' ? <><Bot className="w-4 h-4" /> Gemini AI</> : <><Wrench className="w-4 h-4" /> Parser thủ công</>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mock Tests List */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-primary-400" /> Danh sách Mock Tests
            </h2>
            {loading ? (
              <div className="text-primary-300 text-sm text-center py-8">Đang tải...</div>
            ) : mockTests.length === 0 ? (
              <div className="text-primary-400 text-sm text-center py-8">Chưa có Mock Test nào. Hãy import đề thi PDF!</div>
            ) : (
              <div className="space-y-3">
                {mockTests.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                    <div>
                      <p className="text-white font-semibold">{t.title}</p>
                      <p className="text-primary-400 text-xs mt-1 flex items-center gap-1.5">
                        {new Date(t.created_at).toLocaleDateString('vi-VN')} · 
                        {t.status === 'completed' 
                          ? <span className="flex items-center gap-1 text-green-400"><Check className="w-3 h-3" /> Hoàn thành ({t.score}%)</span>
                          : t.status === 'in_progress'
                            ? <span className="flex items-center gap-1 text-yellow-400"><RefreshCw className="w-3 h-3" /> Đang làm</span>
                            : <span className="flex items-center gap-1 text-primary-400"><Clock className="w-3 h-3" /> Chưa bắt đầu</span>
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        t.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : t.status === 'in_progress'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-primary-500/20 text-primary-400'
                      }`}>
                        #{t.id}
                      </span>
                      <button
                        onClick={() => navigate('/mocktest', { state: { loadTestId: t.id } })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-accent-600/30 text-accent-300 hover:bg-accent-600/50 transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Làm bài
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Users Tab ─── */}
      {tab === 'users' && (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Tổng Users', value: stats.total_users, icon: <Users className="w-8 h-8 mx-auto" /> },
                { label: 'Câu hỏi', value: stats.total_questions, icon: <FileText className="w-8 h-8 mx-auto" /> },
                { label: 'Lượt làm bài', value: stats.total_answers, icon: <CheckCircle2 className="w-8 h-8 mx-auto text-success-400" /> },
                { label: 'Độ chính xác', value: `${stats.accuracy}%`, icon: <Target className="w-8 h-8 mx-auto text-accent-400" /> },
              ].map(s => (
                <div key={s.label} className="glass-card p-5 text-center">
                  <div className="mb-3 text-primary-400">{s.icon}</div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-primary-300 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Users Table */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-400" /> Danh sách người dùng
            </h2>

            {loading ? (
              <div className="text-primary-300 text-sm text-center py-8">Đang tải...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-primary-400 border-b border-white/10">
                      <th className="text-left pb-3 font-medium">Tên</th>
                      <th className="text-left pb-3 font-medium">Email</th>
                      <th className="text-left pb-3 font-medium">Role</th>
                      <th className="text-left pb-3 font-medium">Ngày tạo</th>
                      <th className="text-right pb-3 font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/2">
                        <td className="py-3 text-white font-medium">{u.name}</td>
                        <td className="py-3 text-primary-300">{u.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            u.role === 'admin'
                              ? 'bg-accent-500/20 text-accent-400'
                              : 'bg-primary-500/20 text-primary-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-primary-400 text-xs">
                          {new Date(u.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3 text-right space-x-2">
                          {u.id !== user?.id && (
                            <>
                              <button
                                onClick={() => handleRoleChange(u.id, u.role === 'admin' ? 'user' : 'admin', u.name)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-accent-600/20 text-accent-400 hover:bg-accent-600/40 transition-all flex items-center gap-1 inline-flex"
                              >
                                {u.role === 'admin' ? <><ArrowDown className="w-3.5 h-3.5" /> User</> : <><ArrowUp className="w-3.5 h-3.5" /> Admin</>}
                              </button>
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => handleDelete(u.id, u.name)}
                                  className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all flex items-center gap-1 inline-flex"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                                </button>
                              )}
                            </>
                          )}
                          {u.id === user?.id && (
                            <span className="text-xs text-primary-400 italic">Bạn</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
