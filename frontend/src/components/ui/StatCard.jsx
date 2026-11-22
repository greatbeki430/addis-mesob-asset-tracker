export default function StatCard({ icon: Icon, label, value, hint, tone = 'primary' }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-card__value">{value ?? '—'}</div>
        <div className="stat-card__label">{label}</div>
        {hint && <div className="stat-card__hint">{hint}</div>}
      </div>
    </div>
  );
}
