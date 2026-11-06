# DSCWeb React — Second-Pass Repair: Owner DB Schema, FreePanel Normalization & UI Polish

This plan eliminates dynamic property leakage in the Owner Database Manager, introduces resilient alias-aware response normalization for the Free Panel, enforces safe database identifier resolution for destructive operations, and refines the global DSC visual layout across all viewports.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and UX decisions were confirmed during interactive clarification and govern this implementation pass:

- **Confirmed Decision 1 — Free Users `CaptchaToken` Handling**: Hide `CaptchaToken` from the visible Free Users table columns and edit modal inputs, while silently preserving the record's original `CaptchaToken` value in the `PUT /api/admin/manage/free-user/update` payload so it is never lost or overwritten by `EnvName`.
- **Confirmed Decision 2 — FreePanel Missing/Invalid Download URL**: When FreePanel credentials (`freeUser` and `freePass`) are valid but `freeLink` is missing, empty, or not a valid HTTP/HTTPS URL, render a disabled button labeled `"Download Link Unavailable"` instead of a broken `href="#"` anchor.
- **Confirmed Decision 3 — Missing Database Record ID Safeguards**: Never fall back to array indices or usernames as database IDs for destructive operations. When a row lacks a valid database identifier, disable bulk-selection checkboxes and delete buttons for that row and display an `"ID Missing"` warning badge.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces raw `Object.keys(row)` column discovery in Owner DB with an explicit, allowlisted `TABLE_COLUMN_DEFINITIONS` schema per collection; upgrades FreePanel with a dedicated `normalizeFreePanelResponse(payload)` helper that resolves non-empty aliases across direct and wrapped payloads; and polishes the visual consistency and responsive behavior of headers, dashboards, tables, and modals.
- **Target Audience / Persona**:
  - **Owners & Administrators**: Managing database tables (`users`, `settings`, `freeSettings`, `freeusers`, `panelUpdates`, `keys`, `orders`, `admins`) without visual clutter, duplicate PascalCase/camelCase columns, raw JSON strings, or base64 image dumps.
  - **Public & Subscribed Users**: Viewing accurate FreePanel credentials, slot telemetry, and verified download links across mobile, tablet, and desktop screens.
- **Key Value**: Guarantees that only verified, human-labeled columns are rendered in Owner DB, prevents accidental record corruption or fabricated delete IDs, and ensures FreePanel accurately reflects live backend data regardless of property casing or empty alias strings.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Owner Database Explicit Schema & Safe CRUD Flow**:
     - Selecting any of the 8 collections renders strictly its allowlisted columns from `TABLE_COLUMN_DEFINITIONS` with human-readable headers (e.g., `ID`, `Username`, `Plan`, `License Key`, `HWID`, `Ban Status`, `Failed Login Attempts`, `Lockout End`, `Expiry Date`, `Registration Date`, `Last Login` for `Users`).
     - `System Settings` and `Free Panel Settings` share the settings endpoint but display separate, tailored column subsets (`Free Panel Settings` shows only `ID`, `Free Username`, `Free Password`, `Free Valid Days`, `Maximum Free Slots`, and `Free Download Link`), while saving either preserves the complete settings object.
     - `Orders` displays `Order ID`, `Username`, `Plan`, `Duration`, `Amount`, `Transaction ID`, `Order Status`, and `Creation Date`, excluding raw `PaymentProofBase64` strings and password hashes.
     - Rows with a valid database ID enable selection checkboxes and `Delete`; rows without a valid ID display an `ID Missing` badge and disable both bulk selection and deletion.
  2. **FreePanel Normalization & Download Action Flow**:
     - `normalizeFreePanelResponse(payload)` inspects direct payload properties or documented `data` / `Data` wrappers.
     - Uses a non-empty alias resolver so an empty string in one alias (e.g. `freeUser: ""`) never shadows a populated alias (`FreeUser: "live_user"`).
     - Rejects non-string/object values so `[object Object]` can never render as a credential.
     - When credentials are valid and `freeLink` is a valid URL, renders the active download button; when `freeLink` is missing or invalid, renders a disabled `"Download Link Unavailable"` button while keeping credentials and slot telemetry visible.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Cohesive DSC dark/light technical portal matching the original DSCWeb contrast, borders, and cyan/teal accent hierarchy.
  - *Color Palette & Mood*: Preserves `--bg`, `--surface`, `--surface-strong`, `--primary` (`#22b8cf` dark / `#0891a2` light), and semantic status badges (`good`, `warning`, `bad`).
  - *Typography & Hierarchy*: Clean sans-serif headings and table headers paired with `monospace` and `tabular-nums` for IDs, keys, HWIDs, credentials, and slot counters.
  - *Component Styling & Layout*: Reusable CSS classes for Owner DB toolbars, header action groups, modal footers, and credential cards (replacing scattered inline styles), with horizontal scrolling strictly contained inside `.table-wrap`.
- **Interactive Feedback & Motion**:
  - Skeleton loading rows in Owner DB and FreePanel.
  - Safe clipboard copy handler with try/catch fallback so clipboard permission errors never crash the UI, plus automatic timeout cleanup.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Explicit Allowlisted `TABLE_COLUMN_DEFINITIONS` Over Dynamic Key Discovery**
  - *Chosen Approach*: Define an explicit column array for each of the 8 Owner DB tables with `id`, `label`, `aliases`, and optional `format` type (`boolean`, `status`, `datetime`, `code`, `text`).
  - *Why*: Prevents PascalCase/camelCase duplicate columns, hides sensitive/internal fields (`PasswordHash`, `PaymentProofBase64`, `CaptchaToken`), and stops nested objects from dumping raw JSON into table cells.
- **Decision 2: Non-Empty Precedence Alias Resolution**
  - *Chosen Approach*: Implement `resolveField(record, aliases)` that iterates through ordered alias keys (plus case-insensitive fallback among the known aliases) and returns the first value that is neither `null`, `undefined`, nor an empty/whitespace-only string.
  - *Why*: Standard nullish coalescing (`a ?? b`) stops at `""`, causing blank values when a serializer emits both camelCase `""` and PascalCase `"value"`.
- **Decision 3: Strict Database Identifier Extraction (`getDatabaseRecordId`)**
  - *Chosen Approach*: Resolve only real primary key fields (`id`, `Id`, `userId`, `UserId`, `keyId`, `KeyId`, `orderId`, `OrderId`) and validate that the result is a non-empty string or finite number (`> 0` or valid identifier). Never fall back to `username` or the loop `index`.
  - *Why*: Prevents accidental deletion of the wrong database row if a record is malformed or lacks an ID.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DSCWeb React — Second-Pass Architecture             │
├────────────────────────────────────┬────────────────────────────────────┤
│     Owner Database Console         │         FreePanel Module           │
│  ┌──────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │  TABLE_COLUMN_DEFINITIONS    │  │  │ normalizeFreePanelResponse() │  │
│  │  (8 Explicit Table Schemas)  │  │  │ (Unwraps data/Data & picks   │  │
│  └──────────────┬───────────────┘  │  │  first non-empty string/num) │  │
│                 │                  │  └──────────────┬───────────────┘  │
│  ┌──────────────▼───────────────┐  │                 │                  │
│  │    resolveColumnValue() &    │  │  ┌──────────────▼───────────────┐  │
│  │    getDatabaseRecordId()     │  │  │   FreePanel State Machine    │  │
│  │  (Alias Resolver & Safe ID)  │  │  │  Loading -> Offline / Valid  │  │
│  └──────────────┬───────────────┘  │  │  + Validated Download Link   │  │
│                 │                  │  └──────────────┬───────────────┘  │
│  ┌──────────────▼───────────────┐  │                 │                  │
│  │   Scoped Edit & Delete DTO   │  │  ┌──────────────▼───────────────┐  │
│  │  (Preserves full Settings &  │  │  │ Safe Clipboard Copy Handler  │  │
│  │   silent CaptchaToken save)  │  │  │ (Try/Catch + Timer Cleanup)  │  │
│  └──────────────────────────────┘  │  └──────────────────────────────┘  │
└────────────────────────────────────┴────────────────────────────────────┘
```

- **Data Model & State**:
  - **`TABLE_COLUMN_DEFINITIONS`**:
    - `users`: `id`, `username`, `plan`, `keyValue`, `hwid`, `isBanned`, `failedLoginAttempts`, `lockoutEnd`, `expiryTime`, `registrationTime`, `lastLoginTime`
    - `settings`: `id`, `isMaintenanceMode`, `maintenanceReason`, `maxFreeSlots`, `latestVersion`, `updateUrl`, `showHomeDownloadBtn`, `freeValidDays`, `freeLink`, `streamerLink`, `sniperLink`, `specialLink`, `aimbotLink`, `premiumLink`, `customisedLink`
    - `freeSettings`: `id`, `freeUsername`, `freePassword`, `freeValidDays`, `maxFreeSlots`, `freeLink`
    - `freeusers`: `id`, `username`, `hwid`, `envName`, `isBanned`, `failedLoginAttempts`, `lockoutEnd`, `firstLoginTime`, `lastLoginTime`
    - `keys`: `id`, `keyValue`, `plan`, `validDays`, `isUsed`, `createdAt`
    - `orders`: `id`, `username`, `plan`, `days`, `amount`, `txnId`, `status`, `createdAt`
    - `admins`: `id`, `username`, `role`, `isActive`
    - `panelUpdates`: `update1`, `update2`, `update3`, `update4`
  - **`normalizeFreePanelResponse(payload)`**:
    - Unwraps `payload?.data` or `payload?.Data` if the root object does not directly contain credential/slot keys.
    - Resolves `freeUser` from `['freeUser', 'FreeUser', 'freeUsername', 'FreeUsername']`, `freePass` from `['freePass', 'FreePass', 'freePassword', 'FreePassword']`, `freeLink` from `['freeLink', 'FreeLink']`, `usedSlots` from `['usedSlots', 'UsedSlots']`, and `maxSlots` from `['maxSlots', 'MaxSlots']`.
    - Validates `hasValidCredentials` and `hasValidDownloadUrl` (`/^https?:\/\/\S+/i.test(freeLink)`).
- **Interactive Component & State Mapping**:
  - Search in Owner DB filters rows by inspecting only the resolved values of the active table's `TABLE_COLUMN_DEFINITIONS` so hidden internal fields (like base64 images or password hashes) never trigger false search matches.
  - Bulk selection (`handleSelectAll`, `toggleSelectOne`) and `confirmDelete` check `getDatabaseRecordId(row)` and refuse to operate on rows where the ID is `null`.
  - Editing a `freeusers` row populates `envName` from `EnvName`/`envName` while retaining the original `CaptchaToken`/`captchaToken` in state and submitting it untouched on save.
