# Infrastructure & Deployment Documentation

## Overview

Shop Assistant is currently configured for **local development only**. This document describes the current development setup and provides guidance for potential production deployment scenarios.

---

## Current Development Environment

### Architecture Diagram

```
┌─────────────────────────────────────┐
│   Developer Workstation (Windows)   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Frontend (Next.js)         │   │
│  │  Port: 3000                  │   │
│  │  Command: pnpm dev          │   │
│  │  Process: Node.js 20+       │   │
│  └──────────┬──────────────────┘   │
│             │ HTTP API Calls       │
│             ↓                       │
│  ┌─────────────────────────────┐   │
│  │  Backend (.NET API)         │   │
│  │  Port: 5250 (HTTP)          │   │
│  │  Port: 7199 (HTTPS)         │   │
│  │  Command: dotnet run        │   │
│  │  Process: Kestrel           │   │
│  └──────────┬──────────────────┘   │
│             │ EF Core              │
│             ↓                       │
│  ┌─────────────────────────────┐   │
│  │  SQL Server LocalDB         │   │
│  │  Instance: (localdb)\mssql  │   │
│  │  Database: ShopAssistantDb  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Development Setup

### Prerequisites

**Backend:**
- .NET 10 SDK (minimum)
- SQL Server LocalDB (installed with Visual Studio or standalone)
- Visual Studio Code or Visual Studio 2022

**Frontend:**
- Node.js 20.0.0 or later
- pnpm 10.20.0 (package manager)
- Visual Studio Code

### Installation Scripts

Located in `scripts/` directory:

1. **install.ps1** (Windows PowerShell)
   - Purpose: Automated setup for Windows
   - Actions:
     - Checks .NET SDK version
     - Checks Node.js version
     - Installs pnpm if missing
     - Restores backend packages (`dotnet restore`)
     - Installs frontend packages (`pnpm install`)
     - Applies EF Core migrations
     - Seeds database

2. **install.sh** (Linux/macOS Bash)
   - Purpose: Automated setup for Unix-like systems
   - Actions: Same as install.ps1

3. **quick-install.sh**
   - Purpose: Fast setup without checks
   - Actions: Direct package installation without validation

### Manual Setup Steps

**Backend:**
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

### Environment Variables

**Backend:**
- `ASPNETCORE_ENVIRONMENT` - Set to `Development` for local development
- Connection string in `appsettings.Development.json`

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:5250/api`)
- `NEXT_PUBLIC_USE_API` - Enable/disable API mode (default: `true`)

---

## Development Configuration

### Backend Configuration

**File:** `backend/Properties/launchSettings.json`

**Profiles:**
1. **http** - HTTP only (port 5250)
2. **https** - HTTPS + HTTP (ports 7199/5250)
3. **IIS Express** - IIS Express hosting

**Current Default:** http profile (Swagger auto-opens)

**Application URLs:**
- HTTP: `http://localhost:5250`
- HTTPS: `https://localhost:7199`
- Swagger: `http://localhost:5250/swagger`

### Frontend Configuration

**File:** `frontend/package.json`

**Development Server:**
- Port: 3000 (Next.js default)
- Command: `pnpm dev`
- Hot reload: Enabled

---

## Database Configuration

### Development Database

**Default Connection:** SQL Server LocalDB

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ShopAssistantDb_Dev;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

**Alternative Options:**

1. **Docker SQL Server:**
```json
"DockerConnection": "Server=localhost,1433;Database=ShopAssistantDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True"
```

2. **SQL Server Developer Edition:**
```json
"DeveloperEdition": "Server=localhost;Database=ShopAssistantDb;Integrated Security=true;TrustServerCertificate=True"
```

### Database Operations

**Create/Update Database:**
```bash
cd backend
dotnet ef database update
```

**Drop Database:**
```bash
dotnet ef database drop --force
```

**Create Migration:**
```bash
dotnet ef migrations add MigrationName
```

**Reset and Reseed:**
```bash
dotnet ef database drop --force
dotnet ef database update
dotnet run  # Auto-seeds in Development
```

---

## Production Deployment Considerations

**⚠️ WARNING:** Application is **NOT production-ready**. The following are recommendations for future production deployment.

### Recommended Architecture

```
┌──────────────────────────────────────────────────┐
│                    Internet                       │
└──────────────────┬───────────────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
┌────────▼────────┐  ┌───────▼───────────┐
│  CDN / Edge     │  │  Azure Front Door │
│  (Vercel Edge)  │  │  / API Gateway    │
└────────┬────────┘  └───────┬───────────┘
         │                    │
         │                    │
┌────────▼────────────────────▼───────────┐
│     Frontend (Vercel / Azure SWA)       │
│     - Static assets on CDN              │
│     - SSR on serverless functions       │
└─────────────────────────────────────────┘
                   │
                   │ HTTPS
                   │
┌──────────────────▼──────────────────────┐
│     Azure API Management (Optional)      │
│     - Rate limiting                      │
│     - Authentication                     │
│     - Monitoring                         │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
┌────────▼──────┐   ┌───────▼────────┐
│  Backend API  │   │  Backend API   │
│  Instance 1   │   │  Instance 2    │
│  (Container)  │   │  (Container)   │
└────────┬──────┘   └───────┬────────┘
         │                   │
         └─────────┬─────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Azure SQL Database / SQL Managed       │
│  - Automatic backups                    │
│  - High availability                    │
│  - Read replicas (optional)             │
└─────────────────────────────────────────┘
```

---

## Potential Deployment Targets

### Frontend Deployment Options

#### 1. Vercel (Recommended)
**Pros:**
- Native Next.js support
- Automatic deployments from Git
- Global CDN
- Edge functions for SSR
- Zero configuration

**Configuration:**
- Deploy from GitHub repository
- Set environment variable: `NEXT_PUBLIC_API_URL`
- Automatic HTTPS

**Estimated Cost:** Free tier available, $20/month Pro tier

---

#### 2. Azure Static Web Apps
**Pros:**
- Integrated with Azure ecosystem
- Free SSL certificates
- GitHub Actions integration
- API integration with Azure Functions

**Configuration:**
- Deploy via GitHub Actions
- Configure build settings
- Set environment variables

**Estimated Cost:** Free tier available, ~$9/month Standard tier

---

#### 3. Docker Container
**Pros:**
- Platform-agnostic
- Full control
- Can deploy anywhere

**Dockerfile Example:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

### Backend Deployment Options

#### 1. Azure App Service
**Pros:**
- Managed .NET hosting
- Auto-scaling
- Easy deployment from Visual Studio or CLI
- Integrated monitoring

**Configuration:**
- Publish profile or Azure CLI deployment
- Configure connection string in Application Settings
- Enable Application Insights

**Estimated Cost:** ~$55/month (Basic tier), ~$100/month (Standard tier)

---

#### 2. Azure Container Instances / Container Apps
**Pros:**
- Serverless containers
- Auto-scaling
- Lower cost than App Service
- Flexible deployment

**Dockerfile Example:**
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["ShopAssistant.Api.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 80
ENTRYPOINT ["dotnet", "ShopAssistant.Api.dll"]
```

**Estimated Cost:** ~$20-40/month (Container Apps)

---

#### 3. Azure Kubernetes Service (AKS)
**Pros:**
- Enterprise-grade orchestration
- High availability
- Advanced networking
- Horizontal scaling

**Cons:**
- Complex setup
- Higher cost
- Overkill for small applications

**Estimated Cost:** ~$200+/month

---

### Database Deployment Options

#### 1. Azure SQL Database (Recommended)
**Pros:**
- Fully managed
- Automatic backups
- High availability
- Point-in-time restore
- Scalable

**Configuration:**
- Create Azure SQL Database
- Update connection string with SQL authentication
- Configure firewall rules
- Apply migrations

**Estimated Cost:** ~$5/month (Basic tier), ~$150/month (Standard S2)

---

#### 2. SQL Server on Azure VM
**Pros:**
- Full SQL Server features
- Complete control
- No DTU limitations

**Cons:**
- Self-managed (patching, backups)
- Higher cost
- More complex

**Estimated Cost:** ~$100+/month

---

#### 3. Docker SQL Server
**Pros:**
- Portable
- Version control
- Development/production parity

**Cons:**
- Self-managed
- Data persistence considerations

**Docker Compose Example:**
```yaml
version: '3.8'
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Password123
    ports:
      - "1433:1433"
    volumes:
      - sqldata:/var/opt/mssql
volumes:
  sqldata:
```

---

## Required Production Changes

### Backend Changes

1. **Remove Development-Only Features:**
   - Disable Swagger in production
   - Disable detailed error messages
   - Disable sensitive data logging

```csharp
if (app.Environment.IsProduction())
{
    // NO Swagger
    // NO detailed errors
}
```

2. **Secure Connection Strings:**
   - Move to Azure Key Vault or environment variables
   - Never commit production credentials

3. **Add Health Checks:**
   - Implement detailed health checks
   - Monitor database connectivity

4. **Enable Response Compression:**
```csharp
builder.Services.AddResponseCompression();
app.UseResponseCompression();
```

5. **Configure CORS for Production:**
```csharp
policy.WithOrigins("https://yourdomain.com")
```

6. **Enable Response Caching:**
```csharp
builder.Services.AddResponseCaching();
app.UseResponseCaching();
```

---

### Frontend Changes

1. **Set Production API URL:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

2. **Enable Analytics:**
   - Google Analytics
   - Application Insights

3. **Configure CSP Headers:**
   - Content Security Policy
   - HSTS

4. **Optimize Images:**
   - Use next/image optimization
   - Configure remote patterns

---

### Database Changes

1. **Disable Auto-Seeding:**
   - Remove or condition seed logic to Development only

2. **Configure Backups:**
   - Automated daily backups
   - Transaction log backups

3. **Set Up Monitoring:**
   - Query performance insights
   - Alert on long-running queries

---

## Monitoring & Observability

### Current State
**Status:** ❌ NOT IMPLEMENTED

### Recommended Tools

1. **Application Insights (Azure):**
   - Request tracking
   - Exception logging
   - Performance metrics
   - Availability tests

2. **Sentry (Error Tracking):**
   - Frontend and backend error tracking
   - User context
   - Release tracking

3. **Logging:**
   - Structured logging (Serilog)
   - Log aggregation (Azure Log Analytics, Splunk)

---

## CI/CD Pipeline

### Current State
**Status:** ❌ NOT IMPLEMENTED

### Recommended GitHub Actions Workflow

**Backend:**
```yaml
name: Backend CI/CD
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '10.0.x'
      - run: dotnet build
      - run: dotnet test
      - run: dotnet publish -c Release
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: shopassistant-api
```

**Frontend:**
```yaml
name: Frontend CI/CD
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v20
```

---

## Security Hardening for Production

**See [Security Documentation](../architecture/security.md) for full details.**

### Essential Security Measures:

1. **HTTPS Only:**
   - Enforce HTTPS redirection
   - HSTS headers

2. **API Authentication:**
   - Implement JWT or API keys
   - OAuth for user authentication

3. **Rate Limiting:**
   - Prevent API abuse
   - DDoS protection

4. **Input Validation:**
   - Already implemented (data annotations)
   - Add additional business validation

5. **SQL Injection Prevention:**
   - Already protected (EF Core parameterization)

6. **XSS Prevention:**
   - Already protected (React escaping)
   - Add CSP headers

---

## Estimated Production Costs

### Minimal Setup (Single Region)
- Frontend (Vercel): Free - $20/month
- Backend (Azure Container Apps): $20-40/month
- Database (Azure SQL Basic): $5/month
- **Total:** ~$25-65/month

### Standard Setup (High Availability)
- Frontend (Vercel Pro): $20/month
- Backend (Azure App Service Standard): $100/month
- Database (Azure SQL Standard S2): $150/month
- Application Insights: $5-20/month
- **Total:** ~$275-290/month

### Enterprise Setup
- Frontend (Vercel Enterprise): Custom pricing
- Backend (AKS with 3 nodes): $200+/month
- Database (Azure SQL Premium): $500+/month
- CDN, Monitoring, etc.: $100+/month
- **Total:** ~$800+/month

---

## Backup & Disaster Recovery

### Current State
**Status:** ❌ NOT IMPLEMENTED

### Recommended Strategy

1. **Database Backups:**
   - Automated daily full backups
   - Transaction log backups every 15 minutes
   - Retention: 30 days minimum

2. **Code Backups:**
   - Git repository (GitHub)
   - Protected main branch

3. **Configuration Backups:**
   - Infrastructure as Code (Terraform, Bicep)
   - Environment variables documented

4. **Disaster Recovery Plan:**
   - RTO (Recovery Time Objective): < 4 hours
   - RPO (Recovery Point Objective): < 1 hour
   - Regular DR drills

---

## Performance Optimization

### Backend Optimizations (Production)

1. **Response Caching:**
   - Cache GET /api/products responses
   - Cache GET /api/categories responses

2. **Database Connection Pooling:**
   - Already enabled by default
   - Tune pool size for load

3. **Query Optimization:**
   - Already using AsNoTracking
   - Add query result caching (Redis)

4. **Compression:**
   - Enable gzip/brotli compression

### Frontend Optimizations (Production)

1. **Static Generation:**
   - Pre-render product pages
   - ISR (Incremental Static Regeneration)

2. **CDN:**
   - Serve static assets from CDN
   - Edge caching

3. **Bundle Size:**
   - Already optimized by Next.js
   - Code splitting per route

---

## Related Documentation

- [Security Architecture](../architecture/security.md) - Security implementation
- [Technology Stack](../technology/stack.md) - Technologies used
- [API Documentation](../integration/apis.md) - API endpoints
- [Database Schema](../integration/databases.md) - Database structure

---

**Document Version:** 1.0  
**Last Updated:** January 28, 2026  
**Environment:** Development Only  
**Production Status:** ❌ Not Production-Ready
