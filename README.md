# TrackyTimer (Noir Edition)

> **"Eliminate Choice. Execute Protocol."**

TrackyTimer is a high-stakes productivity system designed to force deep work sessions (`Focus Mode`) through a rigorous "Identity & Contract" protocol. It replaces standard productivity apps with a "console-like" immersive experience that penalizes distraction.

## 🚀 Features

### Core Protocol
- **Identity Verification:** Users must "sign in" with a handle to initiate a session. (Anonymous Cookie-based Auth)
- **The Contract:** A multi-step commitment flow (Tracks -> Syllabus -> Paywall -> Lock) to psychologically bind the user to their task.
- **Hard Lock:** Once a session starts, the environment is "locked". Refreshing or leaving allows the user to return, but "Commitment" is the key theme.
- **Visuals:** A "Noir / Cyberpunk" aesthetic with scanlines, CRT effects, and monospaced typography.

### Technical Architecture
- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **State Management:** Server-Authoritative State (The DB is the single source of truth).
- **Security:** 
  - **Cookie-Based Identity:** Auto-generated `uid` via secure middleware.
  - **RPC Transactions:** All state changes use atomic PostgreSQL functions (`update_session_with_violations`).
  - **Kill Switches:** External APIs (Time, Metrics) can be disabled via ENV.

### 11-Screen Flow
1.  **BootScreen:** System initialization.
2.  **RealityCheckScreen:** User readiness check.
3.  **IdentityScreen:** User handle creation/login.
4.  **DashboardScreen:** The central command hub.
5.  **TracksScreen:** Selecting the "Track" (Context) for work.
6.  **SyllabusScreen:** Defining specific objectives.
7.  **PaywallScreen:** A "Payment" commitment step (Stripe Integration Ready).
8.  **ContractScreen:** Final agreement to protocol rules.
9.  **HardLockScreen:** The final gate before execution.
10. **NoirSessionScreen:** The active, running session interface.
11. **FailureScreen:** Penalty state for integrity violations.

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/likhithmamba/trackytimer.git
    cd trackytimer
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    STRIPE_SECRET_KEY=your_stripe_key
    ENABLE_EXTERNAL_APIS=true
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```

## 🔒 Security

- **Anonymous Auth:** No email required. ID is tied to the device/browser via HTTP-Only cookies.
- **No Client Trust:** Logic for session validation lives on the server.
- **Clean Architecture:** No legacy SQLite files. Pure Cloud Native.

## 📄 License

Private / Proprietary.
