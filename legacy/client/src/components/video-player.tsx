import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Video } from "@shared/schema";

interface VideoPlayerProps {
  video: Video;
  featured?: boolean;
}

export default function VideoPlayer({ video, featured = false }: VideoPlayerProps) {
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

  const buildVideoUrl = () => {
    const videoType = getVideoType();
    const startTime = (video as any).startTime;
    const endTime = (video as any).endTime;

    if (videoType === 'vimeo') {
      const videoId = getVimeoVideoId(video.videoUrl);
      if (videoId) {
        let url = `https://player.vimeo.com/video/${videoId}`;
        if (startTime) {
          url += `#t=${startTime}`;
        }
        return url;
      }
    } else {
      const videoId = getYouTubeVideoId(video.videoUrl);
      if (videoId) {
        let url = `https://www.youtube.com/watch?v=${videoId}`;
        if (startTime) {
          // Convert time format for YouTube (e.g., "2m30s" to "150")
          const timeInSeconds = parseTimeToSeconds(startTime);
          if (timeInSeconds > 0) {
            url += `&t=${timeInSeconds}s`;
          }
        }
        return url;
      }
    }
    return video.videoUrl;
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

  const playVideo = () => {
    window.open(buildVideoUrl(), '_blank');
  };

  const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl);

  if (featured) {
    return (
      <Card className="bg-midnight rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-magenta/20 to-midnight/80 flex items-center justify-center">
            <img 
              src={thumbnailUrl || "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675"} 
              alt={video.title} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                onClick={playVideo}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6 text-white">
          <h3 className="font-playfair text-xl sm:text-2xl font-semibold mb-2">{video.title}</h3>
          <p className="text-gray-300 text-sm sm:text-base">{video.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-video bg-gray-200">
          <img 
            src={thumbnailUrl || "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-midnight/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Button 
              onClick={playVideo}
              className="bg-white text-midnight rounded-full p-3 transform hover:scale-110 transition-transform duration-200"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <h4 className="font-playfair text-base sm:text-lg font-semibold text-midnight mb-1">{video.title}</h4>
        <p className="text-gray-600 text-xs sm:text-sm">{video.description}</p>
      </CardContent>
    </Card>
  );
}
