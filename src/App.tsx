import { useState, useEffect } from 'react';
import { Tv, Film } from 'lucide-react';
import Dashboard, { type Channel } from './components/Dashboard';
import Player from './components/Player';
import Movies from './components/Movies';
import './index.css';

// Initial channels list without logos
const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'history-tv-18',
    name: 'History TV 18',
    url: 'https://amg01448-amg01448c16-samsung-in-3495.playouts.now.amagi.tv/ts-ap-s1-n1/playlist/amg01448-samsungindia-historychannelhindi-samsungin/playlist.m3u8',
  },
  {
    id: 'asianet-movies-hd',
    name: 'Asianet Movies HD',
    url: 'https://da86m1sqpm3o0.cloudfront.net/28072023/smil:asianetmovies1.smil/playlist.m3u8',
  },
  {
    id: 'mazhavil-manorama-hd',
    name: 'Mazhavil Manorama HD',
    url: 'https://mmtv-vglivessai.akamaized.net/v1/master/673630b269b766886555eebfddd4f27f3de3ab50/f8a0827f-030f-4a0d-b7e5-338996c09a5b/index.m3u8',
  },
  {
    id: 'asianet-hd',
    name: 'Asianet HD',
    url: 'https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/AsianetHD.m3u8',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    url: 'https://dai.google.com/linear/hls/event/JCAm25qkRXiKcK1AJMlvKQ/master.m3u8',
  },
  {
    id: 'tune-6-music',
    name: 'Tune 6 Music',
    url: 'https://stream.d6-pro.com/tunes6music/live/video.m3u8',
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'tv' | 'movies'>('tv');
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        // Fetch the open-source IPTV database which contains logos for thousands of channels
        const response = await fetch('https://iptv-org.github.io/api/channels.json');
        const apiChannels = await response.json();

        setChannels(prevChannels => 
          prevChannels.map(ch => {
            // Skip if it already has a logo
            if (ch.logo) return ch;

            // Simple search to match channel names (ignoring case and extra spaces)
            const searchName = ch.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            const match = apiChannels.find((apiCh: any) => {
              if (!apiCh.name || !apiCh.logo) return false;
              const apiName = apiCh.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              return apiName.includes(searchName) || searchName.includes(apiName);
            });

            if (match && match.website) {
              try {
                const domain = new URL(match.website).hostname;
                return { ...ch, logo: `https://logo.clearbit.com/${domain}` };
              } catch (e) {
                // Ignore invalid URLs
              }
            }

            return ch;
          })
        );
      } catch (error) {
        console.error("Failed to fetch channel logos:", error);
      }
    };

    fetchLogos();
  }, []);

  const handleSelectChannel = (channel: Channel) => {
    setActiveChannel(channel);
  };

  const handleBack = () => {
    setActiveChannel(null);
  };

  return (
    <div className="app-container">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo-section">
          <Tv size={28} className="logo-icon" />
          <h1 className="app-title">LiveTV</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => { setActiveTab('tv'); setActiveChannel(null); }}
            style={{ 
              background: activeTab === 'tv' ? '#3b82f6' : 'transparent', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500'
            }}
          >
            <Tv size={18} /> Live TV
          </button>
          <button 
            onClick={() => { setActiveTab('movies'); setActiveChannel(null); }}
            style={{ 
              background: activeTab === 'movies' ? '#3b82f6' : 'transparent', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '500'
            }}
          >
            <Film size={18} /> Movies
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'tv' ? (
          activeChannel ? (
            <Player 
              url={activeChannel.url} 
              channelName={activeChannel.name} 
              onBack={handleBack} 
            />
          ) : (
            <Dashboard 
              channels={channels} 
              onSelectChannel={handleSelectChannel} 
            />
          )
        ) : (
          <Movies />
        )}
      </main>
    </div>
  );
}

export default App;
