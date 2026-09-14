import { ArrowLeft, Loader2, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './MoviePlayer.css';

interface MoviePlayerProps {
  movieId: string;
  movieTitle: string;
  channelId: string;
  msgId: number;
  onBack: () => void;
}

export default function MoviePlayer({ movieTitle, channelId, msgId, onBack }: MoviePlayerProps) {
  const [isBuffering, setIsBuffering] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDragging(true);
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (duration) {
      setCurrentTime((newProgress / 100) * duration);
    }
  };

  const handleSeekCommit = () => {
    setIsDragging(false);
    if (videoRef.current && duration) {
      videoRef.current.currentTime = (progress / 100) * duration;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = Math.floor(timeInSeconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player-page">
      <div className="player-header" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#0f172a' }}>
        <button onClick={onBack} className="back-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer', fontSize: '1rem' }}>
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h2 className="channel-title" style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{movieTitle}</h2>
      </div>
      
      <div 
        ref={playerContainerRef}
        className="video-wrapper" 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        style={{ 
          height: isFullscreen ? '100vh' : 'calc(100vh - 72px)', 
          width: '100%',
          position: 'relative', 
          display: 'flex', 
          backgroundColor: '#000', 
          overflow: 'hidden' 
        }}
      >
        {isBuffering && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10, color: 'white' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: '#e50914', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Loading Stream...</h3>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={() => setIsBuffering(false)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
          onPause={() => setIsPlaying(false)}
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          src={`http://localhost:4000/stream?channelId=${encodeURIComponent(channelId)}&msgId=${msgId}`}
        >
          Your browser does not support HTML5 video.
        </video>

        {/* Custom Premium Controls Overlay */}
        <div 
          className={`premium-controls ${showControls || !isPlaying ? 'show' : 'hide'}`}
        >
          {/* Top gradient for back button visibility in fullscreen */}
          <div className="controls-top-gradient" />

          {/* Bottom controls area */}
          <div className="controls-bottom">
            {/* Progress Bar */}
            <div className="progress-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={progress}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="premium-progress-bar"
                style={{
                  background: `linear-gradient(to right, #e50914 ${progress}%, rgba(255, 255, 255, 0.2) ${progress}%)`
                }}
              />
            </div>
            
            <div className="controls-toolbar">
              <div className="toolbar-left">
                <button onClick={togglePlay} className="control-btn">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span className="time-separator">/</span>
                  <span className="time-duration">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="toolbar-right">
                <button onClick={toggleMute} className="control-btn">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button onClick={toggleFullscreen} className="control-btn">
                  {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
