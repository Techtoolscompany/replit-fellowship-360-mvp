Fellowship 360 Architecture Document
1. High Level Architecture
Technical Summary
This architecture describes a modern, scalable, full-stack application. The frontend will be a Next.js application hosted on Vercel for optimal performance and seamless CI/CD. The backend services, including a self-hosted Supabase instance and the n8n workflow engine, will run on a Hostinger VPS for full control. This hybrid hosting model leverages the strengths of each platform, creating a robust and performant system. The entire platform is designed with a multi-tenant data model to support the agency business model.

High Level Project Diagram
graph TD
    subgraph Internet
        A[User/Caller]
        H[Staff User]
        S[Agency User]
    end

    subgraph Vercel Platform
        I{Next.js CRM Frontend}
    end

    subgraph Hostinger VPS
        C(n8n Workflow Engine)
        F(Supabase DB & Backend)
    end
    
    subgraph External Services
        B(Twilio)
        D(ElevenLabs)
        E(OpenAI GPT)
        G(Google Workspace API)
    end

    A -- Phone Call --> B;
    H -- Interacts with --> I;
    S -- Monitors via --> I;
    I -- API Calls --> F;
    I -- User Actions --> C;
    B -- Webhook / API Call --> C;
    C -- Text-to-Speech --> D;
    D -- Synthesized Voice --> B;
    B -- Voice --> A;
    C -- LLM Processing --> E;
    E -- Response --> C;
    C -- Database Actions --> F;
    C -- Calendar/Email Actions --> G;

2. Architectural and Design Patterns
Backend: Repository Pattern, Service Layer Pattern, Workflow Orchestration (n8n).

Frontend: Component-Based Architecture (Shadcn UI), Custom Hooks, Server Components.

3. Tech Stack
Category

Technology

Version

Purpose

Frontend Framework

Next.js

15.1.0

Web application framework

UI Components

Shadcn UI

0.8.0

UI component collection

Backend Platform

Supabase

1.178.2

Backend, database, auth

Workflow Engine

n8n

5.2.1

Complex process automation

Core LLM

OpenAI GPT-4o

Latest

Conversational intelligence

Voice Generation

ElevenLabs

Latest

AI voice for Grace

Telephony (Voice)

Twilio

Latest

Voice gateway

Telephony (SMS)

Textbee

Latest

Cost-effective SMS gateway

Real-time Comms

LiveKit

2.2.0

High-speed interactions

4. Data Models
The data model is multi-tenant, with all primary records associated with a Church organization.

Core Models: Church, Contact, Ministry, Event, ActivityLog.

Access Control: A Roles and Permissions system will be implemented on top of Supabase Auth to manage access for different staff types and the agency.

5. Components
Grace AI Orchestrator: A collection of n8n workflows that act as the backend "brain," integrating all external services.

CRM Frontend: The Next.js application on Vercel, providing the interface for church staff.

Agency Dashboard: A special view within the CRM, accessible only to agency-level users, for monitoring client churches.