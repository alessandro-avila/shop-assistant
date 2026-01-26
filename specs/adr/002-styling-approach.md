# ADR 002: Styling Approach

**Date**: January 9, 2026  
**Status**: Accepted  
**Deciders**: Development Team, Design Lead

---

## Context

Shop Assistant requires a premium visual design with consistent spacing, typography, and responsive layouts. The styling solution must enable rapid UI development while maintaining design system consistency. The approach should support:
- Rapid prototyping and iteration
- Consistent design tokens across components
- Responsive design across mobile, tablet, desktop
- Dark mode support (potential future enhancement)
- Minimal runtime CSS-in-JS overhead
- Easy customization for theming

With a 5-6 week timeline, development velocity is critical. The solution must balance flexibility with speed.

---

## Options Considered

### Option 1: Tailwind CSS
**Pros**:
- Utility-first approach enables rapid UI development
- Consistent spacing, colors, typography through configuration
- Excellent responsive design utilities (mobile-first)
- Small production bundle (unused styles purged)
- No runtime overhead (CSS generated at build time)
- Extensive plugin ecosystem
- First-class Next.js integration
- Easy to implement design tokens
- Highly maintainable with consistent utility patterns

**Cons**:
- Learning curve for utility-first approach
- Verbose className strings (mitigated with good component structure)
- Requires purge configuration (handled automatically by Next.js)
- Custom animations require configuration

### Option 2: CSS Modules + Custom CSS
**Pros**:
- Full control over CSS
- Traditional CSS workflow
- Scoped styles prevent conflicts
- No external dependencies
- Easy to write custom styles

**Cons**:
- Slower development velocity (writing CSS from scratch)
- Inconsistent spacing/sizing without discipline
- More boilerplate for responsive design
- No built-in design token system
- Larger CSS bundle without utility optimization
- Requires manual responsive breakpoint management

### Option 3: Styled-Components / Emotion
**Pros**:
- Component-scoped styles with JavaScript
- Dynamic styling with props
- Theme provider for design tokens
- TypeScript integration

**Cons**:
- Runtime overhead (CSS-in-JS parsing)
- Larger bundle size
- Server Component compatibility issues with Next.js App Router
- More complex setup and configuration
- Slower build times
- Impacts performance metrics (FCP, LCP)

---

## Decision

**Selected**: Tailwind CSS with Custom Design Tokens

**Rationale**:
1. **Development Velocity**: Utility classes dramatically speed up UI implementation—critical for 5-6 week timeline
2. **Design System Integration**: Tailwind config maps perfectly to design tokens (colors, spacing, typography)
3. **Performance**: Zero runtime overhead; unused styles automatically purged in production
4. **Responsive Design**: Mobile-first utilities make responsive layouts straightforward
5. **Next.js Integration**: Official Next.js support with optimized configuration
6. **Consistency**: Utility patterns enforce consistent spacing and sizing
7. **Community**: Extensive documentation, plugins (forms, typography, animations)
8. **Production Bundle**: Typically 5-10KB gzipped for entire design system

The utility-first approach may feel verbose initially, but component abstraction keeps templates clean while maintaining rapid iteration capability.

---

## Consequences

### Positive
- Extremely fast UI implementation (3-4x faster than custom CSS)
- Design tokens enforced through configuration
- Consistent spacing/sizing across entire application
- Small production CSS bundle
- Easy responsive design with breakpoint utilities
- Hover, focus, and animation states with simple modifiers
- No runtime performance penalty
- Extensive pre-built utility patterns

### Negative
- Verbose className strings in component JSX
- Team needs to learn utility-first approach
- Custom designs require Tailwind config extensions
- May need editor extensions for autocomplete (recommended)

### Neutral
- Design tokens defined in `tailwind.config.js`
- Components should abstract repetitive utility patterns
- Balance between inline utilities and component abstractions
- VS Code extensions recommended (Tailwind CSS IntelliSense)

---

## Implementation Notes

**Configuration Structure**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... design system colors
        },
        neutral: {
          // ... grays
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // 8px grid system
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

**Component Pattern**:
```tsx
// Abstract repetitive patterns into components
const Button = ({ variant = 'primary', children }) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
  };
  
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

**Plugins to Include**:
- `@tailwindcss/forms` - Better form styling defaults
- `@tailwindcss/typography` - Rich text formatting (product descriptions)
- `tailwindcss-animate` - Pre-configured animation utilities

---

## Related Decisions
- [ADR-001: Framework Selection](001-framework-selection.md)
- [ADR-003: Animation Library](003-animation-library.md)
