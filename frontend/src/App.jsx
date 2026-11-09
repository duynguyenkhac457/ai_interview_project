import { useEffect, useMemo, useState } from 'react'
import {
  Bell, Search, Plus, CalendarCheck, ChartNoAxesColumnIncreasing,
  Clock3, Trophy, ArrowUpRight, MoreHorizontal, Sparkles, X,
  BriefcaseBusiness, Trash2, RefreshCw,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, BarChart, Bar,
} from 'recharts'
import Sidebar from './components/Sidebar.jsx'
import StatCard from './components/StatCard.jsx'
import { getDashboardStats, getInterviews, createInterview, deleteInterview } from './services/interviewService.js'

const fallbackStats = {
  total_interviews: 12,
  completed_interviews: 8,
  average_score: 82,
  practice_hours: 16,
  weekly_activity: [
    { day: 'Mon', interviews: 2 },
    { day: 'Tue', interviews: 3 },
    { day: 'Wed', interviews: 1 },
    { day: 'Thu', interviews: 4 },
    { day: 'Fri', interviews: 2 },
    { day: 'Sat', interviews: 5 },
    { day: 'Sun', interviews: 3 },
  ],
  score_trend: [
    { month: 'Jan', score: 58 },
    { month: 'Feb', score: 64 },
    { month: 'Mar', score: 69 },
    { month: 'Apr', score: 72 },
    { month: 'May', score: 78 },
    { month: 'Jun', score: 82 },
  ],
}

const fallbackInterviews = [
  { id: 1, title: 'Frontend Developer', company: 'Tech Company', level: 'Junior', status: 'completed', score: 86, created_at: '2026-11-08' },
  { id: 2, title: 'Python Developer', company: 'AI Solutions', level: 'Middle', status: 'in_progress', score: null, created_at: '2026-11-07' },
  { id: 3, title: 'UI/UX Designer', company: 'Creative Studio', level: 'Junior', status: 'completed', score: 78, created_at: '2026-11-05' },
]

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function App() {
  const [stats, setStats] = useState(fallbackStats)
  const [interviews, setInterviews] = useState(fallbackInterviews)
  const [apiConnected, setApiConnected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', company: '', level: 'Junior' })
  const [submitting, setSubmitting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const [dashboard, list] = await Promise.all([getDashboardStats(), getInterviews()])
      setStats(dashboard)
      setInterviews(list)
      setApiConnected(true)
    } catch {
      setApiConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const completed = useMemo(
    () => interviews.filter((item) => item.status === 'completed').length,
    [interviews],
  )

  async function handleCreate(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const created = await createInterview(form)
      setInterviews((current) => [created, ...current])
      setShowModal(false)
      setForm({ title: '', company: '', level: 'Junior' })
      await loadData()
    } catch {
      alert('Không thể tạo phỏng vấn. Hãy kiểm tra Backend và kết nối MySQL.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa buổi phỏng vấn này?')) return
    try {
      await deleteInterview(id)
      setInterviews((current) => current.filter((item) => item.id !== id))
      await loadData()
    } catch {
      alert('Không thể xóa phỏng vấn. Hãy kiểm tra kết nối Backend.')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Pages</span><b>/</b><strong>Dashboard</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={17} /><input placeholder="Search anything..." /></div>
            <button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="avatar small">NA</div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Welcome back, Nguyen Anh <span>👋</span></h1>
            <p className="subheading">Here’s what’s happening with your interview preparation.</p>
          </div>
          <div className="heading-actions">
            <span className={`connection ${apiConnected ? 'online' : 'offline'}`}>
              <span />{apiConnected ? 'API Connected' : 'Demo data'}
            </span>
            <button className="secondary-button" onClick={loadData}><RefreshCw size={16} /> Refresh</button>
            <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={18} /> New Interview</button>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard icon={CalendarCheck} title="Total Interviews" value={stats.total_interviews ?? interviews.length} note={`${completed} completed`} tone="blue" />
          <StatCard icon={Trophy} title="Average Score" value={`${stats.average_score ?? 0}%`} note="Across completed interviews" tone="purple" />
          <StatCard icon={Clock3} title="Practice Hours" value={`${stats.practice_hours ?? 0}h`} note="Time invested in practice" tone="orange" />
          <StatCard icon={ChartNoAxesColumnIncreasing} title="Completion Rate" value={`${stats.total_interviews ? Math.round((completed / stats.total_interviews) * 100) : 0}%`} note="Keep up the momentum" tone="green" />
        </section>

        <section className="charts-grid">
          <article className="panel score-panel">
            <div className="panel-heading">
              <div><h2>Performance Overview</h2><p>Your interview score progress</p></div>
              <button className="more-button"><MoreHorizontal size={20} /></button>
            </div>
            <div className="chart-legend"><span><i className="legend-dot purple-dot" />Score</span><span className="trend-label"><ArrowUpRight size={15} /> Improving</span></div>
            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.score_trend || fallbackStats.score_trend} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7566e8" stopOpacity={0.24} /><stop offset="95%" stopColor="#7566e8" stopOpacity={0.01} /></linearGradient></defs>
                  <CartesianGrid stroke="#edf0f6" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#98a0b3', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#98a0b3', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#7566e8" strokeWidth={3} fill="url(#scoreFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-heading">
              <div><h2>Weekly Activity</h2><p>Your practice this week</p></div>
              <button className="more-button"><MoreHorizontal size={20} /></button>
            </div>
            <div className="activity-total"><strong>{(stats.weekly_activity || fallbackStats.weekly_activity).reduce((sum, item) => sum + item.interviews, 0)}</strong><span>sessions</span></div>
            <div className="activity-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weekly_activity || fallbackStats.weekly_activity} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#edf0f6" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#98a0b3', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#98a0b3', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="interviews" fill="#a49af4" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="panel interviews-panel">
          <div className="panel-heading">
            <div><h2>Recent Interviews</h2><p>Track your latest interview sessions</p></div>
            <button className="text-button">View all <ArrowUpRight size={16} /></button>
          </div>
          {loading ? <div className="empty-state">Loading interview data...</div> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>INTERVIEW</th><th>LEVEL</th><th>DATE</th><th>STATUS</th><th>SCORE</th><th /></tr></thead>
                <tbody>
                  {interviews.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td><div className="interview-title"><div className="job-icon"><BriefcaseBusiness size={18} /></div><div><strong>{item.title}</strong><span>{item.company || 'Personal practice'}</span></div></div></td>
                      <td>{item.level}</td>
                      <td>{formatDate(item.created_at)}</td>
                      <td><span className={`status ${item.status}`}>{item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In progress' : 'Scheduled'}</span></td>
                      <td>{item.score == null ? '—' : <strong>{item.score}%</strong>}</td>
                      <td><button className="delete-button" title="Delete interview" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                  {interviews.length === 0 && <tr><td colSpan="6" className="empty-state">Chưa có buổi phỏng vấn nào. Hãy tạo buổi đầu tiên!</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="ai-banner">
          <div className="ai-banner-icon"><Sparkles size={24} /></div>
          <div><h3>Ready to level up your interview skills?</h3><p>Start a new AI-powered practice session and get personalized feedback.</p></div>
          <button className="banner-button" onClick={() => setShowModal(true)}>Start practicing <ArrowUpRight size={16} /></button>
        </section>
      </main>

      {showModal && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowModal(false)}>
          <form className="modal" onSubmit={handleCreate}>
            <div className="modal-heading"><div><h2>Create interview</h2><p>Set up your next practice session.</p></div><button type="button" className="icon-button" onClick={() => setShowModal(false)}><X size={19} /></button></div>
            <label>Job position<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Frontend Developer" /></label>
            <label>Company (optional)<input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Inc." /></label>
            <label>Experience level<select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option>Intern</option><option>Junior</option><option>Middle</option><option>Senior</option></select></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Cancel</button><button disabled={submitting} className="primary-button" type="submit">{submitting ? 'Creating...' : 'Create interview'}</button></div>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
