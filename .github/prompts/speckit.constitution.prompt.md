---
agent: speckit.constitution
---

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
