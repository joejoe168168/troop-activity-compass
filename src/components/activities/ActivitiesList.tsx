
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import ActivityCard from "./ActivityCard";

interface Activity {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: 'hiking' | 'training' | 'service' | 'other';
  attendees: number;
  description: string;
}

const dummyActivities: Activity[] = [
  {
    id: "1",
    title: "Weekend Hiking Trip",
    date: new Date(2025, 5, 25),
    time: "8:00 AM",
    location: "Mountain Trail Park",
    type: "hiking",
    attendees: 15,
    description: "A day-long hiking trip to explore the northern trails. Bring water, lunch, and appropriate hiking gear."
  },
  {
    id: "2",
    title: "First Aid Training",
    date: new Date(2025, 5, 18),
    time: "4:00 PM",
    location: "Scout Hall",
    type: "training",
    attendees: 22,
    description: "Basic first aid training session with practical exercises. This is mandatory for all scouts aiming for the safety badge."
  },
  {
    id: "3",
    title: "Community Garden Cleanup",
    date: new Date(2025, 5, 20),
    time: "10:00 AM",
    location: "Community Garden",
    type: "service",
    attendees: 12,
    description: "Help clean and prepare the community garden for summer planting. Tools will be provided."
  },
  {
    id: "4",
    title: "Knot Tying Workshop",
    date: new Date(2025, 5, 22),
    time: "6:00 PM",
    location: "Scout Hall",
    type: "training",
    attendees: 18,
    description: "Learn essential knots and rope skills for camping and climbing activities."
  },
  {
    id: "5",
    title: "Overnight Camping Trip",
    date: new Date(2025, 6, 5),
    time: "2:00 PM",
    location: "Lakeside Campground",
    type: "hiking",
    attendees: 25,
    description: "Weekend camping trip with activities including swimming, hiking, and campfire cooking. Permission slips required."
  }
];

const ActivitiesList = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activityType, setActivityType] = React.useState<string>("");

  const handleViewDetails = (id: string) => {
    console.log(`View details for activity ${id}`);
  };

  const filteredActivities = dummyActivities
    .filter(activity => 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(activity => 
      activityType === "" || activity.type === activityType
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-scout-green-dark">Activities</h2>
        <Button className="bg-scout-green hover:bg-scout-green-dark">
          <Plus className="mr-2 h-4 w-4" /> Create Activity
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities by title or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={activityType} onValueChange={setActivityType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="hiking">Hiking</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      {filteredActivities.length === 0 && (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No activities found matching your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesList;
