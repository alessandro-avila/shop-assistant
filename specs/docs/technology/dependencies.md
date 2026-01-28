# Dependencies & Tools Analysis

## Overview

This document provides a comprehensive analysis of all dependencies, tools, and external libraries used in the Shop Assistant application. This includes version information, purpose, licensing, and maintenance status.

**Analysis Date:** January 28, 2026

---

## Backend Dependencies (.NET/NuGet)

### Production Dependencies (5)

#### 1. Microsoft.AspNetCore.OpenApi
**Version:** 10.* (latest 10.x)  
**Purpose:** OpenAPI 3.0 specification generation for ASP.NET Core APIs  
**License:** MIT  
**Maintainer:** Microsoft  
**Status:** ✅ Actively maintained (part of .NET 10)  
**Security:** ✅ Enterprise-grade, Microsoft security

**Usage in Project:**
- Generates OpenAPI specification from API controllers
- Integrated with Swagger UI
- Automatic schema generation from C# models

---

#### 2. Microsoft.EntityFrameworkCore.SqlServer
**Version:** 10.* (latest 10.x)  
**Purpose:** SQL Server database provider for Entity Framework Core  
**License:** MIT  
**Maintainer:** Microsoft  
**Status:** ✅ Actively maintained (part of EF Core 10)  
**Security:** ✅ Enterprise-grade

**Usage in Project:**
- ORM for database access
- LINQ query translation to SQL
- Database migrations
- Connection pooling
- Transaction management

**Performance:**
- Connection pooling enabled by default
- Retry logic configured (3 retries, 5-second delay)
- Command timeout: 30 seconds

---

#### 3. Microsoft.EntityFrameworkCore.Tools
**Version:** 10.* (latest 10.x)  
**Purpose:** Design-time tools for Entity Framework Core (migrations, scaffolding)  
**License:** MIT  
**Maintainer:** Microsoft  
**Status:** ✅ Actively maintained  
**Development Only:** Yes

**Usage in Project:**
- `dotnet ef migrations add` - Create migrations
- `dotnet ef database update` - Apply migrations
- `dotnet ef database drop` - Drop database
- `dotnet ef migrations list` - View migrations

**Note:** Not included in published output (PrivateAssets=all)

---

#### 4. Swashbuckle.AspNetCore
**Version:** 10.1.0  
**Purpose:** Swagger/OpenAPI tools for ASP.NET Core  
**License:** MIT  
**Maintainer:** domaindrivendev (community)  
**Status:** ✅ Actively maintained  
**GitHub:** [domaindrivendev/Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)

**Usage in Project:**
- Swagger UI at `/swagger`
- OpenAPI spec generation
- Interactive API documentation
- Development-only (removed in production build)

**Dependencies:**
- Swashbuckle.AspNetCore.Swagger
- Swashbuckle.AspNetCore.SwaggerGen
- Swashbuckle.AspNetCore.SwaggerUI

---

#### 5. Swashbuckle.AspNetCore.Annotations
**Version:** 10.1.0  
**Purpose:** Annotations for Swagger documentation (Tags, examples, etc.)  
**License:** MIT  
**Maintainer:** domaindrivendev (community)  
**Status:** ✅ Actively maintained

**Usage in Project:**
- `[Tags]` attribute for grouping endpoints
- `[ProducesResponseType]` for status code documentation
- Example values for DTOs
- Enhanced API documentation

---

### .NET SDK Requirements

**Minimum Version:** .NET 10.0 SDK  
**Recommended:** Latest .NET 10.x SDK  
**Target Framework:** net10.0  
**Runtime:** ASP.NET Core 10.x

**Features Used:**
- C# 12 language features
- Nullable reference types
- Implicit usings
- Top-level statements
- Record types (in DTOs)

---

## Frontend Dependencies (npm/pnpm)

### Production Dependencies (6)

#### 1. next
**Version:** ^14.2.18  
**Purpose:** React framework for production-grade web applications  
**License:** MIT  
**Maintainer:** Vercel  
**Status:** ✅ Actively maintained  
**GitHub:** [vercel/next.js](https://github.com/vercel/next.js)

**Usage in Project:**
- App Router (file-based routing)
- Server Components for SSR
- Client Components for interactivity
- Image optimization (next/image)
- Font optimization (next/font)
- Automatic code splitting

**Bundle Size:** ~90KB gzipped (core runtime)

---

#### 2. react
**Version:** ^18.3.1  
**Purpose:** JavaScript library for building user interfaces  
**License:** MIT  
**Maintainer:** Meta (Facebook)  
**Status:** ✅ Actively maintained  
**GitHub:** [facebook/react](https://github.com/facebook/react)

**Usage in Project:**
- Functional components
- Hooks (useState, useEffect, useReducer, useContext)
- Context API for global state
- Suspense for async rendering

**Bundle Size:** ~45KB gzipped (with react-dom)

---

#### 3. react-dom
**Version:** ^18.3.1  
**Purpose:** DOM rendering for React  
**License:** MIT  
**Maintainer:** Meta (Facebook)  
**Status:** ✅ Actively maintained

**Usage in Project:**
- Server-side rendering (SSR)
- Client-side hydration
- Event handling
- DOM manipulation

---

#### 4. framer-motion
**Version:** ^11.11.11  
**Purpose:** Production-ready animation library for React  
**License:** MIT  
**Maintainer:** Framer  
**Status:** ✅ Actively maintained  
**GitHub:** [framer/motion](https://github.com/framer/motion)

**Usage in Project:**
- Page transitions
- Component animations (fade-in, slide-in, bounce)
- Hover effects
- Scroll-based animations
- Layout animations

**Bundle Size:** ~40KB gzipped

---

#### 5. clsx
**Version:** ^2.1.1  
**Purpose:** Utility for constructing className strings conditionally  
**License:** MIT  
**Maintainer:** lukeed  
**Status:** ✅ Actively maintained  
**GitHub:** [lukeed/clsx](https://github.com/lukeed/clsx)

**Usage in Project:**
- Conditional CSS class application
- Component styling
- Tailwind class concatenation

**Bundle Size:** <1KB

---

#### 6. tailwind-merge
**Version:** ^2.5.5  
**Purpose:** Merge Tailwind CSS classes without style conflicts  
**License:** MIT  
**Maintainer:** dcastil  
**Status:** ✅ Actively maintained  
**GitHub:** [dcastil/tailwind-merge](https://github.com/dcastil/tailwind-merge)

**Usage in Project:**
- Combines with clsx for cn() utility
- Resolves conflicting Tailwind classes
- Component style composition

**Bundle Size:** ~8KB gzipped

---

### Development Dependencies (9)

#### 1. @types/node
**Version:** ^22.10.1  
**Purpose:** TypeScript definitions for Node.js  
**License:** MIT  
**Status:** ✅ Actively maintained

---

#### 2. @types/react
**Version:** ^18.3.12  
**Purpose:** TypeScript definitions for React  
**License:** MIT  
**Status:** ✅ Actively maintained

---

#### 3. @types/react-dom
**Version:** ^18.3.1  
**Purpose:** TypeScript definitions for React DOM  
**License:** MIT  
**Status:** ✅ Actively maintained

---

#### 4. typescript
**Version:** ^5.7.2  
**Purpose:** TypeScript language and compiler  
**License:** Apache 2.0  
**Maintainer:** Microsoft  
**Status:** ✅ Actively maintained

**Configuration:**
- Strict mode enabled
- Bundle resolution
- Path aliases (@/*)
- JSX preserve mode

---

#### 5. eslint
**Version:** ^8.57.1  
**Purpose:** JavaScript/TypeScript linter  
**License:** MIT  
**Maintainer:** OpenJS Foundation  
**Status:** ✅ Actively maintained

**Rules:** Next.js recommended + React Hooks

---

#### 6. eslint-config-next
**Version:** ^14.2.18  
**Purpose:** ESLint configuration for Next.js projects  
**License:** MIT  
**Maintainer:** Vercel  
**Status:** ✅ Actively maintained

---

#### 7. tailwindcss
**Version:** ^3.4.17  
**Purpose:** Utility-first CSS framework  
**License:** MIT  
**Maintainer:** Tailwind Labs  
**Status:** ✅ Actively maintained  
**GitHub:** [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)

**Features Used:**
- JIT (Just-In-Time) compiler
- Custom color palette
- Custom animations
- Responsive utilities
- Form plugin

---

#### 8. postcss
**Version:** ^8.4.49  
**Purpose:** CSS transformation tool  
**License:** MIT  
**Maintainer:** PostCSS community  
**Status:** ✅ Actively maintained

**Plugins:**
- autoprefixer (vendor prefixes)
- tailwindcss (Tailwind processing)

---

#### 9. autoprefixer
**Version:** ^10.4.20  
**Purpose:** Automatically add vendor prefixes to CSS  
**License:** MIT  
**Status:** ✅ Actively maintained

---

#### 10. @tailwindcss/forms
**Version:** ^0.5.9  
**Purpose:** Better default form styles for Tailwind CSS  
**License:** MIT  
**Maintainer:** Tailwind Labs  
**Status:** ✅ Actively maintained

**Usage in Project:**
- Enhanced form input styling
- Consistent form element appearance

---

## Package Managers

### Backend: .NET CLI + NuGet
**Version:** Bundled with .NET 10 SDK  
**Package Source:** nuget.org  
**Lock File:** Not used (packages.lock.json not present)

**Commands:**
- `dotnet restore` - Restore packages
- `dotnet build` - Build with package restore
- `dotnet add package` - Add package
- `dotnet list package` - List packages
- `dotnet list package --vulnerable` - Check vulnerabilities

---

### Frontend: pnpm
**Version:** 10.20.0 (specified in package.json)  
**Advantages:**
- Fast package installation
- Disk-efficient (content-addressable store)
- Strict dependency resolution
- Monorepo support

**Lock File:** `pnpm-lock.yaml` (committed)

**Commands:**
- `pnpm install` - Install dependencies
- `pnpm add` - Add dependency
- `pnpm update` - Update dependencies
- `pnpm audit` - Security audit

---

## Development Tools

### Backend Development

#### Visual Studio Code
**Extensions Recommended:**
- C# Dev Kit (Microsoft)
- C# (Microsoft)
- REST Client (for .http files)
- SQL Server (mssql)

#### .NET CLI Tools
- `dotnet ef` - Entity Framework Core CLI
- `dotnet watch` - File watcher for hot reload
- `dotnet build` - Build project
- `dotnet run` - Run application

---

### Frontend Development

#### Visual Studio Code
**Extensions Recommended:**
- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Prettier (optional - not configured in project)

#### Node.js Tools
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript type checking

---

## Database Tools

### SQL Server LocalDB
**Version:** Bundled with Visual Studio or standalone installer  
**Purpose:** Lightweight SQL Server for development  
**License:** Microsoft (free for development)

**Management Tools:**
- SQL Server Management Studio (SSMS) - GUI
- Azure Data Studio - Cross-platform GUI
- `dotnet ef` - Command-line migrations
- `sqlcmd` - Command-line queries

---

## Security Scanning Tools

### Current State: ❌ NOT IMPLEMENTED

### Recommended Tools:

#### Backend
- **dotnet list package --vulnerable** - Built-in vulnerability scanning
- **OWASP Dependency-Check** - Dependency vulnerability scanner
- **SonarQube** - Code quality and security
- **Snyk** - Dependency security

#### Frontend
- **npm audit / pnpm audit** - Built-in vulnerability scanning
- **Snyk** - Dependency security
- **GitHub Dependabot** - Automated dependency updates
- **retire.js** - JavaScript library vulnerability scanner

---

## Dependency Update Strategy

### Current State: ❌ NO AUTOMATED UPDATES

### Recommended Strategy:

1. **Automated Updates:**
   - GitHub Dependabot (free)
   - Renovate Bot
   - Automatic PR creation for updates

2. **Manual Review:**
   - Review changelogs before updating
   - Test updates in development
   - Update lock files after manual updates

3. **Security Updates:**
   - Apply security patches immediately
   - Monitor GitHub Security Advisories
   - Subscribe to security mailing lists

4. **Major Version Updates:**
   - Plan and test thoroughly
   - Check breaking changes
   - Update documentation

---

## Dependency Licenses

All dependencies use permissive licenses suitable for commercial use:

- **MIT License:** Most dependencies (very permissive)
- **Apache 2.0:** TypeScript (permissive)
- **Microsoft Software License:** .NET SDK (free, permissive)

**License Compliance:** ✅ NO KNOWN ISSUES

---

## Bundle Size Analysis

### Frontend Production Bundle (Estimated)

**Total JavaScript:** ~250-300KB gzipped

**Breakdown:**
- Next.js runtime: ~90KB
- React + React DOM: ~45KB
- Framer Motion: ~40KB
- Application code: ~60-80KB
- Other utilities: ~15KB

**CSS:** ~10-15KB gzipped (Tailwind purged)

**Performance:** ✅ ACCEPTABLE (< 500KB recommended)

---

## Dependency Health Check

### Backend Dependencies
| Package | Version | Status | Last Update | Security Issues |
|---------|---------|--------|-------------|-----------------|
| Microsoft.AspNetCore.OpenApi | 10.* | ✅ Healthy | Regular | None known |
| Microsoft.EntityFrameworkCore.SqlServer | 10.* | ✅ Healthy | Regular | None known |
| Microsoft.EntityFrameworkCore.Tools | 10.* | ✅ Healthy | Regular | None known |
| Swashbuckle.AspNetCore | 10.1.0 | ✅ Healthy | Q4 2024 | None known |
| Swashbuckle.AspNetCore.Annotations | 10.1.0 | ✅ Healthy | Q4 2024 | None known |

### Frontend Dependencies
| Package | Version | Status | Last Update | Security Issues |
|---------|---------|--------|-------------|-----------------|
| next | 14.2.18 | ✅ Healthy | Q4 2024 | None known |
| react | 18.3.1 | ✅ Healthy | Q2 2024 | None known |
| react-dom | 18.3.1 | ✅ Healthy | Q2 2024 | None known |
| framer-motion | 11.11.11 | ✅ Healthy | Q4 2024 | None known |
| tailwindcss | 3.4.17 | ✅ Healthy | Q4 2024 | None known |
| typescript | 5.7.2 | ✅ Healthy | Q4 2024 | None known |

**Overall Dependency Health:** ✅ GOOD (All dependencies actively maintained)

---

## Known Dependency Risks

### None Currently Identified

**Monitoring Recommendations:**
1. Enable GitHub Security Alerts
2. Run `pnpm audit` regularly
3. Run `dotnet list package --vulnerable` regularly
4. Subscribe to security advisories for major packages

---

## Upgrade Path to Production

### Backend Upgrades (Minimal)
- All dependencies already at stable versions
- .NET 10 is latest LTS
- No major version upgrades needed

**Estimated Effort:** 0 hours (no upgrades needed)

### Frontend Upgrades (Minimal)
- Next.js 14 is latest stable
- React 18 is latest major version
- TypeScript 5 is latest major version

**Estimated Effort:** 0 hours (no upgrades needed)

---

## Dependency Best Practices

### ✅ Current Good Practices
1. Lock file committed (pnpm-lock.yaml)
2. Version ranges used (allows minor/patch updates)
3. All dependencies from trusted sources (npm, NuGet)
4. No deprecated dependencies

### ❌ Missing Best Practices
1. No automated dependency updates (Dependabot)
2. No regular vulnerability scanning
3. No dependency license scanning
4. No supply chain security checks

---

## Related Documentation

- [Technology Stack](stack.md) - Complete technology overview
- [Infrastructure & Deployment](../infrastructure/deployment.md) - Deployment considerations
- [Security Architecture](../architecture/security.md) - Security analysis

---

**Document Version:** 1.0  
**Last Updated:** January 28, 2026  
**Total Backend Dependencies:** 5 production + dev tools  
**Total Frontend Dependencies:** 6 production, 10 dev  
**Dependency Health:** ✅ GOOD
