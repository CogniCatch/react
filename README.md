<div align="center">
  <h1>CogniCatch React</h1>
  <p><strong>The Zero-PII Error Boundary for AI-Driven React Applications.</strong></p>

  [![npm version](https://img.shields.io/npm/v/@cognicatch/react.svg?style=flat-square&color=f97316)](https://www.npmjs.com/package/@cognicatch/react)
  [![Build Status](https://img.shields.io/github/actions/workflow/status/CogniCatch/react/ci.yml?branch=main&style=flat-square)](https://github.com/CogniCatch/react/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  
  <br />
  <a href="https://cognicatch.dev/docs">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://cognicatch.dev/#playground">Live Playground</a>
</div>

<br />

Stop losing users to the *White Screen of Death* caused by LLM hallucinations. **CogniCatch** is a production-grade infrastructure library that intercepts runtime crashes, malformed AI JSON payloads, and API failures, transforming them into elegant, user-friendly recovery interfaces while securely routing sanitized telemetry to your observability backend.

---

## 🚀 Why CogniCatch? (The Enterprise Advantage)

While standard error boundaries like `react-error-boundary` are great primitives, they lack native understanding of Generative UI payloads and often swallow critical telemetry data. CogniCatch is built for the modern AI stack:

* 🤖 **GenUI Fallbacks:** Surgically catch LLM hallucinations (e.g., dropped brackets, malformed JSONs) without crashing the entire React tree.
* 🔒 **Zero-PII Middleware (Client-Side Scrubbing):** Built for GDPR/HIPAA compliance. Emails, JWTs, API Keys, and Credit Cards are aggressively redacted in the browser's memory *before* reaching your logs.
* 📡 **Vendor-Agnostic OTLP Support:** Forward clean, sanitized traces seamlessly to Sentry, Datadog, Dynatrace, or any OpenTelemetry-compatible backend.
* ♿ **A11y & Focus Traps:** Flawless accessibility handling for critical modal crashes, avoiding portal/z-index conflicts.

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
import { trace } from '@opentelemetry/api'; // Or your Sentry/Datadog instance

<AIBoundary
  mode="manual"
  title="AI Widget Error"
  description="The AI generated an invalid component structure."
  showRawData={true}
  theme={{ primaryColor: "#f59e0b", textColor: "#ffffff" }}
  rawPayload={{ tool: "chart", data: "I hallucinated this string instead of a valid JSON array!" }}
  onRecover={() => resetChatStream()}
  // CogniCatch automatically scrubs PII from the error and stack trace!
  onError={(safeError, safeErrorInfo, safePayload) => {
    tracer.startActiveSpan('CogniCatch.fallback', (span) => {
      span.setAttribute('react.componentStack', safeErrorInfo.componentStack);
      span.recordException(safeError);
      span.end();
    });
  }}
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

## 📚 Documentation & API Reference

For the full API reference, theming options, and advanced guides (like the Zero-PII architecture deep dive), visit the Official [Documentation](https://cognicatch.dev/docs).
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
