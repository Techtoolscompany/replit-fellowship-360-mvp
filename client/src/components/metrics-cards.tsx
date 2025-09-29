interface MetricsCardsProps {
  metrics: {
    totalChurches?: number;
    totalMembers?: number;
    totalGraceInteractions?: number;
    avgResponseTime?: number;
    memberCount?: number;
    graceInteractionCount?: number;
    leadCount?: number;
    activeCount?: number;
    inactiveCount?: number;
  };
  isAgency?: boolean;
}

export default function MetricsCards({ metrics, isAgency = false }: MetricsCardsProps) {
  if (isAgency) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Churches</p>
              <p className="text-3xl font-bold" data-testid="metric-total-churches">
                {metrics.totalChurches || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-church text-primary text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Members</p>
              <p className="text-3xl font-bold" data-testid="metric-total-members">
                {metrics.totalMembers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grace Interactions</p>
              <p className="text-3xl font-bold" data-testid="metric-total-interactions">
                {metrics.totalGraceInteractions || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-3xl font-bold" data-testid="metric-avg-response-time">
                {metrics.avgResponseTime ? `${(metrics.avgResponseTime / 1000).toFixed(1)}s` : '0s'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Church-specific metrics
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Members</p>
            <p className="text-3xl font-bold" data-testid="metric-member-count">
              {metrics.memberCount || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-users text-primary text-xl"></i>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Leads:</span>
            <span data-testid="metric-lead-count">{metrics.leadCount || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active:</span>
            <span data-testid="metric-active-count">{metrics.activeCount || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Inactive:</span>
            <span data-testid="metric-inactive-count">{metrics.inactiveCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Grace Interactions</p>
            <p className="text-3xl font-bold" data-testid="metric-grace-interactions">
              {metrics.graceInteractionCount || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-robot text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Status</p>
            <p className="text-2xl font-bold text-green-600" data-testid="metric-status">
              Active
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
