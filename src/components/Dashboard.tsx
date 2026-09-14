import React, { useState, useMemo } from 'react';
import { Tv, Filter } from 'lucide-react';

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  category?: string;
  language?: string;
}

interface DashboardProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

const ChannelCard: React.FC<{ channel: Channel; onClick: () => void }> = ({ channel, onClick }) => {
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="channel-card" onClick={onClick} onMouseMove={handleMouseMove}>
      <div className="channel-logo-wrapper">
        {channel.logo && !imgError ? (
          <img 
            src={channel.logo} 
            alt={`${channel.name} logo`} 
            onError={() => setImgError(true)}
          />
        ) : (
          <Tv size={32} className="logo-icon" />
        )}
      </div>
      
      <div className="channel-info">
        <span className="channel-name">{channel.name}</span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
          {channel.category && (
            <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
              {channel.category}
            </span>
          )}
          {channel.language && (
            <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
              {channel.language}
            </span>
          )}
        </div>
        <span className="channel-status" style={{ marginTop: '0.2rem' }}>
          <span className="live-dot"></span>
          Live Now
        </span>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ channels, onSelectChannel }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLanguage, setActiveLanguage] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(channels.map(c => c.category).filter(Boolean) as string[]);
    return ['All', ...Array.from(cats)].sort();
  }, [channels]);

  const languages = useMemo(() => {
    const langs = new Set(channels.map(c => c.language).filter(Boolean) as string[]);
    return ['All', ...Array.from(langs)].sort();
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchLanguage = activeLanguage === 'All' || c.language === activeLanguage;
      return matchCategory && matchLanguage;
    });
  }, [channels, activeCategory, activeLanguage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="filters-container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'var(--glass-bg)', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginRight: '1rem' }}>
          <Filter size={18} />
          <span style={{ fontWeight: 600 }}>Filters:</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category:</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'transparent' : 'rgba(255,255,255,0.1)',
                  padding: '0.4rem 1rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Language:</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                style={{
                  background: activeLanguage === lang ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.05)',
                  color: activeLanguage === lang ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: activeLanguage === lang ? 'transparent' : 'rgba(255,255,255,0.1)',
                  padding: '0.4rem 1rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="channel-grid">
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel) => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              onClick={() => onSelectChannel(channel)} 
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--glass-bg)', borderRadius: '1rem', border: '1px dashed var(--glass-border)' }}>
            No channels found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
