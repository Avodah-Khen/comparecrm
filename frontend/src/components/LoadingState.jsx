export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="state-block">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
