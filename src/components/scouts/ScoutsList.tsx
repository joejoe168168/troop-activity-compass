
import React, { useEffect, useState } from "react";
import ScoutCard from "./ScoutCard";
import ScoutDetails from "./ScoutDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedScoutId, setSelectedScoutId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newScout, setNewScout] = useState({
    name: "",
    age: "",
    group_name: "",
    status: "active" as 'active' | 'suspended' | 'graduated',
    contact_email: "",
    contact_phone: "",
    parent_guardian_name: ""
  });

  const fetchScouts = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchScouts();
  }, []);

  const handleViewDetails = (id: string) => {
    setSelectedScoutId(id);
    setDetailsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewScout(prev => ({ ...prev, [name]: name === 'age' ? value : value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setNewScout(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('scouts')
        .insert({
          name: newScout.name,
          age: parseInt(newScout.age),
          group_name: newScout.group_name,
          status: newScout.status,
          contact_email: newScout.contact_email || null,
          contact_phone: newScout.contact_phone || null,
          parent_guardian_name: newScout.parent_guardian_name || null
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Scout added successfully");
      setCreateDialogOpen(false);
      setNewScout({
        name: "",
        age: "",
        group_name: "",
        status: "active",
        contact_email: "",
        contact_phone: "",
        parent_guardian_name: ""
      });
      fetchScouts();
    } catch (error) {
      console.error("Error adding scout:", error);
      toast.error("Failed to add scout");
    }
  };

  const filteredScouts = scouts.filter(scout => 
    scout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scout.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-scout-green-dark">Scouts</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-scout-green hover:bg-scout-green-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Scout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Scout</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newScout.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={newScout.age}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group_name" className="text-right">Patrol</Label>
                  <Input
                    id="group_name"
                    name="group_name"
                    value={newScout.group_name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select 
                    value={newScout.status} 
                    onValueChange={(value) => handleSelectChange(value, 'status')}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact_email" className="text-right">Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={newScout.contact_email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact_phone" className="text-right">Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={newScout.contact_phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parent_guardian_name" className="text-right">Parent/Guardian</Label>
                  <Input
                    id="parent_guardian_name"
                    name="parent_guardian_name"
                    value={newScout.parent_guardian_name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Scout</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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

      {/* Scout Details Dialog */}
      <ScoutDetails 
        scoutId={selectedScoutId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default ScoutsList;
