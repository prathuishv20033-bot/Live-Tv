import { useState } from 'react';
import { Film } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

export interface Movie {
  id: string | number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  channelId: string;
  msgId: number;
}

// ---------------------------------------------------------
// ADD YOUR CURATED MOVIES HERE
// ---------------------------------------------------------
const MY_MOVIES: Movie[] = [
  {
    id: "dc-2026-tamil",
    title: "DC 2026 Tamil",
    poster_path: "https://m.media-amazon.com/images/M/MV5BMTc0MDYyNmYtZDJkNi00YzllLWJlNTctZDU3NTY1MzRhMWEzXkEyXkFqcGc@._V1_.jpg",
    channelId: "-1004376570919", 
    msgId: 4,
    release_date: "2026",
    vote_average: 8.5
  },
  {
    id: "telegram-movie-7",
    title: "New Telegram Movie (Msg 7)",
    poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500", // Generic poster
    channelId: "-1004376570919", 
    msgId: 7,
    release_date: "2024",
    vote_average: 7.0
  }
];
// ---------------------------------------------------------

export default function Movies() {
  const [movies] = useState<Movie[]>(MY_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (selectedMovie) {
    return (
      <MoviePlayer 
        movieId={selectedMovie.id.toString()} 
        movieTitle={selectedMovie.title}
        channelId={selectedMovie.channelId}
        msgId={selectedMovie.msgId}
        onBack={() => setSelectedMovie(null)} 
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Film className="text-primary" size={24} />
          Movies
        </h2>
      </div>

      <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="channel-card" 
              onClick={() => setSelectedMovie(movie)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div className="channel-logo-container" style={{ padding: 0, aspectRatio: '2/3', background: '#1e293b', overflow: 'hidden' }}>
                {movie.poster_path ? (
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Film size={48} />
                  </div>
                )}
              </div>
              <div className="channel-info" style={{ padding: '1rem' }}>
                <h3 className="channel-name" style={{ fontSize: '1rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#94a3b8' }}>
                  <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                  {movie.vote_average !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      
      {movies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          No movies added yet. Add them in Movies.tsx!
        </div>
      )}
    </div>
  );
}
