import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Content } from "@shared/schema";

export default function About() {
  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ["/api/content/about"],
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-16" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : content ? (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">
              {content.title || "About Us"}
            </h1>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
              {content.content || "Content not available."}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              About content is being updated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}