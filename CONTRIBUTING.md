# Contributing to CogniCatch React

First off, thank you for taking the time to contribute! 🎉

CogniCatch is an **open-core** project. This means the React library (`@cognicatch/react`) is 100% open-source and community-driven, while the AI infrastructure and log processing run on our proprietary SaaS.

This document serves as a guide to ensure your contributions are integrated smoothly and without friction.

## 🧠 The Open-Core Philosophy
Because our client library communicates with a strict API, we ask that you observe this golden rule:
**If your PR alters the network payload (`fetch` to `/analyze-error`), the `Context` structure, or the Zero-PII sanitization mechanism, please open an Issue to discuss the architecture BEFORE writing any code.** We don't want you to spend time developing a wonderful feature that is unfortunately incompatible with our backend security or data models. 

However, for UI improvements (like `AdaptiveToast` or `AdaptiveBanner`), accessibility (a11y), performance tweaks, and unit tests, feel free to open a PR directly!

## 🛠️ Local Development Setup

Our stack is modern and optimized for speed. We use **pnpm** as our package manager and **Biome** as our unified formatting and linting tool.

1. **Fork and clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/react.git](https://github.com/YOUR_USERNAME/react.git)
   cd react
   ```
2. **Install dependencies (Requires Node 20+ and pnpm 8+):**
   ```bash
   pnpm install
   ```
3. **Run the development environment:**
   ```bash
   pnpm run dev
   ```
   This will start Vite in watch mode and open the component testing playground in your browser.
   
## ✅ Code Standards and CI (Continuous Integration)
Our main branch is protected. No PR can be merged if it breaks our CI pipeline. To ensure your PR gets a green checkmark on the first try, run the following commands locally before committing:
- **Automatic Formatting and Linting:**
  We do not use Prettier or ESLint. We use Biome. To automatically fix spacing, quotes, and linting rules, run:
  ```bash
   pnpm run check:fix
   ```
- **Unit Tests:**
  ```bash
   pnpm run test
   ```
- **Type Checking:**
  ```bash
   pnpm tsc --noEmit
   ```
  
## 📝 Commit Standard
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Our Git history generates the changelog and NPM releases automatically.

Please structure your commit messages like this:

- `feat: add support for dark mode in AdaptiveToast` (For new features)
- `fix: resolve hydration error in AdaptiveFatalError` (For bug fixes)
- `docs: update readme with Next.js example` (For documentation changes)
- `test: add coverage for AdaptiveBanner` (For adding/updating tests)
- `chore: update radix-ui dependency` (For maintenance tasks)

## 🚀 How to Submit Your Pull Request
1. Create a branch from `main` with a descriptive name (e.g., `feat/dark-mode-toast`).
2. Make your commits following the standard above.
3. Open the Pull Request detailing what was done. If your PR resolves an open Issue, add `Closes #123` in the description so GitHub automatically closes the issue upon merge.
4. Wait for the GitHub Actions (`Validate Code`) to finish. If any check fails (🔴), review the logs, fix the code in your local branch, and push again.
5. One of the maintainers will review your code shortly!

Thank you for helping us make React error handling smarter and more human! 💙
