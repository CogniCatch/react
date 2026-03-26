# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.6] - 2026-03-26

### Added
- **Observability:** Introduced the `onError` callback to `AdaptiveErrorBoundary`, enabling seamless integration with external logging platforms (e.g., Sentry, Datadog). This allows applications to capture error telemetry silently while CogniCatch handles the graceful UI degradation.

### Changed
- **API Expansion:** Enforced the `description` property as a required field in the API reference for `manual` mode to guarantee consistent UX during fallback states.
- **Architecture:** Hardened the error boundary by wrapping the external `onError` callback execution in a fail-safe `try/catch` block. This ensures that network timeouts or failures in third-party loggers do not crash the recovery UI.

## [1.1.5] - 2026-03-22

### Changed
- **Architecture:** Streamlined the internal dependency graph by removing explicit transient Radix UI packages, returning the resolution responsibility to the host environment. This significantly reduces the installation footprint for end-users.
- **Documentation:** Added official support and troubleshooting guidelines for host applications using Next.js Turbopack paired with strict `pnpm` workspaces.

## [1.1.4] - 2026-03-22

### Changed
- **Dependency Graph:** Expanded the package manifest to explicitly map deeply nested Radix UI primitives, ensuring fallback structural integrity for environments with aggressive node-linker isolation.

## [1.1.3] - 2026-03-22

### Changed
- **Build System:** Refined Vite build engine configuration to optimize how external UI primitives are handled during the pre-compilation phase, aiming to bypass external strict package manager rules.

## [1.1.2] - 2026-03-22

### Fixed
- **Compatibility:** Addressed edge-case module resolution warnings (`Module not found`) specific to strict `pnpm` isolation when compiled via Next.js Turbopack.

## [1.1.1] - 2026-03-13

### Added
- **API Expansion:** Added `showRefresh` and `statusUrl` properties to the public `AdaptiveErrorBoundary` interface, allowing fine-grained control over the fatal recovery UI.

### Changed
- **Layout:** Refactored `AdaptiveFatalError` layout architecture. Switched from absolute positioning (`translate-x/y`) to a robust, invisible Flexbox wrapper to guarantee perfect modal centering regardless of the host application's global CSS resets or transform rules.

### Fixed
- **UI:** Fixed an alignment bug in `AdaptiveFatalError` where the modal would render in the corner of the screen due to CSS stacking context conflicts.
- **Props:** Fixed a prop-trapping issue in `AdaptiveErrorBoundary` where `showRefresh` and `statusUrl` were not being successfully passed down to the active recovery UI.

### Removed
- **Architecture:** Removed redundant `createPortal` (from `react-dom`) usage inside `AdaptiveFatalError` to resolve "Double Portaling" conflicts, as Radix UI's `<Dialog.Portal>` handles DOM injection natively.

## [1.1.0] - 2026-03-13

### Added
- **Features:** New `severity` mapping to `AdaptiveBanner` component to support dynamic visual states (`low`, `medium`, `high`).
- **Features:** Re-introduced `adaptiveToast.warning()` method to the public API for non-blocking AI diagnostics.
- **Security:** Implemented focus trap and interaction blocking in `AdaptiveFatalError` (preventing `Esc` key and outside clicks) to ensure critical errors are addressed.

### Changed
- **Performance:** Refactored `AdaptiveProvider` using `useCallback` and `useMemo` to eliminate unnecessary re-renders in host applications.
- **Design System:** Updated all UI components (`AdaptiveBanner`, `AdaptiveToast`, `AdaptiveFatalError`) to the new "Golden Amber" design system.
- **Security:** Upgraded PII Sanitization engine to `sanitizeErrorContext` for improved performance and client-side scrubbing.
- **Styles:** Improved CSS specificity: UI components now prioritize `ThemeOptions` style injection over default Tailwind utility classes.

### Fixed
- **UI:** Fixed critical bug in `AdaptiveFatalError` where the modal would "force mount" and block the UI regardless of the `isOpen` state.
- **UI:** Fixed text contrast regression where hardcoded Tailwind classes were overriding custom `textColor` from the theme provider.
- **Testing:** Resolved `sk_test_mock` inconsistency between `ErrorBoundary` and `AdaptiveProvider` for deterministic local development.

### Removed
- **Architecture:** Removed `forceMount` property from Radix-based Portal components to prevent hydration mismatches and "Zombie Modals".

## [1.0.0] - 2026-03-05

### Added
- Initial release of `@cognicatch/react`.
- Core `AdaptiveProvider` for global error context management.
- `AdaptiveErrorBoundary` with "auto" and "manual" recovery modes.
- Basic PII Sanitization for error logs.
- Support for custom themes (White-label).
- Integration with Sonner for toast notifications.
