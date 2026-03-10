# Spec Kit Brownfield Demo Plan — Shop Assistant

## Overview

This plan walks through a **complete Spec-Driven Development (SDD) workflow** using [GitHub Spec Kit](https://github.com/github/spec-kit) on the existing **Shop Assistant** brownfield project. The feature being added is **Cart Management → Checkout Flow → Order Processing** — connecting the frontend cart (currently client-side only with simulated order placement) to the backend API (which already has Order/OrderItem models and endpoints, but is never called from the frontend).

### What's Broken Today

| Layer | Current State | Gap |
|-------|--------------|-----|
| **Frontend Cart** | `cart-context.tsx` manages items in `localStorage` | Cart is purely client-side; no backend persistence |
| **Frontend Checkout** | `checkout/page.tsx` simulates order with `setTimeout` + random ID | Never calls `POST /api/orders` |
| **Backend Orders API** | `OrdersController.cs` with `POST /api/orders`, `GET /api/orders/{id}`, `GET /api/orders/number/{orderNumber}` | Endpoints exist but are never invoked |
| **Backend Cart API** | `CartItem` model exists, `DbSet<CartItem>` registered | **No `CartController` exists** — no endpoints for server-side cart |
| **Order Confirmation** | `checkout/success/page.tsx` shows fake order number | Should display real order data from the backend |

### Demo Goal

By the end of the implementation phase: a user can add products to cart, go through checkout, place an order that hits `POST /api/orders`, and see real Order + OrderItem rows in the SQL database.

---

## Branching Strategy

```
feature/spec-kit/demo-brownfield-base          ← You are here (starting point)
  │
  ├── feature/spec-kit/01-init                  ← Spec Kit initialized on project
  │
  ├── feature/spec-kit/02-constitution          ← Constitution generated
  │
  ├── feature/spec-kit/03-specify               ← Feature specification created
  │
  ├── feature/spec-kit/04-clarify               ← Ambiguities resolved
  │
  ├── feature/spec-kit/05-plan                  ← Technical plan generated
  │
  ├── feature/spec-kit/06-analyze               ← Consistency analysis passed
  │
  ├── feature/spec-kit/07-tasks                 ← Task list generated
  │
  └── feature/spec-kit/08-implement             ← Code implemented, orders in DB
```

Each branch represents the **end state** of that SDD phase. During the demo you can:
1. Execute the step live
2. If it takes too long → `git checkout feature/spec-kit/0X-stepname` to jump to the pre-baked result
3. Walk through the generated artifacts on that branch

### Git Commands Between Steps

After each step, commit and create the next branch:

```bash
# After completing a step (e.g., constitution):
git add -A
git commit -m "spec-kit: constitution generated"
git checkout -b feature/spec-kit/03-specify    # next step branch
```

---

## Pre-Demo Setup

### 1. Install the `uv` package manager (if not already installed)

```powershell
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Install Spec Kit CLI

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

### 3. Verify installation

```bash
specify --version
specify check
```

### 4. Ensure VS Code prerequisites

- GitHub Copilot extension installed
- **Agent Mode** enabled in Copilot Chat panel (required for `/speckit.*` commands)
- Project dependencies restored (`dotnet restore` for backend, `pnpm install` for frontend)

---

## Step-by-Step Workflow

---

### STEP 1 — Initialize Spec Kit (Branch: `feature/spec-kit/01-init`)

**What it does:** Scaffolds the `.specify/` directory structure with templates, scripts, and Copilot agent prompt files in `.github/prompts/`.

**Terminal command:**

```bash
cd C:\Projects\Workshops\ghcp\shop-assistant
specify init . --ai copilot
```

> **Note:** Since this is a brownfield project, we use `.` (current directory) instead of a new project name. The `--ai copilot` flag configures Spec Kit for GitHub Copilot agent mode.

**Verify:**
- `.specify/` directory created with `memory/`, `scripts/`, `templates/`
- `.github/prompts/` updated with speckit agent files (e.g., `speckit.constitution.prompt.md`, `speckit.specify.prompt.md`, etc.)
- Open VS Code → Copilot Chat → Agent Mode → type `/speckit` and verify all 7+ commands appear

**After step:**

```bash
git add -A
git commit -m "spec-kit: initialize on brownfield project"
git checkout -b feature/spec-kit/02-constitution
```

---

### STEP 2 — Constitution (Branch: `feature/spec-kit/02-constitution`)

**What it does:** Analyzes the existing codebase and generates non-negotiable project principles. Since this is a **brownfield** project, the agent should analyze what already exists rather than define principles from scratch.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.constitution` agent with this prompt:**

```
As this is a pre-existing brownfield project with an ASP.NET Core 10 backend 
(C#, Entity Framework Core, SQL Server) and a Next.js 15 frontend 
(TypeScript, React 19, Tailwind CSS), I need you to analyze the codebase 
exhaustively and in-depth. 

Do NOT skim over but use multiple iterations to do a deep analysis.

Create principles focused on:

- Code quality: C# coding conventions observed in the existing controllers 
  (OrdersController, ProductsController, CategoriesController), TypeScript 
  strict mode in frontend, ESLint/Prettier conventions
- Backend architecture: Controller → DbContext pattern with DTOs, EF Core 
  migrations, transaction handling, structured logging with ILogger
- Frontend architecture: Next.js App Router, React Context for state, 
  client-side data fetching pattern with api client, component structure 
  (ui/, common/, layout/, product/)
- Testing standards: What testing patterns exist (or should be established)
- API design: RESTful conventions, error handling middleware, 
  ProducesResponseType attributes, consistent JSON responses
- Data integrity: EF Core model validation, decimal precision, 
  required/MaxLength attributes
- Performance: CORS configuration, async/await patterns, 
  AsNoTracking for read queries
- User experience: Tailwind CSS design system, responsive layout, 
  framer-motion animations, accessibility

Include governance for how these principles should guide all technical 
decisions and implementation choices going forward.
```

**Verify:**
- `.specify/memory/constitution.md` is created
- Review it — ensure it accurately reflects the existing codebase patterns
- Edit if needed (e.g., ensure it mentions EF Core migrations, the existing controller patterns)

**After step:**

```bash
git add -A
git commit -m "spec-kit: constitution generated from brownfield analysis"
git checkout -b feature/spec-kit/03-specify
```

---

### STEP 3 — Specify (Branch: `feature/spec-kit/03-specify`)

**What it does:** Creates a feature specification describing WHAT to build and WHY. This auto-creates a spec directory under `specs/`.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.specify` agent with this prompt:**

```
#Goal
Complete the end-to-end order processing flow in the Shop Assistant 
application — connecting the existing frontend cart to the existing 
backend Orders API so that a placed order results in real Order and 
OrderItem rows persisted in the SQL database.

#Context
This is a brownfield e-commerce application with significant existing 
infrastructure:

BACKEND (ASP.NET Core 10 + EF Core + SQL Server):
- Order model with OrderNumber, TotalAmount, Status, ShippingAddress 
  (JSON), CustomerEmail, CustomerName, OrderItems collection
- OrderItem model with ProductId, ProductName, Quantity, UnitPrice, 
  linked to Order and Product
- CartItem model exists (SessionId, ProductId, Quantity, AddedAt) with 
  DbSet registered but NO controller/endpoints
- OrdersController with POST /api/orders (creates order + items in a 
  transaction), GET /api/orders/{id}, GET /api/orders/number/{orderNumber}
- CreateOrderRequest DTO expects Items[], TotalAmount, ShippingAddress, 
  CustomerEmail, CustomerName
- Products and Categories controllers already working

FRONTEND (Next.js 15 + TypeScript + React 19):
- Cart managed client-side via React Context + localStorage 
  (cart-context.tsx)
- Cart page (app/cart/page.tsx) displays items with quantity controls
- Checkout page (app/checkout/page.tsx) has 4 steps: 
  Shipping → Delivery → Payment → Review
- Checkout currently SIMULATES order processing with setTimeout and a 
  random order number — does NOT call the backend
- API client (lib/api/orders.ts) has createOrder(), getOrderById(), 
  getOrderByNumber(), buildOrderRequest() functions already defined 
  but never called from checkout
- Checkout success page exists but shows fake order data

#Instructions
Specify the complete feature to wire up the order flow:

1. CHECKOUT INTEGRATION: The checkout page's "Place Order" handler must 
   call the backend POST /api/orders via the existing createOrder() API 
   client function instead of simulating. Build the request using 
   buildOrderRequest() with cart items, shipping info, customer email 
   and name from the checkout form.

2. ORDER CONFIRMATION: After successful order creation, redirect to 
   /checkout/success with the real order number. The success page should 
   fetch and display real order details (items, totals, shipping address) 
   from GET /api/orders/number/{orderNumber}.

3. ERROR HANDLING: Handle API errors gracefully — show user-friendly 
   error messages if order creation fails (network error, validation 
   error, product not found). Do not clear the cart if the order fails.

4. CART CLEARING: Only clear the cart (via clearCart()) after a 
   successful order response from the backend.

5. DATA MAPPING: Map frontend cart items (productId as string, quantity) 
   to backend order items (productId as int, quantity, unitPrice from 
   product data). The frontend product IDs are strings; the backend 
   expects integers.

6. OPTIONAL - CART API (server-side): Optionally create a CartController 
   with basic endpoints (POST /api/cart/items, GET /api/cart/{sessionId}, 
   DELETE /api/cart/{sessionId}/items/{productId}) using the existing 
   CartItem model. This is secondary to the order flow but rounds out 
   the feature.

The end result must be: user adds products → goes to cart → proceeds 
to checkout → fills shipping/payment → places order → Order + OrderItem 
rows appear in the SQL database → success page shows real order details.
```

**Verify:**
- A new spec directory is created (e.g., `specs/001-order-processing/spec.md`)
- Read the generated spec thoroughly
- Ensure it covers: checkout integration, order confirmation, error handling, cart clearing logic, data type mapping
- Edit anything that doesn't match expectations

**After step:**

```bash
git add -A
git commit -m "spec-kit: feature specification for order processing"
git checkout -b feature/spec-kit/04-clarify
```

---

### STEP 4 — Clarify (Branch: `feature/spec-kit/04-clarify`)

**What it does:** The AI asks structured questions to resolve ambiguities in the spec. This is optional but strongly recommended for features with data flow across layers.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.clarify` agent with this prompt:**

```
Execute
```

The AI will ask sequential questions. Here are the likely questions and **suggested answers** you should give during the demo:

---

**Q: How should product prices be validated — should the backend re-check prices against the database or trust the frontend-submitted prices?**

> Answer: The backend should validate that the submitted unitPrice matches the 
> current product price in the database. If there's a mismatch (e.g., price 
> changed between adding to cart and placing order), return a 400 error with 
> details about which products have price changes. The frontend should display 
> this error and prompt the user to review their cart.

---

**Q: What should happen to the CartItem records in the database after a successful order?**

> Answer: Since we're keeping the cart primarily client-side (localStorage) 
> for now, there are no CartItem records to clean up for the main flow. 
> If the optional server-side Cart API is implemented, cart items for that 
> session should be deleted after successful order creation. The server-side 
> cart is a nice-to-have, not a blocker for the order flow.

---

**Q: Should the checkout form validate fields before allowing the user to proceed to the next step?**

> Answer: Yes, basic client-side validation should be added — required fields, 
> valid email format, minimum length for name and address. The existing Input 
> components already support a `required` prop. Step navigation should be 
> blocked if required fields are empty. No need for real-time validation — 
> validate on "Continue" button click.

---

**Q: How should the frontend handle the case where a product in the cart is no longer available (deleted or out of stock) when placing an order?**

> Answer: The backend POST /api/orders already checks that all product IDs 
> exist. If a product is not found, it returns 400 with "Product with ID X 
> not found". The frontend should display this error message and suggest the 
> user remove the unavailable item from their cart. We don't need to add stock 
> quantity tracking in v1.

---

**Q: What format should the order number use and how should it be displayed on the success page?**

> Answer: Use the existing format from the backend: ORD-YYYY-XXXXX 
> (e.g., ORD-2026-48573). The success page should display it prominently 
> with a "thank you" message, order summary, and shipping address. 
> No need for email confirmation in v1.

---

> **Demo tip:** If the AI asks different questions, answer them based on the project context. The key principle is: keep it simple for v1, trust existing backend validation, focus on wiring the frontend to the backend.

**After step:**

```bash
git add -A
git commit -m "spec-kit: clarification completed"
git checkout -b feature/spec-kit/05-plan
```

---

### STEP 5 — Plan (Branch: `feature/spec-kit/05-plan`)

**What it does:** Generates a technical implementation plan — architecture, dependencies, data flow. The plan must align with the existing tech stack.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.plan` agent with this prompt:**

```
#Goal
Define the technical implementation plan for the order processing feature, 
working within the existing architecture and tech stack.

#Context
The spec is finalized. This plan translates the feature requirements into 
concrete technical changes aligned with the constitution and existing 
codebase patterns.

#Instructions
Provide technical decisions for each area:

BACKEND CHANGES (ASP.NET Core 10 / C# / EF Core):
- No new models needed — Order, OrderItem, CartItem already exist.
- No new migrations needed — schema already supports the flow.
- Optional: Add a CartController following the existing controller 
  patterns (constructor injection of ShopDbContext + ILogger, 
  ProducesResponseType attributes, try/catch with structured logging).
- Consider adding price validation in OrdersController.CreateOrder — 
  verify submitted unit prices match current product prices.

FRONTEND CHANGES (Next.js 15 / TypeScript / React 19):
- Modify checkout/page.tsx handlePlaceOrder() to use createOrder() 
  and buildOrderRequest() from lib/api/orders.ts instead of setTimeout.
- Product IDs are strings in the frontend (productId: string in CartItem) 
  but integers in the backend — use parseInt() during mapping.
- Modify checkout/success page to accept orderNumber as a query param 
  and fetch real order details via getOrderByNumber().
- Add error state handling in checkout — display API errors, don't 
  clear cart on failure.
- Wire up the existing useCartActions().clearCart() only after 
  successful API response.

API CLIENT:
- The api client functions in lib/api/orders.ts are already implemented 
  — createOrder(), buildOrderRequest(), getOrderByNumber(). 
  No changes needed.
- The base client in lib/api/client.ts handles errors via ApiError class.

DATA FLOW:
- Cart items (localStorage) → map to BackendOrderItemRequest[] → 
  POST /api/orders → Order + OrderItems in SQL → return OrderDto → 
  redirect to /checkout/success?order=ORD-XXXX → 
  GET /api/orders/number/ORD-XXXX → display confirmation.

TESTING:
- Backend: The api-tests.http file can be updated with order creation 
  test requests.
- Frontend: Manual testing flow — add product, checkout, verify DB.
- Use SQLite or existing SQL Server dev database.

Keep changes minimal and surgical — the goal is to wire existing 
pieces together, not to refactor.
```

**Verify:**
- Plan file created (e.g., `specs/001-order-processing/plan.md`)
- Confirm it respects existing architecture — no unnecessary new packages, no refactoring
- Ensure data flow is accurately mapped

**After step:**

```bash
git add -A
git commit -m "spec-kit: technical plan generated"
git checkout -b feature/spec-kit/06-analyze
```

---

### STEP 6 — Analyze (Branch: `feature/spec-kit/06-analyze`)

**What it does:** Cross-artifact consistency check. Validates that constitution, spec, plan, and tasks all align. Flags CRITICAL findings. This is the quality gate before implementation.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.analyze` agent with this prompt:**

```
Execute
```

**What to look for:**
- **CRITICAL findings:** Fix these before proceeding (e.g., "spec requires X but plan doesn't address it")
- **Warnings:** Review but can proceed (e.g., "consider adding integration tests")
- **Info:** Nice to know, no action needed

**If critical issues are found:**
- Go back and update the spec or plan as needed
- Re-run `/speckit.analyze` to confirm the fix

> **Demo tip:** This is a great moment to show the audience that SDD has built-in quality gates. The analyze step catches misalignments BEFORE you write a single line of code.

**After step:**

```bash
git add -A
git commit -m "spec-kit: analysis passed - consistency verified"
git checkout -b feature/spec-kit/07-tasks
```

---

### STEP 7 — Tasks (Branch: `feature/spec-kit/07-tasks`)

**What it does:** Breaks the plan into ordered, executable tasks with clear dependencies and acceptance criteria.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.tasks` agent with this prompt:**

```
Execute
```

**Expected generated tasks (approximate):**

| Task | Description | Dependencies |
|------|-------------|--------------|
| T001 | Add price validation in `OrdersController.CreateOrder` | None |
| T002 | Update `handlePlaceOrder()` in `checkout/page.tsx` to call `createOrder()` | None |
| T003 | Map frontend cart items to `BackendOrderItemRequest[]` with proper type conversion | T002 |
| T004 | Build shipping address from checkout form data to `BackendAddressDto` | T002 |
| T005 | Add error handling and display in checkout for API failures | T002 |
| T006 | Only clear cart after successful order response | T002, T005 |
| T007 | Update checkout success page to accept real `orderNumber` param | T002 |
| T008 | Fetch and display real order details on success page via `getOrderByNumber()` | T007 |
| T009 | (Optional) Create `CartController` with basic CRUD endpoints | None |
| T010 | Update `api-tests.http` with order creation test requests | T001 |
| T011 | End-to-end manual test: add product → checkout → verify order in DB | All above |

**Verify:**
- Tasks file created (e.g., `specs/001-order-processing/tasks.md`)
- Check task ordering and dependencies make sense
- Acceptance criteria are specific and testable

**After step:**

```bash
git add -A
git commit -m "spec-kit: task list generated"
git checkout -b feature/spec-kit/08-implement
```

---

### STEP 8 — Implement (Branch: `feature/spec-kit/08-implement`)

**What it does:** Executes all tasks to generate working code. The AI references every artifact (constitution, spec, plan, tasks) to produce consistent, aligned implementations.

**In VS Code Copilot Chat (Agent Mode), use the `speckit.implement` agent with this prompt:**

```
#Goal
Execute all tasks from tasks.md to complete the order processing feature.

#Context
All artifacts are finalized and have passed the /speckit.analyze consistency 
check. The constitution, spec, plan, and tasks are ready.

#Instructions
Implement all tasks from tasks.md in sequence. For each task:
1. Read the task description and acceptance criteria
2. Apply constitution principles to all code decisions
3. Follow the architectural patterns defined in the plan
4. Generate code changes as specified
5. Validate the task's acceptance criteria before proceeding to the next

Key implementation notes:
- In checkout/page.tsx, the handlePlaceOrder function currently uses 
  setTimeout to simulate — replace with actual createOrder() call
- Use parseInt() to convert productId from string to number
- Build the order request using the existing buildOrderRequest() helper
- Only clear cart AFTER successful API response
- On the success page, use the order number from the URL query param 
  to fetch real order data via getOrderByNumber()
- Follow existing error handling patterns (try/catch, structured logging)

#Output
Working code changes committed incrementally. Flag any ambiguities 
or blockers before proceeding.
```

> **Note:** Implementation may take several minutes. If it's too slow for a live demo, `git checkout feature/spec-kit/08-implement` to the pre-baked result.

**If the agent doesn't complete all tasks in one pass:**

```
Continue implementing the remaining tasks.
```

Or target specific tasks:

```
Implement task T007 and T008 (checkout success page).
```

**After step:**

```bash
git add -A
git commit -m "spec-kit: implementation complete - orders now persist to DB"
```

---

## Post-Implementation Verification

### 1. Start the backend

```bash
cd backend
dotnet run
```

### 2. Start the frontend

```bash
cd frontend
pnpm dev
```

### 3. Test the flow

1. Open `http://localhost:3000/products`
2. Add one or more products to the cart
3. Go to cart → "Proceed to Checkout"
4. Fill in shipping info, select delivery, enter payment
5. Click "Place Order"
6. Verify redirect to success page with real order number (ORD-2026-XXXXX)
7. Verify order details displayed

### 4. Verify data in SQL database

```bash
# Using the API
curl http://localhost:5223/api/orders/number/ORD-2026-XXXXX

# Or check the database directly using the http test file
# backend/api-tests.http
```

### 5. Verify Order + OrderItems in DB

Check that:
- An `Order` row exists with correct TotalAmount, Status="Pending", ShippingAddress (JSON), CustomerEmail, CustomerName
- `OrderItem` rows exist for each cart item with correct ProductId, ProductName, Quantity, UnitPrice
- OrderItems link back to the Order via OrderId foreign key

---

## Demo Talking Points

### Why Brownfield?
- Most real projects aren't greenfield — teams extend existing codebases
- Spec Kit's constitution step analyzes what already exists before defining rules
- No need to rewrite — we're wiring existing pieces together

### Why This Feature?
- It spans the full stack (frontend, backend, database)
- The backend API exists but is disconnected from the frontend
- Classic "last mile" problem — the plumbing is missing, not the architecture

### SDD Value Proposition
- **Constitution** → The AI understands our coding patterns before touching anything
- **Specify** → We define WHAT, not HOW — the spec is technology-agnostic
- **Clarify** → Edge cases caught BEFORE implementation (price validation, error handling)
- **Plan** → Technical decisions documented and reviewed BEFORE code
- **Analyze** → Quality gate catches misalignments at spec level (cheapest place to fix)
- **Tasks** → Ordered, dependency-aware work items with acceptance criteria
- **Implement** → AI has full context from every prior step — no re-explanation needed

### Key Metrics to Highlight
| Metric | Without SDD | With SDD |
|--------|-------------|----------|
| Token consumption | ~92% budget | ~35% budget |
| Context loss | High (re-explain each prompt) | None (persistent specs) |
| Rework | Frequent | Minimal |
| Traceability | Zero | Full audit trail |

---

## Quick Reference: All Commands

| Step | Branch | Agent | Prompt Summary |
|------|--------|-------|----------------|
| Init | `01-init` | Terminal | `specify init . --ai copilot` |
| Constitution | `02-constitution` | `speckit.constitution` | Analyze brownfield codebase, derive principles |
| Specify | `03-specify` | `speckit.specify` | Order processing feature spec with full context |
| Clarify | `04-clarify` | `speckit.clarify` | `Execute` — answer AI questions |
| Plan | `05-plan` | `speckit.plan` | Technical plan respecting existing stack |
| Analyze | `06-analyze` | `speckit.analyze` | `Execute` — consistency check |
| Tasks | `07-tasks` | `speckit.tasks` | `Execute` — generate ordered task list |
| Implement | `08-implement` | `speckit.implement` | Execute all tasks with implementation notes |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `/speckit` commands not showing | Switch to Agent Mode in Copilot Chat panel |
| `specify` command not found | Re-run `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git` |
| Backend can't connect to SQL | Check `appsettings.Development.json` connection string |
| Frontend can't reach backend | Verify CORS allows `localhost:3000` and API is running on expected port |
| Agent doesn't find spec files | Ensure `specs/` directory exists and files were committed |
| Implement step is slow | Use `git checkout feature/spec-kit/08-implement` for pre-baked result |
