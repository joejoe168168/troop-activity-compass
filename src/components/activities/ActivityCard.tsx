
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    date: Date;
    time: string;
    location: string;
    type: 'hiking' | 'training' | 'service' | 'other';
    description?: string;
    capacity?: number | null;
  };
  onViewDetails: (id: string) => void;
}

const ActivityCard = ({ activity, onViewDetails }: ActivityCardProps) => {
  return (
    <Card className="scout-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{activity.title}</h3>
          <div className={`text-xs px-2 py-1 rounded-full font-medium 
            ${activity.type === 'hiking' ? 'bg-green-100 text-green-800' : 
            activity.type === 'training' ? 'bg-blue-100 text-blue-800' : 
            activity.type === 'service' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
            {activity.type}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(activity.date, 'MMMM d, yyyy')} • {activity.time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{activity.location}</span>
          </div>
          {activity.capacity && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>Capacity: {activity.capacity}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm line-clamp-2">{activity.description}</p>
      </CardContent>
      
      <CardFooter className="bg-muted py-3 px-6">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-muted-foreground">
            {/* We'll implement this count later */}
            RSVP Available
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(activity.id)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
