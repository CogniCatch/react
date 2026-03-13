# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [1.0.0] - 2026-02-15

### Added
- Initial release of `@cognicatch/react`.
- Core `AdaptiveProvider` for global error context management.
- `AdaptiveErrorBoundary` with "auto" and "manual" recovery modes.
- Basic PII Sanitization for error logs.
- Support for custom themes (White-label).
- Integration with Sonner for toast notifications.
