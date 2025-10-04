"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Search,
  HelpCircle,
  Church
} from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  roles?: ('STAFF' | 'ADMIN' | 'AGENCY')[];
}

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation items for Fellowship 360
const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/", roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { id: "contacts", name: "Contacts", icon: Users, href: "/contacts", roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { id: "ministries", name: "Ministries", icon: Megaphone, href: "/ministries", roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { id: "events", name: "Events", icon: Calendar, href: "/events", roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { id: "grace", name: "Grace Assistant", icon: MessageCircle, href: "/grace", roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { id: "reports", name: "Reports", icon: BarChart3, href: "/reports", roles: ['STAFF', 'ADMIN', 'AGENCY'] },
];

export function FellowshipSidebar({ className = "", children }: SidebarProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('fellowship-sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('fellowship-sidebar-collapsed', newState.toString());
  };

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!user) return null;

  // Get user initials
  const userInitials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-background shadow-md border border-border md:hidden hover:bg-accent transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ?
          <X className="h-5 w-5 text-foreground" /> :
          <Menu className="h-5 w-5 text-foreground" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-background border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:relative md:translate-x-0 md:z-auto
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Church className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-base">Fellowship 360</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {user.church?.name || 'Church Management'}
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <Church className="h-5 w-5 text-primary-foreground" />
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-accent transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href as any}
                    onClick={handleItemClick}
                    className={`
                      w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group relative
                      ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon
                        className={`
                          h-4.5 w-4.5 flex-shrink-0
                          ${isActive
                            ? "text-primary"
                            : "group-hover:text-foreground"
                          }
                        `}
                      />
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>{item.name}</span>
                        {item.badge && (
                          <span className={`
                            px-1.5 py-0.5 text-xs font-medium rounded-full
                            ${isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                            }
                          `}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Badge for collapsed state */}
                    {isCollapsed && item.badge && (
                      <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-primary/20 border border-background">
                        <span className="text-[10px] font-medium text-primary">
                          {parseInt(item.badge) > 9 ? '9+' : item.badge}
                        </span>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-md">
                        {item.name}
                        {item.badge && (
                          <span className="ml-1.5 px-1 py-0.5 bg-muted rounded-full text-[10px]">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-popover border-l border-t border-border rotate-45" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Settings & Help section */}
          {!isCollapsed && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </p>
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/settings"
                    onClick={handleItemClick}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Settings className="h-4.5 w-4.5 flex-shrink-0" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    onClick={handleItemClick}
                    className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <HelpCircle className="h-4.5 w-4.5 flex-shrink-0" />
                    <span className="text-sm">Help & Support</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-border">
          {/* Profile Section */}
          <div className={`border-b border-border bg-muted/20 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-background hover:bg-accent transition-colors duration-200 cursor-pointer">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">{userInitials}</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" title="Online" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">{userInitials}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center rounded-md text-left transition-all duration-200 group relative
                text-destructive hover:bg-destructive/10 hover:text-destructive
                ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
              </div>

              {!isCollapsed && (
                <span className="text-sm">Logout</span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-md">
                  Logout
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-popover border-l border-t border-border rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
