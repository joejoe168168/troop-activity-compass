
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, X, MinusCircle, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Activity {
  id: string;
  title: string;
  date: Date;
  location: string;
}

interface Scout {
  id: string;
  name: string;
  group_name: string;
}

interface Attendance {
  id?: string;
  scout_id: string;
  activity_id: string;
  status: 'present' | 'absent' | 'excused';
  notes?: string | null;
}

const Attendance = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        const formattedActivities = data.map(activity => ({
          id: activity.id,
          title: activity.title,
          date: new Date(activity.date),
          location: activity.location
        }));
        
        setActivities(formattedActivities);
        
        // Auto-select the most recent activity
        if (formattedActivities.length > 0) {
          setSelectedActivity(formattedActivities[0].id);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("Failed to load activities");
      }
    };
    
    const fetchScouts = async () => {
      try {
        const { data, error } = await supabase
          .from('scouts')
          .select('*')
          .eq('status', 'active');
        
        if (error) throw error;
        
        setScouts(data.map(scout => ({
          id: scout.id,
          name: scout.name,
          group_name: scout.group_name
        })));
      } catch (error) {
        console.error("Error fetching scouts:", error);
        toast.error("Failed to load scouts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
    fetchScouts();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedActivity) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('activity_id', selectedActivity);
        
        if (error) throw error;
        
        // Convert attendance data to our format
        const attendanceMap = new Map();
        data.forEach(record => {
          attendanceMap.set(record.scout_id, {
            id: record.id,
            scout_id: record.scout_id,
            activity_id: record.activity_id,
            status: record.status,
            notes: record.notes
          });
        });
        
        // Create attendance records for all scouts, using existing data if available
        const attendanceRecords = scouts.map(scout => {
          if (attendanceMap.has(scout.id)) {
            return attendanceMap.get(scout.id);
          }
          return {
            scout_id: scout.id,
            activity_id: selectedActivity,
            status: 'absent' as 'absent'
          };
        });
        
        setAttendance(attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedActivity && scouts.length > 0) {
      fetchAttendance();
    }
  }, [selectedActivity, scouts]);

  const handleStatusChange = (scoutId: string, status: 'present' | 'absent' | 'excused') => {
    setAttendance(current => 
      current.map(record => 
        record.scout_id === scoutId 
          ? { ...record, status } 
          : record
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedActivity) return;
    
    try {
      setSaving(true);
      
      // Process records in batches
      for (const record of attendance) {
        if (record.id) {
          // Update existing record
          const { error } = await supabase
            .from('attendance')
            .update({
              status: record.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', record.id);
          
          if (error) throw error;
        } else {
          // Insert new record
          const { error } = await supabase
            .from('attendance')
            .insert({
              scout_id: record.scout_id,
              activity_id: record.activity_id,
              status: record.status
            });
          
          if (error) throw error;
        }
      }
      
      toast.success("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const selectedActivityDetails = activities.find(activity => activity.id === selectedActivity);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-scout-green-dark">Attendance Tracking</h1>
            <p className="text-muted-foreground">Record and manage scout attendance for activities</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.map(activity => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.title} ({format(activity.date, 'MMM d, yyyy')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="default" 
              className="bg-scout-green hover:bg-scout-green-dark flex items-center gap-2"
              onClick={saveAttendance}
              disabled={!selectedActivity || saving || loading}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </div>
        
        {selectedActivityDetails && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{selectedActivityDetails.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(selectedActivityDetails.date, 'MMMM d, yyyy')} • {selectedActivityDetails.location}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center p-10">
                  <p>Loading attendance records...</p>
                </div>
              ) : scouts.length === 0 ? (
                <div className="text-center p-10">
                  <p>No active scouts found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Scout Name</TableHead>
                      <TableHead className="w-[150px]">Patrol</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scouts.map(scout => {
                      const attendanceRecord = attendance.find(record => record.scout_id === scout.id);
                      const status = attendanceRecord?.status || 'absent';
                      
                      return (
                        <TableRow key={scout.id}>
                          <TableCell className="font-medium">{scout.name}</TableCell>
                          <TableCell>{scout.group_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant={status === 'present' ? 'default' : 'outline'}
                                className={status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                                onClick={() => handleStatusChange(scout.id, 'present')}
                              >
                                <Check size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={status === 'absent' ? 'default' : 'outline'}
                                className={status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                                onClick={() => handleStatusChange(scout.id, 'absent')}
                              >
                                <X size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={status === 'excused' ? 'default' : 'outline'}
                                className={status === 'excused' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                onClick={() => handleStatusChange(scout.id, 'excused')}
                              >
                                <MinusCircle size={16} />
                              </Button>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {status === 'present' ? 'Present' : 
                                 status === 'absent' ? 'Absent' : 'Excused'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
        
        {!selectedActivity && (
          <div className="text-center p-10 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">Please Select an Activity</h3>
            <p className="text-muted-foreground">Choose an activity from the dropdown to manage attendance</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Attendance;
