
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, Send, MessageSquare, Users, Archive, AlertCircle, CheckCircle 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Scout {
  id: string;
  name: string;
  status: string;
  group_name: string;
  contact_email: string | null;
}

interface Message {
  id: string;
  subject: string;
  body: string;
  recipient_type: string;
  delivery_method: string;
  created_at: string;
  sender_name: string;
}

const Communications = () => {
  const [recipients, setRecipients] = useState("all");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState<Message[]>([
    {
      id: "1",
      subject: "Summer Camp Details",
      body: "Important information about the upcoming summer camp...",
      recipient_type: "All Scouts",
      delivery_method: "email",
      created_at: "2025-05-14T10:00:00Z",
      sender_name: "Troop Leader"
    },
    {
      id: "2",
      subject: "Weekly Meeting Reminder",
      body: "Don't forget our weekly meeting this Wednesday at 7PM...",
      recipient_type: "Active Scouts",
      delivery_method: "sms",
      created_at: "2025-05-10T14:30:00Z",
      sender_name: "Scoutmaster"
    }
  ]);
  
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchScouts();
  }, []);
  
  const fetchScouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scouts')
        .select('id, name, status, group_name, contact_email')
        .order('name');
        
      if (error) throw error;
      setScouts(data as Scout[]);
    } catch (error) {
      console.error("Error fetching scouts:", error);
      toast.error("Failed to load scout information");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !messageBody.trim()) {
      toast.error("Please enter both subject and message content");
      return;
    }
    
    // Check if there are recipients with email addresses if using email delivery
    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
      const targetScouts = scouts.filter(scout => {
        if (recipients === 'all') return true;
        if (recipients === 'active') return scout.status === 'active';
        return scout.group_name.toLowerCase() === recipients.toLowerCase();
      });
      
      const scoutsWithEmail = targetScouts.filter(scout => Boolean(scout.contact_email));
      
      if (scoutsWithEmail.length === 0) {
        toast.error("None of the selected recipients have email addresses");
        return;
      }
    }
    
    // This would be where you'd integrate with a backend email/SMS service
    setSending(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Add to sent messages
      const newMessage = {
        id: Date.now().toString(),
        subject,
        body: messageBody,
        recipient_type: getRecipientDisplayName(),
        delivery_method: deliveryMethod,
        created_at: new Date().toISOString(),
        sender_name: "Current User"
      };
      
      setSentMessages(prev => [newMessage, ...prev]);
      
      // Reset form
      setSubject("");
      setMessageBody("");
      setDeliveryMethod("email");
      
      toast.success("Message sent successfully!");
      setSending(false);
    }, 1500);
  };
  
  const getRecipientDisplayName = () => {
    switch (recipients) {
      case 'all': return 'All Scouts';
      case 'active': return 'Active Scouts';
      case 'leaders': return 'Troop Leaders';
      case 'parents': return 'Parents';
      default: return recipients.charAt(0).toUpperCase() + recipients.slice(1) + ' Patrol';
    }
  };
  
  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="h-4 w-4 text-scout-green" />;
      case 'sms': return <MessageSquare className="h-4 w-4 text-scout-blue" />;
      case 'both': return <Users className="h-4 w-4 text-scout-brown" />;
      default: return <Send className="h-4 w-4" />;
    }
  };

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
                <form id="messageForm" onSubmit={handleSendMessage}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="recipient" className="text-sm font-medium">To:</label>
                      <Select value={recipients} onValueChange={setRecipients}>
                        <SelectTrigger id="recipient" className="w-full">
                          <SelectValue placeholder="Select recipients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Scouts</SelectItem>
                          <SelectItem value="active">Active Scouts</SelectItem>
                          <SelectItem value="leaders">Troop Leaders</SelectItem>
                          <SelectItem value="parents">Parents</SelectItem>
                          {scouts
                            .map(scout => scout.group_name)
                            .filter((value, index, self) => self.indexOf(value) === index) // unique values
                            .map(group => (
                              <SelectItem key={group} value={group.toLowerCase()}>{group} Patrol</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject:</label>
                      <Input 
                        id="subject" 
                        placeholder="Message subject" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message:</label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        className="min-h-[200px]"
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Delivery Method:</label>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant={deliveryMethod === 'email' ? 'default' : 'outline'} 
                          className={`flex-1 gap-2 ${deliveryMethod === 'email' ? 'bg-scout-green hover:bg-scout-green-dark' : ''}`}
                          onClick={() => setDeliveryMethod('email')}
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Button>
                        <Button 
                          type="button"
                          variant={deliveryMethod === 'sms' ? 'default' : 'outline'} 
                          className={`flex-1 gap-2 ${deliveryMethod === 'sms' ? 'bg-scout-green hover:bg-scout-green-dark' : ''}`}
                          onClick={() => setDeliveryMethod('sms')}
                        >
                          <MessageSquare className="h-4 w-4" />
                          SMS
                        </Button>
                        <Button 
                          type="button"
                          variant={deliveryMethod === 'both' ? 'default' : 'outline'} 
                          className={`flex-1 gap-2 ${deliveryMethod === 'both' ? 'bg-scout-green hover:bg-scout-green-dark' : ''}`}
                          onClick={() => setDeliveryMethod('both')}
                        >
                          <Users className="h-4 w-4" />
                          Both
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 justify-end w-full">
                  <Button variant="outline" type="button">Save Draft</Button>
                  <Button 
                    className="gap-2 bg-scout-green hover:bg-scout-green-dark" 
                    disabled={sending}
                    type="submit"
                    form="messageForm"
                  >
                    {sending ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
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
                  {sentMessages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-scout-green/20 rounded-full flex items-center justify-center">
                          {getDeliveryIcon(message.delivery_method)}
                        </div>
                        <div>
                          <h4 className="font-medium">{message.subject}</h4>
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {message.body}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            To: {message.recipient_type}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSubject(template);
                          setMessageBody(`This is a template for ${template.toLowerCase()}.`);
                          document.getElementById("compose-tab")?.click();
                          toast.success(`${template} template loaded`);
                        }}
                      >
                        Use
                      </Button>
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
