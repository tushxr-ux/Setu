# Setu — Bridging Problems to Solutions

> **SIH 2026 · PS26043** — A civic innovation marketplace connecting government departments, startups, and student teams to solve real-world problems through verified, escrow-backed challenges.

## 🌐 Live Preview
Run locally with `npm run dev` → [http://localhost:5173](http://localhost:5173)

---

## 🏛️ What is Setu?

Setu is a web platform where:
- **Government departments & NGOs** post real civic challenges (pothole detection, maternal health apps, smart waste management) — free listing
- **Companies & startups** post innovation bounties with cash rewards
- **Student teams** discover, solve, and submit solutions — with **guaranteed escrowed payouts**

The name "Setu" (सेतु) means **bridge** in Hindi — bridging civic problems to student-built solutions.

---

## ✨ Features

### 🔐 Escrow-Backed Rewards
- 100% of the reward is locked in escrow **before** any team starts work
- On acceptance: **70% to winner**, **30% shared among all other finishers** (no team walks away empty-handed)
- Private-sector: 7% platform success fee on resolution

### 🏛️ Dual-Track Posting
| Feature | Government / NGO (Public) | Private Sector |
|---|---|---|
| Listing fee | Free | Small flat fee |
| Rewards | Certificates + cash | Cash + internship/PPO |
| Location scope | State or National | National by default |
| IP on non-winners | Students keep IP | Students keep IP |

### ⚖️ Fairness Safeguards
- Non-winning teams retain **full IP ownership**
- Guaranteed reward floor — every team that finishes gets a share
- Capped scope — no free production builds
- Upfront disclosure of all terms before a team commits

### 🤖 AI-Powered Features (MVP Simulated)
- Pre-submission **originality / plagiarism scanner** (< 30% similarity threshold)
- Challenge sectors auto-tagged: Healthcare, Agriculture, Infrastructure, Fintech, Environment, Smart Cities

### 📋 Review & Hiring Pipeline
- Org review inbox with milestone checklist, writeup, and code links
- Accept → escrow releases automatically
- **Talent pipeline Kanban**: Shortlisted → Interview → Offer → Placed
- Direct hiring from challenge solutions

### 🏆 National Leaderboard
- Elo-style rating based on difficulty, acceptance rate, and originality
- Sector specialization badges
- Hire offers count per solver

### 💰 Solver Wallet
- Instant UPI / IMPS withdrawal
- Lifetime earnings tracker
- Badge system for civic contributions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (white/navy blue Setu brand) |
| State | React Context + localStorage (MVP) |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |
| Animations | CSS keyframes + Tailwind transitions |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 👤 Demo Personas

Switch personas from the top-right profile dropdown to explore each role:

| Persona | Role | Demonstrates |
|---|---|---|
| Rahul Sharma | Student — IIT Delhi | Challenge discovery, solution submission, wallet |
| Priya Mishra | Govt. Dept — Jharkhand IT | Posting public challenges, reviewing submissions |
| Arjun Kapoor | Company — RuralFintech | Posting private bounties, talent pipeline |
| Setu Trust & Safety | Admin | Escrow ledger, plagiarism flags, dispute resolution |

---

## 📁 Project Structure

```
src/
├── assets/          # Brand logo
├── components/      # All UI components
│   ├── Navbar.tsx
│   ├── HeroBanner.tsx
│   ├── ChallengeCard.tsx
│   ├── ChallengeDetailModal.tsx
│   ├── PostChallengeModal.tsx
│   ├── SubmitSolutionModal.tsx
│   ├── OrgDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── LeaderboardView.tsx
│   ├── HirePipelineView.tsx
│   └── AdminPortal.tsx
├── context/
│   └── AppContext.tsx    # Central state management
├── data/
│   └── mockData.ts       # Realistic civic challenge seed data
└── types.ts              # All TypeScript interfaces
```

---

## 🏗️ Architecture

The MVP uses a **monolithic React Context** as the state store with `localStorage` persistence — designed for rapid iteration before migrating to a real backend (Node.js/FastAPI + PostgreSQL + Razorpay escrow).

---

*Built for Smart India Hackathon 2026 — Problem Statement PS26043*
