import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, PhoneCall, MessageCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CallData {
  to: string;
  greeting: string;
}

interface SMSData {
  to: string;
  message: string;
}

export function TwilioCallPanel() {
  const [callData, setCallData] = useState<CallData>({ to: "", greeting: "" });
  const [smsData, setSmsData] = useState<SMSData>({ to: "", message: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const makeCallMutation = useMutation({
    mutationFn: async (data: CallData) => {
      const response = await apiRequest("/api/twilio/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Call Initiated",
        description: `Call started successfully. Call SID: ${data.callSid}`,
      });
      setCallData({ to: "", greeting: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/grace/interactions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate call",
        variant: "destructive",
      });
    },
  });

  const sendSMSMutation = useMutation({
    mutationFn: async (data: SMSData) => {
      const response = await apiRequest("/api/twilio/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "SMS Sent",
        description: `Message sent successfully. Message SID: ${data.messageSid}`,
      });
      setSmsData({ to: "", message: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/grace/interactions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "SMS Failed",
        description: error.message || "Failed to send SMS",
        variant: "destructive",
      });
    },
  });

  const handleMakeCall = () => {
    if (!callData.to.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number to call",
        variant: "destructive",
      });
      return;
    }

    makeCallMutation.mutate(callData);
  };

  const handleSendSMS = () => {
    if (!smsData.to.trim() || !smsData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive",
      });
      return;
    }

    sendSMSMutation.mutate(smsData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Make Call Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Make Grace Call
          </CardTitle>
          <CardDescription>
            Initiate an outbound call with Grace as your church's AI assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="call-to">Phone Number</Label>
            <Input
              id="call-to"
              type="tel"
              placeholder="+1234567890"
              value={callData.to}
              onChange={(e) => setCallData({ ...callData, to: e.target.value })}
              data-testid="input-call-phone"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="call-greeting">Custom Greeting (Optional)</Label>
            <Textarea
              id="call-greeting"
              placeholder="Hello! This is Grace calling from [Church Name]..."
              value={callData.greeting}
              onChange={(e) => setCallData({ ...callData, greeting: e.target.value })}
              rows={3}
              data-testid="input-call-greeting"
            />
          </div>
          
          <Button 
            onClick={handleMakeCall}
            disabled={makeCallMutation.isPending}
            className="w-full"
            data-testid="button-make-call"
          >
            {makeCallMutation.isPending ? (
              <>
                <PhoneCall className="mr-2 h-4 w-4 animate-spin" />
                Calling...
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" />
                Make Call
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Send SMS Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Send SMS
          </CardTitle>
          <CardDescription>
            Send a text message to church members or visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sms-to">Phone Number</Label>
            <Input
              id="sms-to"
              type="tel"
              placeholder="+1234567890"
              value={smsData.to}
              onChange={(e) => setSmsData({ ...smsData, to: e.target.value })}
              data-testid="input-sms-phone"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sms-message">Message</Label>
            <Textarea
              id="sms-message"
              placeholder="Your message here..."
              value={smsData.message}
              onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
              rows={4}
              maxLength={160}
              data-testid="input-sms-message"
            />
            <div className="text-xs text-muted-foreground text-right">
              {smsData.message.length}/160
            </div>
          </div>
          
          <Button 
            onClick={handleSendSMS}
            disabled={sendSMSMutation.isPending}
            className="w-full"
            data-testid="button-send-sms"
          >
            {sendSMSMutation.isPending ? (
              <>
                <MessageCircle className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send SMS
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}