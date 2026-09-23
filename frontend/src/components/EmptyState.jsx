export default function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="state-block state-empty">
      <p>{message}</p>
    </div>
  );
}
