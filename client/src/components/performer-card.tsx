import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Performer } from "@shared/schema";

interface PerformerCardProps {
  performer: Performer;
}

export default function PerformerCard({ performer }: PerformerCardProps) {
  return (
    <Card className="group bg-pearl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img 
          src={performer.imageUrl || "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"} 
          alt={performer.name} 
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-playfair text-2xl font-semibold text-midnight mb-2">{performer.name}</h3>
        <p className="text-magenta font-medium mb-3">{performer.role}</p>
        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {performer.bio}
        </p>
        <Button 
          variant="ghost" 
          className="mt-4 text-magenta hover:text-midnight font-medium p-0 h-auto"
        >
          Read Full Bio <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
