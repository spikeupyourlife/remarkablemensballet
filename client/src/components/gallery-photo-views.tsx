import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GalleryPhotoViewsProps {
  views: number;
  className?: string;
}

export default function GalleryPhotoViews({ views, className = "" }: GalleryPhotoViewsProps) {
  return (
    <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
      <Eye className="w-3 h-3" />
      <span className="text-xs">
        {views.toLocaleString()} view{views !== 1 ? 's' : ''}
      </span>
    </Badge>
  );
}

// Hook to track photo views
export function useTrackPhotoView(photoId: string) {
  const trackView = async () => {
    try {
      await fetch(`/api/gallery/${photoId}/view`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Failed to track photo view:", error);
    }
  };

  return trackView;
}