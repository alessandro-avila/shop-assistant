# ADR 001: Framework Selection

**Date**: January 9, 2026  
**Status**: Accepted  
**Deciders**: Development Team, Technical Lead

---

## Context

Shop Assistant is a demonstration-grade e-commerce platform requiring modern web development capabilities, premium UX, smooth animations, and optimal performance. The framework choice will impact development velocity, performance, maintainability, and the ability to showcase best practices during live demos.

The application needs:
- Fast page loads and optimal Core Web Vitals (LCP < 2.5s, FCP < 1.5s)
- Server-side rendering for perceived performance
- Code splitting and optimized asset delivery
- Type safety to minimize runtime errors during demos
- Excellent developer experience for rapid iteration

---

## Options Considered

### Option 1: Next.js 14 with App Router
**Pros**:
- Built-in routing with automatic code splitting
- App Router provides modern patterns (Server Components, Streaming)
- Next.js Image component with automatic optimization
- Exceptional deployment experience on Vercel (zero-config)
- TypeScript support out-of-the-box
- Excellent documentation and community support
- File-system based routing reduces boilerplate
- Built-in performance optimizations (prefetching, static optimization)

**Cons**:
- Learning curve for App Router patterns
- Framework lock-in (though minimal for frontend apps)
- Slightly larger bundle compared to minimal setups

### Option 2: Vite + React + React Router
**Pros**:
- Extremely fast dev server (instant HMR)
- More lightweight and minimal
- Greater flexibility in architecture
- Simpler mental model (no Server Components complexity)
- Full control over configuration

**Cons**:
- Manual routing configuration required
- No built-in image optimization (need third-party tools)
- Manual setup for code splitting
- More configuration needed for production optimizations
- Manual deployment configuration

### Option 3: Vue.js 3 + Nuxt
**Pros**:
- Excellent developer experience
- Nuxt provides similar benefits to Next.js
- Simpler reactivity model
- Good performance characteristics

**Cons**:
- Smaller ecosystem compared to React
- Less familiar to many developers
- Fewer UI library options
- React expertise more common in hiring

---

## Decision

**Selected**: Next.js 14 with App Router + TypeScript

**Rationale**:
1. **Performance by Default**: Next.js provides automatic optimizations (code splitting, image optimization, prefetching) that are critical for demo credibility
2. **Developer Experience**: File-based routing and zero-config deployment enable rapid development within the 5-6 week timeline
3. **Best Practices Showcase**: Demonstrates modern React patterns and production-grade architecture
4. **Image Optimization**: Built-in Image component crucial for product catalog performance
5. **TypeScript Integration**: Seamless TypeScript support reduces bugs during live demos
6. **Deployment**: Vercel deployment is one command with automatic HTTPS, CDN, and performance monitoring
7. **Community & Resources**: Largest ecosystem ensures quick problem resolution

The App Router, while having a learning curve, provides future-proof patterns and is worth the investment for a showcase project.

---

## Consequences

### Positive
- Faster time-to-market with built-in features
- Better perceived performance out of the box
- Reduced configuration and boilerplate code
- Automatic route-based code splitting
- Production-ready deployment in minutes
- Excellent Core Web Vitals scores achievable
- Strong foundation for future enhancements

### Negative
- Need to learn App Router conventions (Server/Client Components)
- Framework-specific patterns may not transfer to all projects
- Slightly larger initial bundle compared to minimal Vite setup
- Opinionated structure may limit some architectural choices

### Neutral
- Development environment requires Node.js 18+ and modern npm/pnpm
- Team needs familiarity with Next.js patterns
- Documentation and training resources readily available

---

## Implementation Notes

**Package Manager**: pnpm (faster installs, efficient disk usage)  
**Node Version**: 20.x LTS  
**TypeScript**: Strict mode enabled  
**Build Tool**: Turbopack (Next.js 14 default)

**Initial Setup**:
```bash
pnpm create next-app@latest shop-assistant --typescript --tailwind --app --eslint
```

**Key Dependencies**:
- next@14.x
- react@18.x
- typescript@5.x
- @types/react@18.x
- @types/node@20.x

---

## Related Decisions
- [ADR-002: Styling Approach](002-styling-approach.md)
- [ADR-003: Animation Library](003-animation-library.md)
- [ADR-004: State Management](004-state-management.md)
