import { useGreeting } from '../hooks/useGreeting';

export function GreetingCard() {
  const { message, loading, error } = useGreeting();

  return (
    <div className="card">
      <h2>API Response:</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {message && <p className="message">{message}</p>}
    </div>
  );
}
