import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Performer } from "@shared/schema";
import PerformerRating from "./performer-rating";
import { useQueryClient } from "@tanstack/react-query";

interface PerformerCardProps {
  performer: Performer;
}

export default function PerformerCard({ performer }: PerformerCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleRatingUpdate = (newRating: number, newCount: number) => {
    // Invalidate performers cache to refresh the data
    queryClient.invalidateQueries({ queryKey: ["/api/performers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/performers/current"] });
    queryClient.invalidateQueries({ queryKey: ["/api/performers/featured"] });
  };

  return (
    <>
      <Card className="group bg-pearl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        <div className="relative overflow-hidden">
          <img 
            src={performer.imageUrl || "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"} 
            alt={performer.name} 
            className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {performer.featured && (
            <Badge className="absolute top-4 left-4 bg-gold text-midnight px-3 py-1 text-xs font-medium">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-midnight mb-2">{performer.name}</h3>
          <p className="text-magenta font-medium mb-3 text-sm sm:text-base">{performer.role}</p>
          <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4 text-sm sm:text-base">
            {performer.bio}
          </p>
          <Button 
            variant="ghost" 
            className="mt-4 text-magenta hover:text-midnight font-medium p-0 h-auto"
            onClick={() => setIsDialogOpen(true)}
          >
            Read Full Bio <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4" aria-describedby="performer-bio">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl text-midnight">
              {performer.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:w-1/3">
                <img 
                  src={performer.imageUrl || "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"} 
                  alt={performer.name} 
                  className="w-full rounded-lg object-cover"
                />
              </div>
              
              <div className="sm:w-2/3 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-magenta text-white px-3 py-1">
                    {performer.role}
                  </Badge>
                  {performer.featured && (
                    <Badge className="bg-gold text-midnight px-3 py-1">
                      Featured Performer
                    </Badge>
                  )}
                </div>
                
                <div className="mb-4">
                  <PerformerRating
                    performerId={performer.id}
                    currentRating={(performer as any).rating || 0}
                    ratingCount={(performer as any).ratingCount || 0}
                    onRatingUpdate={handleRatingUpdate}
                  />
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <p id="performer-bio" className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {performer.bio}
                  </p>
                </div>
              </div>
            </div>
            
            {performer.galleryImages && performer.galleryImages.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-playfair text-lg font-semibold text-midnight">
                  Gallery
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {performer.galleryImages.map((imageUrl, index) => (
                    <img 
                      key={index}
                      src={imageUrl} 
                      alt={`${performer.name} gallery image ${index + 1}`}
                      className="w-full aspect-square rounded-lg object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
