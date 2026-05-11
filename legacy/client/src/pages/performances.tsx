import { useQuery } from "@tanstack/react-query";
import PerformanceCard from "@/components/performance-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Performance } from "@shared/schema";

export default function Performances() {
  const { data: performances, isLoading } = useQuery<Performance[]>({
    queryKey: ["/api/performances"],
  });

  const upcomingPerformances = performances?.filter(p => new Date(p.date) >= new Date()) || [];
  const pastPerformances = performances?.filter(p => new Date(p.date) < new Date()) || [];

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">Performances</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our upcoming shows and relive the magic of our past performances.
          </p>
        </div>

        {isLoading ? (
          <div className="max-w-5xl mx-auto space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-pearl rounded-2xl p-6 md:p-8">
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  <Skeleton className="h-20 w-full" />
                  <div className="md:col-span-2 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Upcoming Performances */}
            {upcomingPerformances.length > 0 && (
              <div className="mb-16">
                <h2 className="font-playfair text-3xl font-semibold text-midnight mb-8 text-center">Upcoming Shows</h2>
                <div className="space-y-6">
                  {upcomingPerformances.map((performance) => (
                    <PerformanceCard key={performance.id} performance={performance} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Performances */}
            {pastPerformances.length > 0 && (
              <div>
                <h2 className="font-playfair text-3xl font-semibold text-midnight mb-8 text-center">Past Performances</h2>
                <div className="space-y-6">
                  {pastPerformances.map((performance) => (
                    <PerformanceCard key={performance.id} performance={performance} />
                  ))}
                </div>
              </div>
            )}

            {performances && performances.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No performances scheduled.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
