
import React from "react";
import ScoutCard from "./ScoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface Scout {
  id: string;
  name: string;
  age: number;
  group: string;
  status: 'active' | 'suspended' | 'graduated';
}

const dummyScouts: Scout[] = [
  { id: "1", name: "Alex Johnson", age: 12, group: "Wolf Patrol", status: "active" },
  { id: "2", name: "Sam Williams", age: 14, group: "Eagle Patrol", status: "active" },
  { id: "3", name: "Jordan Smith", age: 13, group: "Fox Patrol", status: "suspended" },
  { id: "4", name: "Taylor Brown", age: 15, group: "Bear Patrol", status: "active" },
  { id: "5", name: "Casey Davis", age: 16, group: "Eagle Patrol", status: "graduated" },
  { id: "6", name: "Riley Wilson", age: 12, group: "Wolf Patrol", status: "active" },
];

const ScoutsList = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleViewDetails = (id: string) => {
    console.log(`View details for scout ${id}`);
  };

  const filteredScouts = dummyScouts.filter(scout => 
    scout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scout.group.toLowerCase().includes(searchTerm.toLowerCase())
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
    </div>
  );
};

export default ScoutsList;
