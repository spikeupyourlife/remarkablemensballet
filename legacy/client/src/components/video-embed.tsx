import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Video } from "@shared/schema";

interface VideoEmbedProps {
  video: Video;
  featured?: boolean;
  showTitle?: boolean;
}

export default function VideoEmbed({ video, featured = false, showTitle = true }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Extract video ID from Vimeo URL
  const getVimeoVideoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const getVideoType = () => {
    if ((video as any).videoType) {
      return (video as any).videoType;
    }
    // Auto-detect based on URL
    if (video.videoUrl.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'youtube';
  };

  const parseTimeToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  };

  const buildEmbedUrl = () => {
    const videoType = getVideoType();
    const startTime = (video as any).startTime;
    const endTime = (video as any).endTime;

    if (videoType === 'vimeo') {
      const videoId = getVimeoVideoId(video.videoUrl);
      if (videoId) {
        let url = `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`;
        if (startTime) {
          const startSeconds = parseTimeToSeconds(startTime);
          url += `#t=${startSeconds}s`;
        }
        return url;
      }
    } else {
      const videoId = getYouTubeVideoId(video.videoUrl);
      if (videoId) {
        let url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        if (startTime) {
          const startSeconds = parseTimeToSeconds(startTime);
          if (startSeconds > 0) {
            url += `&start=${startSeconds}`;
          }
        }
        if (endTime) {
          const endSeconds = parseTimeToSeconds(endTime);
          if (endSeconds > 0) {
            url += `&end=${endSeconds}`;
          }
        }
        return url;
      }
    }
    return video.videoUrl;
  };

  const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl) || "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
  };

  const videoTypeInfo = getVideoType();
  const startTime = (video as any).startTime;
  const endTime = (video as any).endTime;

  return (
    <>
      <div className={`relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
        featured ? 'bg-midnight text-white' : 'bg-white'
      }`}>
        <div className="relative">
          <div className={`aspect-video bg-gray-200 ${featured ? 'bg-midnight/80' : ''}`}>
            <img 
              src={thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 flex items-center justify-center ${
              featured ? 'bg-midnight/40' : 'bg-black/40'
            } opacity-0 hover:opacity-100 transition-opacity duration-300`}>
              <Button 
                onClick={handlePlay}
                className={`${
                  featured 
                    ? 'bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full p-6 hover:bg-white/30' 
                    : 'bg-magenta text-white rounded-full p-4 hover:bg-midnight'
                } transition-all duration-300 transform hover:scale-110`}
              >
                <Play className={`${featured ? 'w-8 h-8' : 'w-6 h-6'} ml-1`} />
              </Button>
            </div>
          </div>
          
          {/* Video type and time info badge */}
          {(videoTypeInfo || startTime || endTime) && (
            <div className="absolute top-2 left-2 flex gap-1">
              {videoTypeInfo && (
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
                  {videoTypeInfo}
                </span>
              )}
              {startTime && (
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Start: {startTime}
                </span>
              )}
              {endTime && (
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  End: {endTime}
                </span>
              )}
            </div>
          )}
        </div>
        
        {showTitle && (
          <div className={`p-4 ${featured ? 'text-white' : ''}`}>
            <h3 className={`font-playfair ${featured ? 'text-xl sm:text-2xl' : 'text-lg'} font-semibold mb-2`}>
              {video.title}
            </h3>
            {video.description && (
              <p className={`${featured ? 'text-gray-300' : 'text-gray-600'} text-sm ${featured ? 'sm:text-base' : ''}`}>
                {video.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black" aria-describedby="video-player-description">
          <VisuallyHidden>
            <DialogTitle>Video Player</DialogTitle>
          </VisuallyHidden>
          <div className="sr-only" id="video-player-description">
            Video player for {video.title}
          </div>
          <div className="relative">
            <Button
              onClick={handleClose}
              className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
              aria-label="Close video player"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <div className="aspect-video">
              {isPlaying && (
                <iframe
                  src={buildEmbedUrl()}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; web-share; accelerometer; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                  className="rounded-lg"
                  title={video.title}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}