# Shop Assistant

A brownfield e-commerce application used as a workshop demo for **SpecKit** — a structured, agent-driven software development workflow powered by GitHub Copilot. The project consists of an ASP.NET Core 10 backend API and a Next.js 14 frontend, serving as the real-world codebase that SpecKit operates on to demonstrate how AI-assisted specification, planning, and implementation work in practice.

## Branch Structure

| Branch | Purpose |
|---|---|
| `feature/spec-kit/demo-brownfield-base` | Stable baseline of the shop-assistant application |
| `feature/spec-kit/01-init` | SpecKit initialization — scaffolds the `.specify/` directory and prompt files |
| `feature/spec-kit/02-constitution` | Constitution generation — establishes project principles from codebase analysis |
| `feature/spec-kit/03-specify` | Specification — produces the feature spec and API contracts |
| `feature/spec-kit/04-clarify` | Clarification — resolves open questions and ambiguities in the spec |
| `feature/spec-kit/05-plan` | Planning — creates the implementation plan from the spec |
| `feature/spec-kit/06-tasks` | Task generation — breaks the plan into actionable task files |
| `feature/spec-kit/07-analyze` | Analysis — reviews tasks for constitution compliance and risks |
| `feature/spec-kit/08-implement` | Implementation — executes the tasks with code changes |
| `feature/spec-kit/09-final-demo` | Final demo — complete end-to-end result of the SpecKit workflow |

Each `feature/spec-kit/*` branch builds incrementally on the previous one, showing the progression through the SpecKit workflow steps. You can check out any branch to see the state of the project at that stage.

## 📁 Project Structure

```
shop-assistant/
├── frontend/          # Next.js 14 + React + TypeScript frontend
├── backend/           # ASP.NET Core 10 Web API + EF Core + SQL Server
├── .specify/          # SpecKit templates, constitution, and memory
├── .github/prompts/   # SpecKit slash command prompt files
├── specs/             # Feature specs, contracts, plans, and tasks
└── scripts/           # Install and setup scripts
```

## 🚀 Quick Start

### Frontend (Next.js)

```bash
cd frontend
pnpm install
pnpm dev
```

Visit http://localhost:3000

### Backend (.NET 10)

```bash
cd backend
dotnet run
```

API available at http://localhost:5250

## 📚 Documentation

- **[Frontend README](frontend/README.md)** - Frontend setup, API integration, and architecture
- **[Backend README](backend/README.md)** - Backend API setup and endpoints

## 📖 SpecKit Workflow

This repo demonstrates the **GitHub SpecKit** workflow — a structured, multi-stage pipeline that uses GitHub Copilot agents to go from feature idea to shipped code. The workflow is driven by slash commands (e.g. `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`) that invoke specialized agents, each producing traceable artifacts in the `.specify/` directory.

### Workflow Stages

1. **Init**: Scaffold the `.specify/` directory, templates, and prompt files
2. **Constitution**: Deep-analyze the codebase to generate project principles and governance rules
3. **Specify**: Produce a feature specification with API contracts and research decisions
4. **Clarify**: Resolve open questions and ambiguities in the spec
5. **Plan**: Create a detailed implementation plan from the spec, checked against the constitution
6. **Tasks**: Break the plan into ordered, atomic task files
7. **Analyze**: Review tasks for compliance, risks, and dependencies
8. **Implement**: Execute the tasks with code changes, one batch at a time

### Key Artifacts

| Directory | Contents |
|---|---|
| `.specify/templates/` | Constitution, plan, spec, tasks, and checklist templates |
| `.specify/memory/` | `constitution.md` — the project's governing principles |
| `.github/prompts/` | `speckit.*.prompt.md` slash command prompt files |
| `specs/<feature>/` | Per-feature specs, contracts, research, plans, and tasks |

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: React Context + localStorage

### Backend
- **Framework**: ASP.NET Core 10 Web API
- **Language**: C# 13
- **Database**: SQL Server (LocalDB/Developer/Docker)
- **ORM**: Entity Framework Core
- **API Docs**: Swagger/OpenAPI

## 📝 Note on spec2cloud

This project was originally scaffolded using [spec2cloud](https://github.com/EmeaAppGbb/spec2cloud), an AI-powered workflow with specialized Copilot agents (`@pm`, `@dev`, `@architect`, `@planner`). The `specs/` directory and agent definitions in `.github/` come from that earlier phase. The current focus of this repo is demonstrating the **SpecKit** workflow.
