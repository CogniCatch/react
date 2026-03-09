# 🧠 CogniCatch React

**Premium B2B React Error Boundaries & API Fallbacks powered by GenUI.**

Stop losing users to the dreaded "White Screen of Death" (WSOD) or scaring them away with raw, technical stack traces. **CogniCatch React** is a React library that intercepts runtime crashes and API failures, gracefully degrading them into elegant, accessible, and user-friendly recovery interfaces.

Powered by a **GenUI** (Generative UI) engine, it automatically analyzes error logs, sanitizes sensitive data, and generates the perfect UI fallback—all in real-time, automatically translated to your user's native language.

---

## 🔒 Enterprise-Grade Security & Privacy (Zero-PII)

When selling to or building for enterprises, security is non-negotiable. Our library was architected from the ground up to be fully compliant with strict data privacy laws like **GDPR, LGPD, HIPAA, and SOC2**.

We guarantee that **no user data or sensitive values ever leave the browser**:

* **Sandboxed by Design:** React Error Boundaries natively only catch the `Error` object and the component tree. They physically cannot read form inputs, component `state`, or `props`.
* **Client-Side Zero-PII Sanitizer:** Before any error log is transmitted to the AI or your backend, our aggressive redaction engine scrubs the payload directly in the browser's memory.
* **What gets redacted?** Emails, JWTs, API Keys, Bearer Tokens, Phone Numbers, Credit Cards, SSNs, and IP Addresses are instantly replaced with tags like `[EMAIL_REDACTED]` or `[JWT_REDACTED]`.
* **The Result:** The AI and your servers only receive the structural skeleton of the crash (e.g., *"Payment failed for user [EMAIL_REDACTED] using [JWT_REDACTED]"*), keeping your company safe from data leaks.

---

## ✨ The GenUI Engine (Auto Mode)

In traditional development, you have to manually map every possible error with a `try/catch` and hardcode generic fallback messages.

With our Auto Mode, Artificial Intelligence takes the wheel:

1. The boundary or hook catches the crash/API failure.
2. The Zero-PII Sanitizer scrubs the payload.
3. The anonymized log is sent to the API, where an LLM analyzes the technical context.
4. The AI generates an empathetic title, description, and action button **in the user's native language**.
5. The perfectly sized interface (Banner, Toast, or Modal) is rendered dynamically to the user.

## 🛠️ Tech Stack

* **Core:** React 18 / 19
* **Styling:** Tailwind CSS v4 (Isolated styles, won't clash with your app)
* **Accessibility:** Radix UI (100% accessible and screen-reader friendly Modals)
* **Notifications:** Sonner (High-performance, beautiful Toasts)
* **Type Safety:** TypeScript (Strict Mode)

---

## 📦 Installation

```bash
npm install @cognicatch/react
# or
pnpm add @cognicatch/react
# or
yarn add @cognicatch/react
```

Import the global styles at the root of your application (e.g., main.tsx, app.tsx, or layout.tsx):

```typescript
import '@cognicatch/react/style.css';
```

## 💻 Usage

The library is designed to scale from indie open-source projects to enterprise SaaS platforms.

### 1. Pro / SaaS Tier (Auto Mode via GenUI)

To unlock the full potential of GenUI, set up the AdaptiveProvider at the root of your application. This prevents you from prop-drilling your API key and automatically handles internationalization (i18n).

* A. Global Setup:

```typescript
import { AdaptiveProvider, AdaptiveToastProvider } from '@cognicatch/react';

export default function App() {
  return (
    // Automatically detects navigator.language, or you can force a locale via the `language` prop.
    <AdaptiveProvider apiKey="your_api_key_here">
      <AdaptiveToastProvider />
      <YourAppRoutes />
    </AdaptiveProvider>
  );
}
```

* B. Catching UI Crashes (Component Errors):

Wrap fragile components. The boundary will automatically inherit the API key from the Provider.

```typescript
import { AdaptiveErrorBoundary } from '@cognicatch/react';

export function CheckoutPage() {
  return (
    <AdaptiveErrorBoundary 
      mode="auto" 
      onRecover={() => console.log("User clicked to recover")}
    >
      <ComplexWidget />
    </AdaptiveErrorBoundary>
  );
}
```

* C. Catching API Failures (Async Errors):

Use our hook to gracefully handle backend failures (e.g., `400 Bad Request` or `500 Server Error`). It sanitizes the error, sends it to the AI, and renders a Premium Toast.

```typescript
import { useAdaptive } from '@cognicatch/react';

export function PaymentForm() {
  const { captureAsyncError } = useAdaptive();

  const handlePayment = async () => {
    try {
      await api.post('/checkout', data);
    } catch (error) {
      // Magically turns raw backend errors into empathetic UI Toasts
      captureAsyncError(error); 
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

### 2. Open Source Tier (Manual Mode)

Don't have an API key? You can still wrap fragile components to prevent a localized error from taking down the entire page. You define the severity, and the UI adapts automatically:

* low: Triggers a Toast and allows the component to attempt a re-render.

* medium: Replaces the broken component with an elegant inline Banner.

* high: Locks the screen with a Critical Modal (ideal for root-level routing errors).

```typescript
import { AdaptiveErrorBoundary } from '@cognicatch/react';

export function Dashboard() {
  return (
    <AdaptiveErrorBoundary 
      mode="manual" 
      severity="medium"
      title="Widget Failed"
      description="We couldn't load the financial data at this moment."
      actionLabel="Try Again"
      onRecover={() => window.location.reload()}
    >
      <ComplexWidget />
    </AdaptiveErrorBoundary>
  );
}
```

### 3. The Free Swiss Army Knife (Generic Toasts)

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
