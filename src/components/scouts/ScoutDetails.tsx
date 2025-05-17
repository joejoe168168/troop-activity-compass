
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, User, Users, Activity, AlertCircle, Locate } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScoutDetailsProps {
  scoutId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Scout {
  id: string;
  name: string;
  age: number;
  group_name: string;
  status: 'active' | 'suspended' | 'graduated';
  join_date: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  parent_guardian_name: string | null;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  type: string;
  status: string; // from attendance records
}

const ScoutDetails = ({ scoutId, open, onOpenChange }: ScoutDetailsProps) => {
  const [scout, setScout] = useState<Scout | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (scoutId && open) {
      fetchScoutDetails();
    }
  }, [scoutId, open]);
  
  const fetchScoutDetails = async () => {
    if (!scoutId) return;
    
    try {
      setLoading(true);
      
      // Fetch scout details
      const { data: scoutData, error: scoutError } = await supabase
        .from('scouts')
        .select('*')
        .eq('id', scoutId)
        .single();
      
      if (scoutError) throw scoutError;
      setScout(scoutData);
      
      // Fetch activities with attendance status
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          id,
          status,
          activity_id,
          activities(id, title, date, type)
        `)
        .eq('scout_id', scoutId);
      
      if (attendanceError) throw attendanceError;
      
      // Transform the data to get the activity info with attendance status
      const transformedActivities = attendanceData.map((item: any) => ({
        id: item.activities.id,
        title: item.activities.title,
        date: item.activities.date,
        type: item.activities.type,
        status: item.status
      }));
      
      setActivities(transformedActivities);
      
    } catch (error) {
      console.error("Error fetching scout details:", error);
      toast.error("Failed to load scout details");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <p>Loading scout details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!scout) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p>Scout not found or no longer available.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-scout-green" />
            {scout.name}
          </DialogTitle>
          <Badge className={`w-fit 
            ${scout.status === 'active' ? 'bg-green-100 text-green-700' : 
             scout.status === 'suspended' ? 'bg-amber-100 text-amber-700' : 
             'bg-blue-100 text-blue-700'}`}>
            {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
          </Badge>
        </DialogHeader>
        
        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Basic Info</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-scout-green" />
                <span>Age: <strong>{scout.age}</strong></span>
              </div>
              <div className="flex items-center text-sm">
                <Locate className="h-4 w-4 mr-2 text-scout-green" />
                <span>Patrol: <strong>{scout.group_name}</strong></span>
              </div>
              {scout.join_date && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-scout-green" />
                  <span>Joined: <strong>{format(parseISO(scout.join_date), 'MMMM d, yyyy')}</strong></span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activities">
            {activities.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex flex-col">
                      <span className="font-medium">{activity.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(activity.date), 'MMM d, yyyy')} • {activity.type}
                      </span>
                    </div>
                    <Badge variant={activity.status === 'present' ? 'default' : 'outline'} 
                      className={activity.status === 'present' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                               activity.status === 'absent' ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100' : 
                               'bg-gray-100 text-gray-800'}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No activity records found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            {scout.contact_email || scout.contact_phone || scout.parent_guardian_name ? (
              <div className="space-y-3">
                {scout.parent_guardian_name && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-scout-green" />
                    <span>Parent/Guardian: <strong>{scout.parent_guardian_name}</strong></span>
                  </div>
                )}
                {scout.contact_email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-scout-green" />
                    <span>Email: <strong>{scout.contact_email}</strong></span>
                  </div>
                )}
                {scout.contact_phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-scout-green" />
                    <span>Phone: <strong>{scout.contact_phone}</strong></span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground">No contact information available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-3">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScoutDetails;
