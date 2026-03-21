import { Link } from 'react-router-dom'
import { PenTool, BookOpen, Headset, Edit3, Mic } from 'lucide-react'

const skills = [
  { id: 'grammar', label: 'Grammar', icon: <PenTool className="w-8 h-8" />, desc: 'Multiple choice grammar exercises', color: 'skill-grammar' },
  { id: 'reading', label: 'Reading', icon: <BookOpen className="w-8 h-8" />, desc: 'Comprehension & matching tasks', color: 'skill-reading' },
  { id: 'listening', label: 'Listening', icon: <Headset className="w-8 h-8" />, desc: 'Audio comprehension practice', color: 'skill-listening' },
  { id: 'writing', label: 'Writing', icon: <Edit3 className="w-8 h-8" />, desc: 'Essay & email writing', color: 'skill-writing' },
  { id: 'speaking', label: 'Speaking', icon: <Mic className="w-8 h-8" />, desc: 'Record & review your speech', color: 'skill-speaking' },
]

export default function SkillCard({ skill: skillId }) {
  const skill = skills.find(s => s.id === skillId) || skills[0]

  return (
    <Link
      to={skill.id === 'grammar' ? '/grammar' : `/practice/${skill.id}`}
      className="glass-card p-6 flex flex-col items-center text-center group cursor-pointer"
    >
      <div className={`w-16 h-16 rounded-2xl ${skill.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
        {skill.icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{skill.label}</h3>
      <p className="text-sm text-primary-300">{skill.desc}</p>
    </Link>
  )
}

export { skills }
