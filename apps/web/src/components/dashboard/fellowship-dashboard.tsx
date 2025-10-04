"use client"
import React, { useState, useLayoutEffect } from "react";
import { Bell, User, Moon, Sun, Users, MessageCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth/context';
import { usePathname } from 'next/navigation';
import { ChurchChartInteractive } from "@/components/dashboard/church-chart-interactive";
import { ChurchSectionCards } from "@/components/dashboard/church-section-cards";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { GraceWidget } from "@/components/grace/grace-widget";

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

  // Animation variants matching card-22 exactly
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  }

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
      <ChurchChartInteractive />
      
      {/* Main Content Grid - 3 Columns */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Recent Contacts */}
        <motion.div variants={cardVariants} className="h-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.25 }}
            variants={contentVariants}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            className="rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer p-6 h-full flex flex-col overflow-hidden"
          >
            <motion.div variants={contentVariants} className="space-y-6 flex-1">
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Recent Contacts</h3>
                </div>
                <a href="/contacts" className="text-sm text-primary hover:text-primary/80 font-medium">
                  View all
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <ContactsTable limit={5} />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={cardVariants} className="h-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.25 }}
            variants={contentVariants}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            className="rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer p-6 h-full flex flex-col overflow-hidden"
          >
            <motion.div variants={contentVariants} className="space-y-6 flex-1">
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
                </div>
                <a href="/activity" className="text-sm text-primary hover:text-primary/80 font-medium">
                  View all
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <ActivityFeed limit={8} />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Grace Widget */}
        <motion.div variants={cardVariants} className="h-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.25 }}
            variants={contentVariants}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: '0px 10px 30px -5px hsl(var(--foreground) / 0.1)',
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            className="rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer p-6 h-full flex flex-col overflow-hidden"
          >
            <motion.div variants={contentVariants} className="space-y-6 flex-1">
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Grace Assistant</h3>
                </div>
                <a href="/grace" className="text-sm text-primary hover:text-primary/80 font-medium">
                  Open Dashboard
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <GraceWidget />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
