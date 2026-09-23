# Product Requirements Document (PRD)
## Platform Name (working title): **SolveHub**
*A marketplace where companies post real technical problems, students solve them for pay, and top solvers get hired.*

---

## 1. Problem Statement
Companies frequently hit small-to-medium technical problems (bugs, optimization tasks, prototype features, data issues, algorithm challenges) that don't justify hiring a full-time engineer or an agency, but still need to be solved quickly and cheaply.

Meanwhile, students have technical skills but lack:
- Real-world problems to prove themselves on
- Paid opportunities before they have "experience"
- A direct channel to get noticed by companies for hiring

**SolveHub** connects the two: companies post problems → students solve them → companies pay for good solutions → companies can hire top performers.

## 2. Goals & Objectives
- Give companies a fast, low-cost channel to get technical problems solved by vetted talent.
- Give students a way to earn money and build a portfolio through real problems (not just tutorials).
- Create a hiring funnel where performance data (not just resumes) drives recruitment.
- Build a reputation/leaderboard system that becomes valuable currency for students over time.

## 3. Target Users

### Primary: Companies (Demand side)
- Startups / SMEs with limited engineering bandwidth
- Larger companies wanting to crowdsource R&D-style problems or run hiring challenges
- Needs: quick turnaround, quality control, low cost vs. agencies, access to hire-ready talent

### Primary: Students (Supply side)
- CS/engineering students, bootcamp grads, early-career devs
- Needs: real problems, payment, credibility, direct path to interviews/jobs

### Secondary: Colleges/Universities (optional, later phase)
- Could co-brand or track student participation for placement cells

## 4. Core User Personas
| Persona | Description | Key Need |
|---|---|---|
| Priya, Startup CTO | Small team, needs a bug fixed or feature prototyped fast | Fast, cheap, reliable solve |
| Rahul, 3rd-year CS student | Good at DSA/web dev, wants real experience + money | Real problems + payment + visibility |
| Ananya, HR/Talent lead | Wants to hire junior devs based on actual work, not just resume | Evidence-based hiring signal |

## 5. Key Features (MVP Scope)

### 5.1 Company Side
- Company signup/verification (basic KYC — GSTIN/company email domain verification to prevent fake postings)
- Post a "Problem" with: title, description, tech stack tags, difficulty, reward amount, deadline, attachments (code snippet, repo link, logs), visibility (public/invite-only)
- Escrow-based payment: company deposits reward amount upfront before problem goes live (prevents non-payment disputes)
- Review submissions dashboard (compare multiple solutions side-by-side)
- Accept/reject solutions with feedback
- Mark a student as "Hire Interested" → triggers a private chat/interview flow

### 5.2 Student Side
- Signup + profile (skills, resume, GitHub/portfolio link, college)
- Skill verification (optional short coding test at signup to get a "verified" badge — improves credibility & reduces spam submissions)
- **Feed**: personalized list of open problems, filterable by tech stack, reward, deadline, difficulty
- Submit a solution: code upload / repo link / write-up / demo video
- Track submission status (Under Review / Accepted / Rejected / Paid)
- Wallet: view earnings, withdraw to bank/UPI
- Public profile: solved problems, ratings, badges, leaderboard rank

### 5.3 Platform / Admin
- Moderation queue (flag inappropriate or plagiarized problems/solutions)
- Plagiarism/duplicate-solution detection (basic code-similarity check)
- Dispute resolution flow (company rejects solution but student disagrees → admin arbitration)
- Payment processing + platform commission (e.g., 10-15% fee on reward)
- Analytics dashboard (for internal use): active companies, active students, GMV, avg solve time

## 6. Core User Flows

**Company flow:**
Sign up → Verify → Post problem + fund escrow → Problem appears in student feed → Review submissions → Accept + release payment → (optional) Initiate hire conversation

**Student flow:**
Sign up → Build profile / take skill test → Browse feed → Submit solution → Await review → Get paid if accepted → Get discovered for interviews

## 7. Monetization
- Commission on each successful transaction (10–15%)
- Premium company plan: private problem posting, priority visibility, advanced analytics, direct hiring search of student database
- Optional: featured/urgent problem boost (like a "promoted job post")

## 8. Success Metrics (North Star + supporting)
- **North Star:** Number of problems successfully solved & paid per month
- Company retention (repeat postings within 30 days)
- Student activation (submits ≥1 solution within 7 days of signup)
- Time-to-first-submission per problem
- Hire conversions (students hired via platform / month)
- Dispute rate (% of submissions disputed) — should stay low

## 9. Risks & Open Questions
- **IP/confidentiality risk**: companies may hesitate to post real bugs/code publicly (leaking proprietary code). Need NDA-lite click-through + private/invite-only postings for sensitive stuff.
- **Quality control**: how do you stop 50 low-quality submissions flooding one problem? Consider caps on submissions or skill-gated access.
- **Fraud**: fake companies posting problems without funding escrow, or students submitting copied solutions.
- **Cold start problem**: needs both companies and students simultaneously — classic two-sided marketplace bootstrap challenge.
- **Legal**: is this "gig work"? May need contractor agreements, TDS/tax handling for payouts (India-specific compliance if you're targeting Indian users).

## 10. Competitive Landscape
- **Topcoder / HackerEarth Challenges** — algorithmic/dev challenges for companies
- **Bugcrowd / HackerOne** — bug bounty specifically (security bugs)
- **Unstop (Dare2Compete)** — Indian student competition + hiring platform
- **Toptal / Turing** — freelance hiring marketplaces (not problem-based)
- **Devpost** — hackathon-style challenges

Your differentiator needs to be sharper than "generic problems + generic students" — see the assessment shared separately for recommendations.

## 11. MVP Build Phases (high-level, see TRD for technical detail)
| Phase | Scope | Est. Timeline |
|---|---|---|
| Phase 1 | Auth, company/student profiles, post problem, feed, submit solution (no payments yet — manual payout) | 4-6 weeks |
| Phase 2 | Payment gateway integration + escrow ledger, review/accept flow | 3-4 weeks |
| Phase 3 | Hiring flow, leaderboard, badges, plagiarism detection | 3-4 weeks |
| Phase 4 | Admin dashboard, disputes, analytics, polish | 2-3 weeks |
