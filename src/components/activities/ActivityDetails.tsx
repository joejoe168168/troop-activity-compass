
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActivityDetailsProps {
  activityId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Scout {
  id: string;
  name: string;
  status: string;
}

interface RSVP {
  id: string;
  scout_id: string;
  activity_id: string;
  status: string;
  notes?: string | null;
  scout?: Scout;
}

const ActivityDetails = ({ activityId, open, onOpenChange }: ActivityDetailsProps) => {
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [attending, setAttending] = useState<number>(0);
  
  useEffect(() => {
    if (activityId && open) {
      fetchActivityDetails();
    }
  }, [activityId, open]);
  
  const fetchActivityDetails = async () => {
    if (!activityId) return;
    
    try {
      setLoading(true);
      
      // Fetch activity details
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();
      
      if (activityError) throw activityError;
      
      setActivity(activityData);
      
      // Fetch RSVPs with scout information
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvp')
        .select(`
          *,
          scout:scouts(id, name, status)
        `)
        .eq('activity_id', activityId);
      
      if (rsvpError) throw rsvpError;
      
      setRSVPs(rsvpData as RSVP[]);
      setAttending(rsvpData.filter((rsvp: RSVP) => rsvp.status === 'attending').length);
      
    } catch (error) {
      console.error("Error fetching activity details:", error);
      toast.error("Failed to load activity details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <p>Loading activity details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!activity) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p>Activity not found or no longer available.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{activity.title}</DialogTitle>
          <div className={`text-xs px-2 py-1 rounded-full font-medium inline-flex w-fit mt-1
            ${activity.type === 'hiking' ? 'bg-green-100 text-green-800' : 
            activity.type === 'training' ? 'bg-blue-100 text-blue-800' : 
            activity.type === 'service' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
            {activity.type}
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-scout-green" />
              <span>Date: <strong>{format(parseISO(activity.date), 'MMMM d, yyyy')}</strong></span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-scout-green" />
              <span>Time: <strong>{activity.time}</strong></span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-scout-green" />
              <span>Location: <strong>{activity.location}</strong></span>
            </div>
            {activity.capacity && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-scout-green" />
                <span>Capacity: <strong>{attending}/{activity.capacity}</strong></span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          
          {rsvps.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">RSVPs</h4>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                    <span>{rsvp.scout?.name}</span>
                    <Badge variant={rsvp.status === 'attending' ? 'default' : 'outline'} className={rsvp.status === 'attending' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                      {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetails;
