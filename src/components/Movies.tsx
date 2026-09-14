import { Film } from 'lucide-react';

export default function Movies() {
  return (
    <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
      <Film size={64} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
        Movies and Shows
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px' }}>
        This section is currently blank. Check back later for movies and TV shows!
      </p>
    </div>
  );
}
