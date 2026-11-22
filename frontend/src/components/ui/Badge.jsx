// tone: success | warning | danger | info | neutral
export default function Badge({ tone = 'neutral', icon: Icon, children }) {
  return (
    <span className={`badge badge-${tone}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
