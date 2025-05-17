import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Scout {
  id: string;
  name: string;
  age: number;
  group_name: string;
  status: string;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  type: string;
  capacity?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  location: string;
  time: string;
  description?: string | null;
}

interface Attendance {
  id: string;
  scout_id: string;
  activity_id: string;
  status: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [scoutsByPatrol, setScoutsByPatrol] = useState<{name: string, value: number}[]>([]);
  const [scoutsByStatus, setScoutsByStatus] = useState<{name: string, value: number}[]>([]);
  const [activityData, setActivityData] = useState<{name: string, count: number}[]>([]);
  const [attendanceData, setAttendanceData] = useState<{name: string, present: number, absent: number, excused: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch scouts
        const { data: scoutsData, error: scoutsError } = await supabase
          .from('scouts')
          .select('*');
        
        if (scoutsError) throw scoutsError;
        
        // Fetch activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*');
        
        if (activitiesError) throw activitiesError;
        
        // Fetch attendance
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('*');
        
        if (attendanceError) throw attendanceError;
        
        // Process scouts by patrol
        const patrolCounts: Record<string, number> = {};
        scoutsData.forEach((scout: Scout) => {
          if (patrolCounts[scout.group_name]) {
            patrolCounts[scout.group_name]++;
          } else {
            patrolCounts[scout.group_name] = 1;
          }
        });
        
        setScoutsByPatrol(
          Object.entries(patrolCounts).map(([name, value]) => ({ name, value }))
        );
        
        // Process scouts by status
        const statusCounts: Record<string, number> = {};
        scoutsData.forEach((scout: Scout) => {
          if (statusCounts[scout.status]) {
            statusCounts[scout.status]++;
          } else {
            statusCounts[scout.status] = 1;
          }
        });
        
        setScoutsByStatus(
          Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
        );
        
        // Process activities by type
        const typeCounts: Record<string, number> = {};
        activitiesData.forEach((activity: Activity) => {
          if (typeCounts[activity.type]) {
            typeCounts[activity.type]++;
          } else {
            typeCounts[activity.type] = 1;
          }
        });
        
        setActivityData(
          Object.entries(typeCounts).map(([name, count]) => ({ name, count }))
        );
        
        // Process attendance by recent activities (last 5)
        // Sort activities by date in descending order
        const recentActivities = [...activitiesData]
          .sort((a: Activity, b: Activity) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .slice(0, 5);
        
        const attendanceStats: Record<string, { present: number, absent: number, excused: number }> = {};
        
        recentActivities.forEach((activity: Activity) => {
          attendanceStats[activity.title] = { present: 0, absent: 0, excused: 0 };
        });
        
        attendanceData.forEach((record: Attendance) => {
          const activity = activitiesData.find((a: Activity) => a.id === record.activity_id);
          if (activity && attendanceStats[activity.title]) {
            if (record.status === 'present') {
              attendanceStats[activity.title].present++;
            } else if (record.status === 'absent') {
              attendanceStats[activity.title].absent++;
            } else if (record.status === 'excused') {
              attendanceStats[activity.title].excused++;
            }
          }
        });
        
        setAttendanceData(
          Object.entries(attendanceStats).map(([name, stats]) => ({
            name,
            ...stats
          }))
        );
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-scout-green-dark">Reports</h1>
            <p className="text-muted-foreground">Scout participation and activity analytics</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Data
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="scouts">Scouts</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scouts by Patrol</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <p>Loading data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={scoutsByPatrol}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {scoutsByPatrol.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activities by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <p>Loading data...</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={activityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Activities" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activities Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <p>Loading data...</p>
                    </div>
                  ) : attendanceData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <p>No attendance data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={attendanceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" fill="#4CAF50" name="Present" />
                        <Bar dataKey="absent" fill="#F44336" name="Absent" />
                        <Bar dataKey="excused" fill="#FFC107" name="Excused" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10">Detailed attendance reports coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scouts">
            <Card>
              <CardHeader>
                <CardTitle>Scout Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10">Detailed scout reports coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Activity Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10">Detailed activity reports coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
