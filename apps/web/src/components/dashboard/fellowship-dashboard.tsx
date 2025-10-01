"use client"
import React, { useState, useLayoutEffect } from "react";
import { Bell, User, Moon, Sun, Users, MessageCircle } from "lucide-react";
import { useAuth } from '@/lib/auth/context';
import { usePathname } from 'next/navigation';
import { ChurchChartInteractive } from "@/components/dashboard/church-chart-interactive";
import { ChurchSectionCards } from "@/components/dashboard/church-section-cards";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { GraceWidget } from "@/components/grace/grace-widget";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export const FellowshipDashboard = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage immediately to prevent flash
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('fellowship-theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  // Apply theme changes synchronously before paint
  useLayoutEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('fellowship-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('fellowship-theme', 'light');
    }
  }, [isDark]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at {user.church?.name || 'your church'} today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Church Metrics Cards */}
      <ChurchSectionCards />
      
      {/* Chart */}
      <BackgroundGradient>
        <ChurchChartInteractive />
      </BackgroundGradient>
      
      {/* Main Content Grid - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Contacts */}
        <BackgroundGradient containerClassName="h-full" className="rounded-[22px] p-6 bg-card h-full flex flex-col" isSelected={pathname === '/contacts'}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Recent Contacts</h3>
            </div>
            <a href="/contacts" className="text-sm text-primary hover:text-primary/80 font-medium">
              View all
            </a>
          </div>
          <div className="flex-1">
            <ContactsTable limit={5} />
          </div>
        </BackgroundGradient>

        {/* Activity Feed */}
        <BackgroundGradient containerClassName="h-full" className="rounded-[22px] p-6 bg-card h-full flex flex-col" isSelected={pathname === '/activity'}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
            </div>
            <a href="/activity" className="text-sm text-primary hover:text-primary/80 font-medium">
              View all
            </a>
          </div>
          <div className="flex-1">
            <ActivityFeed limit={8} />
          </div>
        </BackgroundGradient>

        {/* Grace Widget */}
        <BackgroundGradient containerClassName="h-full" className="rounded-[22px] p-6 bg-card h-full flex flex-col" isSelected={pathname === '/grace'}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Grace Assistant</h3>
            </div>
            <a href="/grace" className="text-sm text-primary hover:text-primary/80 font-medium">
              Open Dashboard
            </a>
          </div>
          <div className="flex-1">
            <GraceWidget />
          </div>
        </BackgroundGradient>
      </div>
    </div>
  );
};


export default FellowshipDashboard;
