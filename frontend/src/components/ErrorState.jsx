export default function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="state-block state-error">
      <p>⚠ {message}</p>
    </div>
  );
}
