# Security Policy

Security is a core principle at CogniCatch. Because our tools are designed to handle application errors and prevent PII (Personally Identifiable Information) leakage, we take vulnerabilities in our open-source client and proprietary APIs very seriously.

## Supported Versions

Currently, as we are in the early traction phase, only the latest major version of the `@cognicatch/react` library receives active security updates. 

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Scope: Open-Core Architecture

CogniCatch operates on an open-core model:
* **In-Scope for this repository:** Vulnerabilities related to the React client components (`AdaptiveErrorBoundary`, `AdaptiveToast`, etc.), UI cross-site scripting (XSS), dependency vulnerabilities, or bypasses in the client-side PII sanitization logic.
* **Out-of-Scope for this repository:** Vulnerabilities related to the CogniCatch SaaS platform, API endpoints, or database infrastructure. If you find a vulnerability in our hosted services, please use the same reporting method below, but note that the backend source code is not public.

## Reporting a Vulnerability

**DO NOT OPEN A PUBLIC GITHUB ISSUE TO REPORT A VULNERABILITY.**

Publicly disclosing a security flaw before it is patched puts our users at risk. To practice Responsible Disclosure, please report any security issues privately:

1. Send an email to **support@cognicatch.dev** with the subject `[SECURITY] Vulnerability Report: <Brief Description>`.
2. Include a detailed description of the vulnerability, the steps to reproduce it, and any potential impact (e.g., "Bypasses the PII filter allowing sensitive data to be sent to the API").
3. Include any proof-of-concept (PoC) code or screenshots if applicable.

### What to expect

* We will acknowledge receipt of your vulnerability report within **48 hours**.
* We will send you regular updates about our progress in investigating and patching the issue.
* Once the vulnerability is resolved and a patch is released, we will publicly acknowledge your contribution (if you desire) in our release notes and security advisories.

Currently, we do not offer a paid Bug Bounty program, but we are happy to provide public acknowledgment, CVE credits where applicable, and our deepest gratitude for helping secure the CogniCatch ecosystem.
