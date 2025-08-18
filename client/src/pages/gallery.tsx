import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { GalleryPhoto } from "@shared/schema";

export default function Gallery() {
  const { data: photos, isLoading } = useQuery<GalleryPhoto[]>({
    queryKey: ["/api/gallery"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 font-serif">Gallery</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Loading stunning moments from our performances...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700 aspect-[3/4] rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 font-serif">Gallery</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover the artistry and passion behind every performance through our collection of memorable moments.
          </p>
        </div>

        {/* Gallery Grid */}
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <GalleryPhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Photos Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Our gallery is being curated. Check back soon for stunning photography from our performances.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface GalleryPhotoCardProps {
  photo: GalleryPhoto;
}

function GalleryPhotoCard({ photo }: GalleryPhotoCardProps) {
  const formatDate = (date: string | Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="group overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {photo.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {photo.title}
          </h3>
          {photo.description && (
            <p className="text-slate-400 text-sm line-clamp-2">
              {photo.description}
            </p>
          )}
        </div>

        {/* Show Details */}
        {(photo.showName || photo.showDate) && (
          <div className="space-y-2">
            {photo.showName && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>{photo.showName}</span>
              </div>
            )}
            {photo.showDate && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{formatDate(photo.showDate)}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="space-y-3">
          {photo.whoTags && photo.whoTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-medium text-pink-400 uppercase tracking-wide">Who</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whoTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {photo.whatTags && photo.whatTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">What</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whatTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {photo.whenTags && photo.whenTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-green-400 uppercase tracking-wide">When</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whenTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {photo.whereTags && photo.whereTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Where</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {photo.whereTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}