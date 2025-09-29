import { useEffect } from "react";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        setLocation("/agency-dashboard");
      } else if (user?.churchId) {
        setLocation(`/church-dashboard/${user.churchId}`);
      }
    }
  }, [isAuthenticated, isAdmin, user, setLocation]);

  const handleLoginSuccess = () => {
    const { isAuthenticated, isAdmin, user } = useAuth();
    
    if (isAuthenticated) {
      if (isAdmin) {
        setLocation("/agency-dashboard");
      } else if (user?.churchId) {
        setLocation(`/church-dashboard/${user.churchId}`);
      }
    }
  };

  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
