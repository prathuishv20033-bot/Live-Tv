import { ArrowLeft } from 'lucide-react';
import './MoviePlayer.css';

interface MoviePlayerProps {
  movieId: string;
  movieTitle: string;
  onBack: () => void;
}

export default function MoviePlayer({ movieTitle, movieId, onBack }: MoviePlayerProps) {
  return (
    <div className="player-page">
      <div className="player-header" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#0f172a' }}>
        <button onClick={onBack} className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}>
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h2 className="channel-title" style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{movieTitle}</h2>
      </div>
      
      <div className="video-wrapper" style={{ height: 'calc(100vh - 72px)', width: '100%', backgroundColor: '#000' }}>
        <iframe
          src={`https://vidsrc.me/embed/movie?tmdb=${movieId}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen"
          title={movieTitle}
        ></iframe>
      </div>
    </div>
  );
}
