# DSCWeb React — Feature-Parity Repair, Regression Fixes & Responsive Optimization

This plan restores complete functional parity between the legacy DSCWeb reference behavior and the modern React application, fixing regressions in FreePanel availability gating, User Dashboard order/expiry handling, Owner DB Free Users field mapping, and multi-viewport responsiveness while preserving the established DSC visual identity and architecture.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and UX decisions were confirmed during interactive clarification and govern the implementation:

- **Confirmed Decision 1 — User Dashboard 404 (`NO ACTIVE ORDERS`) State**: When `/api/auth/my-order` returns HTTP `404`, display `NO ACTIVE ORDERS` in the order status statistics card, keep the License Key card visible with `"No Active Order"` placeholder text (with the copy button and software download card hidden), and do not show a false server error banner.
- **Confirmed Decision 2 — Owner DB Free Users (`EnvName` & `CaptchaToken`) Preservation**: Maintain distinct, editable `EnvName` and `CaptchaToken` fields inside the Free Users edit modal so neither database column overwrites the other during updates.
- **Confirmed Decision 3 — Responsive UI Optimization Scope**: Preserve the current DSC visual theme, colors, and component layout while fixing horizontal overflow, long key/credential wrapping, action button alignment, modal scrolling, and touch target spacing across mobile, tablet, and desktop viewports (`320px` to `1920px`).

---

## 1. Overview & Core Concept

- **What It Does**: Repairs behavioral regressions introduced during the React migration across public telemetry (`FreePanel`), authenticated client workflows (`UserDashboard`, `Checkout`, `ChangePassword`), and administrative consoles (`AdminDashboard`, `OwnerDB`, `GenerateKey`).
- **Target Audience / Persona**:
  - **Public Evaluators**: Users checking real-time Free Panel slot capacity and evaluation credentials.
  - **Subscribed Clients**: Customers tracking order verification, copying license keys, and downloading plan binaries.
  - **Administrators & Owners**: Staff managing accounts, orders, hardware IDs, passwords, keys, and database collections.
- **Key Value**: Eliminates false-positive UI states (such as exposing FreePanel slot bars and downloads when credentials are null/empty, or treating a `404` no-order response as a fatal error) and guarantees reliable data integrity across all user and admin workflows.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **FreePanel Credential Gating Flow**:
     - Fetches `GET /api/public/free-panel`.
     - Validates both `freeUser` and `freePass` (rejecting `null`, `undefined`, `""`, and whitespace-only strings).
     - When credentials are valid: renders the complete availability card (username, password, copy buttons, slot usage progress bar, download action, and conditional `Slots Full` notice when `usedSlots >= maxSlots`).
     - When either credential is missing/blank or the API errors: hides the entire availability section (credentials, slot telemetry, progress bar, and download button) and renders the clean offline notice (`Free Panel Not Available` — `The free panel is currently offline. Please check back later.`).
  2. **User Dashboard Order & Expiry Flow**:
     - Calls `GET /api/auth/my-order` with the user's JWT.
     - If HTTP `404` is returned: treats it as a valid "no active order" state rather than an error; displays `NO ACTIVE ORDERS` in the status stat card, shows the License Key card in an empty state with `"No Active Order"` placeholder text, and hides key copy and binary download controls.
     - Evaluates subscription expiry using explicit boolean `isExpired` when provided by the backend, falling back to parsing and comparing the actual expiry timestamp (`expiry` / `expiryTime`) against current time while safely ignoring null dates on pending/temporary plans.
  3. **Owner DB & Admin Management Flow**:
     - Preserves separate `EnvName` and `CaptchaToken` inputs when editing Free Users records so neither field clobbers the other on save.
     - Retains full Owner security actions (HWID Reset, Force Password Reset, and Direct Set User Password) with scoped feedback and table refresh.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Utilitarian dark/light cybersecurity & licensing portal preserving DSC's established styling tokens (`--bg`, `--surface`, `--primary`, `--text`, `--muted`, `--success`, `--warning`, `--danger`).
  - *Color Palette & Mood*: High-contrast dual-theme (dark default with light theme toggle) using semantic status indicators paired with explicit text labels.
  - *Typography & Hierarchy*: Clean sans-serif UI labels paired with `monospace` and `tabular-nums` for license keys, credentials, slot counters, and timestamps.
  - *Component Styling & Layout*: Responsive CSS grid and flex containers with safe word-breaking (`overflow-wrap: anywhere` / `word-break: break-all` on keys and hashes), controlled horizontal scrolling for dense Owner DB tables, and viewport-constrained modals (`max-height: 90vh`, internal scroll).
- **Interactive Feedback & Motion**:
  - Skeleton shimmer placeholders during initial resource fetches.
  - Inline button spinners (`is-loading`) and disabled states during mutations to prevent duplicate submissions.
  - Instant clipboard feedback (`Copied!`) with automatic reset.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Strict Credential Gating on FreePanel**
  - *Chosen Approach*: Require both non-empty trimmed `freeUser` and `freePass` strings before mounting the availability container, slot progress bar, or download link.
  - *Why*: Matches the original DSCWeb business rule where the public evaluation panel is considered offline whenever the backend omits or clears the shared credentials.
  - *Alternatives Considered*: Showing slot telemetry without credentials (rejected as a migration regression that misleads users into downloading an unusable archive).
- **Decision 2: Structured 404 Handling in User Dashboard**
  - *Chosen Approach*: Intercept `ApiError` with `status === 404` in `UserDashboardPage` as a first-class `hasNoOrder` state rather than letting it surface as a failed request banner.
  - *Why*: A newly registered or unsubscribed account legitimately has no order record (`404` from `/api/auth/my-order`); displaying `NO ACTIVE ORDERS` in the status card and `"No Active Order"` in the key box provides clear guidance without alarming the user.
- **Decision 3: Hybrid Expiry Calculation**
  - *Chosen Approach*: Honor explicit boolean `data.isExpired` / `session.isExpired` when present, and otherwise compute `new Date(liveExpiry).getTime() <= Date.now()` when a valid date string exists and the order is not pending.
  - *Why*: Protects against cases where the backend returns an expiry timestamp without pre-computing `isExpired`, while preventing pending orders without an assigned expiry date from appearing expired.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DSCWeb React Application                         │
├──────────────────────┬───────────────────────────┬──────────────────────┤
│   Public & Catalog   │   Client Portal & Auth    │   Admin & Owner DB   │
│  ┌────────────────┐  │  ┌─────────────────────┐  │  ┌────────────────┐  │
│  │ FreePanelPage  │  │  │  UserDashboardPage  │  │  │AdminDashboard  │  │
│  │ (Cred Gating & │  │  │ (404 No-Order State │  │  │(Users, Orders, │  │
│  │  Slot States)  │  │  │  & Expiry Fallback) │  │  │ Keys, Security)│  │
│  └───────┬────────┘  │  └──────────┬──────────┘  │  └───────┬────────┘  │
│          │           │             │             │          │           │
│  ┌───────▼────────┐  │  ┌──────────▼──────────┐  │  ┌───────▼────────┐  │
│  │  ProductsPage  │  │  │    CheckoutPage     │  │  │AdminWorkspace  │  │
│  │  & Static Info │  │  │ (Plan Normalization │  │  │ (8 Owner Tables│  │
│  │     Pages      │  │  │  & UPI QR / Proof)  │  │  │ & FreeUsers)   │  │
│  └───────┬────────┘  │  └──────────┬──────────┘  │  └───────┬────────┘  │
└──────────┼───────────┴─────────────┼─────────────┴──────────┼───────────┘
           │                         │                        │
           ▼                         ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│             useRemoteResource Hook & Session Auth Utilities             │
│   (AbortController Cancellation, Stale Guard, JWT Claim Normalization)  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Centralized API Client (dscApi)                      │
│     (Bearer Auth, ProblemDetails Extraction, 400/401/403/404/500)       │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **FreePanel State**: Normalized `{ freeUser, freePass, freeLink, usedSlots, maxSlots }` with derived `hasValidCredentials = Boolean(freeUser.trim() && freePass.trim())` and `isFull = maxSlots <= 0 || usedSlots >= maxSlots`.
  - **User Dashboard State**: Distinguishes `loading`, `hasNoOrder` (`error?.status === 404` or empty order payload), `fatalError` (non-404 API/network errors), and active order states (`Pending`, `Approved`, `Rejected`).
  - **Owner DB FreeUsers State**: Preserves `{ id, userId, Username, HWID, EnvName, CaptchaToken, IsBanned, FailedLoginAttempts }` independently across `openEdit` and `handleSaveEdit`.
- **Interactive Component & State Mapping**:
  - `FreePanelPage`: Renders loading skeleton -> evaluates `!error && hasValidCredentials` -> renders credentials + copy handlers + slot progress + download button (+ `Slots Full` warning if `isFull`), or renders `#freeOfflineMsg` (`Free Panel Not Available`) when `error || !hasValidCredentials`.
  - `UserDashboardPage`: Evaluates `error?.status === 404` -> sets `hasNoOrder = true` -> renders `NO ACTIVE ORDERS` in `#dashOrderStatus`, renders `"No Active Order"` inside `#dashOrderKey` with `No Order` badge, and suppresses copy/download buttons. For non-404 errors, renders an explicit error alert with retry capability.
  - `AdminWorkspacePage`: Separates `envName` and `captchaToken` state properties in `editForm` when `table === 'freeusers'`, rendering distinct labeled inputs in the edit modal and submitting both values accurately in `PUT /api/admin/manage/free-user/update`.
  - `useRemoteResource`: Resets `data` to `initialData` when dependencies change or a new fetch cycle starts so stale data from a previous user/table never leaks across transitions.
