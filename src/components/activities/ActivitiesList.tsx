
import React, { useEffect, useState } from "react";
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
import ActivityDetails from "./ActivityDetails";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Updated to match the data structure from Supabase
interface Activity {
  id: string;
  title: string;
  date: string; // Changed from Date to string to match Supabase
  time: string;
  location: string;
  type: string; // Changed from union type to string to match Supabase
  description: string | null;
  capacity: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const ActivitiesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activityType, setActivityType] = useState<string>("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "hiking" as 'hiking' | 'training' | 'service' | 'other',
    capacity: ""
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*');
      
      if (error) {
        throw error;
      }

      // No need to transform date objects now as we're storing them as strings
      setActivities(data as Activity[]);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleViewDetails = (id: string) => {
    setSelectedActivityId(id);
    setDetailsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewActivity(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          title: newActivity.title,
          description: newActivity.description,
          date: newActivity.date, // Store as ISO string
          time: newActivity.time,
          location: newActivity.location,
          type: newActivity.type,
          capacity: newActivity.capacity ? parseInt(newActivity.capacity) : null
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Activity created successfully");
      setCreateDialogOpen(false);
      setNewActivity({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        type: "hiking",
        capacity: ""
      });
      fetchActivities();
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to create activity");
    }
  };

  const filteredActivities = activities
    .filter(activity => 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(activity => 
      activityType === "all" || activity.type === activityType
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-scout-green-dark">Activities</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-scout-green hover:bg-scout-green-dark">
              <Plus className="mr-2 h-4 w-4" /> Create Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newActivity.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newActivity.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newActivity.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={newActivity.time}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newActivity.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select 
                    value={newActivity.type} 
                    onValueChange={(value) => handleSelectChange(value, 'type')}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={newActivity.capacity}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Activity</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="hiking">Hiking</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="text-center p-10">
          <p>Loading activities...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
      
      {/* Activity Details Dialog */}
      <ActivityDetails 
        activityId={selectedActivityId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default ActivitiesList;
