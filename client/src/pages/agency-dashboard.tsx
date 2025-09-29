import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import MetricsCards from "@/components/metrics-cards";
import ChurchCard from "@/components/church-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ChurchWithCounts, type GraceInteraction } from "@shared/schema";

export default function AgencyDashboard() {
  const { isAdmin } = useAuth();

  const { data: churches = [], isLoading: churchesLoading } = useQuery<ChurchWithCounts[]>({
    queryKey: ["/api/churches"],
    enabled: isAdmin,
  });

  const { data: metrics = {}, isLoading: metricsLoading } = useQuery<any>({
    queryKey: ["/api/analytics/agency"],
    enabled: isAdmin,
  });

  const { data: recentInteractions = [], isLoading: interactionsLoading } = useQuery<GraceInteraction[]>({
    queryKey: ["/api/grace-interactions/recent"],
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const formatExecutedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "VOICE":
        return "fas fa-microphone text-blue-600";
      case "CHAT":
        return "fas fa-message text-green-600";
      case "CALENDAR":
        return "fas fa-calendar text-purple-600";
      case "SMS":
        return "fas fa-sms text-orange-600";
      case "WORKFLOW":
        return "fas fa-cogs text-gray-600";
      default:
        return "fas fa-robot text-blue-600";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Navbar
          title="Agency Dashboard"
          subtitle="Manage all church networks and Grace bot interactions"
          actions={
            <Button data-testid="button-add-client">
              <i className="fas fa-plus w-4 h-4 mr-2"></i>
              Add Client
            </Button>
          }
        />

        <div className="p-6 space-y-6">
          {/* Metrics Cards */}
          <MetricsCards metrics={metrics} isAgency={true} />

          {/* Churches Grid */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Church Networks</h2>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search churches..."
                    className="w-64"
                    data-testid="input-search-churches"
                  />
                  <Button variant="outline" size="sm" data-testid="button-filter-churches">
                    <i className="fas fa-filter"></i>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {churchesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-background p-6 rounded-lg border border-border animate-pulse">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : churches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-church text-2xl text-muted-foreground"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Churches Yet</h3>
                  <p className="text-muted-foreground">Add your first church to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="churches-grid">
                  {churches.map((church) => (
                    <ChurchCard key={church.id} church={church} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Recent Grace Bot Activity</h2>
              <p className="text-muted-foreground text-sm">Latest interactions across all church networks</p>
            </div>

            <div className="divide-y divide-border">
              {interactionsLoading ? (
                <div className="p-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                      <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentInteractions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-robot text-2xl text-muted-foreground"></i>
                  </div>
                  <h4 className="text-lg font-medium mb-2">No Recent Activity</h4>
                  <p className="text-muted-foreground">Grace bot interactions will appear here</p>
                </div>
              ) : (
                recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="p-6 flex items-center gap-4" data-testid={`activity-${interaction.id}`}>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <i className={getInteractionIcon(interaction.type)}></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" data-testid={`activity-description-${interaction.id}`}>
                        {interaction.description || `${interaction.function} executed`}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span data-testid={`activity-time-${interaction.id}`}>
                          {interaction.executedAt ? formatExecutedAt(interaction.executedAt.toString()) : "N/A"}
                        </span>
                        {interaction.responseTime && (
                          <span data-testid={`activity-response-time-${interaction.id}`}>
                            Response: {(interaction.responseTime / 1000).toFixed(1)}s
                          </span>
                        )}
                        <span data-testid={`activity-type-${interaction.id}`}>
                          {interaction.type} Interaction
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        interaction.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                        interaction.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`} data-testid={`activity-status-${interaction.id}`}>
                        {interaction.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
