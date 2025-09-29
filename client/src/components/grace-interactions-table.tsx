import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type GraceInteraction } from "@shared/schema";

interface GraceInteractionsTableProps {
  churchId: string;
}

export default function GraceInteractionsTable({ churchId }: GraceInteractionsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interactions = [], isLoading } = useQuery<GraceInteraction[]>({
    queryKey: ["/api/churches", churchId, "grace-interactions"],
    enabled: !!churchId,
  });

  const startVoiceSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/grace-interactions", {
        type: "VOICE",
        function: "Voice Session",
        description: "Started Grace voice assistant session",
        status: "COMPLETED",
        churchId,
        responseTime: Math.floor(Math.random() * 2000) + 500, // Simulate response time
        metadata: { sessionType: "voice", initiated: "manual" },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/churches", churchId, "grace-interactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/churches", churchId] });
      toast({
        title: "Success",
        description: "Voice session started successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start voice session",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const className = "inline-flex items-center px-2 py-1 rounded text-xs font-medium";
    
    switch (status) {
      case "COMPLETED":
        return <span className={`${className} bg-green-100 text-green-800`}>Completed</span>;
      case "PENDING":
        return <span className={`${className} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case "FAILED":
        return <span className={`${className} bg-red-100 text-red-800`}>Failed</span>;
      default:
        return <span className={`${className} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VOICE":
        return "fas fa-microphone";
      case "CHAT":
        return "fas fa-message";
      case "CALENDAR":
        return "fas fa-calendar";
      case "SMS":
        return "fas fa-sms";
      case "WORKFLOW":
        return "fas fa-cogs";
      default:
        return "fas fa-robot";
    }
  };

  const formatExecutedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <div>Loading Grace interactions...</div>;
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Grace Bot Interactions</h3>
            <p className="text-sm text-muted-foreground">Voice, chat, and automation activity</p>
          </div>
          <Button
            onClick={() => startVoiceSessionMutation.mutate()}
            disabled={startVoiceSessionMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-start-voice-session"
          >
            <i className="fas fa-microphone mr-2"></i>
            {startVoiceSessionMutation.isPending ? "Starting..." : "Start Voice Session"}
          </Button>
        </div>
      </div>

      {interactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-robot text-2xl text-muted-foreground"></i>
          </div>
          <h4 className="text-lg font-medium mb-2">No Grace Interactions Yet</h4>
          <p className="text-muted-foreground mb-4">Start by clicking the voice session button above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Function</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Executed At</th>
                <th className="text-left p-4 font-medium">Response Time</th>
                <th className="text-left p-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {interactions.map((interaction: GraceInteraction) => (
                <tr key={interaction.id} data-testid={`interaction-row-${interaction.id}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <i className={`${getTypeIcon(interaction.type)} text-sm`}></i>
                      <span className="font-medium" data-testid={`interaction-type-${interaction.id}`}>
                        {interaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-medium" data-testid={`interaction-function-${interaction.id}`}>
                    {interaction.function}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(interaction.status)}
                  </td>
                  <td className="p-4 text-muted-foreground" data-testid={`interaction-time-${interaction.id}`}>
                    {interaction.executedAt ? formatExecutedAt(interaction.executedAt.toString()) : "N/A"}
                  </td>
                  <td className="p-4 text-muted-foreground" data-testid={`interaction-response-time-${interaction.id}`}>
                    {interaction.responseTime ? `${(interaction.responseTime / 1000).toFixed(1)}s` : "N/A"}
                  </td>
                  <td className="p-4 text-muted-foreground" data-testid={`interaction-description-${interaction.id}`}>
                    {interaction.description || "No description"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
