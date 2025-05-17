
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Search, Map, Locate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Location {
  name: string;
  usageCount: number; // Number of activities in this location
}

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      
      // Fetch unique locations from activities
      const { data, error } = await supabase
        .from('activities')
        .select('location');
        
      if (error) throw error;
      
      // Count occurrences of each location
      const locationCounts: Record<string, number> = {};
      data.forEach(item => {
        const location = item.location;
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      });
      
      // Convert to array format for display
      const formattedLocations = Object.entries(locationCounts).map(([name, usageCount]) => ({
        name,
        usageCount
      }));
      
      setLocations(formattedLocations);
      
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddLocation = () => {
    // In a real app, this would create a new activity at this location
    if (!newLocation.trim()) {
      toast.error("Please enter a location name");
      return;
    }
    
    setLocations(prev => [...prev, { name: newLocation, usageCount: 0 }]);
    toast.success(`Location "${newLocation}" added successfully`);
    setNewLocation("");
    setDialogOpen(false);
  };
  
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-scout-green-dark">Locations</h2>
            <p className="text-muted-foreground">Manage activity locations</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-scout-green hover:bg-scout-green-dark">
                <Plus className="mr-2 h-4 w-4" /> Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Name</Label>
                  <Input 
                    id="location" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g., Mountain Trail Park"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddLocation}>Add Location</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="text-center p-10">
            <p>Loading locations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.name} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">{location.name}</CardTitle>
                  <MapPin className="h-4 w-4 text-scout-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Used in <span className="font-medium text-foreground">{location.usageCount}</span> {location.usageCount === 1 ? 'activity' : 'activities'}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Map className="mr-2 h-4 w-4" /> View Activities
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {filteredLocations.length === 0 && !loading && (
              <div className="col-span-full text-center p-10 border border-dashed rounded-lg">
                <Locate className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No locations found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Locations;
