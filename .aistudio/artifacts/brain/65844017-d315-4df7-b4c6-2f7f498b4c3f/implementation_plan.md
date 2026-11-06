# Free Panel Settings to Users Table Synchronization (`Plan = free`)

When the Owner saves **Free Panel Settings** in the Owner Database, the system will persist the global Free Panel settings and synchronize the corresponding evaluation user account in the **Users** table (`Plan = "free"`), ensuring public Free Panel credentials can authenticate immediately while protecting existing paid accounts from accidental overwrites.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and workflow decisions were confirmed during interactive clarification and govern the implementation:

- **Confirmed Decision 1 — Dedicated Owner Sync Contract After Settings Save**: Saving Free Panel Settings will first validate the inputs and check for paid-username conflicts, persist the full settings payload via `PUT /api/admin/settings/update`, and invoke the dedicated Owner synchronization endpoint (`POST /api/admin/free-panel/sync-user`) to create, update, or disable the `Plan = "free"` user record in the `Users` table. Because the ASP.NET Core 8 backend lives in an external repository (`dscauth.onrender.com`), the exact C# controller and DTO implementation is also specified for backend deployment.
- **Confirmed Decision 2 — Existing `free` User Synchronization Policy**: If the configured `freeUsername` already exists in `Users` with `Plan = "free"`, the synchronization updates its password (hashed on the backend), recalculates `ExpiryTime` from `UTC Now + FreeValidDays`, and resets `IsBanned = false`. If the username belongs to any paid plan (`streamer`, `sniper`, `special`, `aimbot`, `premium`, `customised`, etc.), the operation is rejected with a clear conflict error before modifying the user.
- **Confirmed Decision 3 — Disabling Previous Free Account When Turned Off**: When `Global Free Username` is saved as blank (`""`) to turn the Free Panel off, the workflow saves the blank settings and disables/expires the previously configured `Plan = "free"` user account in the `Users` table so stale evaluation credentials can no longer authenticate.

---

## 1. Overview & Core Concept

- **What It Does**: Bridges the gap between the global **Free Panel Settings** record (`freeUsername`, `freePassword`, `freeValidDays`, `maxFreeSlots`) and the authentication **Users** table (`Plan = "free"`).
- **Target Audience / Persona**: The verified **Owner** managing evaluation access through the Owner Database workspace (`/pages/ownerdb`).
- **Key Value**: Eliminates the manual two-step mismatch where public Free Panel credentials were displayed on `/pages/freepanel` without a matching `Plan = "free"` user record in the `Users` table.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Creating or Updating Free Panel Credentials**:
     - The Owner selects **Free Panel Settings** in Owner DB and clicks **Edit / Manage**.
     - The Owner enters a `Global Free Username`, `Global Free Password` (minimum 6 characters when username is non-empty), `Free User Valid Days` (positive integer $\ge 1$), and `Max Free Panel Slots` ($\ge 1$).
     - Upon clicking **Save Changes**, the frontend validates the fields, checks the `Users` list for any paid-plan username collision, saves the full settings payload, and dispatches the Free User synchronization request.
     - Upon completion, the modal closes, the Owner DB refreshes both the settings state and the `Users` table, switches or updates the view so the `Plan = "free"` account is immediately visible, and displays a clear status banner indicating whether the free user account was **created**, **updated**, or **disabled**.
  2. **Turning Off the Free Panel (Blank Username)**:
     - If the Owner clears `Global Free Username` (`""`) and saves, the system persists the blank Free Panel settings and disables/expires the previous `Plan = "free"` user account in `Users`, displaying a confirmation message that the Free Panel has been turned off and the free user account was disabled.
  3. **Error & Partial-Failure Transparency**:
     - If `PUT /api/admin/settings/update` succeeds but the subsequent user synchronization fails (for example, due to a paid-account collision, validation error, or network/server error), the UI **never** displays a false overall success banner. Instead, it displays an explicit error stating that settings were saved but the Free Plan user account could not be provisioned, keeping the Owner informed of the exact failure reason.

- **Visual Identity & Theme**:
  - Preserves the established DSC dark/light theme tokens (`--bg`, `--surface`, `--primary`, `--success`, `--warning`, `--danger`), tabular numeral alignment (`tabular-nums`), and single-elevation card geometry.
  - Uses existing `.form-error`, `.form-success`, and `.badge` components with accessible text labels (never signaling state by color alone).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Pre-Flight Paid Account Conflict Guard + Backend Enforcement**
  - *Chosen Approach*: Before saving Free Panel Settings, verify against the loaded/fetched `Users` collection that the target `freeUsername` does not belong to an existing paid account (`plan !== "free"`), in addition to enforcing the same check in the backend sync endpoint.
  - *Why*: Prevents saving a public `freeUsername` in `Settings` that collides with a paying customer's username, avoiding any partial state where public FreePanel displays a paid user's handle.
  - *Alternatives Considered*: Relying solely on post-settings-save error handling was rejected because `PUT /api/admin/settings/update` would already have written the conflicting username into system settings before user creation was rejected.

- **Decision 2 — Explicit Synchronization Policy for Existing `Plan = free` Accounts**
  - *Chosen Approach*: When the target username already exists with `Plan = "free"`, synchronize the account by updating its password (via backend hashing / `setUserPassword`), resetting `ExpiryTime` to `now + freeValidDays`, and setting `IsBanned = false`. When the dedicated `POST /api/admin/free-panel/sync-user` endpoint is available, it performs this atomically; if an existing `Plan = "free"` user is already present in `Users`, the frontend also supports synchronizing via the verified Owner endpoints (`PUT /api/admin/user/update` + `POST /api/admin/user/{id}/set-password`) when needed.
  - *Why*: Ensures repeated saves of Free Panel Settings are idempotent, never create duplicate usernames, and always keep the evaluation account's password and expiry aligned with the configured settings.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Owner DB Workspace (AdminWorkspacePage)                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Free Panel Settings Modal                                             │  │
│  │  • Global Free Username (blank = OFF)                                 │  │
│  │  • Global Free Password (min 6 chars when active)                     │  │
│  │  • Free User Valid Days (int >= 1)                                    │  │
│  │  • Max Free Panel Slots (int >= 1)                                    │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             Free Panel Settings & User Provisioning Orchestrator            │
│                                                                             │
│  1. Validate inputs (password >= 6 chars, validDays >= 1, maxSlots >= 1)    │
│  2. Inspect Users list (`GET /api/admin/users`) for username match:         │
│     ├─ Exists with Paid Plan (`plan !== 'free'`) ──► Abort & Show Error     │
│     ├─ Exists with `plan === 'free'`             ──► Mode: UPDATE           │
│     ├─ Does not exist (username non-empty)       ──► Mode: CREATE           │
│     └─ Username cleared (`""`)                   ──► Mode: DISABLE          │
│  3. Save full settings (`PUT /api/admin/settings/update`)                   │
│  4. Provision / Sync Free User (`POST /api/admin/free-panel/sync-user`)     │
│  5. Refresh `users` & `freeSettings` tables and surface action outcome      │
└──────────────────┬───────────────────────────────────────┬──────────────────┘
                   │                                       │
                   ▼                                       ▼
┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐
│   PUT /api/admin/settings/update    │ │ POST /api/admin/free-panel/sync-user│
│  • Persists FreeUsername,           │ │  • Owner JWT required               │
│    FreePassword, FreeValidDays,     │ │  • Hashes password with BCrypt      │
│    MaxFreeSlots, and all links      │ │  • Sets Plan = "free", IsBanned = 0 │
│                                     │ │  • Sets ExpiryTime = UtcNow + Days  │
│                                     │ │  • Rejects paid username conflicts  │
└─────────────────────────────────────┘ └─────────────────────────────────────┘
```

### Data Model & Contract Specification

1. **Settings Payload (`PUT /api/admin/settings/update`)**:
   - Retains all existing system settings fields (`id`, `isMaintenanceMode`, `maintenanceReason`, `maxFreeSlots`, `latestVersion`, `updateUrl`, `showHomeDownloadBtn`, `freeValidDays`, `freeUsername`, `freePassword`, `freeLink`, `streamerLink`, `sniperLink`, `specialLink`, `aimbotLink`, `premiumLink`, `customisedLink`).
2. **Free User Synchronization Payload (`POST /api/admin/free-panel/sync-user`)**:
   - **Request Body (`SyncFreePanelUserDto`)**:
     - `username`: string (trimmed `freeUsername`, or `""` when disabling)
     - `previousUsername`: string (previously configured `freeUsername`, used to locate and disable the prior free user when cleared)
     - `password`: string (raw password to be hashed by the backend; never stored in `KeyValue`)
     - `validDays`: integer ($\ge 1$)
     - `plan`: `"free"`
     - `expiryTime`: ISO-8601 UTC timestamp calculated from `Date.now() + validDays * 86400000`
     - `isBanned`: boolean (`false` when active, `true` when disabling)
   - **Response Body**:
     - `{ status: "created" | "updated" | "disabled" | "unchanged", message: string, user: AdminUserDto }`
3. **Interactive Component & State Mapping**:
   - **Validation Guard**: Before calling the API on `freeSettings` save, if `freeUsername` is provided:
     - Require `freePassword` (at least 6 characters).
     - Require `freeValidDays` to be a positive integer ($\ge 1$).
     - Require `maxFreeSlots` to be a positive integer ($\ge 1$).
   - **Conflict Check**: Fetch `GET /api/admin/users` (using the Owner token) and normalize usernames case-insensitively. If a record matches `freeUsername` and its normalized `plan` is not `'free'`, block the save and display `"Cannot use this username for Free Panel: '<username>' belongs to an existing paid (<plan>) account."`
   - **Post-Save Table Refresh**: After both steps succeed, reload the Owner DB records and verify the `Plan = "free"` user in the `Users` collection so the Owner can immediately inspect the created/updated account.
