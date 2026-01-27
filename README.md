# Shop Assistant - E-Commerce Demo

A modern, full-stack e-commerce demonstration application showcasing premium UI/UX, Next.js frontend, and .NET 10 backend with SQL Server.

## 📁 Project Structure

\\\
shop-assistant/
├── frontend/          # Next.js 14 + React + TypeScript frontend
├── backend/           # .NET 10 Web API (coming soon)
├── specs/            # Product and feature specifications
│   ├── prd.md        # Product Requirements Document
│   ├── features/     # Feature Requirements Documents (FRDs)
│   └── tasks/        # Technical implementation tasks
├── docs/             # MkDocs documentation
└── .github/          # Workflows, prompts, and agents
\\\

## 🚀 Quick Start

### Frontend (Next.js)

\\\ash
cd frontend
pnpm install
pnpm dev
\\\

Visit http://localhost:3000

### Backend (.NET 10) - Coming Soon

Backend implementation follows the tasks defined in [\specs/tasks/\](specs/tasks/).

\\\ash
cd backend
dotnet run
\\\

API will be available at http://localhost:5000

## 📚 Documentation

- **[Product Requirements (PRD)](specs/prd.md)** - Complete product specification
- **[Feature Requirements](specs/features/)** - Detailed feature specifications (FRD-001 through FRD-009)
- **[Technical Tasks](specs/tasks/)** - Implementation task breakdown (TASK-001 through TASK-008)
- **[Demo Guide](frontend/DEMO_GUIDE.md)** - 5-10 minute presentation guide
- **[Architecture Documentation](docs/)** - MkDocs documentation site

## 🎯 Current Status

✅ **Phase 1 Complete**: Frontend implementation (Next.js, React, TypeScript, Tailwind)  
🔄 **Phase 2 In Progress**: Backend API and database integration (.NET 10 + SQL Server)

### What's Working
- Full frontend with product browsing, filtering, search
- Shopping cart (localStorage-based)
- Complete checkout flow
- Responsive design (mobile, tablet, desktop)
- Smooth animations and interactions

### What's Next
- Backend API implementation (see [task breakdown](specs/tasks/))
- Database setup with SQL Server
- Frontend-backend integration
- API documentation with Swagger

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: React Context + localStorage

### Backend (Coming Soon)
- **Framework**: .NET 10 Web API
- **Database**: SQL Server (LocalDB/Developer/Docker)
- **ORM**: Entity Framework Core
- **API Docs**: Swagger/OpenAPI

## 📖 Development Workflow

This project uses **spec2cloud** AI-powered development workflow with specialized GitHub Copilot agents.

### Specialized Agents
- \@pm\ - Product Manager (creates PRDs, FRDs)
- \@dev\ - Developer (implements features)
- \@architect\ - Architect (creates ADRs)
- \@planner\ - Planner (breaks down tasks)

### Workflow Prompts
- \/prd\ - Generate Product Requirements Document
- \/frd\ - Generate Feature Requirements Documents
- \/plan\ - Break features into technical tasks
- \/delegate\ - Delegate task to developer

See [\.github/prompts/\](.github/prompts/) for all available workflows.

## 🎨 About spec2cloud

**Spec2Cloud** is an AI-powered development workflow that transforms high-level product ideas into production-ready applications deployed on Azure—using specialized GitHub Copilot agents working together.

For more details, see [README.spec2cloud.md](README.spec2cloud.md) or visit the [spec2cloud repository](https://github.com/EmeaAppGbb/spec2cloud).

---

**From idea to production, powered by AI agents.** 🚀
