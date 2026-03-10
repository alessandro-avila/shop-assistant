<!--
  Sync Impact Report
  ===================
  Version Change: 0.0.0 (template) -> 1.0.0
  Bump Rationale: MAJOR — initial ratification of project constitution

  Modified Principles (all new — no prior principles existed):
    + I.   Code Quality & Consistency
    + II.  Backend Architecture Discipline
    + III. Frontend Architecture Discipline
    + IV.  Testing Standards
    + V.   API Design Contract
    + VI.  Data Integrity & Safety
    + VII. Performance by Default
    + VIII. User Experience Excellence

  Added Sections:
    + Technology Stack Baseline
    + Development Workflow
    + Governance

  Removed Sections: (none — initial version)

  Templates Requiring Updates:
    ✅ plan-template.md — Constitution Check section is generic; aligns with principles
    ✅ spec-template.md — Requirements and success criteria structure aligns; no update needed
    ✅ tasks-template.md — Phase structure supports principle-driven task types; no update needed
    ✅ checklist-template.md — Generic template; no principle-specific references to update

  Follow-up TODOs: none
-->

# Shop Assistant Constitution

## Core Principles

### I. Code Quality & Consistency

All code MUST adhere to established language idioms and project conventions.
Deviations require explicit justification in code review.

**C# (Backend)**:
- File-scoped namespaces (`namespace X;`) MUST be used in all files.
- Nullable reference types MUST remain enabled; `null` warnings MUST be
  resolved, not suppressed.
- The `required` keyword MUST be used on DTO properties that are mandatory
  for API consumers.
- XML documentation comments (`/// <summary>`) MUST be present on all public
  controller actions and DTO types.
- Data Annotations and Fluent API configurations MUST NOT contradict each
  other; Fluent API is the source of truth for database constraints.

**TypeScript (Frontend)**:
- TypeScript strict mode MUST remain enabled; `any` is forbidden except in
  explicitly justified `@ts-expect-error` cases.
- All React components accepting DOM-forwarded refs MUST use `forwardRef`.
- The `cn()` utility (clsx + tailwind-merge) MUST be used for all conditional
  className composition — manual string concatenation is forbidden.
- Backend DTO types (`Backend*Dto` in `lib/types/api.ts`) and frontend domain
  types (`lib/types/product.ts`, etc.) MUST remain separate; explicit mapper
  functions MUST mediate the boundary.

**Shared**:
- No duplicated logic across files. Shared utilities MUST be extracted to a
  common location (e.g., extension methods in backend, utility modules in
  frontend).
- Magic strings and numbers MUST be replaced with named constants or
  configuration values.
- Every function/method MUST have a single responsibility. Functions exceeding
  50 lines MUST be decomposed.

### II. Backend Architecture Discipline

The ASP.NET Core backend MUST follow a layered architecture with clear
separation of concerns.

- **Controller Responsibility**: Controllers MUST only handle HTTP concerns
  (routing, model binding, status codes). Business logic MUST NOT reside in
  controller actions.
- **Service Layer**: Complex operations (order creation, inventory management,
  cross-entity queries) MUST be extracted to dedicated service classes injected
  via DI. Controllers MUST NOT access `ShopDbContext` directly for operations
  involving business rules or multi-step workflows.
- **Middleware Pipeline**: The middleware registration order in `Program.cs`
  MUST be preserved: Error Handling → Swagger → HTTPS Redirection → CORS →
  Authorization → Controller Mapping. Changes to pipeline order require
  constitution-level review.
- **Error Handling**: All API responses MUST conform to the structured envelope
  `{ success, data, message, error: { code, details } }`. Unhandled exceptions
  MUST be caught by `ErrorHandlingMiddleware` and MUST NOT leak stack traces in
  non-development environments.
- **Dependency Injection**: All services MUST be registered in the DI container
  with appropriate lifetimes (Scoped for DbContext-dependent services, Singleton
  for stateless utilities). Instantiating service classes with `new` is
  forbidden.
- **Configuration**: Connection strings and environment-specific settings MUST
  use the ASP.NET Core configuration system (`appsettings.json` / environment
  variables). Hard-coded connection strings are forbidden.

### III. Frontend Architecture Discipline

The Next.js frontend MUST leverage the App Router component model with
intentional decisions about rendering strategy.

- **Server vs. Client Components**: Pages that perform initial data fetching
  without user interaction MUST be Server Components (async functions). The
  `"use client"` directive MUST only be added when the component requires
  browser APIs, event handlers, or React hooks.
- **API Abstraction Layer**: All backend communication MUST go through the
  typed API client in `lib/api/`. Direct `fetch()` calls from components are
  forbidden.
- **Mock Data Fallback**: Every API function MUST implement the mock data
  fallback pattern (check `USE_API` flag, catch errors, fall back to local
  JSON with a console warning). This ensures the frontend remains demonstrable
  without a running backend.
- **Type Safety Boundary**: Backend response types (`lib/types/api.ts`) MUST
  mirror the backend DTOs exactly. Frontend domain types
  (`lib/types/product.ts`, etc.) MUST be used in components. Mapper functions
  MUST handle the transformation and MUST NOT silently drop fields.
- **State Management**: Client-side state that persists across pages MUST use
  React Context with `useReducer`. Local component state MUST use `useState`.
  No additional state management libraries without constitution amendment.
- **Component Hierarchy**: Reusable UI primitives (`ui/`) MUST be stateless
  and accept all configuration via props. Domain-specific components
  (`product/`, `layout/`) MAY maintain internal state. Page components (`app/`)
  orchestrate data fetching and composition.

### IV. Testing Standards

All new features and bug fixes MUST include corresponding tests. The existing
codebase MUST progressively gain test coverage.

- **Backend Unit Tests**: All service-layer logic MUST have unit tests using
  xUnit. Controller tests MUST validate routing, model binding, and status code
  selection. Mocking MUST use a recognized library (Moq or NSubstitute).
- **Backend Integration Tests**: API endpoints MUST be tested with
  `WebApplicationFactory<Program>` using an in-memory or containerized test
  database. Tests MUST verify the full request/response cycle including
  serialization and error envelope structure.
- **Frontend Component Tests**: Interactive components MUST have tests using
  React Testing Library. Tests MUST assert user-visible behavior (rendered
  text, navigation, form submission), not implementation details.
- **End-to-End Tests**: Critical user journeys (browse products → add to
  cart → checkout) MUST have E2E coverage using Playwright or equivalent.
- **Test Organization**: Backend tests MUST reside in a separate test project
  (`ShopAssistant.Api.Tests`). Frontend tests MUST be co-located with their
  source files (`*.test.tsx` / `*.test.ts`).
- **Coverage Threshold**: No PR MUST reduce overall line coverage. New code
  MUST achieve a minimum of 80% line coverage.

### V. API Design Contract

All HTTP endpoints MUST follow RESTful conventions and maintain backward
compatibility within a major version.

- **URL Structure**: Resource URLs MUST use plural nouns (`/api/products`,
  `/api/orders`). Slug-based lookups MUST be supported alongside ID-based
  lookups for user-facing resources.
- **HTTP Methods**: GET for reads (MUST be idempotent and side-effect free),
  POST for creation, PUT for full replacement, PATCH for partial updates,
  DELETE for removal. Business-logic verbs in URLs are forbidden.
- **Pagination**: List endpoints MUST return `PaginatedResponse<T>` with
  `page`, `pageSize`, `totalCount`, `totalPages`, `hasPreviousPage`,
  `hasNextPage`. Page size MUST be capped at a server-enforced maximum
  (currently 100).
- **Filtering & Sorting**: Query parameters MUST follow
  `?category=X&minPrice=Y&sortBy=Z&sortDescending=true` conventions. Unknown
  query parameters MUST be ignored, not rejected.
- **Error Responses**: MUST use appropriate HTTP status codes (400 for
  validation, 404 for not found, 409 for conflicts, 500 for server errors).
  Response body MUST conform to the error envelope defined in Principle II.
- **Documentation**: Every endpoint MUST have `[ProducesResponseType]`
  attributes for all possible status codes. XML doc comments MUST describe
  purpose, parameters, and example responses.
- **Versioning**: When breaking changes are unavoidable, API versioning via
  URL prefix (`/api/v2/`) MUST be introduced. Existing endpoints MUST continue
  to function during the deprecation period.

### VI. Data Integrity & Safety

Data correctness MUST be enforced at every layer: application validation,
ORM configuration, and database constraints.

- **Validation Layering**: Input validation MUST occur at the DTO level
  (Data Annotations / `required` keyword). Business rule validation MUST
  occur in service logic. Database constraints (unique indexes, foreign keys,
  check constraints) MUST serve as the final safety net.
- **Monetary Precision**: All monetary columns MUST use `decimal(18, 2)`
  precision. Monetary calculations MUST use `decimal` type — `float` /
  `double` are forbidden for money.
- **Referential Integrity**: Foreign key constraints MUST be configured with
  `DeleteBehavior.Restrict` by default. `Cascade` is permitted only for
  parent-child relationships where the child has no independent meaning (e.g.,
  Order → OrderItem). Every FK relationship MUST have an explicit
  `DeleteBehavior` configured in the Fluent API.
- **Transactions**: Multi-step write operations (e.g., order creation with
  line items and inventory updates) MUST be wrapped in an explicit database
  transaction with rollback on failure.
- **Timestamps**: All entities with temporal relevance MUST include `CreatedAt`
  and `UpdatedAt` columns with `HasDefaultValueSql("GETUTCDATE()")`.
  Application code MUST NOT set `CreatedAt` after initial creation.
- **Unique Constraints**: Business identifiers (slugs, order numbers, SKUs)
  MUST have unique database indexes. Collision-prone generation (e.g., order
  numbers) MUST implement retry logic with a bounded attempt limit.
- **Seed Data**: Database seeding MUST be idempotent (check-before-insert).
  Seed data MUST only run in development environments unless explicitly
  configured otherwise.

### VII. Performance by Default

Performance-conscious patterns MUST be the default, not an afterthought.

- **Read Query Optimization**: All read-only queries MUST use
  `AsNoTracking()`. Data retrieval MUST use `Select()` projections to DTOs —
  fetching full entities and mapping in memory is forbidden for list endpoints.
- **Pagination Enforcement**: All list endpoints MUST be paginated. Unbounded
  `SELECT *` queries are forbidden. Page size MUST have a server-enforced
  maximum.
- **Connection Resilience**: Database connections MUST configure
  `EnableRetryOnFailure` with appropriate retry counts and delays. API clients
  MUST configure timeouts (via `API_TIMEOUT`).
- **Parallel Data Fetching**: Frontend pages requiring multiple independent
  data sources MUST use `Promise.all()` (or equivalent parallel fetching)
  rather than sequential `await` calls.
- **Image Optimization**: The Next.js `Image` component MUST be used for all
  product and category images to enable automatic optimization. Raw `<img>`
  tags are forbidden for content images.
- **Bundle Size**: Frontend dependencies MUST be justified. Adding a new
  `dependencies` entry to `package.json` requires review for bundle impact.
  Prefer tree-shakeable libraries.
- **Caching Strategy**: Static and rarely-changing data (categories, featured
  products) SHOULD leverage Next.js caching (ISR / `revalidate`) when the API
  integration matures. Mutable user-specific data (cart, orders) MUST NOT be
  cached beyond the current session.

### VIII. User Experience Excellence

The application MUST provide clear, responsive, and accessible feedback for
every user interaction.

- **Loading States**: Every data-fetching operation MUST display a skeleton or
  spinner while in progress. Empty white screens during data loading are
  forbidden.
- **Empty States**: All list/collection views MUST display a meaningful empty
  state with guidance when no items exist.
- **Error Recovery**: User-facing errors MUST display actionable messages
  (e.g., "Try again" button). The `ErrorBoundary` component MUST wrap all
  client-side page content. API errors MUST be caught and displayed
  gracefully — unhandled promise rejections reaching the console are forbidden.
- **Responsive Design**: All pages MUST be functional on viewports from 320px
  to 2560px. Navigation MUST adapt (hamburger menu on mobile, full nav on
  desktop). Touch targets MUST be at minimum 44x44px.
- **Animation Intent**: Animations (Framer Motion) MUST serve a functional
  purpose (indicating state change, guiding attention, providing spatial
  context). Decorative-only animations MUST respect `prefers-reduced-motion`.
- **Form Validation**: All form inputs MUST provide inline validation feedback.
  Required fields MUST be visually indicated. Error messages MUST appear
  adjacent to the offending field, not in a detached toast.
- **Accessibility**: All interactive elements MUST be keyboard-navigable.
  Images MUST have descriptive `alt` text. Color MUST NOT be the sole means
  of conveying information. ARIA attributes MUST be used when semantic HTML is
  insufficient.

## Technology Stack Baseline

The following technology choices are locked and MUST NOT be changed without a
constitution amendment.

| Layer | Technology | Version Constraint |
|-------|-----------|-------------------|
| Backend Runtime | .NET | 10.x |
| Backend Framework | ASP.NET Core | 10.x |
| ORM | Entity Framework Core | 10.x |
| Database | SQL Server | 2019+ / LocalDB / Developer Edition |
| API Documentation | Swashbuckle (OpenAPI) | 10.x |
| Frontend Framework | Next.js (App Router) | 14.x |
| UI Library | React | 18.x |
| Language (Frontend) | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 3.x |
| Animation | Framer Motion | 11.x |
| Package Manager | pnpm | 10.x |
| Node.js | Node.js | >=20 |

**Upgrade Policy**: Framework and library upgrades MUST be tracked as explicit
tasks with migration plans. Major version upgrades (e.g., Next.js 14 → 15,
React 18 → 19) require a dedicated spec and testing cycle.

**New Dependencies**: Adding a new dependency MUST be justified against these
criteria:
1. Is there a built-in or existing dependency that solves this?
2. Is the package actively maintained (commits within 6 months)?
3. What is the bundle size / dependency tree impact?
4. Does it have TypeScript types (built-in or `@types/*`)?

## Development Workflow

### Branch & Commit Conventions

- Feature branches MUST follow the pattern
  `{issue-number}-{brief-description}` (e.g., `042-add-product-reviews`).
- Commit messages MUST use Conventional Commits format:
  `type(scope): description` (e.g., `feat(orders): add order tracking`).
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
  `chore`, `ci`.

### Code Review Requirements

- All changes MUST go through pull request review before merging to `main`.
- PRs MUST include: description of changes, testing evidence, and constitution
  compliance self-check.
- Reviewers MUST verify adherence to applicable constitution principles.

### Local Development

- Backend MUST start with `dotnet run` and auto-apply migrations in
  development mode.
- Frontend MUST start with `pnpm dev` and function with or without a running
  backend (mock data fallback per Principle III).
- The `/health` endpoint MUST be used to verify backend availability.

### Quality Gates

Before any PR is merged, the following MUST pass:
1. All existing tests pass (zero regression).
2. New code has tests meeting the coverage threshold (Principle IV).
3. No new compiler warnings (C#) or TypeScript errors.
4. API documentation is updated if endpoints changed (Principle V).
5. Linting passes with zero warnings (`dotnet format` / `eslint`).

## Governance

This constitution is the supreme technical authority for the Shop Assistant
project. All implementation decisions, code reviews, and architectural choices
MUST be evaluated against these principles.

### Amendment Process

1. **Proposal**: Any team member MAY propose an amendment by creating a PR
   that modifies this file.
2. **Justification**: The PR description MUST include: the principle being
   changed, the rationale, the impact on existing code, and a migration plan
   if applicable.
3. **Review**: Constitution amendments require review and approval from at
   least two team members.
4. **Versioning**: Amendments MUST update the version number following
   semantic versioning:
   - **MAJOR**: Removing a principle, redefining a principle's intent, or
     changing a technology stack baseline entry.
   - **MINOR**: Adding a new principle, materially expanding guidance, or
     adding a new section.
   - **PATCH**: Clarifications, typo fixes, rewording for clarity without
     changing intent.
5. **Propagation**: After amendment, all dependent templates
   (`plan-template.md`, `spec-template.md`, `tasks-template.md`,
   `checklist-template.md`) MUST be reviewed for consistency.

### Compliance Review

- Every PR MUST include a self-assessment of which principles apply.
- Code reviewers MUST flag principle violations with a reference to the
  specific section (e.g., "Violates VII.1 — missing AsNoTracking").
- Quarterly reviews SHOULD assess overall codebase compliance and identify
  systemic drift.

### Exception Process

- If a principle cannot be followed in a specific case, the code MUST include
  a comment: `// CONSTITUTION EXCEPTION: [Principle Number] — [Justification]`.
- Exceptions MUST be tracked and reviewed during quarterly compliance reviews.
- Persistent exceptions SHOULD trigger an amendment proposal.

**Version**: 1.0.0 | **Ratified**: 2025-07-17 | **Last Amended**: 2025-07-17
