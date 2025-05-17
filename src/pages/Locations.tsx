
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Locations = () => {
  // We'll extract unique locations from activities
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('location');
        
        if (error) throw error;
        
        // Extract unique locations
        const uniqueLocations = Array.from(new Set(data.map(item => item.location)))
          .sort();
        
        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location => 
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-scout-green-dark">Locations</h1>
          <Button className="bg-scout-green hover:bg-scout-green-dark">
            <Plus className="mr-2 h-4 w-4" /> Add Location
          </Button>
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
            {filteredLocations.map((location, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-scout-green" />
                    {location}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm">View Activities</Button>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredLocations.length === 0 && (
              <div className="col-span-full text-center p-10 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No locations found matching your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Locations;
