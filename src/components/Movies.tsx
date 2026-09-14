import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  channelId: string;
  msgId: number;
  customTitle?: string;
  customPoster?: string;
}

// ---------------------------------------------------------
// ADD YOUR CURATED MOVIES HERE
// ---------------------------------------------------------
const MY_MOVIES = [
  {
    tmdbId: 437342, // You can keep a random TMDB ID just for basic data
    customTitle: "DC 2026 Tamil", // Overrides the TMDB title
    customPoster: "https://m.media-amazon.com/images/M/MV5BMTc0MDYyNmYtZDJkNi00YzllLWJlNTctZDU3NTY1MzRhMWEzXkEyXkFqcGc@._V1_.jpg", // Custom superhero poster
    channelId: "-1004376570919", 
    msgId: 4 
  }
];
// ---------------------------------------------------------

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setError('Please add your TMDB API key to the .env file');
      return;
    }
    fetchCuratedMovies();
  }, []);

  const fetchCuratedMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedMovies = await Promise.all(
        MY_MOVIES.map(async (movieReq) => {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieReq.tmdbId}?api_key=${API_KEY}`);
          if (!response.ok) throw new Error(`Failed to fetch movie ID ${movieReq.tmdbId}`);
          const data = await response.json();
          return {
            ...data,
            title: movieReq.customTitle || data.title,
            poster_path: movieReq.customPoster || data.poster_path, // override poster
            channelId: movieReq.channelId,
            msgId: movieReq.msgId
          };
        })
      );
      setMovies(fetchedMovies);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #334155', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
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
                    src={movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && movies.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          No movies added yet. Add them in Movies.tsx!
        </div>
      )}
    </div>
  );
}
