# Development Guide

## Prerequisites

- Node.js 20+
- .NET SDK 8.0 or 10.0
- pnpm 10+
- SQL Server LocalDB (included with Visual Studio)

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd shop-assistant
```

### 2. Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

The API will be available at `http://localhost:5250`

### 3. Frontend Setup

```bash
cd frontend
pnpm install
pnpm run dev
```

The web app will be available at `http://localhost:3000`

## Development Workflow

### Running the Application

Start both frontend and backend servers:

**Backend (Terminal 1):**
```bash
cd backend
dotnet run
```

**Frontend (Terminal 2):**
```bash
cd frontend
pnpm run dev
```

### Making Changes

1. Create a feature branch
2. Make your changes
3. Run tests and type checking:
   ```bash
   # Frontend type checking
   cd frontend
   pnpm run type-check
   pnpm run lint
   
   # Backend tests
   cd backend
   dotnet test
   ```
4. Commit and push changes
5. Create pull request

## Shopping Cart Feature

### Architecture

The shopping cart is implemented using:

1. **State Management:** React Context API (`CartProvider`)
2. **Persistence:** Browser localStorage with error handling
3. **Data Flow:** 
   - Cart items stored with productId and quantity
   - Product details fetched on-demand from API
   - Real-time calculations in hooks

### Cart Context Enhancements

The cart context includes comprehensive features for cart management:

**Quantity Validation:**
- Minimum quantity: 1
- Maximum quantity: 100
- Quantities automatically clamped to valid range
- Items with quantity 0 are automatically removed
- Console warnings in development mode for validation issues

**Actions:**
- `ADD_ITEM`: Add item or increment quantity if exists
- `REMOVE_ITEM`: Remove item by productId
- `UPDATE_QUANTITY`: Update item quantity with validation
- `INCREMENT_ITEM`: Increase quantity by 1 (respects max)
- `DECREMENT_ITEM`: Decrease quantity by 1 (removes if reaches 0)
- `CLEAR_CART`: Empty the cart
- `LOAD_CART`: Restore cart from localStorage

**Error Handling:**
- localStorage quota exceeded: Cart works in memory-only mode
- Corrupted data: Cart resets gracefully
- User notification in development mode for storage issues
- All cart operations wrapped in try-catch blocks

**Performance:**
- Memoized calculations (`totalItems`, `subtotal`, `isEmpty`)
- Prevents unnecessary re-renders
- Efficient state updates with immutable patterns

### Cart Components

#### CartProvider (`context/cart-context.tsx`)
Manages cart state with reducer pattern:
- Validates quantities (1-100 range)
- Auto-removes items with quantity 0
- Handles localStorage persistence with error recovery
- Shows warning indicator in dev mode if storage fails

#### useCart Hook (`lib/hooks/use-cart.ts`)
Provides cart access:
- `items`: Raw cart items
- `totalItems`: Total quantity across all items
- `isEmpty`: Boolean indicating if cart is empty
- `dispatch`: For custom actions

#### useCartWithProducts Hook
Get cart items with full product data:
- Fetches product details from API
- Calculates `subtotal` (sum of line totals)
- Returns `totalItems`, `isEmpty`, `isLoading`
- Optimized with memoization

#### useCartActions Hook
Convenient action functions:
- `addToCart(product, quantity)`: Add or increment item
- `removeFromCart(productId)`: Remove item completely
- `updateQuantity(productId, quantity)`: Set specific quantity
- `incrementItem(productId)`: Increase by 1
- `decrementItem(productId)`: Decrease by 1
- `clearCart()`: Empty cart
- All actions include JSDoc documentation

### Cart Components
- `ADD_ITEM`: Add item or increment quantity if exists
- `REMOVE_ITEM`: Remove item by productId
- `UPDATE_QUANTITY`: Update item quantity
- `CLEAR_CART`: Empty the cart
- `LOAD_CART`: Restore cart from localStorage

#### useCart Hook (`lib/hooks/use-cart.ts`)
Provides cart access:
- `useCart()`: Get cart items and total count
- `useCartWithProducts()`: Get cart items with full product data, subtotal, loading state
- `useCartActions()`: Get cart manipulation functions (add, remove, update, clear)

#### Cart Page (`app/cart/page.tsx`)
Main cart display:
- Shows empty state when no items
- Lists all cart items with product details
- Displays order summary with subtotal
- Handles loading states

#### CartItem Component (`components/cart/cart-item.tsx`)
Individual cart item display:
- Product image (linked to detail page)
- Product name and brand
- Unit price and line total
- Quantity controls (+/- buttons, input field)
- Remove button
- Responsive layout

#### CartSummary Component (`components/cart/cart-summary.tsx`)
Order summary sidebar:
- Item count
- Subtotal calculation
- "Proceed to Checkout" button
- Sticky positioning on desktop

#### EmptyCart Component (`components/cart/empty-cart.tsx`)
Empty cart state:
- Cart icon
- Message
- "Continue Shopping" button

### Testing the Cart

1. Navigate to http://localhost:3000/products
2. Click "Add to Cart" on any product
3. Notice cart count badge in header
4. Click cart icon to view cart page
5. Test quantity controls:
   - Click + to increase
   - Click - to decrease
   - Type directly in input
6. Test remove button
7. Refresh page to verify persistence
8. Test "Continue Shopping" link
9. Add multiple items and verify subtotal calculation

### Cart Data Flow

```
User Action → CartProvider → localStorage → useCartWithProducts → Fetch Products → Display
```

1. User adds item to cart
2. CartProvider dispatches ADD_ITEM action
3. Reducer updates state
4. State saved to localStorage
5. Cart page uses useCartWithProducts hook
6. Hook fetches full product details from API
7. Hook calculates subtotal
8. Components display cart with products

## API Integration

The frontend connects to the backend API for:
- Product listings and details
- Category information
- **Order creation with validation (checkout)**

API client configured in `lib/api/client.ts` with base URL from environment variable:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5250';
```

### Order API Validation

The `POST /api/orders` endpoint includes comprehensive server-side validation to ensure data integrity and prevent fraud:

#### Price Validation (Critical for Security)
- **All prices validated against database** - prevents price tampering
- Client-sent prices must exactly match current database prices
- Any price mismatch results in 400 Bad Request with message: "Price validation failed. Please refresh your cart."
- Price tampering attempts logged with client IP address

#### Quantity Validation
- Minimum quantity per item: 1
- Maximum quantity per item: 100
- Maximum total items in order: 100
- Violations return 400 Bad Request with specific error messages

#### Shipping Address Validation
- All fields required except Country (defaults to "USA")
- Email format validation
- Phone number must contain at least 10 digits
- Postal code: 3-20 alphanumeric characters
- String length limits enforced:
  - FullName: 2-200 characters
  - Email: max 200 characters
  - Phone: max 50 characters
  - StreetAddress: 5-500 characters
  - City: 2-100 characters
  - State: 2-100 characters
  - PostalCode: 3-20 characters
  - Country: max 100 characters

#### Product Validation
- All product IDs must exist in database
- Non-existent products return 400 Bad Request

#### Validation Response Format
Errors returned in ProblemDetails format:
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "ShippingAddress.Email": ["Invalid email format"],
    "Items[0].Quantity": ["Quantity must be between 1 and 100"]
  }
}
```

### Testing Order Validation

Manual test file available at: `backend/tests/OrderValidationTests.http`

Test scenarios included:
1. Valid order creation
2. Price tampering detection
3. Quantity validation (zero, exceeds max)
4. Total items limit
5. Invalid email format
6. Missing required fields
7. Phone number too short
8. Non-existent product
9. String length violations

### Order Retrieval API

The order retrieval endpoints provide optimized read access to order details:

#### GET /api/orders/{id}
Retrieve order by numeric ID.

**Features:**
- Optimized read-only query with `.AsNoTracking()`
- Single database query (no N+1 issues)
- Response time < 200ms
- Client-side caching (5 minutes)
- ProblemDetails error responses

**Response includes:**
- Order ID and order number
- Status, total amount, created date
- Customer information
- Complete item list with line totals
- Full shipping address

#### GET /api/orders/number/{orderNumber}
Retrieve order by order number (e.g., ORD-20260128-001).

**Features:**
- Same optimizations as GET by ID
- Useful for customer order lookup
- Supports bookmarkable URLs

**Cache Control:**
Both endpoints set `Cache-Control: private, max-age=300` headers, allowing browsers to cache order details for 5 minutes.

**Error Responses:**
- 404: Order not found (includes helpful message)
- 500: Internal server error (generic message, detailed logs server-side)

**Manual Test File:** `backend/tests/OrderRetrievalTests.http`

## Code Standards

- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind CSS for styling
- Add proper TypeScript types and interfaces
- Write accessible markup (ARIA labels)
- Keep components small and focused
- Extract reusable logic into hooks
- Use meaningful variable names

## Debugging

### Frontend Issues
- Check browser console for errors
- Use React DevTools to inspect component state
- Check Network tab for API call failures
- Verify localStorage for cart data

### Backend Issues
- Check terminal output for exceptions
- Use breakpoints in Visual Studio/VS Code
- Check database with SQL Server Management Studio
- Verify API responses with REST client or Postman

## Common Tasks

### Adding a New Component
```bash
cd frontend/components
# Create component file
# Add TypeScript types
# Export from index if needed
```

### Adding a New API Endpoint
```bash
cd backend/Controllers
# Create or modify controller
# Add DTO in DTOs folder
# Update database models if needed
# Run migrations if schema changed
```

### Running Database Migrations
```bash
cd backend
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Entity Framework Core Documentation](https://docs.microsoft.com/ef/core)

## Checkout Form Implementation

### Overview

The checkout form is a single-page form that collects shipping information and creates orders via the backend API.

### Form Validation

The form validation matches backend validation rules defined in `AddressDto.cs`:

**Field Rules:**
- **Full Name**: Required, 2-100 characters
- **Email**: Required, valid email format, max 100 characters
- **Phone**: Required, 10-20 characters, alphanumeric with spaces/dashes/parentheses allowed
- **Street Address**: Required, 5-200 characters
- **City**: Required, 2-100 characters
- **State**: Required, 2-100 characters
- **Postal Code**: Required, 3-20 characters, alphanumeric with spaces/dashes allowed
- **Country**: Required, 2-100 characters

**Validation Utilities:**

Located in `frontend/lib/utils/form-validation.ts`:
- `validateFullName(fullName)` - Validates full name field
- `validateEmail(email)` - Validates email with regex
- `validatePhone(phone)` - Validates phone with flexible format
- `validatePostalCode(postalCode)` - Validates postal code
- `validateStreetAddress(streetAddress)` - Validates street address
- `validateCity(city)` - Validates city
- `validateState(state)` - Validates state
- `validateCountry(country)` - Validates country
- `validateShippingAddress(data)` - Validates entire form, returns `{ isValid, errors }`

### Components

**CheckoutForm** (`components/checkout/checkout-form.tsx`):
- Single-page form with 8 shipping address fields
- Client-side validation with real-time error display
- Form data persisted to sessionStorage automatically
- Validates on blur (touched fields) and on submit
- Supports disabled state during submission
- Displays server-side validation errors from API

**OrderReview** (`components/checkout/order-review.tsx`):
- Displays cart items with thumbnails, quantities, and prices
- Shows subtotal, shipping, tax, and total
- Sticky sidebar positioning
- Empty cart state with call-to-action

**Checkout Page** (`app/checkout/page.tsx`):
- Two-column layout (form + order review)
- Handles order submission to `POST /api/orders`
- Comprehensive error handling:
  - Network errors
  - Validation errors (400)
  - Product not found (404)
  - Server errors (500)
- Clears cart and sessionStorage on success
- Navigates to success page with order ID

### Form Persistence

The checkout form automatically saves and restores data using sessionStorage:

**Storage Key:** `checkout-form-data`

**Behavior:**
- Form data saved on every input change
- Data restored when page is loaded
- Data cleared after successful order submission
- Graceful error handling if sessionStorage unavailable

### Order Submission Flow

1. User fills out shipping form
2. Client-side validation runs on submit
3. If valid, form data sent to `POST /api/orders` with:
   - `items[]` - Cart items with productId, quantity, unitPrice
   - `totalAmount` - Cart subtotal
   - `shippingAddress` - Complete address object
4. Backend validates:
   - Address fields (data annotations)
   - Product prices against database (security check)
   - Product availability
   - Quantity limits (1-100 per item)
5. On success:
   - Order created with generated order number
   - Cart cleared from localStorage
   - Form data cleared from sessionStorage
   - Navigate to `/checkout/success?orderId={id}`
6. On error:
   - Display error message above form
   - Keep form data intact for correction
   - User can fix issues and resubmit

### Error Handling

The checkout page handles multiple error scenarios:

**Network Errors:**
```
Network error. Please check your connection and try again.
```

**Validation Errors (400):**
```
Validation failed:
FullName: Full name is required
Email: Please enter a valid email address
```

**Product Not Found (404):**
```
One or more products in your cart are no longer available.
```

**Server Errors (500):**
```
Server error. Please try again later.
```

### Testing Checkout

**Manual Testing:**

1. Add products to cart
2. Navigate to `/checkout`
3. Fill out shipping form with valid data
4. Submit and verify order creation
5. Test validation by leaving fields empty or entering invalid data
6. Test error scenarios:
   - Backend not running (network error)
   - Invalid product ID in cart (404)
   - Modified prices in localStorage (validation error)

**Backend Order API:**

Use `backend/tests/OrderValidationTests.http` to test order creation scenarios.

### Integration with Cart

The checkout page integrates with the cart system:

**Cart Context:**
- Uses `useCartWithProducts()` to get cart items with product details
- Uses `useCartActions()` to access `clearCart()` function
- Verifies cart is not empty before showing checkout form

**Type Safety:**
- `CartItemWithProduct` includes full product details
- Backend expects `productId` as number (cart stores as string - converted during submission)
- Cart items mapped to `BackendOrderItemRequest[]` format

### API Types

The checkout implementation uses these backend types:

**BackendAddressDto:**
```typescript
{
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

**BackendCreateOrderRequest:**
```typescript
{
  items: BackendOrderItemRequest[];
  totalAmount: number;
  shippingAddress: BackendAddressDto;
}
```

**BackendOrderItemRequest:**
```typescript
{
  productId: number;
  quantity: number;
  unitPrice: number;
}
```

### Security Considerations

- Prices submitted from frontend are validated against database on backend
- Product availability verified during order creation
- Quantity limits enforced (1-100 per item)
- All validation rules applied server-side regardless of client-side validation
- No payment information collected (placeholder for future payment integration)

## Order Confirmation Page

### Overview

The order confirmation page displays order details after successful checkout, fetched fresh from the backend API each time.

### Page Route

**URL:** `/checkout/success?orderId={orderId}`

**Access:** Public (no authentication required, but requires valid orderId query parameter)

### Components

**OrderConfirmationHeader** (`components/order/order-confirmation-header.tsx`):
- Large success checkmark icon (green)
- "Order Confirmed!" headline
- Order number displayed prominently
- Order date/time (formatted: "January 28, 2026 at 10:30 AM")
- Status badge (color-coded by status)

**OrderDetails** (`components/order/order-details.tsx`):
- Lists all order items with:
  - Product name
  - Quantity × Unit price
  - Line total
- Shows subtotal, shipping (FREE), tax ($0.00), total
- Item count summary

**ShippingAddressDisplay** (`components/order/shipping-address-display.tsx`):
- Customer name
- Email (clickable mailto link)
- Phone (clickable tel link)
- Full shipping address (street, city, state, postal code, country)

**OrderStatusBadge** (`components/order/order-status-badge.tsx`):
- Color-coded status badge:
  - **Pending**: Yellow/Orange
  - **Processing**: Blue
  - **Shipped**: Purple
  - **Delivered**: Green
  - **Cancelled**: Red

**OrderActions** (`components/order/order-actions.tsx`):
- "Continue Shopping" button (navigates to /products)
- "Print Receipt" button (triggers browser print dialog)

### Data Fetching

**API Integration:**
- Fetches order data on page load: `GET /api/orders/{orderId}`
- Extracts orderId from URL query parameter
- Handles loading state with spinner
- Handles error states (404, 500, network)

**Loading States:**
1. **Loading:** Spinner displayed with "Loading Your Order..." message
2. **Success:** Order details displayed
3. **Error:** Error message with retry button

**Error Handling:**
- **Missing orderId**: Redirects to homepage
- **Order not found (404)**: Shows "Order Not Found" with link to homepage
- **Server error (500)**: Shows generic error with retry button
- **Network error**: Shows connection error with retry button

### Utilities

**Date Formatting** (`lib/utils/date-format.ts`):
- `formatOrderDate(isoDate)` - Formats to "January 28, 2026 at 10:30 AM"
- `formatShortDate(isoDate)` - Formats to "Jan 28, 2026"
- `formatEstimatedDelivery(orderDate)` - Calculates 5-7 day delivery estimate

### Navigation Flow

**Entry Points:**
1. From checkout page after successful order creation
2. Bookmark or direct URL access (requires orderId)

**Exit Points:**
1. "Continue Shopping" → `/products`
2. "Go to Homepage" → `/` (from error states)

### Bookmarkability

The success page can be bookmarked and accessed later:
- Order data fetched fresh from API each time
- No reliance on client state or localStorage
- orderId in URL ensures order retrieval

### Print Functionality

The page includes print-optimized styles:
- Print button triggers `window.print()`
- `@media print` CSS hides navigation, buttons
- High contrast for printed text
- Simplified layout for printing

**Print CSS:**
```css
@media print {
  header, footer, nav, .no-print {
    display: none !important;
  }
  body {
    color: black;
    background: white;
  }
  button {
    display: none;
  }
}
```

### Responsive Design

**Mobile (< 768px):**
- Single column layout
- Stacked order details and shipping address
- Full-width action buttons

**Tablet/Desktop (≥ 768px):**
- Two-column layout (order details 66%, shipping address 33%)
- Horizontal action button layout

### Testing

**Manual Testing:**
1. Complete checkout flow, verify navigation to success page
2. Refresh page, verify order loads correctly
3. Bookmark URL, close browser, reopen bookmark
4. Test print functionality
5. Test error scenarios (invalid orderId, backend down)

**Backend Integration:**
- Requires `GET /api/orders/{id}` endpoint (from TASK-003)
- Order number format from TASK-001

