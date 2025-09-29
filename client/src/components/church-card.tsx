import { Link } from "wouter";
import { type ChurchWithCounts } from "@shared/schema";

interface ChurchCardProps {
  church: ChurchWithCounts;
}

export default function ChurchCard({ church }: ChurchCardProps) {
  const getStatusBadge = (plan: string) => {
    const className = "inline-flex items-center px-2 py-1 rounded text-xs font-medium";
    
    switch (plan) {
      case "TRIAL":
        return <span className={`${className} bg-yellow-100 text-yellow-800`}>Trial</span>;
      case "STARTER":
        return <span className={`${className} bg-blue-100 text-blue-800`}>Starter</span>;
      case "PROFESSIONAL":
        return <span className={`${className} bg-green-100 text-green-800`}>Professional</span>;
      case "ENTERPRISE":
        return <span className={`${className} bg-purple-100 text-purple-800`}>Enterprise</span>;
      default:
        return <span className={`${className} bg-gray-100 text-gray-800`}>Active</span>;
    }
  };

  const getLastActivity = () => {
    if (!church.lastActivity) return "No activity";
    
    const lastActivity = new Date(church.lastActivity);
    const now = new Date();
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <Link href={`/church-dashboard/${church.id}`}>
      <a 
        className="block bg-background p-6 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
        data-testid={`card-church-${church.id}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-church text-primary text-xl"></i>
          </div>
          {getStatusBadge(church.plan)}
        </div>
        
        <h3 className="font-semibold text-lg mb-2" data-testid={`text-church-name-${church.id}`}>
          {church.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4" data-testid={`text-church-email-${church.id}`}>
          {church.email}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Members</span>
            <span className="font-medium" data-testid={`text-member-count-${church.id}`}>
              {church.memberCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Grace Interactions</span>
            <span className="font-medium" data-testid={`text-interaction-count-${church.id}`}>
              {church.graceInteractionCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Activity</span>
            <span className="text-sm text-muted-foreground" data-testid={`text-last-activity-${church.id}`}>
              {getLastActivity()}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Plan: <span className="font-medium text-foreground">{church.plan}</span>
            </span>
            <span className="text-primary hover:text-primary/80 text-sm font-medium">
              View Details →
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
