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
    logo: 'https://images.seeklogo.com/logo-png/50/1/history-tv18-logo-png_seeklogo-508443.png',
    category: 'Entertainment',
    language: 'Hindi'
  },
  {
    id: 'asianet-movies-hd',
    name: 'Asianet Movies HD',
    url: 'https://da86m1sqpm3o0.cloudfront.net/28072023/smil:asianetmovies1.smil/playlist.m3u8',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDH2PFnOBRFUx-Pyp4Txhb0MJiV3HtldeBBtgvwbxLXg&s=10',
    category: 'Movies',
    language: 'Malayalam'
  },
  {
    id: 'mazhavil-manorama-hd',
    name: 'Mazhavil Manorama HD',
    url: 'https://mmtv-vglivessai.akamaized.net/v1/master/673630b269b766886555eebfddd4f27f3de3ab50/f8a0827f-030f-4a0d-b7e5-338996c09a5b/index.m3u8',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiZVwFjqH-k_gNWepCf7Eirq8z7nzx04wv6k5AVTHlJA&s=10',
    category: 'Entertainment',
    language: 'Malayalam'
  },
  {
    id: 'asianet-hd',
    name: 'Asianet HD',
    url: 'https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/AsianetHD.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Asianet_2023_logo.png',
    category: 'Entertainment',
    language: 'Malayalam'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    url: 'https://dai.google.com/linear/hls/event/JCAm25qkRXiKcK1AJMlvKQ/master.m3u8',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAXTETLw3D9gay6IuBuOpUdciX0RPbgtPyP15Y94JH3p0jo4y7swqCDCd&s=10',
    category: 'Music',
    language: 'Hindi'
  },
  {
    id: 'tune-6-music',
    name: 'Tune 6 Music',
    url: 'https://stream.d6-pro.com/tunes6music/live/video.m3u8',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUxq7MNDfVpvGAB8Ab_KBmzaT7uBKvOXmyQfnOWoM4K1upX7uxwdvN-OI&s=10',
    category: 'Music',
    language: 'Malayalam'
  },
  {
    id: 'flo-racing',
    name: 'FLO Racing',
    url: 'https://amg02278-amg02278c1-distrotv-us-7534.playouts.now.amagi.tv/playlist/amg02278-flosports-floracing24x7-distrotvus/playlist.m3u8',
    category: 'Sports',
    language: 'English'
  },
  {
    id: 'asianet-middle-east',
    name: 'Asianet Middle East',
    url: 'https://mumt03.tangotv.in/Dsly5z3HASIANETMIDDLEEAST/index.m3u8',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBHP7PqLOTcmG0btPT4dc0VShNLq0Yw-vmnWqqYiKDjw&s',
    category: 'Entertainment',
    language: 'Malayalam'
  },
  {
    id: 'epic-bharat-digital',
    name: 'Epic Bharat Digital',
    url: 'https://cc-p1izg43bk7sj5.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-p1izg43bk7sj5/DIYC/PMSL/IN10/Nazara_IN_B/Nazara_IN_B.m3u8',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCurRP1xC1l7mmTGXSqvcXPLzrKsIoTjNm2OV33jspCQ&s=10',
    category: 'Entertainment',
    language: 'Hindi'
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

            if (match && match.logo) {
              return { ...ch, logo: match.logo };
            } else if (match && match.website) {
              try {
                const domain = new URL(match.website).hostname;
                return { ...ch, logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=256` };
              } catch (e) {
                // Ignore invalid URLs
              }
            } else {
              // Try to use Google Favicon with a guessed domain if no website in API
              const guessedDomain = `${ch.name.toLowerCase().replace(/\s+/g, '')}.com`;
              return { ...ch, logo: `https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=256` };
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
      <header className="app-header">
        <div className="logo-section">
          <img src="/golive_logo.jpg" alt="GoLive India" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <h1 className="app-title">GoLive India</h1>
        </div>
        <div className="desktop-nav">
          <button 
            className={`nav-button ${activeTab === 'tv' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tv'); setActiveChannel(null); }}
          >
            <Tv size={18} /> Live TV
          </button>
          <button 
            className={`nav-button ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => { setActiveTab('movies'); setActiveChannel(null); }}
          >
            <Film size={18} /> Movies & Shows
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <button 
          className={`mobile-nav-btn ${activeTab === 'tv' ? 'active' : ''}`}
          onClick={() => { setActiveTab('tv'); setActiveChannel(null); }}
        >
          <Tv size={24} />
          <span>Live TV</span>
        </button>
        <button 
          className={`mobile-nav-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => { setActiveTab('movies'); setActiveChannel(null); }}
        >
          <Film size={24} />
          <span>Movies & Shows</span>
        </button>
      </nav>

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
