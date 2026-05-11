import { useQuery } from "@tanstack/react-query";
import VideoEmbed from "@/components/video-embed";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video } from "@shared/schema";

export default function Videos() {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const featuredVideos = videos?.filter(video => video.featured) || [];
  const regularVideos = videos?.filter(video => !video.featured) || [];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">Video Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the beauty and artistry of our performances through our curated collection of videos.
          </p>
        </div>

        {isLoading ? (
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Featured Video Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            {/* Regular Videos Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            {/* Featured Videos */}
            {featuredVideos.length > 0 && (
              <div className="mb-16">
                <h2 className="font-playfair text-3xl font-semibold text-midnight mb-8 text-center">Featured Performances</h2>
                <div className="space-y-8">
                  {featuredVideos.map((video) => (
                    <VideoEmbed key={video.id} video={video} featured={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Videos */}
            {regularVideos.length > 0 && (
              <div>
                <h2 className="font-playfair text-3xl font-semibold text-midnight mb-8 text-center">All Videos</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularVideos.map((video) => (
                    <VideoEmbed key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No videos found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
