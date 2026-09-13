import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface PlayerProps {
  url: string;
  channelName: string;
  onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ url, channelName, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let hls: Hls;

    if (videoRef.current) {
      const video = videoRef.current;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      if (Hls.isSupported()) {
        hls = new Hls({ maxBufferLength: 30 });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.error("Auto-play prevented", e));
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.error("Auto-play prevented", e));
        });
      }

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);

      // Handle screen orientation for mobile devices
      if (window.screen && window.screen.orientation) {
        if (isFs) {
          try {
            // @ts-ignore - The types might not have lock defined depending on the TS config
            window.screen.orientation.lock('landscape').catch((e) => {
              console.warn("Screen orientation lock is not supported on this device.", e);
            });
          } catch (e) {
            console.warn("Screen orientation lock failed.", e);
          }
        } else {
          try {
            // @ts-ignore
            window.screen.orientation.unlock();
          } catch (e) {
            console.warn("Screen orientation unlock failed.", e);
          }
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    // Hide controls initially if playing after a delay
    handleMouseMove();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="player-view">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
      
      <div 
        className="player-container" 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video 
          ref={videoRef} 
          className="player-wrapper" 
          style={{ width: '100%', height: '100%', backgroundColor: '#000', cursor: showControls ? 'default' : 'none' }}
          onClick={togglePlay}
          playsInline
        />
        
        {/* Custom Controls Overlay */}
        <div className={`custom-controls ${showControls ? 'visible' : 'hidden'}`}>
          <div className="controls-top">
            <span className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </span>
          </div>
          
          <div className="controls-bottom">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <div className="control-divider"></div>
            
            <span className="control-channel-name">{channelName}</span>
            
            <div className="controls-spacer"></div>
            
            <button className="control-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            
            <button className="control-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="now-playing-info">
        <div>
          <h2>{channelName}</h2>
          <p>Live TV Streaming</p>
        </div>
      </div>
    </div>
  );
};

export default Player;
