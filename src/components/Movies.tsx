import { useState, useEffect } from 'react';
import { Film, Loader2 } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

export interface Movie {
  id: string | number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (selectedMovie) {
    return (
      <MoviePlayer 
        movieId={selectedMovie.id.toString()} 
        movieTitle={selectedMovie.title}
        onBack={() => setSelectedMovie(null)} 
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Film className="text-primary" size={24} />
          Trending Movies
        </h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin text-primary" size={48} />
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
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
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
      )}
      
      {!isLoading && movies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Failed to load movies.
        </div>
      )}
    </div>
  );
}
