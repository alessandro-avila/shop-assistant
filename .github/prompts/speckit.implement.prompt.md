---
agent: speckit.implement
---

# Goal
Execute all tasks from tasks.md to complete the order processing feature.

# Context
All artifacts are finalized and have passed the /speckit.analyze consistency 
check. The constitution, spec, plan, and tasks are ready.

# Instructions
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

# Output
Working code changes committed incrementally. Flag any ambiguities 
or blockers before proceeding.
