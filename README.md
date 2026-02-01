# TrackyTimer (Noir Edition)

**“Eliminate Choice. Execute Protocol.”**

TrackyTimer is a high-stakes productivity system designed to enforce deep work through a rigid **Identity & Contract** protocol.  
It deliberately removes flexibility, replaces motivation with commitment, and treats focus as a system constraint — not a preference.

This is **not** a typical productivity app.  
It is an enforcement engine.

---

## 🚀 Core Concept

TrackyTimer operates on a simple principle:

> **Discipline is strongest when choice is removed.**

Instead of reminders, gamification, or encouragement, the system forces the user into a **contractual focus session** that is psychologically and technically difficult to abandon.

---

## 🧠 Core Protocol

### Identity Initialization
- Users initialize a local handle tied to a **secure, anonymous, device-scoped identity**
- Implemented via **HTTP-only cookies**
- No email, no password, no personal data

### The Contract
- A deliberate, multi-step commitment flow  
  **Tracks → Syllabus → Paywall → Contract → Lock**
- Designed to slow the user down and reinforce intent
- Each step increases the psychological cost of backing out

### Hard Lock
- Once a session begins, the environment enters **Focus Mode**
- Refreshing or leaving the page does not reset progress
- The user can return — but the **contract remains active**
- Enforcement is at the **application level** (not OS-level control)

### Failure & Penalty
- Integrity violations (visibility loss, protocol breaks) are recorded
- Severe or repeated violations move the user into a **Failure State**
- Failure is terminal for the session and cannot be bypassed

---

## 🎨 Visual Identity

- Noir / Cyberpunk aesthetic
- CRT scanlines, terminal-style UI, monospaced typography
- Console-like experience designed to feel *serious* and *unforgiving*
- Visuals reinforce system authority, not comfort

---

## 🏗️ Technical Architecture

### Framework
- Next.js 14 (App Router)

### Database
- Supabase (PostgreSQL)
- Server-authoritative state
- SQL-enforced constraints for integrity

### State Model
- The database is the **single source of truth**
- UI is a pure projection of server state
- Refreshing the frontend never alters session legality

### Security Model
- Anonymous, cookie-based identity (HTTP-only)
- No client-side trust for session enforcement
- All state mutations occur via **atomic PostgreSQL RPC functions**
- External dependencies (time, metrics) are guarded by **kill switches**

---

## 🔁 Application Flow (11 Screens)

1. **BootScreen** – System initialization  
2. **RealityCheckScreen** – Readiness confirmation  
3. **IdentityScreen** – Handle initialization  
4. **DashboardScreen** – Central command hub  
5. **TracksScreen** – Context selection  
6. **SyllabusScreen** – Objective definition  
7. **PaywallScreen** – Commitment through payment (Stripe-ready)  
8. **ContractScreen** – Final protocol agreement  
9. **HardLockScreen** – Irreversible commitment gate  
10. **NoirSessionScreen** – Active focus session  
11. **FailureScreen** – Penalty state for violations  

---

## 🛠️ Setup & Installation

### Clone the repository
```bash
git clone https://github.com/likhithmamba/trackytimer.git
cd trackytimer
