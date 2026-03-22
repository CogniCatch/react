# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2026-03-22

### Fixed
- Resolved lingering Radix UI module resolution issues in strict `pnpm` workspaces by explicitly declaring all transient sub-dependencies (e.g., `@radix-ui/react-primitive`, `@radix-ui/react-portal`, `@radix-ui/react-focus-guards`) directly in the `dependencies` block of `package.json`.

### Changed
- Reverted the Vite bundling strategy introduced in `1.1.3`. `@radix-ui/*` packages are once again treated as `external` to prevent duplicated dependencies and respect the host application's package manager resolution.

## [1.1.3] - 2026-03-22

### Fixed
- Resolved persistent `Module not found` and sub-dependency resolution errors (e.g., `@radix-ui/react-primitive`, `@radix-ui/react-focus-scope`) in Next.js Turbopack and strict `pnpm` environments.
- Updated Vite build configuration (`vite.config.build.ts`) to internally bundle `@radix-ui/*` dependencies instead of marking them as `external`, eliminating fragmented package manager resolution issues for host applications.

## [1.1.2] - 2026-03-22

### Fixed
- Fixed module resolution errors (e.g., `Module not found: Can't resolve '@radix-ui/react-dismissable-layer'`) in strict package managers like `pnpm` and Next.js Turbopack environments by explicitly declaring Radix UI sub-dependencies in `package.json`.

## [1.1.1] - 2026-03-13

### Added
- Added `showRefresh` and `statusUrl` properties to the public `AdaptiveErrorBoundary` interface, allowing fine-grained control over the fatal recovery UI.

### Changed
- Refactored `AdaptiveFatalError` layout architecture. Switched from absolute positioning (`translate-x/y`) to a robust, invisible Flexbox wrapper to guarantee perfect modal centering regardless of the host application's global CSS resets or transform rules.

### Fixed
- Fixed an alignment bug in `AdaptiveFatalError` where the modal would render in the corner of the screen due to CSS stacking context conflicts.
- Fixed a prop-trapping issue in `AdaptiveErrorBoundary` where `showRefresh` and `statusUrl` were not being successfully passed down to the active recovery UI.

### Removed
- Removed redundant `createPortal` (from `react-dom`) usage inside `AdaptiveFatalError` to resolve "Double Portaling" conflicts, as Radix UI's `<Dialog.Portal>` handles DOM injection natively.

## [1.1.0] - 2026-03-13

### Added
- New `severity` mapping to `AdaptiveBanner` component to support dynamic visual states (`low`, `medium`, `high`).
- Re-introduced `adaptiveToast.warning()` method to the public API for non-blocking AI diagnostics.
- Implemented focus trap and interaction blocking in `AdaptiveFatalError` (preventing `Esc` key and outside clicks) to ensure critical errors are addressed.

### Changed
- Refactored `AdaptiveProvider` using `useCallback` and `useMemo` to eliminate unnecessary re-renders in host applications.
- Updated all UI components (`AdaptiveBanner`, `AdaptiveToast`, `AdaptiveFatalError`) to the new "Golden Amber" design system.
- Upgraded PII Sanitization engine to `sanitizeErrorContext` for improved performance and client-side scrubbing.
- Improved CSS specificity: UI components now prioritize `ThemeOptions` style injection over default Tailwind utility classes.

### Fixed
- Fixed critical bug in `AdaptiveFatalError` where the modal would "force mount" and block the UI regardless of the `isOpen` state.
- Fixed text contrast regression where hardcoded Tailwind classes were overriding custom `textColor` from the theme provider.
- Resolved `sk_test_mock` inconsistency between `ErrorBoundary` and `AdaptiveProvider` for deterministic local development.

### Removed
- Removed `forceMount` property from Radix-based Portal components to prevent hydration mismatches and "Zombie Modals".

## [1.0.0] - 2026-03-05

### Added
- Initial release of `@cognicatch/react`.
- Core `AdaptiveProvider` for global error context management.
- `AdaptiveErrorBoundary` with "auto" and "manual" recovery modes.
- Basic PII Sanitization for error logs.
- Support for custom themes (White-label).
- Integration with Sonner for toast notifications.
