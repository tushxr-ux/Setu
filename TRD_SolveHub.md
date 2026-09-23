# Technical Requirements Document (TRD)
## Platform Name (working title): **SolveHub**
*A marketplace where companies post real technical problems, students solve them for pay, and top solvers get hired.*

---

## 1. High-Level Architecture
```
[React/Next.js Frontend] 
        |
        v
[API Gateway / Backend - Node.js (NestJS) or Django]
        |
   -----------------------------------------------
   |            |             |            |     |
[Auth Svc] [Problem Svc] [Submission Svc] [Payment Svc] [Notification Svc]
   |            |             |            |     |
   -----------------------------------------------
        |
        v
[PostgreSQL - primary DB]   [Redis - cache/queues]   [S3/Cloud Storage - files]
        |
        v
[Elasticsearch - feed search/filter]   [Payment Gateway: Razorpay/Stripe]
```

## 2. Recommended Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + TypeScript + Tailwind | SEO for public problem pages, fast dev, good DX |
| Backend | Node.js (NestJS) or Django REST Framework | Structured, scalable, good ecosystem |
| Database | PostgreSQL | Relational data (users, problems, submissions, payments) |
| Cache/Queue | Redis + BullMQ (or Celery if Django) | Async jobs: notifications, plagiarism checks, payment webhooks |
| File Storage | AWS S3 / Cloudflare R2 | Code files, attachments, demo videos |
| Search/Feed | Elasticsearch or Postgres full-text + filters (MVP can skip ES) | Feed filtering/search at scale |
| Auth | JWT + OAuth (Google/GitHub login for students) | Fast onboarding, GitHub link doubles as portfolio verification |
| Payments | Razorpay (India) / Stripe (global) with escrow-style hold via Razorpay Route or manual ledger | Handles payouts, KYC, compliance |
| Hosting | AWS/GCP + Vercel (frontend) | Standard scalable setup |
| Monitoring | Sentry + Datadog/Grafana | Error tracking, uptime |

## 3. Core Data Model (simplified)

```
User (id, role[company/student/admin], email, name, verified, created_at)
CompanyProfile (user_id, company_name, gstin/domain, verified_at)
StudentProfile (user_id, college, skills[], github_url, resume_url, rating, badges[])
Problem (id, company_id, title, description, tags[], difficulty, reward_amount, 
         escrow_status, deadline, visibility, status[open/closed/expired], created_at)
Submission (id, problem_id, student_id, content_url, writeup, status[pending/accepted/rejected],
            submitted_at, reviewed_at, feedback)
Payment (id, submission_id, amount, platform_fee, status[held/released/refunded], txn_id)
HireInterest (id, company_id, student_id, problem_id, status[initiated/interview/hired/declined])
Notification (id, user_id, type, payload, read_status, created_at)
Dispute (id, submission_id, raised_by, reason, status, resolution)
```

## 4. Key API Endpoints (MVP)

```
POST   /auth/signup              /auth/login          /auth/oauth/:provider
GET    /problems?filters=...     GET /problems/:id
POST   /problems                 (company only, requires escrow funding first)
POST   /problems/:id/submissions (student)
GET    /submissions/:id
PATCH  /submissions/:id/review   (company: accept/reject + feedback)
POST   /payments/fund-escrow     POST /payments/release
POST   /hire/initiate            PATCH /hire/:id/status
GET    /students/:id/profile     GET /leaderboard
POST   /disputes                 PATCH /disputes/:id/resolve  (admin)
```

## 5. Payment/Escrow Flow (Critical System)
1. Company creates problem → must fund escrow via payment gateway before problem is published (status: `held`).
2. On accept, backend triggers payout to student's linked account/UPI, minus platform commission.
3. If problem expires with no acceptable submission, refund logic triggers (minus any processing fee, per policy).
4. All state transitions logged in an immutable `PaymentLedger` table for auditability.

*Note: True escrow (funds held by a licensed third party) has regulatory implications in India (RBI PPI rules). For MVP, consider using Razorpay Route/Payouts with your own ledger rather than claiming to be a formal escrow provider — consult a fintech-compliant payment partner before launch.*

## 6. Plagiarism / Duplicate Detection
- MVP: simple code-similarity hashing (e.g., MOSS-like algorithm or a library like `copydetect`) run as async job on submission.
- Flag high-similarity submissions for manual review rather than auto-rejecting.

## 7. Security & Compliance
- Role-based access control (RBAC) for company/student/admin
- Signed URLs for file uploads (avoid public S3 buckets)
- Rate limiting on submission endpoints (prevent spam)
- NDA click-wrap agreement before viewing private/sensitive problems
- GDPR/DPDP (India) compliant data handling — explicit consent for storing resumes/personal data
- PCI compliance handled by payment gateway (never store card data directly)

## 8. Scalability Considerations (post-MVP)
- Move feed queries to Elasticsearch once problem volume grows (>10k active problems)
- Separate microservices only when a single monolith becomes a bottleneck — **don't over-engineer at MVP stage**
- CDN for static assets and demo videos
- Background workers (BullMQ/Celery) for: notification sends, plagiarism checks, payment webhook processing

## 9. MVP Build Phases
| Phase | Scope | Est. Timeline |
|---|---|---|
| Phase 1 | Auth, company/student profiles, post problem, feed, submit solution (no payments yet — manual payout) | 4-6 weeks |
| Phase 2 | Payment gateway integration + escrow ledger, review/accept flow | 3-4 weeks |
| Phase 3 | Hiring flow, leaderboard, badges, plagiarism detection | 3-4 weeks |
| Phase 4 | Admin dashboard, disputes, analytics, polish | 2-3 weeks |

*(Solo/small team estimate — adjust based on team size)*
