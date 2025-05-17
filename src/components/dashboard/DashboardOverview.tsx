
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Calendar, User, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const DashboardOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-scout-green-dark">Dashboard</h1>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-stat bg-scout-green-light/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-scout-green-dark">Total Scouts</CardTitle>
            <User className="h-4 w-4 text-scout-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground mt-1">12 active groups</p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat bg-scout-blue-light/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-scout-blue-dark">Upcoming Activities</CardTitle>
            <Calendar className="h-4 w-4 text-scout-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Next: First Aid Training</p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat bg-scout-brown-light/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-scout-brown-dark">Avg. Attendance</CardTitle>
            <CheckSquare className="h-4 w-4 text-scout-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat bg-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-3">
                  {["Weekend Hiking Trip", "First Aid Training", "Community Garden Cleanup"].map((activity, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded hover:bg-muted cursor-pointer"
                      onClick={() => navigate("/activities")}>
                      <div>
                        <p className="font-medium">{activity}</p>
                        <p className="text-xs text-muted-foreground">
                          {["May 25, 2025", "May 18, 2025", "May 20, 2025"][i]} • {["8:00 AM", "4:00 PM", "10:00 AM"][i]}
                        </p>
                      </div>
                      <div className={`activity-badge activity-badge-${["hiking", "training", "service"][i]}`}>
                        {["hiking", "training", "service"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-3">
                  {["Wildlife Observation", "Map Reading Workshop", "Beach Cleanup"].map((activity, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded hover:bg-muted cursor-pointer"
                      onClick={() => navigate("/activities")}>
                      <div>
                        <p className="font-medium">{activity}</p>
                        <p className="text-xs text-muted-foreground">
                          {["May 5, 2025", "May 2, 2025", "April 28, 2025"][i]} • {["9:00 AM", "6:30 PM", "10:00 AM"][i]}
                        </p>
                      </div>
                      <div className={`activity-badge activity-badge-${["hiking", "training", "service"][i]}`}>
                        {["hiking", "training", "service"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Scout Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patrols">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="patrols">Patrols</TabsTrigger>
                <TabsTrigger value="badges">Recent Badges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="patrols">
                <div className="space-y-3">
                  {["Wolf Patrol", "Eagle Patrol", "Fox Patrol", "Bear Patrol"].map((patrol, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded hover:bg-muted cursor-pointer"
                      onClick={() => navigate("/scouts")}>
                      <div>
                        <p className="font-medium">{patrol}</p>
                        <p className="text-xs text-muted-foreground">{[8, 10, 6, 12][i]} members</p>
                      </div>
                      <div className="text-sm text-scout-green-dark font-medium">
                        {[95, 87, 92, 89][i]}% attendance
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="badges">
                <div className="space-y-3">
                  {["First Aid", "Camping", "Hiking", "Environment"].map((badge, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded hover:bg-muted">
                      <div>
                        <p className="font-medium">{badge} Badge</p>
                        <p className="text-xs text-muted-foreground">Earned by {[6, 12, 8, 5][i]} scouts</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        This month
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
