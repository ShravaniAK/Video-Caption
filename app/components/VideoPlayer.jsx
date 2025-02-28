import { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, captions, onTimeUpdate, isPlaying, setIsPlaying }) {
  const playerRef = useRef(null);
  const [currentCaption, setCurrentCaption] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  useEffect(() => {
    const activeCaption = captions.find(
      caption => 
        onTimeUpdate >= caption.startTime && 
        onTimeUpdate <= caption.endTime
    );
    
    setCurrentCaption(activeCaption);
  }, [captions, onTimeUpdate]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      onTimeUpdate(state.playedSeconds);
    }
  };
  
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };
  
  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };
  
  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    const seekTime = parseFloat(e.target.value);
    playerRef.current.seekTo(seekTime);
  };
  
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };
  
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    
    return `${mm}:${ss}`;
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'arrowright':
          e.preventDefault();
          playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
          break;
        case 'arrowleft':
          e.preventDefault();
          playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
          break;
        case 'm':
          e.preventDefault();
          setVolume(volume === 0 ? 0.8 : 0);
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume]);
  
  const handlePlayerMouseEnter = () => {
    setShowControls(true);
  };
  
  const handlePlayerMouseLeave = () => {
    setShowControls(false);
  };
  
  const duration = playerRef.current ? playerRef.current.getDuration() : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="relative aspect-video bg-black"
        onMouseEnter={handlePlayerMouseEnter}
        onMouseLeave={handlePlayerMouseLeave}
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          onProgress={handleProgress}
          progressInterval={100}
          className="absolute top-0 left-0"
        />
        
        {currentCaption && (
          <div className="absolute bottom-16 left-0 right-0 text-center px-4">
            <div className="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded text-lg max-w-full">
              {currentCaption.text}
            </div>
          </div>
        )}
        
        {showControls && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded">
            <p>Space: Play/Pause</p>
            <p>←/→: -5s/+5s</p>
            <p>M: Mute/Unmute</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-800 text-white">
        <div className="flex items-center mb-2">
          <button 
            onClick={handlePlayPause} 
            className="mr-3 focus:outline-none"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <div className="text-sm mr-3 w-16">{formatTime(onTimeUpdate)}</div>
          
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="flex-grow h-2 rounded-full"
          />
          
          <div className="text-sm ml-3 w-16">{formatTime(duration)}</div>
          
          <div className="ml-4 flex items-center">
            <button 
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="mr-2 focus:outline-none"
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


