import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, Settings, Lock, UserPlus, Database, Key } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', role: '' });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Parent'
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to Supabase Auth in a real implementation
    toast.success(`User invitation sent to ${newUser.email}`);
    setUserDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Parent'
    });
  };

  const handleUserSettings = (name: string, role: string) => {
    setCurrentUser({ name, role });
    setUserSettingsOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-scout-green-dark">Admin Dashboard</h1>
            <p className="text-muted-foreground">System administration and management</p>
          </div>
          <Button className="bg-scout-green hover:bg-scout-green-dark gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">156</span>
                <span className="text-green-500 text-sm">+12%</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4 text-scout-green" />
                <span className="text-sm">24 new this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:100ms]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Scouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">98</span>
                <span className="text-green-500 text-sm">+5%</span>
              </div>
              <Progress value={98} max={120} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">98 of 120 capacity</p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:200ms]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">2.4GB</span>
                <span className="text-amber-500 text-sm">75%</span>
              </div>
              <Progress value={75} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">2.4GB of 5GB storage used</p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in [animation-delay:300ms]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-lg font-medium">All Systems Normal</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last backup: 12 hours ago</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="system">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and their access</CardDescription>
                  </div>
                  
                  <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-1">
                        <UserPlus className="h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddUser}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input 
                              id="name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <Select 
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({...newUser, role: value})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Administrator">Administrator</SelectItem>
                                <SelectItem value="Leader">Scout Leader</SelectItem>
                                <SelectItem value="Parent">Parent</SelectItem>
                                <SelectItem value="Committee">Committee Member</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Send Invitation</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={userSettingsOpen} onOpenChange={setUserSettingsOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>User Settings: {currentUser.name}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Current Role</Label>
                          <div className="col-span-3">
                            <span className="font-medium">{currentUser.role}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="newRole" className="text-right">New Role</Label>
                          <Select defaultValue={currentUser.role}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Administrator">Administrator</SelectItem>
                              <SelectItem value="Leader">Scout Leader</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Committee">Committee Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <Button variant="outline" className="w-full">Reset Password</Button>
                          <Button variant="destructive" className="w-full">Deactivate User</Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          toast.success(`User ${currentUser.name} updated`);
                          setUserSettingsOpen(false);
                        }}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4 bg-muted/50">
                    <div className="grid grid-cols-4 w-full font-medium">
                      <div>User</div>
                      <div>Role</div>
                      <div>Status</div>
                      <div>Last Login</div>
                    </div>
                    <div className="w-8"></div>
                  </div>
                  <Separator />
                  {['Admin User', 'Scout Leader', 'Parent Account', 'Committee Chair', 'Treasurer'].map((user, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="grid grid-cols-4 w-full">
                          <div className="font-medium">{user}</div>
                          <div>{i === 0 ? 'Administrator' : i === 1 ? 'Leader' : i === 2 ? 'Parent' : 'Committee'}</div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              i !== 3 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {i !== 3 ? 'Active' : 'Pending'}
                            </span>
                          </div>
                          <div className="text-muted-foreground">{i === 0 ? 'Just now' : `${i} day${i > 1 ? 's' : ''} ago`}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUserSettings(
                            user, 
                            i === 0 ? 'Administrator' : i === 1 ? 'Leader' : i === 2 ? 'Parent' : 'Committee'
                          )}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                      {i < 4 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Roles & Permissions</CardTitle>
                    <CardDescription>Manage system roles and their permissions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Administrator', description: 'Full system access and configuration', icon: Shield },
                    { name: 'Scout Leader', description: 'Manage activities, attendance, and scouts', icon: Users },
                    { name: 'Committee Member', description: 'View reports and manage limited settings', icon: FileText },
                    { name: 'Parent', description: 'View activities and manage their scouts', icon: Lock }
                  ].map((role, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-scout-green/20 rounded-full flex items-center justify-center">
                          <role.icon className="h-5 w-5 text-scout-green" />
                        </div>
                        <div>
                          <h4 className="font-medium">{role.name}</h4>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit Permissions</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Manage system data and backups</CardDescription>
                  </div>
                  <Button className="gap-1">
                    <Database className="h-4 w-4" />
                    Backup Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Recent Backups</h3>
                    <div className="space-y-2">
                      {[
                        { date: 'Today, 3:45 AM', size: '24.6 MB', automatic: true },
                        { date: 'Yesterday, 3:45 AM', size: '24.2 MB', automatic: true },
                        { date: '2 days ago, 2:30 PM', size: '24.0 MB', automatic: false }
                      ].map((backup, i) => (
                        <div key={i} className="flex items-center justify-between bg-background p-2 rounded border text-sm">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-scout-blue" />
                            <div>
                              <span className="font-medium">{backup.date}</span>
                              <span className="text-muted-foreground ml-2">({backup.size})</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {backup.automatic && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Auto</span>
                            )}
                            <Button variant="ghost" size="sm">Restore</Button>
                            <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Data Export</h3>
                    <p className="text-sm text-muted-foreground mb-3">Export system data for reporting or migration</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Export Scouts</Button>
                      <Button variant="outline" size="sm">Export Activities</Button>
                      <Button variant="outline" size="sm">Export All Data</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>System Logs</CardTitle>
                    <CardDescription>View system activities and errors</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="bg-muted/50 p-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">All</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Info</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Warnings</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Errors</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Clear Logs</Button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto font-mono text-xs">
                    {[
                      { type: 'info', message: 'System backup completed successfully', time: '10:45:23' },
                      { type: 'info', message: 'User "Admin" logged in', time: '10:42:01' },
                      { type: 'warning', message: 'High CPU usage detected (78%)', time: '09:57:45' },
                      { type: 'info', message: 'Activity "Summer Camp" created', time: '09:32:18' },
                      { type: 'error', message: 'Failed to send email notifications', time: '08:15:30' },
                      { type: 'info', message: 'Database optimization completed', time: '07:00:00' },
                    ].map((log, i) => (
                      <div key={i} className={`p-2 flex border-b ${
                        log.type === 'error' ? 'bg-red-50' : 
                        log.type === 'warning' ? 'bg-amber-50' : ''
                      }`}>
                        <div className="w-20 text-muted-foreground">{log.time}</div>
                        <div className="w-20">
                          <span className={`rounded px-1 py-0.5 ${
                            log.type === 'error' ? 'bg-red-100 text-red-800' : 
                            log.type === 'warning' ? 'bg-amber-100 text-amber-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {log.type}
                          </span>
                        </div>
                        <div className="flex-1">{log.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
