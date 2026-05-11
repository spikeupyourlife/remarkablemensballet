import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Performance } from "@shared/schema";

interface PerformanceCardProps {
  performance: Performance;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getMonthDay = (date: Date) => {
    const d = new Date(date);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.getDate()
    };
  };

  const { month, day } = getMonthDay(performance.date);

  const handleBookTickets = () => {
    if (performance.ticketUrl) {
      window.open(performance.ticketUrl, '_blank');
    }
  };

  return (
    <Card className="bg-pearl rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-4 gap-6 items-center">
          <div className="text-center md:text-left">
            <div className="text-3xl font-bold text-magenta">{month}</div>
            <div className="text-4xl font-bold text-midnight">{day}</div>
            <div className="text-gray-600">{new Date(performance.date).getFullYear()}</div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-playfair text-2xl font-semibold text-midnight mb-2">{performance.title}</h3>
            <p className="text-gray-600 mb-2">{performance.venue}</p>
            <p className="text-sm text-gray-500">{performance.description}</p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-lg font-semibold text-midnight mb-2">{performance.time}</div>
            <Button 
              onClick={handleBookTickets}
              className="bg-magenta text-white hover:bg-magenta/80 transition-colors duration-300 font-medium px-6 py-3 rounded-full"
            >
              Book Tickets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
