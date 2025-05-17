
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, MessageSquare, Users, Archive } from "lucide-react";

const Communications = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-scout-green-dark">Communications</h1>
          <p className="text-muted-foreground">Manage communications with scouts and parents</p>
        </div>

        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose" className="space-y-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>New Message</CardTitle>
                <CardDescription>Compose a new message to scouts or parents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="recipient" className="text-sm font-medium">To:</label>
                  <Select>
                    <SelectTrigger id="recipient" className="w-full">
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scouts</SelectItem>
                      <SelectItem value="active">Active Scouts</SelectItem>
                      <SelectItem value="leaders">Troop Leaders</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                      <SelectItem value="eagle">Eagle Patrol</SelectItem>
                      <SelectItem value="beaver">Beaver Patrol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject:</label>
                  <Input id="subject" placeholder="Message subject" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message:</label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Method:</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Users className="h-4 w-4" />
                      Both
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 justify-end w-full">
                  <Button variant="outline">Save Draft</Button>
                  <Button className="gap-2 bg-scout-green hover:bg-scout-green-dark">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="inbox" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>View incoming messages and replies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-scout-brown/20 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-scout-brown" />
                        </div>
                        <div>
                          <h4 className="font-medium">{`Parent ${index}: Question about camp`}</h4>
                          <p className="text-sm text-muted-foreground truncate max-w-md">I was wondering about the equipment list for next month's camping trip...</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{`${index} day${index > 1 ? 's' : ''} ago`}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sent Messages</CardTitle>
                <CardDescription>View messages you have sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2].map((index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-scout-green/20 rounded-full flex items-center justify-center">
                          <Send className="h-5 w-5 text-scout-green" />
                        </div>
                        <div>
                          <h4 className="font-medium">{index === 1 ? "Summer Camp Details" : "Weekly Meeting Reminder"}</h4>
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {index === 1 
                              ? "Important information about the upcoming summer camp..." 
                              : "Don't forget our weekly meeting this Wednesday at 7PM..."
                            }
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{`${index + 3} days ago`}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Save and reuse common messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Meeting Reminder", "Activity Cancellation", "Permission Form Request"].map((template) => (
                    <div key={template} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-scout-blue/20 rounded-full flex items-center justify-center">
                          <Archive className="h-5 w-5 text-scout-blue" />
                        </div>
                        <div>
                          <h4 className="font-medium">{template}</h4>
                          <p className="text-sm text-muted-foreground">Template</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Use</Button>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full" variant="outline">
                  Create New Template
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Communications;
