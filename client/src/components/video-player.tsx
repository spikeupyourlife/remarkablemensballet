import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Video } from "@shared/schema";

interface VideoPlayerProps {
  video: Video;
  featured?: boolean;
}

export default function VideoPlayer({ video, featured = false }: VideoPlayerProps) {
  const playVideo = () => {
    // Extract video ID from YouTube URL
    const videoId = video.videoUrl.split('v=')[1]?.split('&')[0] || video.videoUrl.split('/').pop();
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (featured) {
    return (
      <Card className="bg-midnight rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-magenta/20 to-midnight/80 flex items-center justify-center">
            <img 
              src={video.thumbnailUrl || "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675"} 
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
        <CardContent className="p-6 text-white">
          <h3 className="font-playfair text-2xl font-semibold mb-2">{video.title}</h3>
          <p className="text-gray-300">{video.description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-video bg-gray-200">
          <img 
            src={video.thumbnailUrl || "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
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
      <CardContent className="p-4">
        <h4 className="font-playfair text-lg font-semibold text-midnight mb-1">{video.title}</h4>
        <p className="text-gray-600 text-sm">{video.description}</p>
      </CardContent>
    </Card>
  );
}
