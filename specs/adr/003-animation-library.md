# ADR 003: Animation Library

**Date**: January 9, 2026  
**Status**: Accepted  
**Deciders**: Development Team, UX Lead

---

## Context

Animations are critical to Shop Assistant's premium feel and demo impact. The application requires:
- Smooth page transitions and modal animations
- Cart drawer slide-in/slide-out
- Product card hover effects and microinteractions
- Loading state transitions (skeleton screens)
- Success animations (order confirmation checkmark)
- Scroll-based animations (fade-in on scroll)
- Respect for `prefers-reduced-motion` accessibility

Animations must run at 60fps without impacting performance metrics. The library should integrate well with React and Next.js App Router, provide declarative APIs, and support complex choreography.

---

## Options Considered

### Option 1: Framer Motion
**Pros**:
- Production-ready React animation library
- Declarative API with variants system
- Automatic `prefers-reduced-motion` detection
- Layout animations (shared layout transitions)
- Gesture support (drag, hover, tap)
- Server Component compatible with proper usage
- Excellent documentation and community
- Optimized for React (uses React's reconciler)
- ~30KB gzipped (tree-shakeable)
- AnimatePresence for exit animations

**Cons**:
- Adds ~30KB to bundle
- Runtime library (vs pure CSS)
- Slight learning curve for variants API
- Can be overkill for simple animations

### Option 2: React Spring
**Pros**:
- Physics-based animations (natural feel)
- Excellent performance (renders outside React)
- Interpolation and spring configurations
- Powerful for complex animations
- Gesture library integration

**Cons**:
- Steeper learning curve (hooks-based API)
- Physics-based approach not always needed
- Less intuitive for simple transitions
- ~25KB gzipped but more complex API
- Harder to achieve consistent timing
- Less declarative than Framer Motion

### Option 3: CSS Transitions/Animations + Tailwind
**Pros**:
- Zero JavaScript overhead
- Excellent performance (GPU accelerated)
- Simple for basic transitions
- Tailwind provides animation utilities
- Smallest possible bundle impact

**Cons**:
- Limited control for complex sequences
- Difficult to coordinate multiple animations
- No AnimatePresence equivalent (exit animations hard)
- Manual reduced-motion media queries
- Challenging for layout animations
- State-based animations require more code

---

## Decision

**Selected**: Framer Motion with CSS fallbacks

**Rationale**:
1. **Developer Experience**: Declarative variants API enables rapid animation development
2. **Accessibility Built-in**: Automatic `prefers-reduced-motion` support crucial for inclusive demo
3. **Complex Animations**: Cart drawer, modals, and page transitions require choreographed animations
4. **Layout Animations**: Shared layout transitions for cart count and product galleries
5. **Exit Animations**: AnimatePresence handles modal/drawer closing animations elegantly
6. **React Integration**: Designed specifically for React with optimal performance
7. **Maintenance**: Large community and excellent documentation reduce development friction
8. **Demo Quality**: Smooth, production-quality animations impress during presentations

The ~30KB bundle cost is justified by development velocity and animation quality. CSS animations will be used for simple hover states to minimize Framer Motion usage.

---

## Consequences

### Positive
- Rapid implementation of complex animation sequences
- Consistent animation timing and easing
- Automatic accessibility compliance
- Shared layout animations with minimal code
- Exit animations without manual state management
- Scroll-triggered animations with InView component
- Gesture support for mobile interactions
- Production-quality animation feel

### Negative
- Additional ~30KB bundle size (gzipped)
- Runtime animation library (vs zero-cost CSS)
- Need to learn variants API patterns
- Potential for overuse (must show restraint)

### Neutral
- Use CSS transitions for simple hover/focus states
- Reserve Framer Motion for complex animations
- Code split animation library for non-critical routes
- Monitor performance impact on Core Web Vitals

---

## Implementation Notes

**Usage Guidelines**:

1. **Simple Transitions**: Use CSS/Tailwind
```tsx
// Hover effects, focus states
<button className="transition-colors hover:bg-primary-700">
```

2. **Complex Animations**: Use Framer Motion
```tsx
// Modal, drawer, page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
/>
```

3. **Shared Variants** (Reusable):
```tsx
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
```

**Animation Budget**:
- Page transitions: 300-400ms
- Microinteractions: 150-200ms
- Loading states: 200ms
- Modal/drawer: 300ms
- Success animations: 500-600ms

**Performance Practices**:
- Animate only `transform` and `opacity` (GPU-accelerated)
- Avoid animating `height`, `width`, `top`, `left`
- Use `layout` prop for size/position changes
- Lazy load Framer Motion for non-critical routes

**Reduced Motion**:
```tsx
// Framer Motion handles automatically, but manual override:
<motion.div
  animate={!prefersReducedMotion ? "animate" : "initial"}
/>
```

---

## Related Decisions
- [ADR-002: Styling Approach](002-styling-approach.md)
- [ADR-004: State Management](004-state-management.md)
