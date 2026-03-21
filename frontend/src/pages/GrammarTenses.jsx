import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Activity, Flag, PenTool, CheckCircle, ChevronDown, ChevronUp, BookOpen, Layers, Lightbulb } from 'lucide-react'
import { ADVANCED_GRAMMAR, STUDY_TIPS } from '../data/grammarData'

const TENSES_DATA = [
  // PRESENT TENSES
  {
    id: 'grammar_present_simple',
    group: 'PRESENT',
    name: 'Hiện Tại Đơn (Present Simple)',
    formula: '(+) S + V(s/es) | S + am/is/are\n(-) S + do/does + not + V | S + am/is/are + not\n(?) Do/Does + S + V? | Am/Is/Are + S?',
    usage: '- Diễn tả thói quen, hành động lặp đi lặp lại.\n- Sự thật hiển nhiên, chân lý.\n- Lịch trình, thời gian biểu cố định.',
    signals: 'always, usually, often, sometimes, rarely, every day/week...',
    examples: '- I usually go to school by bus.\n- The sun rises in the east.\n- The train leaves at 8 AM tomorrow.'
  },
  {
    id: 'grammar_present_continuous',
    group: 'PRESENT',
    name: 'Hiện Tại Tiếp Diễn (Present Continuous)',
    formula: '(+) S + am/is/are + V-ing\n(-) S + am/is/are + not + V-ing\n(?) Am/Is/Are + S + V-ing?',
    usage: '- Diễn tả hành động đang xảy ra tại thời điểm nói.\n- Sự việc đang diễn ra xung quanh thời điểm nói.\n- Một kế hoạch sắp xảy ra trong tương lai gần (có dự định từ trước).',
    signals: 'now, right now, at the moment, at present, Look!, Listen!...',
    examples: '- She is studying English right now.\n- We are meeting our friends tonight.'
  },
  {
    id: 'grammar_present_perfect',
    group: 'PRESENT',
    name: 'Hiện Tại Hoàn Thành (Present Perfect)',
    formula: '(+) S + have/has + V3/ed\n(-) S + have/has + not + V3/ed\n(?) Have/Has + S + V3/ed?',
    usage: '- Hành động xảy ra trong quá khứ kéo dài đến hiện tại.\n- Hành động vừa mới xảy ra.\n- Trải nghiệm, kinh nghiệm cho tới nay.',
    signals: 'already, yet, just, ever, never, since, for, recently, so far...',
    examples: '- I have lived here for 5 years.\n- She has just finished her homework.'
  },
  {
    id: 'grammar_present_perfect_continuous',
    group: 'PRESENT',
    name: 'Hiện Tại Hoàn Thành Tiếp Diễn (Present Perfect Continuous)',
    formula: '(+) S + have/has + been + V-ing\n(-) S + have/has + not + been + V-ing\n(?) Have/Has + S + been + V-ing?',
    usage: '- Nhấn mạnh quá trình, khoảng thời gian của một hành động bắt đầu từ quá khứ và vẫn tiếp tục ở hiện tại (hoặc vừa mới kết thúc).',
    signals: 'all day, all week, for a long time, since, for...',
    examples: '- It has been raining all morning.\n- I have been working on this project for 3 hours.'
  },

  // PAST TENSES
  {
    id: 'grammar_past_simple',
    group: 'PAST',
    name: 'Quá Khứ Đơn (Past Simple)',
    formula: '(+) S + V2/ed | S + was/were\n(-) S + did + not + V | S + was/were + not\n(?) Did + S + V? | Was/Were + S?',
    usage: '- Hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ.\n- Thói quen trong quá khứ.',
    signals: 'yesterday, last night/week, [time] ago, in 1990...',
    examples: '- I visited Paris last year.\n- She bought a new car two days ago.'
  },
  {
    id: 'grammar_past_continuous',
    group: 'PAST',
    name: 'Quá Khứ Tiếp Diễn (Past Continuous)',
    formula: '(+) S + was/were + V-ing\n(-) S + was/were + not + V-ing\n(?) Was/Were + S + V-ing?',
    usage: '- Đang làm gì tại một thời điểm xác định trong quá khứ.\n- Hành động đang xảy ra thì có hành động khác xen vào (hành động đang xảy ra dùng QKTD, xen vào dùng QKĐ).',
    signals: 'at [time] yesterday, when, while...',
    examples: '- I was watching TV at 8 PM last night.\n- While I was walking, I saw him.'
  },
  {
    id: 'grammar_past_perfect',
    group: 'PAST',
    name: 'Quá Khứ Hoàn Thành (Past Perfect)',
    formula: '(+) S + had + V3/ed\n(-) S + had + not + V3/ed\n(?) Had + S + V3/ed?',
    usage: '- Diễn tả một hành động xảy ra trước một hành động khác trong quá khứ (hành động xảy ra trước dùng QKHT, sau dùng QKĐ).',
    signals: 'before, after, by the time, as soon as, when...',
    examples: '- By the time we arrived, the train had left.\n- I had finished my work before I went out.'
  },
  {
    id: 'grammar_past_perfect_continuous',
    group: 'PAST',
    name: 'Quá Khứ Hoàn Thành Tiếp Diễn (Past Perfect Cont.)',
    formula: '(+) S + had + been + V-ing\n(-) S + had + not + been + V-ing\n(?) Had + S + been + V-ing?',
    usage: '- Nhấn mạnh quá trình của một hành động xảy ra trước một thời điểm hoặc một hành động khác trong quá khứ.',
    signals: 'for, since, before, until then...',
    examples: '- He had been waiting for 2 hours before she arrived.\n- They had been playing football until it rained.'
  },

  // FUTURE TENSES
  {
    id: 'grammar_future_simple',
    group: 'FUTURE',
    name: 'Tương Lai Đơn (Future Simple)',
    formula: '(+) S + will + V\n(-) S + will + not + V\n(?) Will + S + V?',
    usage: '- Diễn đạt quyết định nảy ra ngay lúc nói.\n- Đưa ra một dự đoán không có cơ sở chắc chắn.\n- Lời hứa, đề nghị.',
    signals: 'tomorrow, next week, soon, probably, think, hope...',
    examples: '- I will help you with this project.\n- I think it will rain tomorrow.'
  },
  {
    id: 'grammar_future_continuous',
    group: 'FUTURE',
    name: 'Tương Lai Tiếp Diễn (Future Continuous)',
    formula: '(+) S + will + be + V-ing\n(-) S + will + not + be + V-ing\n(?) Will + S + be + V-ing?',
    usage: '- Đang làm gì tại một thời điểm xác định trong tương lai.',
    signals: 'at this time tomorrow, at 9 AM next Monday...',
    examples: '- At 8 PM tomorrow, I will be having dinner.\n- We will be flying to London at this time next week.'
  },
  {
    id: 'grammar_future_perfect',
    group: 'FUTURE',
    name: 'Tương Lai Hoàn Thành (Future Perfect)',
    formula: '(+) S + will + have + V3/ed\n(-) S + will + not + have + V3/ed\n(?) Will + S + have + V3/ed?',
    usage: '- Hành động sẽ hoàn thành trước một thời điểm hoặc hành động khác trong tương lai.',
    signals: 'by the end of, by the time, before [time in future]...',
    examples: '- I will have finished the report by Friday.\n- By the time you arrive, I will have cooked dinner.'
  },
  {
    id: 'grammar_future_perfect_continuous',
    group: 'FUTURE',
    name: 'Tương Lai HT Tiếp Diễn (Future Perfect Cont.)',
    formula: '(+) S + will + have + been + V-ing\n(-) S + will + not + have + been + V-ing\n(?) Will + S + have + been + V-ing?',
    usage: '- Nhấn mạnh tính liên tục của một hành động kéo dài tới một thời điểm cụ thể trong tương lai.',
    signals: 'for [time] by [future time]...',
    examples: '- By next month, I will have been working here for 5 years.'
  }
]

function TenseCard({ tense }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${open ? 'ring-2 ring-primary-500' : 'hover:border-primary-500/50'}`}>
      <div 
        onClick={() => setOpen(!open)}
        className="p-5 cursor-pointer flex justify-between items-center group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-300 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">{tense.name}</h3>
        </div>
        {open ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
      </div>

      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-4 animate-fade-in bg-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-accent-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Công thức (Formula)</h4>
              <p className="text-emerald-100 font-mono font-bold bg-black/30 px-4 py-3 rounded-xl break-words whitespace-pre-wrap leading-loose shadow-inner">{tense.formula}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-yellow-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><Flag className="w-4 h-4" /> Dấu hiệu (Signals)</h4>
              <p className="text-primary-200 text-sm leading-relaxed">{tense.signals}</p>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><Activity className="w-4 h-4" /> Cách dùng (Usage)</h4>
            <pre className="text-primary-100 text-sm whitespace-pre-wrap font-sans">{tense.usage}</pre>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="text-blue-400 font-bold mb-2 uppercase text-xs tracking-wider flex items-center gap-2"><PenTool className="w-4 h-4" /> Ví dụ (Examples)</h4>
            <pre className="text-primary-100 text-sm whitespace-pre-wrap font-sans italic">{tense.examples}</pre>
          </div>

          <div className="pt-4 flex justify-end">
             <Link 
               to={`/practice/${tense.id}`} 
               className="btn-glow bg-gradient-to-r from-accent-600 to-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
             >
               Làm Bài Tập <ArrowLeft className="w-5 h-5 rotate-180" />
             </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function AdvancedCard({ topic }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${open ? 'ring-2 ring-emerald-500' : 'hover:border-emerald-500/50'}`}>
      <div 
        onClick={() => setOpen(!open)}
        className="p-5 cursor-pointer flex justify-between items-center group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">{topic.name}</h3>
        </div>
        {open ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
      </div>

      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-4 animate-fade-in bg-black/10 text-primary-100 text-sm leading-relaxed overflow-x-auto">
          {topic.content}
          <div className="pt-4 flex justify-end">
             <Link 
               to={`/practice/${topic.id}`} 
               className="btn-glow bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
             >
               Làm Bài Tập <ArrowLeft className="w-5 h-5 rotate-180" />
             </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function TipsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {STUDY_TIPS.map(tip => (
        <div key={tip.id} className="glass-card p-6 border-yellow-500/30 bg-yellow-500/5 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-500">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">{tip.title}</h3>
          <p className="text-primary-200 text-sm leading-relaxed">{tip.content}</p>
        </div>
      ))}
    </div>
  )
}

export default function GrammarTenses({ isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('TENSES') // TENSES, ADVANCED, TIPS
  const [filter, setFilter] = useState('ALL') // ALL, PRESENT, PAST, FUTURE

  const displayedTenses = filter === 'ALL' ? TENSES_DATA : TENSES_DATA.filter(t => t.group === filter)

  return (
    <div className={`max-w-5xl mx-auto space-y-8 animate-fade-in relative ${isEmbedded ? '' : 'pb-10'}`}>
      {/* Header */}
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/practice" className="text-primary-300 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary-400" /> English Grammar Hub
              </h1>
              <p className="text-primary-300 mt-1">Từ 12 Thì Cơ Bản đến các Chủ Điểm Ngữ Pháp Nâng Cao</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex gap-2 bg-black/40 p-2 rounded-2xl w-max border border-white/10 shadow-inner overflow-x-auto max-w-full">
        <button onClick={() => setActiveTab('TENSES')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'TENSES' ? 'bg-primary-600 text-white shadow-lg' : 'text-primary-400 hover:text-white hover:bg-white/10'}`}>12 Thì Cơ Bản</button>
        <button onClick={() => setActiveTab('ADVANCED')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'ADVANCED' ? 'bg-emerald-600 text-white shadow-lg' : 'text-primary-400 hover:text-white hover:bg-white/10'}`}>Ngữ Pháp Nâng Cao</button>
        <button onClick={() => setActiveTab('TIPS')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'TIPS' ? 'bg-yellow-600 text-white shadow-lg' : 'text-primary-400 hover:text-white hover:bg-white/10'}`}>Mẹo Học Hiệu Quả</button>
      </div>

      {/* Tenses View */}
      {activeTab === 'TENSES' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl w-max border border-white/10 overflow-x-auto max-w-full">
            {['ALL', 'PRESENT', 'PAST', 'FUTURE'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${filter === f ? 'bg-primary-600 text-white shadow-lg' : 'text-primary-300 hover:text-white hover:bg-white/10'}`}
              >
                {f === 'ALL' ? 'Tất cả 12 Thì' : `${f} TENSES`}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {displayedTenses.map(tense => (
              <TenseCard key={tense.id} tense={tense} />
            ))}
            {displayedTenses.length === 0 && (
              <p className="text-center text-primary-300 py-10">No tenses found for this filter.</p>
            )}
          </div>
        </div>
      )}

      {/* Advanced Grammar View */}
      {activeTab === 'ADVANCED' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {ADVANCED_GRAMMAR.map(topic => (
            <AdvancedCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      {/* Study Tips View */}
      {activeTab === 'TIPS' && (
        <TipsView />
      )}
    </div>
  )
}
