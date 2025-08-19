import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import PerformerCard from "@/components/performer-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Performer } from "@shared/schema";

export default function Performers() {
  const [selectedType, setSelectedType] = useState<string>("all");
  
  const { data: allPerformers, isLoading } = useQuery<Performer[]>({
    queryKey: ["/api/performers/current"],
  });

  const performers = allPerformers?.filter(performer => {
    if (selectedType === "all") return true;
    const personType = (performer as any).personType || "performer";
    return personType === selectedType;
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-midnight mb-6">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our talented performers and the dedicated people behind the scenes who bring our vision to life through their exceptional skill, passion, and dedication to the art of ballet.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by role:</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All team members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Members</SelectItem>
                <SelectItem value="performer">Performers</SelectItem>
                <SelectItem value="choreographer">Choreographers</SelectItem>
                <SelectItem value="makeup">Makeup Artists</SelectItem>
                <SelectItem value="assistant">Personal Assistants</SelectItem>
                <SelectItem value="fan">Fans</SelectItem>
                <SelectItem value="rookie">Rookies</SelectItem>
                <SelectItem value="director">Directors</SelectItem>
                <SelectItem value="producer">Producers</SelectItem>
                <SelectItem value="costume">Costume Designers</SelectItem>
                <SelectItem value="musician">Musicians</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedType !== "all" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedType("all")}
              className="text-sm"
            >
              Clear Filter
            </Button>
          )}
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
            <p className="text-gray-500 text-lg">
              {selectedType === "all" ? "No team members found." : `No ${selectedType}s found.`}
            </p>
            {selectedType !== "all" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedType("all")}
              >
                View All Team Members
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
