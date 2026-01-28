# Task 006: Frontend Checkout Form Implementation

**Task ID:** TASK-006  
**Feature:** FEAT-CHECKOUT-001 (Checkout Process)  
**Priority:** High  
**Complexity:** High  
**Estimated Effort:** 10-12 hours

---

## Description

Implement the checkout page (`/checkout`) where users provide shipping information, review their order, and submit to create an order in the database. This page includes form validation, API integration, error handling, and navigation to the confirmation page upon success.

---

## Dependencies

**Prerequisite Tasks:**
- TASK-002 (Backend Order API Validation) - Required for order creation endpoint
- TASK-004 (Frontend Cart Context Enhancement) - Required for cart data
- TASK-005 (Frontend Cart Page) - Required for navigation flow

**Blocks:**
- TASK-007 (Frontend Order Confirmation Page)

---

## Technical Requirements

### Page Specifications

1. **Route:** `/checkout`
2. **File:** `frontend/app/checkout/page.tsx`
3. **Protected:** Redirect to `/cart` if cart is empty
4. **State Management:** Uses cart context and local form state

### UI Components to Create

1. **Checkout Page (`app/checkout/page.tsx`)**
   - Main container for checkout flow
   - Two-column layout (form + order summary)
   - Responsive design (single column on mobile)

2. **Checkout Form Component (`components/checkout/checkout-form.tsx`)**
   - Shipping information fields:
     - Full Name (required)
     - Email (required, email validation)
     - Phone (required, phone validation)
     - Street Address (required)
     - City (required)
     - State/Province (required)
     - Postal Code (required)
     - Country (optional, default: "USA")
   - Form validation (client-side)
   - Submit button with loading state
   - Error message display

3. **Order Review Component (`components/checkout/order-review.tsx`)**
   - Display cart items summary:
     - Product name
     - Quantity
     - Unit price
     - Line total
   - Display subtotal
   - Read-only (no editing, must go back to cart)
   - Sticky/fixed on desktop

4. **Checkout Loading Component (`components/checkout/checkout-loading.tsx`)**
   - Display while order is being created
   - Spinner/skeleton
   - Message: "Creating your order..."

### Functional Requirements

1. **Form Validation (Client-Side)**
   - **All fields required** except Country
   - **Email validation:**
     - Must contain @
     - Must have domain
     - Format: `user@example.com`
   - **Phone validation:**
     - Must contain at least 10 digits
     - Accept formats: (555) 123-4567, 555-123-4567, 5551234567
   - **Postal Code validation:**
     - Alphanumeric, 3-10 characters
   - **Real-time validation:**
     - Validate on blur (field loses focus)
     - Show error immediately below field
     - Prevent submit if validation fails

2. **Form State Management**
   - Use React state or React Hook Form
   - Initial state: Empty form
   - Load from sessionStorage if exists (form persistence)
   - Save to sessionStorage on every change

3. **Order Submission**
   - Collect form data + cart data
   - Transform to API format (CreateOrderRequest)
   - POST to `/api/orders`
   - Handle loading state (disable form, show spinner)
   - Handle success: Clear cart, navigate to confirmation
   - Handle error: Show error message, allow retry

4. **Cart Data Validation**
   - Verify cart is not empty before allowing checkout
   - Calculate total amount (sum of line totals)
   - Build order items array (productId, quantity, unitPrice)

5. **Navigation Flow**
   - **Entry:** From cart page "Proceed to Checkout" button
   - **Exit (success):** Navigate to `/checkout/success?orderId={orderId}`
   - **Exit (cancel):** Link back to cart "< Back to Cart"
   - **Exit (empty cart):** Redirect to `/cart`

6. **Error Handling**
   - **Network error:** "Unable to connect. Please try again."
   - **Validation error (400):** Display field-specific errors
   - **Server error (500):** "Something went wrong. Please try again."
   - **Product not found (404):** "One or more products unavailable."
   - **Price mismatch:** "Prices have changed. Please refresh your cart."
   - All errors: Retry button, form data preserved

7. **Loading States**
   - Button shows spinner while submitting
   - Button text: "Place Order" → "Creating Order..."
   - Form fields disabled during submission
   - Prevent double-submission (disable button on first click)

---

## Acceptance Criteria

### Functional Requirements

1. **Page Access**
   - ✅ Page accessible at `/checkout` route
   - ✅ Redirects to `/cart` if cart is empty
   - ✅ Form pre-filled from sessionStorage if exists

2. **Form Display**
   - ✅ All required fields marked with asterisk (*)
   - ✅ Labels associated with inputs
   - ✅ Placeholders provide examples
   - ✅ Error messages display below fields

3. **Form Validation**
   - ✅ Empty required fields: "This field is required"
   - ✅ Invalid email: "Please enter a valid email address"
   - ✅ Phone too short: "Phone number must be at least 10 digits"
   - ✅ Submit button disabled until form valid
   - ✅ Validation runs on blur and on submit

4. **Order Review**
   - ✅ All cart items displayed
   - ✅ Item count accurate
   - ✅ Subtotal accurate
   - ✅ Matches cart exactly (no stale data)

5. **Order Submission**
   - ✅ Clicking "Place Order" sends POST to `/api/orders`
   - ✅ Request includes items and shipping address
   - ✅ Loading state shown during API call
   - ✅ Success: Cart cleared, navigate to confirmation
   - ✅ Error: Message displayed, form data preserved

6. **Error Handling**
   - ✅ Network error: User-friendly message
   - ✅ Validation error: Field-specific messages
   - ✅ Server error: Generic message
   - ✅ Retry button allows re-submission
   - ✅ Form data not lost on error

7. **Form Persistence**
   - ✅ Form data saved to sessionStorage on change
   - ✅ Form data restored if user navigates back
   - ✅ sessionStorage cleared after successful order

8. **Responsive Design**
   - ✅ Two-column layout on desktop (form + summary)
   - ✅ Single-column layout on mobile
   - ✅ Touch-friendly inputs on mobile (large tap targets)
   - ✅ Summary sticky on desktop, fixed bottom on mobile

### Non-Functional Requirements
- ✅ Form validation completes in < 50ms
- ✅ Order submission completes in < 5 seconds
- ✅ Page loads in < 1 second
- ✅ No layout shift during loading

### Code Quality
- ✅ TypeScript strict mode compliant
- ✅ Form validation DRY (reusable validation functions)
- ✅ API client uses type-safe methods
- ✅ Error handling comprehensive
- ✅ Follows React best practices

---

## Testing Requirements

### Unit Tests (Required - ≥85% coverage)

1. **Test: Form Validation - Empty Fields**
   - Given: All fields empty
   - When: Submit form
   - Then: All required fields show "This field is required"

2. **Test: Form Validation - Invalid Email**
   - Given: Email = "not-an-email"
   - When: Blur email field
   - Then: Error: "Please enter a valid email address"

3. **Test: Form Validation - Valid Email**
   - Given: Email = "user@example.com"
   - When: Blur email field
   - Then: No error

4. **Test: Form Validation - Phone Too Short**
   - Given: Phone = "123"
   - When: Blur phone field
   - Then: Error: "Phone number must be at least 10 digits"

5. **Test: Form Submission - Success**
   - Given: Valid form, API returns 201
   - When: Submit form
   - Then: Navigate to confirmation page, cart cleared

6. **Test: Form Submission - Validation Error**
   - Given: Valid form, API returns 400 with errors
   - When: Submit form
   - Then: Errors displayed, form not cleared

7. **Test: Form Submission - Network Error**
   - Given: API request fails
   - When: Submit form
   - Then: Error message displayed, retry available

8. **Test: Cart Empty Redirect**
   - Given: Cart is empty
   - When: Navigate to /checkout
   - Then: Redirect to /cart

9. **Test: Order Items Transformation**
   - Given: Cart with 3 items
   - When: Build order request
   - Then: Items array has 3 entries with correct productId, quantity, price

10. **Test: Total Amount Calculation**
    - Given: Cart items (2×$100, 3×$50)
    - When: Calculate total
    - Then: Total = 350.00

### Integration Tests (Required)

1. **Test: End-to-End Checkout Flow**
   - Add items to cart
   - Navigate to /checkout
   - Fill in form
   - Submit order
   - Verify: API called, navigate to confirmation, cart cleared

2. **Test: Form Persistence**
   - Fill in half of form
   - Navigate back to cart
   - Navigate back to /checkout
   - Verify: Form fields pre-filled from sessionStorage

3. **Test: API Error Handling**
   - Mock API to return 500 error
   - Submit form
   - Verify: Error displayed, retry works

### E2E Tests (Optional but Recommended)

1. Test: Complete checkout with Playwright
2. Test: Form validation errors
3. Test: Network error retry

---

## API Integration

### Endpoint: POST /api/orders

**Request Payload:**
```typescript
interface CreateOrderRequest {
  items: OrderItemRequest[];
  totalAmount: number;
  shippingAddress: AddressDto;
  customerEmail: string;
  customerName: string;
}

interface OrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface AddressDto {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
```

**Success Response (201 Created):**
```json
{
  "orderId": 12345,
  "orderNumber": "ORD-20260128-001",
  "status": "Pending",
  "totalAmount": 599.98,
  "createdAt": "2026-01-28T10:30:00Z",
  "items": [...],
  "shippingAddress": {...}
}
```

**Error Response (400 Bad Request):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Items[0].UnitPrice": ["Price validation failed. Please refresh your cart."],
    "ShippingAddress.Email": ["The Email field is not a valid e-mail address."]
  }
}
```

---

## Implementation Notes

### Files to Create

1. **frontend/app/checkout/page.tsx** - Main checkout page
2. **frontend/components/checkout/checkout-form.tsx** - Shipping form
3. **frontend/components/checkout/order-review.tsx** - Cart summary
4. **frontend/components/checkout/checkout-loading.tsx** - Loading state
5. **frontend/lib/validation/checkout-schema.ts** - Validation logic
6. **frontend/lib/api/orders.ts** - Order API client (if not exists)

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form (recommended) or native React state
- **Validation:** Zod schema validation (optional)
- **API Client:** Fetch API or axios
- **State:** Cart context + local form state

### Form Validation Pattern

**Option 1: React Hook Form + Zod**
```typescript
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/\d{10,}/, "Phone must have at least 10 digits"),
  // ...
});

const form = useForm<CheckoutFormData>({
  resolver: zodResolver(formSchema),
});
```

**Option 2: Native Validation**
```typescript
const [errors, setErrors] = useState({});

function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
  return null;
}
```

### Order Submission Flow

1. Validate form (all fields valid)
2. Get cart data from context
3. Build `CreateOrderRequest`:
   - items: Map cart items to `OrderItemRequest[]`
   - totalAmount: Calculate sum of line totals
   - shippingAddress: From form
   - customerEmail: From form
   - customerName: From form
4. Set loading state (`isSubmitting = true`)
5. POST to `/api/orders`
6. Handle response:
   - **201 Created:**
     - Clear cart: `dispatch({ type: 'CLEAR_CART' })`
     - Clear sessionStorage
     - Navigate: `router.push(`/checkout/success?orderId=${orderId}`)`
   - **400 Bad Request:**
     - Parse errors from response
     - Display field-specific errors
     - Set loading state to false
   - **500 Internal Server Error:**
     - Display generic error
     - Set loading state to false
7. Catch network errors:
   - Display: "Unable to connect. Please try again."
   - Set loading state to false

### Form Persistence (sessionStorage)

```typescript
// Save on every change
useEffect(() => {
  sessionStorage.setItem('checkout-form', JSON.stringify(formData));
}, [formData]);

// Load on mount
useEffect(() => {
  const saved = sessionStorage.getItem('checkout-form');
  if (saved) {
    setFormData(JSON.parse(saved));
  }
}, []);

// Clear on success
function clearFormData() {
  sessionStorage.removeItem('checkout-form');
}
```

---

## Design Specifications

### Layout (Desktop - Two Column)
```
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
└─────────────────────────────────────────────────────────┘
┌────────────────────────────────┬────────────────────────┐
│ Shipping Information (60%)     │ Order Summary (40%)    │
│                                │ ┌────────────────────┐ │
│ Full Name: [____________]      │ │ Items:             │ │
│ Email:     [____________]      │ │ - Product A (2×$X) │ │
│ Phone:     [____________]      │ │ - Product B (1×$Y) │ │
│ Address:   [____________]      │ │                    │ │
│ City:      [____________]      │ │ Subtotal: $XXX.XX  │ │
│ State:     [____________]      │ │                    │ │
│ Postal:    [____________]      │ └────────────────────┘ │
│ Country:   [____________]      │                        │
│                                │                        │
│ [< Back to Cart] [Place Order] │                        │
└────────────────────────────────┴────────────────────────┘
```

### Layout (Mobile - Single Column)
```
┌───────────────────────┐
│ Header                │
├───────────────────────┤
│ Order Summary         │
│ - 5 items             │
│ - Subtotal: $XXX.XX   │
├───────────────────────┤
│ Shipping Information  │
│ Full Name: [_______]  │
│ Email: [___________]  │
│ Phone: [___________]  │
│ Address: [_________]  │
│ City: [____________]  │
│ State: [___________]  │
│ Postal: [__________]  │
│ Country: [_________]  │
├───────────────────────┤
│ Fixed Bottom Bar      │
│ [< Back] [Place Order]│
└───────────────────────┘
```

---

## Related Features

- **FEAT-CHECKOUT-001**: Checkout Process (primary feature)
- **FEAT-CART-001**: Shopping Cart Management (provides cart data)
- **FEAT-ORDER-001**: Order Confirmation (next step)

---

## Open Questions

1. **Q:** Should we show shipping cost estimate?  
   **A:** Out of scope - no shipping calculation implemented

2. **Q:** Should we support multiple addresses?  
   **A:** No - single shipping address only

3. **Q:** Should we show tax calculation?  
   **A:** Out of scope - no tax calculation implemented

---

## Definition of Done

- ✅ Checkout page created at `/checkout`
- ✅ All form fields implemented with validation
- ✅ Order review component displays cart correctly
- ✅ API integration complete (POST /api/orders)
- ✅ Success flow works (clear cart, navigate to confirmation)
- ✅ Error handling comprehensive (all error types)
- ✅ Form persistence works (sessionStorage)
- ✅ All unit tests passing (≥85% coverage)
- ✅ Integration tests passing
- ✅ E2E test passing (optional)
- ✅ Responsive design tested on all screen sizes
- ✅ Accessibility requirements met (WCAG 2.1 AA)
- ✅ TypeScript strict mode compliant
- ✅ Code peer-reviewed
- ✅ Manual testing completed
- ✅ PR approved and merged

---

## Success Metrics

- Checkout completion rate > 30%
- Form submission success rate > 95%
- Average checkout time < 2 minutes
- Zero crashes or unhandled errors
- < 5% retry rate (errors requiring retry)
