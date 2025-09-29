import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./lib/auth";
import Login from "@/pages/login";
import AgencyDashboard from "@/pages/agency-dashboard";
import ChurchDashboard from "@/pages/church-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/agency-dashboard" component={AgencyDashboard} />
      <Route path="/church-dashboard/:churchId" component={ChurchDashboard} />
      <Route path="/" component={() => {
        const { isAdmin, user } = useAuth();
        if (isAdmin) {
          window.location.href = "/agency-dashboard";
        } else if (user?.churchId) {
          window.location.href = `/church-dashboard/${user.churchId}`;
        }
        return <div>Redirecting...</div>;
      }} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
