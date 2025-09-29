import { Button } from "@/components/ui/button";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Navbar({ title, subtitle, actions }: NavbarProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground" data-testid="text-page-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              data-testid="button-notifications"
            >
              <i className="fas fa-bell w-5 h-5"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              data-testid="button-search"
            >
              <i className="fas fa-search w-5 h-5"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
