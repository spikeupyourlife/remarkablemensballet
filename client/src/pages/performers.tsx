import { useQuery } from "@tanstack/react-query";
import PerformerCard from "@/components/performer-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Performer } from "@shared/schema";

export default function Performers() {
  const { data: performers, isLoading } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">Our Performers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the talented artists who bring our vision to life through their exceptional skill, passion, and dedication to the art of ballet.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : performers && performers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {performers.map((performer) => (
              <PerformerCard key={performer.id} performer={performer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No performers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
