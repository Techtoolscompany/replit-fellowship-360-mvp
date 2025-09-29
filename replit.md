# GraceCRM Multi-Tenant Church Management System

## Overview

GraceCRM is a multi-tenant church management system designed to serve multiple churches from a single application instance. The system provides church administrators with tools to manage members, track interactions, and monitor church growth metrics. Built with a modern full-stack architecture, it features role-based access control, comprehensive analytics, and a clean, responsive user interface optimized for church administration workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, using a modern component-based architecture. The UI leverages shadcn/ui components with Radix UI primitives for accessibility and consistency. Styling is handled through Tailwind CSS with a custom design system featuring CSS variables for theming. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching.

### Backend Architecture
The server follows a REST API pattern built on Express.js with TypeScript. The architecture separates concerns through distinct layers: route handlers for HTTP endpoints, storage abstraction for data operations, and database connectivity through Drizzle ORM. Authentication is implemented using JWT tokens with bcrypt for password hashing. The system supports role-based access control with ADMIN and MEMBER roles, ensuring proper multi-tenant isolation.

### Database Design
PostgreSQL serves as the primary database with Drizzle ORM providing type-safe database operations. The schema implements a multi-tenant architecture where churches are isolated through foreign key relationships. Core entities include users, churches, members, and grace interactions. The design supports different subscription plans (Trial, Starter, Professional, Enterprise) and tracks various interaction types (Voice, Chat, Calendar, SMS, Workflow) with their completion status.

### Authentication & Authorization
JWT-based authentication provides stateless session management with token-based API security. The system implements two-tier authorization: role-based permissions (Admin vs Member) and tenant-based isolation (users can only access their assigned church data). Admins have cross-church visibility for agency-level management, while regular members are restricted to their church's data.

### Multi-Tenant Strategy
The application uses a shared database with tenant isolation through foreign keys. Each church operates as an independent tenant with isolated data access. The routing system directs users to appropriate dashboards based on their role and church assignment. Agency administrators can manage multiple churches through a centralized dashboard, while church members access church-specific interfaces.

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database provider for scalable cloud database hosting
- **Drizzle ORM**: Type-safe database toolkit providing schema management and query building

### UI Component Libraries
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library built on Radix UI with consistent styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### Authentication & Security
- **bcrypt**: Password hashing library for secure credential storage
- **jsonwebtoken**: JWT implementation for stateless authentication tokens

### State Management & Data Fetching
- **TanStack Query**: Server state management with caching, background updates, and optimistic UI
- **React Hook Form**: Form state management with validation integration
- **Zod**: TypeScript-first schema validation for runtime type safety

### Development & Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking for enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

### Runtime Environment
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework for REST API endpoints