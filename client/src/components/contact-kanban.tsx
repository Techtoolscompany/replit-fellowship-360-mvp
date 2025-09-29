import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { type Member } from "@shared/schema";

interface ContactKanbanProps {
  churchId: string;
}

interface AddMemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "LEAD" | "ACTIVE" | "INACTIVE";
  notes: string;
}

const initialFormData: AddMemberFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  status: "LEAD",
  notes: "",
};

export default function ContactKanban({ churchId }: ContactKanbanProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AddMemberFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/churches", churchId, "members"],
    enabled: !!churchId,
  });

  const addMemberMutation = useMutation({
    mutationFn: async (memberData: AddMemberFormData) => {
      const response = await apiRequest(
        "POST",
        `/api/churches/${churchId}/members`,
        memberData
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/churches", churchId, "members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/churches", churchId] });
      setIsAddDialogOpen(false);
      setFormData(initialFormData);
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add member",
        variant: "destructive",
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/members/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/churches", churchId, "members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/churches", churchId] });
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMemberMutation.mutate(formData);
  };

  const handleStatusChange = (memberId: string, newStatus: string) => {
    updateMemberMutation.mutate({ id: memberId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const className = "inline-flex items-center px-2 py-1 rounded text-xs font-medium";
    
    switch (status) {
      case "LEAD":
        return <span className={`${className} bg-yellow-100 text-yellow-800`}>Lead</span>;
      case "ACTIVE":
        return <span className={`${className} bg-green-100 text-green-800`}>Active</span>;
      case "INACTIVE":
        return <span className={`${className} bg-gray-100 text-gray-800`}>Inactive</span>;
      default:
        return <span className={`${className} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const categorizedMembers = {
    LEAD: members.filter((m: Member) => m.status === "LEAD"),
    ACTIVE: members.filter((m: Member) => m.status === "ACTIVE"),
    INACTIVE: members.filter((m: Member) => m.status === "INACTIVE"),
  };

  if (isLoading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Member Pipeline</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-member">
              <i className="fas fa-plus mr-2"></i>Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-member-email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "LEAD" | "ACTIVE" | "INACTIVE") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  data-testid="input-notes"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={addMemberMutation.isPending} data-testid="button-submit-member">
                  {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  data-testid="button-cancel-member"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["LEAD", "ACTIVE", "INACTIVE"] as const).map((status) => (
          <div key={status} className="min-h-[500px] bg-muted rounded-lg p-4" data-testid={`kanban-column-${status.toLowerCase()}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">{status === "LEAD" ? "Leads" : status === "ACTIVE" ? "Active Members" : "Inactive"}</h4>
              <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded" data-testid={`count-${status.toLowerCase()}`}>
                {categorizedMembers[status].length}
              </span>
            </div>
            
            <div className="space-y-3">
              {categorizedMembers[status].map((member: Member) => (
                <Card 
                  key={member.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  data-testid={`member-card-${member.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium" data-testid={`member-name-${member.id}`}>
                        {member.firstName} {member.lastName}
                      </h5>
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1" data-testid={`member-email-${member.id}`}>
                      {member.email}
                    </p>
                    {member.phone && (
                      <p className="text-sm text-muted-foreground" data-testid={`member-phone-${member.id}`}>
                        {member.phone}
                      </p>
                    )}
                    {member.notes && (
                      <p className="text-xs text-muted-foreground mt-2" data-testid={`member-notes-${member.id}`}>
                        {member.notes}
                      </p>
                    )}
                    
                    <div className="mt-2 flex gap-1">
                      {status !== "LEAD" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(member.id, "LEAD")}
                          disabled={updateMemberMutation.isPending}
                          data-testid={`button-to-lead-${member.id}`}
                        >
                          → Lead
                        </Button>
                      )}
                      {status !== "ACTIVE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(member.id, "ACTIVE")}
                          disabled={updateMemberMutation.isPending}
                          data-testid={`button-to-active-${member.id}`}
                        >
                          → Active
                        </Button>
                      )}
                      {status !== "INACTIVE" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(member.id, "INACTIVE")}
                          disabled={updateMemberMutation.isPending}
                          data-testid={`button-to-inactive-${member.id}`}
                        >
                          → Inactive
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
