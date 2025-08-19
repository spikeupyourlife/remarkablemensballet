import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PerformerRatingProps {
  performerId: string;
  currentRating: number;
  ratingCount: number;
  onRatingUpdate?: (newRating: number, newCount: number) => void;
}

export default function PerformerRating({ 
  performerId, 
  currentRating, 
  ratingCount,
  onRatingUpdate 
}: PerformerRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitRating = async (rating: number) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/performers/${performerId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        const data = await response.json();
        onRatingUpdate?.(data.averageRating, data.ratingCount);
        toast({
          title: "Rating submitted",
          description: `You rated this performer ${rating} stars`,
        });
      } else {
        throw new Error("Failed to submit rating");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="text-2xl transition-colors hover:scale-110 transform"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => submitRating(star)}
            disabled={isSubmitting}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoveredRating || currentRating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium">
          {currentRating > 0 ? (
            <>
              {currentRating.toFixed(1)} / 5
              <span className="text-muted-foreground ml-1">
                ({ratingCount} rating{ratingCount !== 1 ? 's' : ''})
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">No ratings yet</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Click to rate
        </div>
      </div>
    </div>
  );
}