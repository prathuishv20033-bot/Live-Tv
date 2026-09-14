import { useState } from 'react';
import { ArrowLeft, Server } from 'lucide-react';
import './MoviePlayer.css';

interface MoviePlayerProps {
  movieId: string;
  movieTitle: string;
  onBack: () => void;
}

const STREAMING_SERVERS = [
  { name: 'VidSrc ME', url: (id: string) => `https://vidsrc.me/embed/movie?tmdb=${id}` },
  { name: 'AutoEmbed', url: (id: string) => `https://autoembed.to/movie/tmdb/${id}` },
  { name: 'MultiEmbed', url: (id: string) => `https://multiembed.mov/?video_id=${id}&tmdb=1` },
  { name: 'VidSrc PRO', url: (id: string) => `https://vidsrc.pro/embed/movie/${id}` },
  { name: '2Embed', url: (id: string) => `https://www.2embed.cc/embed/${id}` }
];

export default function MoviePlayer({ movieTitle, movieId, onBack }: MoviePlayerProps) {
  const [activeServer, setActiveServer] = useState(0);

  return (
    <div className="player-page" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#000' }}>
      <div className="player-header" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#0f172a' }}>
        <button onClick={onBack} className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}>
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h2 className="channel-title" style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movieTitle}</h2>
      </div>
      
      <div className="video-wrapper" style={{ flex: 1, width: '100%', position: 'relative' }}>
        <iframe
          src={STREAMING_SERVERS[activeServer].url(movieId)}
          style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}
          allowFullScreen
          allow="autoplay; fullscreen"
          title={movieTitle}
        ></iframe>
      </div>

      <div className="server-selector" style={{ padding: '1rem', background: '#0f172a', display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>
          <Server size={16} />
          SERVERS:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {STREAMING_SERVERS.map((server, index) => (
            <button
              key={server.name}
              onClick={() => setActiveServer(index)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: activeServer === index ? '#e50914' : '#1e293b',
                color: activeServer === index ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeServer === index ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {server.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
