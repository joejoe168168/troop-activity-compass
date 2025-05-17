
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";

interface ScoutCardProps {
  scout: {
    id: string;
    name: string;
    age: number;
    group_name: string;
    status: 'active' | 'suspended' | 'graduated';
  };
  onViewDetails: (id: string) => void;
}

const ScoutCard = ({ scout, onViewDetails }: ScoutCardProps) => {
  return (
    <Card className="scout-card overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="bg-scout-green/20 p-4 rounded-full">
            <User className="text-scout-green h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-lg">{scout.name}</h3>
            <p className="text-muted-foreground text-sm">
              Age: {scout.age} • {scout.group_name}
            </p>
          </div>
        </div>
        <div className="px-4 pb-4 flex items-center justify-between">
          <Badge variant="outline" className={`
            ${scout.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : ''}
            ${scout.status === 'suspended' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
            ${scout.status === 'graduated' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
          `}>
            {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
          </Badge>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-muted p-4 flex justify-between">
        <Button variant="ghost" className="text-xs" onClick={() => onViewDetails(scout.id)}>
          View Details
        </Button>
        <Button variant="ghost" className="text-xs">
          Activity History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScoutCard;
