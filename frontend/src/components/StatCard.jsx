export default function StatCard({ icon: Icon, title, value, note, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
      <p className="stat-title">{title}</p>
      <div className="stat-value">{value}</div>
      <p className="stat-note">{note}</p>
    </article>
  )
}
