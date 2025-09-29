import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import MetricsCards from "@/components/metrics-cards";
import ContactKanban from "@/components/contact-kanban";
import GraceInteractionsTable from "@/components/grace-interactions-table";

interface ChurchDashboardProps {
  params: { churchId: string };
}

export default function ChurchDashboard({ params }: ChurchDashboardProps) {
  const { churchId } = params;
  const { user, isAdmin } = useAuth();

  // Check access permissions
  const hasAccess = isAdmin || user?.churchId === churchId;

  const { data: church, isLoading: churchLoading } = useQuery<any>({
    queryKey: ["/api/churches", churchId],
    enabled: hasAccess && !!churchId,
  });

  const { data: metrics = {}, isLoading: metricsLoading } = useQuery<any>({
    queryKey: ["/api/analytics/churches", churchId],
    enabled: hasAccess && !!churchId,
  });

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this church.</p>
        </div>
      </div>
    );
  }

  if (churchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading church dashboard...</p>
        </div>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Church Not Found</h1>
          <p className="text-muted-foreground">The requested church could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Navbar
          title={`${church.name} Dashboard`}
          subtitle="Member management and Grace bot interactions"
        />

        <div className="p-6 space-y-6">
          {/* Church Metrics */}
          <MetricsCards metrics={metrics} isAgency={false} />

          {/* Contact Kanban Board */}
          <ContactKanban churchId={churchId} />

          {/* Grace Interactions Table */}
          <GraceInteractionsTable churchId={churchId} />
        </div>
      </main>
    </div>
  );
}
