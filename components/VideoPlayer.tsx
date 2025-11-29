import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  startTime?: number;
  endTime?: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  autoPlayClip?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  startTime, 
  endTime, 
  onTimeUpdate, 
  onDurationChange,
  autoPlayClip = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync external Start Time changes (e.g., clicking a clip)
  useEffect(() => {
    if (videoRef.current && startTime !== undefined) {
      videoRef.current.currentTime = startTime;
      if (autoPlayClip) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [startTime, autoPlayClip]);

  // Handle clip end time enforcement
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);

      if (endTime && time >= endTime && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        // Reset to start of clip for replay convenience
        if (startTime !== undefined) {
          videoRef.current.currentTime = startTime;
        }
      }
    }
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

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      onDurationChange(dur);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-slate-700/50">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[60vh] object-contain mx-auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />
      
      {/* Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700/50 h-1.5 rounded-full mb-3 cursor-pointer overflow-hidden relative"
             onClick={(e) => {
               if(!videoRef.current) return;
               const rect = e.currentTarget.getBoundingClientRect();
               const pos = (e.clientX - rect.left) / rect.width;
               videoRef.current.currentTime = pos * duration;
             }}>
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-75"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          
          {/* Clip Indicators (Visual Markers on timeline) */}
          {startTime !== undefined && endTime !== undefined && duration > 0 && (
             <div 
               className="absolute top-0 h-full bg-yellow-400/50 pointer-events-none"
               style={{
                 left: `${(startTime / duration) * 100}%`,
                 width: `${((endTime - startTime) / duration) * 100}%`
               }}
             />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition">
              {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
            </button>
            <span className="text-xs font-medium text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button onClick={toggleMute} className="text-slate-300 hover:text-white transition">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
          
          <button className="text-slate-300 hover:text-white transition">
             <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
