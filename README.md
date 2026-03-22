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

#### Adaptive Error Boundary

Wrap any fragile component. If it crashes, CogniCatch renders a beautiful fallback.

```typescript
import { AdaptiveErrorBoundary } from '@cognicatch/react';

<AdaptiveErrorBoundary 
  mode="manual" 
  severity="medium"
  title="Component Error"
  onRecover={() => window.location.reload()}
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

### `<AdaptiveErrorBoundary />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'manual' \| 'auto'` | `'manual'` | Use 'manual' for local/free tier. |
| `severity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Defines the UI type (Toast, Banner, or Modal). |
| `title` | `string` | `undefined` | Fallback title (Manual mode only). |
| `onRecover` | `() => void` | `undefined` | Callback triggered by the action button. |

### `<AdaptiveToastProvider />` Props

The provider accepts all standard [Sonner](https://sonner.emilkowal.ski/) configurations to customize the behavior globally.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `string` | `'top-right'` | Position of the toasts (top-left, top-center, etc). |
| `expand` | `boolean` | `false` | Whether toasts should expand on hover. |
| `richColors` | `boolean` | `true` | Enables colored backgrounds for success/error/w |

## 🚨 Troubleshooting

### Next.js Turbopack + pnpm (`Module not found: @radix-ui/*`)

If you are using **Next.js with Turbopack** (`next dev --turbo`) alongside **pnpm**, you might encounter module resolution errors complaining about missing Radix UI internal dependencies. This is a known interaction between pnpm's strict symlinked `node_modules` architecture and Turbopack's compiler.

**The Fix:**
You need to instruct pnpm to hoist the dependencies to the root of your `node_modules` folder.

1. Create an `.npmrc` file in the root of your host project and add the following line:
```text
node-linker=hoisted
```
(Alternatively, you can use public-hoist-pattern[]=*@radix-ui/* to strictly hoist only the UI primitives).

2. Clear your local cache and reinstall your dependencies:
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```
*Built with precision by the CogniCatch team.*
