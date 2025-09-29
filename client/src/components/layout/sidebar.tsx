import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-church text-primary-foreground text-sm"></i>
          </div>
          <div>
            <h2 className="font-semibold text-lg">GraceCRM</h2>
            <p className="text-xs text-muted-foreground">Multi-Tenant CRM</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {isAdmin && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
              AGENCY
            </p>
            <Link href="/agency-dashboard">
              <a
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/agency-dashboard")
                    ? "bg-accent text-accent-foreground border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-testid="link-agency-dashboard"
              >
                <i className="fas fa-building w-4 h-4"></i>
                Agency Dashboard
              </a>
            </Link>
          </div>
        )}

        {user?.churchId && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
              CHURCH
            </p>
            <Link href={`/church-dashboard/${user.churchId}`}>
              <a
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(`/church-dashboard/${user.churchId}`)
                    ? "bg-accent text-accent-foreground border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-testid="link-church-dashboard"
              >
                <i className="fas fa-church w-4 h-4"></i>
                {user.church?.name || "Church Dashboard"}
              </a>
            </Link>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            GRACE BOT
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
            data-testid="button-voice-assistant"
          >
            <i className="fas fa-microphone w-4 h-4"></i>
            Voice Assistant
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
            data-testid="button-calendar-integration"
          >
            <i className="fas fa-calendar w-4 h-4"></i>
            Calendar Integration
          </Button>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <i className="fas fa-user text-secondary-foreground text-sm"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" data-testid="text-user-email">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-user-role">
              {user?.role}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full"
          data-testid="button-logout"
        >
          <i className="fas fa-sign-out-alt w-4 h-4 mr-2"></i>
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
