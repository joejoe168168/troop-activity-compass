
import React, { useEffect, useState } from "react";
import ScoutCard from "./ScoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Scout {
  id: string;
  name: string;
  age: number;
  group_name: string;
  status: 'active' | 'suspended' | 'graduated';
}

const ScoutsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScouts = async () => {
      try {
        const { data, error } = await supabase
          .from('scouts')
          .select('*');
        
        if (error) {
          throw error;
        }

        // Cast the data to ensure the status is of the correct type
        const typedScouts = data?.map(scout => ({
          id: scout.id,
          name: scout.name,
          age: scout.age,
          group_name: scout.group_name,
          status: scout.status as 'active' | 'suspended' | 'graduated'
        })) || [];

        setScouts(typedScouts);
      } catch (error) {
        console.error("Error fetching scouts:", error);
        toast.error("Failed to load scouts");
      } finally {
        setLoading(false);
      }
    };

    fetchScouts();
  }, []);

  const handleViewDetails = (id: string) => {
    console.log(`View details for scout ${id}`);
  };

  const filteredScouts = scouts.filter(scout => 
    scout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scout.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-scout-green-dark">Scouts</h2>
        <Button className="bg-scout-green hover:bg-scout-green-dark">
          <Plus className="mr-2 h-4 w-4" /> Add Scout
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search scouts by name or patrol..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center p-10">
          <p>Loading scouts...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScouts.map((scout) => (
              <ScoutCard
                key={scout.id}
                scout={scout}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {filteredScouts.length === 0 && (
            <div className="text-center p-10 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No scouts found matching your search criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScoutsList;
