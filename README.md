# CogniCatch React

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7973b59c-257c-4994-9e65-4416bf6d8167" />


[![npm version](https://img.shields.io/npm/v/@cognicatch/react.svg?style=flat-square&color=f59e0b)](https://www.npmjs.com/package/@cognicatch/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Stop losing users to the White Screen of Death.** CogniCatch is a production-grade library that intercepts runtime crashes and API failures, transforming them into elegant, user-friendly recovery interfaces.

---

## ⚡ Quick Start (Zero-Config)

CogniCatch works out-of-the-box for local and open-source projects. **No API Key is required** for Manual Mode.

### 1. Install
```bash
npm install @cognicatch/react
# or
yarn add @cognicatch/react
# or
pnpm add @cognicatch/react
```

### 2. Setup Styles

Import the global CSS at your root (main.tsx or app.tsx):

```typescript
import '@cognicatch/react/style.css';
```

### 3. Usage (Manual Mode)

#### Generative UI Fallback (AIBoundary) ✨

Safely intercept LLM hallucinations and salvage malformed JSON payloads without breaking your application. Perfect for AI wrappers and generative UI components.

```typescript
import { AIBoundary } from '@cognicatch/react';

<AIBoundary
  mode="manual"
  title="AI Widget Error"
  description="The AI generated an invalid component structure."
  showRawData={true}
  theme={{ primaryColor: "#f59e0b", textColor: "#ffffff" }}
  rawPayload={{ tool: "chart", data: "I hallucinated this string instead of a valid JSON array!" }}
  onRecover={() => resetChatStream()}
>
  <YourGenerativeUIComponent />
</AIBoundary>
```

#### Adaptive Error Boundary

Wrap any fragile component. If it crashes, CogniCatch renders a beautiful fallback.

```typescript
import { AdaptiveErrorBoundary } from '@cognicatch/react';

<AdaptiveErrorBoundary 
  mode="manual" 
  severity="medium"
  title="Component Error"
  description="Error description"
  onRecover={() => window.location.reload()}
  onError={(error, errorInfo) => {
    // Silently log to Sentry while CogniCatch handles the UI
    Sentry.captureException(error, { extra: errorInfo });
  }}
>
  <YourFragileComponent />
</AdaptiveErrorBoundary>
```

#### Generic Toasts

Even if you don't use the Error Boundaries, you get a premium, white-label notification system out of the box. Assuming you added the `AdaptiveToastProvider` to your root, you can trigger beautiful toasts anywhere.

**In your Root/Layout:**

```typescript
import { AdaptiveToastProvider } from '@cognicatch/react';

export default function App() {
  return (
    <>
      <AdaptiveToastProvider />
      <YourApp />
    </>
  );
}
```

**Triggering alerts in your components:**

```typescript
import { adaptiveToast } from '@cognicatch/react';

function handleSave() {
  // Beautiful notifications with native Light/Dark mode support
  adaptiveToast.success("Profile Updated", "Your changes have been saved successfully.");
  
  // adaptiveToast.error("Connection Failed", "Please try again later.");
  // adaptiveToast.warning("Warning", "Your session is about to expire.");
  // adaptiveToast.info("Update Available", "A new version is ready to be installed.");
}
```

## 🔒 Enterprise-Grade Security (Zero-PII)

Built for GDPR/HIPAA compliance, our **Client-Side Sanitizer** ensures sensitive data never leaves the browser. 

* **Sandboxed:** Error Boundaries cannot read your component's internal state or props.
* **Aggressive Redaction:** Emails, JWTs, API Keys, and Credit Cards are instantly replaced with `[REDACTED]` tags in the browser's memory before any log is processed.
* **The Result:** The AI and your servers only receive the structural skeleton of the crash (e.g., *"Payment failed for user [EMAIL_REDACTED] using [JWT_REDACTED]"*), keeping your company safe from data leaks.

## 🛠️ Tech Stack
- **Core:** React 18 / 19 (Strict Mode Ready)
- **Styling:** Tailwind CSS v4 (Isolated/Zero-conflict)
- **Primitives:** Radix UI & Sonner (Accessible & High-performance)

---

## ✨ The GenUI Engine (Auto Mode - Coming Soon)

In the Pro Tier, Artificial Intelligence takes the wheel. The library analyzes the technical stack trace and generates an empathetic recovery UI, automatically translated to the user's native language.

### Upcoming Pro Features:
- **Cloud Telemetry:** Track crashes in real-time on your CogniCatch Dashboard.
- **Async Capture:** `captureAsyncError(error)` hook for seamless API failure handling.
- **Domain Whitelisting:** Secure your production environment.

👉 **[Join the Early Adopter Waitlist](https://cognicatch.dev/dashboard)**.

---

## 📖 API Reference

### `<AIBoundary />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'manual' \| 'auto'` | `'manual'` | Use 'manual' for local/free tier. |
| `showRawData` | `boolean` | `false` | Whether to display the raw malformed payload to the user in the UI. |
| `theme` | `object` | `undefined` | Customize the recovery UI colors (`primaryColor`, `textColor`). |
| `rawPayload` | `any` | `undefined` | The raw output from the LLM that caused the crash. |
| `onRecover` | `() => void` | `undefined` | Callback triggered when the user clicks the recovery action. |

### `<AdaptiveErrorBoundary />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'manual' \| 'auto'` | `'manual'` | Use 'manual' for local/free tier. |
| `severity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Defines the UI type (Toast, Banner, or Modal). |
| `title` | `string` | `undefined` | Fallback title (Manual mode only). |
| `description` | `string` | `undefined` | Fallback description message (Manual mode only). |
| `onRecover` | `() => void` | `undefined` | Callback triggered by the action button. |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | `undefined` | Callback to silently log errors to external services (e.g., Sentry, Datadog) without breaking the fallback UI. |

### `<AdaptiveToastProvider />` Props

The provider accepts all standard [Sonner](https://sonner.emilkowal.ski/) configurations to customize the behavior globally.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `string` | `'top-right'` | Position of the toasts (top-left, top-center, etc). |
| `expand` | `boolean` | `false` | Whether toasts should expand on hover. |
| `richColors` | `boolean` | `true` | Enables colored backgrounds for success/error/w |

### 📡 Integration with Observability (Sentry, Datadog, etc.)

A common trap with React Error Boundaries is that they swallow errors to show the fallback UI, leaving your telemetry tools (like Sentry) completely blind. 

CogniCatch solves this with the `onError` callback. You can keep your users happy with a graceful degradation UI while silently sending the full stack trace to your logging service in the background:

```tsx
import * as Sentry from "@sentry/react";
import { AdaptiveErrorBoundary } from "@cognicatch/react";

export function CheckoutFlow() {
  return (
    <AdaptiveErrorBoundary 
      mode="manual"
      severity="medium"
      title="Payment Failed"
      description="We couldn't process your card right now. Please try again."
      // The UI stays up, and Sentry gets the log silently
      onError={(error, errorInfo) => {
        Sentry.captureException(error, { extra: errorInfo });
      }}
    >
      <PaymentForm />
    </AdaptiveErrorBoundary>
  );
}
```

Because onError exposes the raw (error, errorInfo), it is completely provider-agnostic. You can easily swap Sentry with Datadog (datadogLogs.logger.error()), LogRocket, Bugsnag, or your own custom backend endpoint.

## 🚨 Troubleshooting

### Next.js Turbopack + pnpm (`Module not found: @radix-ui/*`)

If you are using **Next.js with Turbopack** (`next dev --turbo`) alongside **pnpm**, you might encounter module resolution errors complaining about missing Radix UI internal dependencies. This is a known interaction between pnpm's strict symlinked `node_modules` architecture and Turbopack's compiler.

**The Fix:**
You need to instruct pnpm to hoist the dependencies to the root of your `node_modules` folder.

1. Create an `.npmrc` file in the root of your host project and add the following line:
```text
node-linker=hoisted
```
(Alternatively, you can use `public-hoist-pattern[]=*@radix-ui/*` to strictly hoist only the UI primitives).

2. Clear your local cache and reinstall your dependencies:
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```
## ❓ FAQ

### Why not just build it myself with `react-error-boundary`?

You absolutely can, and for very simple projects, you probably should! `react-error-boundary` is a fantastic primitive. However, building a *production-ready* error UI layer takes much more than just a `try/catch` wrapper. 

CogniCatch handles the complex **edge cases** so you don't have to spend weeks reinventing the wheel:

* **Telemetry Sync:** Custom boundaries often accidentally swallow errors. CogniCatch's `onError` guarantees your Sentry/Datadog logs stay intact while the UI degrades gracefully.
* **PII Sanitization:** Out-of-the-box client-side scrubbing prevents sensitive user data from leaking into error messages.
* **Accessibility (A11y) & Focus Traps:** Handling `Esc` keys, focus trapping in fatal modals, and avoiding z-index/portal conflicts across different CSS resets.
* **Deduplication:** Preventing the UI from spamming 50 toasts if a component gets caught in a continuous re-render crash loop.
* **AI-Powered UX (Pro):** Automatically translating raw stack traces into user-friendly, empathetic messages based on the component's context.

Think of it like data fetching: you *could* use native `fetch()`, but you use React Query for the caching, deduplication, and edge cases. CogniCatch is that layer for error handling.

*Built with precision by Matheus Lima.*
