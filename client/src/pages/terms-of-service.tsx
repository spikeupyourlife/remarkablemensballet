import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Content } from "@shared/schema";

export default function TermsOfService() {
  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ["/api/content/terms-of-service"],
  });

  return (
    <div className="pt-20 min-h-screen bg-pearl">
      <div className="container mx-auto px-6 py-20">
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : content ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-5xl font-bold text-midnight mb-8 text-center">
              {content.title || "Terms of Service"}
            </h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content.content || "Terms of service content is being updated. Please check back soon."}
              </div>
            </div>
            <div className="text-center mt-8 text-sm text-gray-500">
              Last updated: {content.updatedAt ? new Date(content.updatedAt).toLocaleDateString() : "Unknown"}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-5xl font-bold text-midnight mb-8 text-center">Terms of Service</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <p className="text-xl text-gray-600 leading-relaxed">
                Terms of service content is being updated. Please check back soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}