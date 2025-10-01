# Sidebar Refactoring Plan - Dashboard with Collapsible Sidebar

## Executive Summary

This document outlines the plan to refactor Fellowship 360's sidebar implementation by creating a unified `dashboard-with-collapsible-sidebar` component that eliminates duplicate sidebars while maintaining the green theme and implementing proper light/dark mode support.

---

## Current Issues

### Problem Statement
The application currently renders **two sidebars simultaneously**:
1. [`AppSidebar`](apps/web/src/components/layout/app-sidebar.tsx:153) - Rendered in the [`AppShell`](apps/web/src/components/layout/app-shell.tsx:13) layout component
2. [`FellowshipSidebar`](apps/web/src/components/dashboard/fellowship-dashboard.tsx:57) - Embedded within the [`FellowshipDashboard`](apps/web/src/components/dashboard/fellowship-dashboard.tsx:33) component

This creates a confusing UI with duplicate navigation elements.

### Impact
- Poor user experience with duplicate sidebars
- Inconsistent navigation state
- Difficult to maintain
- Wasted screen real estate

---

## Theme Specifications

### Green Color Palette

The application uses a **green theme** with the following CSS variables defined in [`globals.css`](apps/web/src/app/globals.css:1):

#### Light Mode (Default)
```css
--primary: oklch(0.73 0.21 147.82);              /* Main green */
--primary-foreground: oklch(0.98 0.02 155.71);   /* Light text on green */
--sidebar: oklch(0.723 0.219 149.579);           /* Sidebar green */
--sidebar-foreground: oklch(0.982 0.018 155.826);
--sidebar-primary: oklch(0.723 0.219 149.579);
--sidebar-accent: oklch(0.6 0.2 149.579);        /* Darker green for hover */
--sidebar-border: oklch(0.5 0.15 149.579);
--sidebar-ring: oklch(0.723 0.219 149.579);
```

#### Dark Mode
```css
--primary: oklch(0.70 0.16 160.43);              /* Muted green for dark */
--primary-foreground: oklch(0.39 0.10 152.27);   /* Dark text on green */
--sidebar: oklch(0.696 0.17 162.48);
--sidebar-foreground: oklch(0.393 0.095 152.535);
--sidebar-primary: oklch(0.696 0.17 162.48);
--sidebar-accent: oklch(0.5 0.15 162.48);
--sidebar-border: oklch(0.4 0.12 162.48);
--sidebar-ring: oklch(0.527 0.154 150.069);
```

### Design Principles
- **Consistency**: Use Tailwind CSS classes that reference CSS variables
- **Accessibility**: Maintain proper contrast ratios in both modes
- **Smooth Transitions**: Animate theme changes gracefully
- **System Awareness**: Respect user's OS preference while allowing manual toggle

---

## Component Architecture

### Current Structure (Problematic)
```
RootLayout
└── AuthProvider
    └── AuthenticatedLayout
        └── AppShell [renders AppSidebar]
            └── Dashboard
                └── FellowshipDashboard [renders FellowshipSidebar]
```

### Proposed Structure (Clean)
```
RootLayout
└── AuthProvider
    └── AuthenticatedLayout
        └── DashboardWithCollapsibleSidebar [unified component]
            ├── Sidebar (collapsible, green themed)
            │   ├── Logo & Title
            │   ├── Dark Mode Toggle
            │   ├── Navigation Items (role-based)
            │   ├── Account Section
            │   └── Collapse Toggle
            └── Main Content Area
                └── Dashboard Content (cards, charts, tables)
```

---

## Unified Sidebar Component Design

### Component: `dashboard-with-collapsible-sidebar.tsx`

#### Location
`apps/web/src/components/ui/dashboard-with-collapsible-sidebar.tsx`

#### Features Checklist

**From AppSidebar** ✅
- [x] Next.js `Link` components for routing
- [x] `usePathname` hook for active state
- [x] Auth context integration (`useAuth`)
- [x] Role-based navigation (STAFF, ADMIN, AGENCY)
- [x] Dropdown menu for settings/logout
- [x] Church name display
- [x] TypeScript interfaces

**From FellowshipSidebar** ✅
- [x] Notification badge system
- [x] Help & Support option
- [x] Polished visual design
- [x] Smooth animations

**New Features** 🆕
- [x] Dark mode toggle button in sidebar
- [x] Green theme via CSS variables
- [x] Responsive mobile drawer
- [x] State persistence (localStorage)
- [x] Accessible keyboard navigation

#### Component Structure

```typescript
// Main export for easy import
export function Example() {
  return <DashboardWithCollapsibleSidebar />
}

// Sub-components
export function DashboardWithCollapsibleSidebar({ children }) {
  const [open, setOpen] = useState(true)
  const [isDark, setIsDark] = useState(false)
  
  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} setOpen={setOpen} isDark={isDark} setIsDark={setIsDark} />
      <main className="flex-1">{children}</main>
    </div>
  )
}

function Sidebar({ open, setOpen, isDark, setIsDark }) {
  // Navigation items with role-based filtering
  // Dark mode toggle
  // Collapsible functionality
}
```

---

## Navigation Structure

### Primary Navigation Items
```typescript
const navigationItems = [
  { 
    icon: Home, 
    label: 'Dashboard', 
    href: '/',
    badge: undefined,
    roles: ['STAFF', 'ADMIN', 'AGENCY']
  },
  { 
    icon: Users, 
    label: 'Contacts', 
    href: '/contacts',
    badge: 8,  // Dynamic count
    roles: ['STAFF', 'ADMIN', 'AGENCY']
  },
  { 
    icon: Megaphone, 
    label: 'Ministries', 
    href: '/ministries',
    roles: ['STAFF', 'ADMIN', 'AGENCY']
  },
  { 
    icon: Calendar, 
    label: 'Events', 
    href: '/events',
    roles: ['STAFF', 'ADMIN', 'AGENCY']
  },
  { 
    icon: MessageCircle, 
    label: 'Grace Assistant', 
    href: '/grace',
    badge: 3,  // Pending tasks
    roles: ['STAFF', 'ADMIN', 'AGENCY']
  },
  { 
    icon: BarChart3, 
    label: 'Reports', 
    href: '/reports',
    roles: ['STAFF', 'ADMIN', 'AGENCY']
  },
]
```

### Admin Items (ADMIN role only)
```typescript
const adminItems = [
  { icon: UserCog, label: 'Staff Management', href: '/admin/staff' },
  { icon: Settings, label: 'Church Settings', href: '/admin/settings' },
]
```

### Agency Items (AGENCY role only)
```typescript
const agencyItems = [
  { icon: Church, label: 'All Churches', href: '/agency/churches' },
  { icon: BarChart3, label: 'Agency Reports', href: '/agency/reports' },
]
```

### Account Section
```typescript
const accountItems = [
  { icon: Settings, label: 'Settings', href: '/profile' },
  { icon: HelpCircle, label: 'Help & Support', href: '/help' },
  { icon: LogOut, label: 'Sign Out', action: signOut },
]
```

---

## Dark Mode Implementation

### Strategy

#### 1. Class-Based Toggle
```typescript
const [isDark, setIsDark] = useState(false)

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}, [isDark])
```

#### 2. Initial State from localStorage
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark))
}, [])
```

#### 3. Toggle Button in Sidebar
```tsx
<button
  onClick={() => setIsDark(!isDark)}
  className="flex h-10 w-10 items-center justify-center rounded-lg 
             border border-sidebar-border bg-sidebar 
             hover:bg-sidebar-accent transition-colors"
>
  {isDark ? (
    <Sun className="h-4 w-4 text-sidebar-foreground" />
  ) : (
    <Moon className="h-4 w-4 text-sidebar-foreground" />
  )}
</button>
```

### Styling with Theme Variables

All sidebar components will use theme-aware Tailwind classes:

```tsx
// Sidebar container
<nav className="
  sticky top-0 h-screen shrink-0 
  bg-sidebar text-sidebar-foreground
  border-r border-sidebar-border
  transition-all duration-300
">

// Active navigation item
<div className="
  bg-sidebar-accent text-sidebar-accent-foreground
  border-l-2 border-primary
  shadow-sm
">

// Hover state
<div className="
  hover:bg-sidebar-accent 
  hover:text-sidebar-accent-foreground
">
```

---

## Dashboard Content Organization

### Current FellowshipDashboard Layout
The [`FellowshipDashboard`](apps/web/src/components/dashboard/fellowship-dashboard.tsx:33) has excellent card-based organization that should be preserved:

```tsx
<div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6">
  {/* Header with welcome message and actions */}
  
  {/* Church Metrics Cards */}
  <ChurchSectionCards />
  
  {/* Interactive Chart */}
  <ChurchChartInteractive />
  
  {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Recent Contacts Table */}
    <div className="lg:col-span-2">
      <ContactsTable limit={5} />
    </div>
    
    {/* Side Column */}
    <div className="space-y-6">
      {/* Activity Feed */}
      <ActivityFeed limit={8} />
      
      {/* Grace Widget */}
      <GraceWidget />
    </div>
  </div>
</div>
```

### Refactored Structure

The dashboard content should be **extracted** from FellowshipDashboard and moved to a clean component:

```tsx
// apps/web/src/components/dashboard/dashboard-content.tsx
export function DashboardContent() {
  const { user } = useAuth()
  
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <DashboardHeader user={user} />
      
      {/* Metrics Cards */}
      <ChurchSectionCards />
      
      {/* Chart */}
      <ChurchChartInteractive />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ContactsTable limit={5} />
        </div>
        <div className="space-y-6">
          <ActivityFeed limit={8} />
          <GraceWidget />
        </div>
      </div>
    </div>
  )
}
```

---

## Implementation Steps

### Phase 1: Create Unified Component ✅
**Files to Create:**
- `apps/web/src/components/ui/dashboard-with-collapsible-sidebar.tsx`

**Implementation Checklist:**
- [ ] Base component structure with TypeScript
- [ ] Sidebar sub-component with collapsible state
- [ ] Navigation items with role-based filtering
- [ ] Dark mode toggle integration
- [ ] Green theme styling with CSS variables
- [ ] Notification badge system
- [ ] Active route highlighting
- [ ] Account dropdown menu
- [ ] Mobile responsive drawer
- [ ] Export as `Example` component

### Phase 2: Update Layout Components ✅
**Files to Modify:**
1. [`apps/web/src/components/layout/app-shell.tsx`](apps/web/src/components/layout/app-shell.tsx:10)
   - Replace [`AppSidebar`](apps/web/src/components/layout/app-shell.tsx:3) import with new component
   - Remove [`SiteHeader`](apps/web/src/components/layout/app-shell.tsx:4) (header merged into sidebar)
   - Simplify structure

**Before:**
```tsx
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**After:**
```tsx
import { Example as DashboardLayout } from '@/components/ui/dashboard-with-collapsible-sidebar'

export function AppShell({ children }: AppShellProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
```

### Phase 3: Refactor Dashboard Component ✅
**Files to Modify:**
1. [`apps/web/src/components/dashboard/fellowship-dashboard.tsx`](apps/web/src/components/dashboard/fellowship-dashboard.tsx:33)
   - Remove [`FellowshipSidebar`](apps/web/src/components/dashboard/fellowship-dashboard.tsx:57) component
   - Remove wrapper `<div className="flex">` structure
   - Extract [`FellowshipContent`](apps/web/src/components/dashboard/fellowship-dashboard.tsx:224) to standalone component
   - Remove dark mode toggle (now in sidebar)

**Before:**
```tsx
export const FellowshipDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <FellowshipSidebar />
      <FellowshipContent />
    </div>
  )
}
```

**After:**
```tsx
export const FellowshipDashboard = () => {
  const { user } = useAuth()
  
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at {user.church?.name} today.
          </p>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <ChurchSectionCards />
      <ChurchChartInteractive />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ... existing content ... */}
      </div>
    </div>
  )
}
```

### Phase 4: Testing & Verification ✅
**Test Cases:**
1. **Navigation**
   - [ ] All routes navigate correctly
   - [ ] Active state highlights current page
   - [ ] Role-based items show/hide properly

2. **Dark Mode**
   - [ ] Toggle switches theme
   - [ ] Theme persists on page reload
   - [ ] Green colors look good in both modes
   - [ ] All components adapt to theme

3. **Sidebar**
   - [ ] Collapse/expand animation smooth
   - [ ] State persists on navigation
   - [ ] Notification badges display
   - [ ] Mobile drawer works

4. **Dashboard**
   - [ ] Cards render properly
   - [ ] Charts display correctly
   - [ ] Layout responsive
   - [ ] No duplicate sidebars

### Phase 5: Cleanup ✅
**Files to Archive/Remove:**
- [ ] `apps/web/src/components/layout/app-sidebar.tsx` (old sidebar)
- [ ] `apps/web/src/components/layout/site-header.tsx` (if unused)
- [ ] Old sidebar components from `fellowship-dashboard.tsx`

**Documentation Updates:**
- [ ] Update README with new component usage
- [ ] Add JSDoc comments to new component
- [ ] Document theme customization options

---

## TypeScript Interfaces

### Navigation Item
```typescript
interface NavigationItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
  roles?: ('STAFF' | 'ADMIN' | 'AGENCY')[]
}
```

### Sidebar Props
```typescript
interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  isDark: boolean
  setIsDark: (isDark: boolean) => void
}
```

### Dashboard Layout Props
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
  defaultOpen?: boolean
  defaultTheme?: 'light' | 'dark'
}
```

---

## Visual Design Specifications

### Sidebar Dimensions
- **Expanded**: 256px (w-64)
- **Collapsed**: 64px (w-16)
- **Transition**: 300ms ease-in-out

### Spacing
- **Padding**: 0.5rem (p-2)
- **Gap between items**: 0.25rem (space-y-1)
- **Border radius**: 0.65rem (var(--radius))

### Typography
- **Logo/Title**: text-sm font-semibold
- **Subtitle**: text-xs text-muted-foreground
- **Nav items**: text-sm font-medium
- **Badges**: text-xs font-medium

### Color Usage
```scss
// Sidebar background
bg-sidebar

// Sidebar text
text-sidebar-foreground

// Active item
bg-sidebar-accent 
text-sidebar-accent-foreground
border-l-2 border-primary

// Hover state
hover:bg-sidebar-accent
hover:text-sidebar-accent-foreground

// Border
border-sidebar-border

// Notification badge
bg-primary text-primary-foreground
```

---

## Responsive Behavior

### Desktop (>= 1024px)
- Sidebar persists as side panel
- Collapsible via toggle button
- State saved to localStorage

### Tablet (768px - 1023px)
- Sidebar starts collapsed
- Expands on hover or click
- Overlay when expanded

### Mobile (< 768px)
- Sidebar hidden by default
- Hamburger menu button in header
- Full-screen drawer overlay
- Swipe to close

---

## Migration Checklist

### Pre-Implementation
- [x] Document current architecture
- [x] Identify duplicate code
- [x] Map navigation routes
- [x] Define theme specifications
- [ ] Create backup branch

### Implementation
- [ ] Create new unified component
- [ ] Implement dark mode toggle
- [ ] Apply green theme styling
- [ ] Update AppShell layout
- [ ] Refactor FellowshipDashboard
- [ ] Test all routes
- [ ] Verify theme switching
- [ ] Check mobile responsiveness

### Post-Implementation
- [ ] Remove old components
- [ ] Update imports across app
- [ ] Test on multiple browsers
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Documentation update

---

## Success Criteria

✅ **No duplicate sidebars** - Single unified sidebar across all pages

✅ **Green theme consistency** - Uses CSS variables throughout

✅ **Dark mode working** - Toggle in sidebar, persists across sessions

✅ **Responsive design** - Works on desktop, tablet, mobile

✅ **Role-based navigation** - Items show/hide based on user role

✅ **Dashboard layout preserved** - Cards and content maintain current UX

✅ **Performance** - Smooth animations, no jank

✅ **Accessibility** - Keyboard navigation, screen reader support

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Component Creation | 2-3 hours | None |
| Layout Updates | 1 hour | Phase 1 complete |
| Dashboard Refactor | 1-2 hours | Phase 2 complete |
| Testing | 2 hours | Phase 3 complete |
| Cleanup | 30 min | Phase 4 complete |
| **Total** | **6-8 hours** | - |

---

## Risk Mitigation

### Risk: Breaking existing functionality
**Mitigation**: Implement in feature branch, extensive testing before merge

### Risk: Theme inconsistencies
**Mitigation**: Use CSS variables exclusively, test both modes

### Risk: Route navigation issues
**Mitigation**: Use Next.js Link components, test all routes

### Risk: State management conflicts
**Mitigation**: Single source of truth for sidebar/theme state

---

## Next Steps

1. **Review & Approve** this plan
2. **Create feature branch** `feature/unified-sidebar`
3. **Switch to Code mode** to implement the solution
4. **Progressive testing** after each phase
5. **User acceptance testing** before merge

---

## Questions for Stakeholder

- [ ] Is the green theme specification accurate?
- [ ] Should dark mode be the default for new users?
- [ ] Are there any additional navigation items needed?
- [ ] Should we add keyboard shortcuts for sidebar toggle?
- [ ] Any specific accessibility requirements?

---

*Document Version: 1.0*  
*Last Updated: 2025-10-01*  
*Author: Roo (Architect Mode)*