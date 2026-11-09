import {
  Brain,
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'My Interviews', icon: CalendarDays },
  { label: 'Practice', icon: Brain },
  { label: 'Reports', icon: ClipboardList },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Brain size={22} /></div>
        <div>
          <strong>AI Interview</strong>
          <span>Interview smarter</span>
        </div>
      </div>

      <div className="nav-caption">MENU</div>
      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button className={`nav-item ${active ? 'active' : ''}`} key={label}>
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item"><HelpCircle size={19} /><span>Help Center</span></button>
        <button className="nav-item"><Settings size={19} /><span>Settings</span></button>
        <div className="profile">
          <div className="avatar">NA</div>
          <div className="profile-info">
            <strong>Nguyen Anh</strong>
            <span>Candidate</span>
          </div>
          <LogOut size={17} className="logout-icon" />
        </div>
      </div>
    </aside>
  )
}
