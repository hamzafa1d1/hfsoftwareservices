# Portfolio storybook — "From ticket to production"

Status: **v0.2 (2026-11-01)**, rewritten from the Jun–Oct 2026 work summary (private source P1, claims CC17–CC28 in `hamza-career-skills`). See [IMPLEMENTATION.md](IMPLEMENTATION.md) for the build plan and [design-system.md](design-system.md) for tokens and motion.

## 1. The story in one line

> I ship production software through a gated, AI-assisted loop, and every change carries its own proof.

The page is that loop. The visitor scrolls through the same nine steps a change goes through, then sees the loop working on real (anonymised) problems.

What P1 lets us say, and what it doesn't:
- ✅ AI agents research, plan, code, review and QA; a person approves at two gates; reviewers are read-only; QA is a different agent from the coder; plans freeze.
- ✅ Hamza wrote the loop down, adapted it for payroll-grade rules, packaged it as a one-command kit for five AI tools, and used it to build three modules in about seven weeks.
- ❌ Hamza invented the loop (it started as a team pilot). ❌ Daily releases, ~45% cost savings or cycle-time gains as results (they are targets or estimates).

## 2. Readers

| Reader | Decides in ~10 s | Fear the story answers |
|---|---|---|
| Engineering manager / CTO, SaaS | Can he own a module alone and safely? | AI code nobody checked |
| Founder / ops lead | Will it ship and keep working? | Demo that never reaches production |
| Contract recruiter | Senior? Remote-ready? | Vague claims |

## 3. The visual idea: the Loop

Nine nodes on a ring, shown in 3D in the hero:

**Brainstorm → Plan → Approve ◎ → Build → Review → QA → Ship → Human review ◎ → Retro → (back to Brainstorm)**

◎ = human gate. A dashed amber arc runs Review → Build ("concerns → back to build"). Amber means only that.

The ring appears four times: the 3D hero, a sticky mini-ring in the Method chapter, a stage tag on each case, and the closing animation, where the token lands on Ship.

## 4. Chapters

### 0 — Hero (dark)
- **H1:** "Software that holds up in production."
- **Sub:** "I'm Hamza, a software engineer working on .NET, React and SQL systems for remote SaaS teams. AI agents do the legwork in my process. Frozen plans, read-only reviewers, a separate QA agent and a human sign-off decide what ships."
- **CTA:** Start a conversation · See how I ship
- **Visual:** the 3D loop, rotating slowly, with the token's amber detour on its first pass.

### 1 — Numbers (dark strip, "Jun–Oct 2026")
45+ tickets shipped to production · 15 epics owned · 35+ technical documents · 3 product modules in ~7 weeks. *(CC17, CC26)*

### 2 — The Loop, step by step (`#method`)
Sticky mini-ring on the left; nine step cards on the right, each with an action and its output file (brainstorm.md → plan.md (frozen) → dev record → review verdict → evidence.md → PR → merge → LEARNINGS.md). Then three "why it holds" cards:
- **Rules for money and tenants:** exact decimals, no hand-written tenant filters, a pure calculation engine, DB-change safety.
- **Independence enforced by tools:** reviewers get read/run access only. CI caught a one-word edit that would have given a reviewer write access.
- **No false green:** a fresh install once printed "All checks passed" with 29 unresolved placeholders. Now 76/76 adoption checks pass.

Kit strip: *one command · 5 AI tools · plan freeze in tools, pre-commit and CI*. Honest line: *"Gate is advisory until branch protection is on; speed gains not yet measured."* *(CC24)*

### 3 — Exhibit: what a PR looks like (`#evidence`)
A PR card reconstructed from a real one, with names removed. **Problem:** admins outside a form's approval route couldn't see in-flight forms. **Result:** 7 forms visible instead of 1. **Tests:** 14 new; the main test fails without the fix; suite 511 passed / 0 failed. **Scope:** one area, no DB change. *(CC25)*

### 4 — Cases (`#work`), each tagged with its loop stage
1. **Slow screens, four root causes** (Explore → Review). Requests up to 217 s. Re-keyed indexes: reads 7,845 → as few as 4 (staging). Warm app pool: cold loads 5–7 s → about 1 s. *(CC20)*
2. **Security audit, verified twice** (Review → QA). 24 verified findings, 8 critical. Tenant isolation hardened across 46 code paths with 27 tests. A global filter was rejected with evidence. *(CC21)*
3. **Feature, end to end: bulk salary benchmarking** (Plan → Ship). 9 stories, all in production. Plus the title-matching fix: about a third of titles returned no data; 12/12 QA scenarios passed. *(CC18, CC19)*
4. **Night shift (dark band): incidents into prevention.** Health checks: 16 signals every 15 minutes, posting to Slack. SSO restored for 8 tenants; expiry + mismatch alerts added. *(CC10, CC22)*

### 5 — Built with the loop (`#modules`)
Three HR product modules in ~7 weeks: skills profile + validation (done), 1:1s (16 stories built and QA'd in 9 days; calendar sync; HR sees whether 1:1s happen, not what was said), development plans from skill gaps (on dev). *(CC26)*

### 6 — Also on the bench
Rebuild discovery: ~209K backend lines, 554 tables, 37 features mapped, 6-stage ingestion design (CC23) · Co-built agentic ticket triage on .NET 10 + Microsoft Agent Framework, shadow-mode rollout (CC27) · Toolchain migration, build ~8 min → ~80 s, in review (CC28).

### 7 — Earlier: payments that kept running
100+ cards renewed before expiry (EX01) · live schema migration, reported 0 downtime and < 2% CPU overhead (EX04) · suspension policies for 1,000+ corporate users (EX05) · idempotent provider-agnostic webhooks (EX03).

### 8–11 — Recommendation, About, How we'd work, Contact
Verbatim quote; chronology strip (employers appear only here); four-step engagement; closing loop lands on **Ship**.

## 5. Motion and 3D rules
1. Content first: every word is in HTML and readable without JS.
2. One 3D object, built with CSS 3D transforms (no WebGL library, 0 KB dependencies).
3. Scroll effects use CSS scroll-driven animations under `@supports`; Firefox stable gets the static page.
4. No scroll-jacking, no auto-advancing carousels, no cursor followers.
5. `prefers-reduced-motion: reduce` freezes everything and shows final values.

## 6. Evidence guardrails
- No customer, colleague, vendor, repo or ticket names. No exploit mechanics (injection location, superuser, backdoors).
- Keep the qualifiers: "staging", "in review", "on dev", "shadow mode", "reported", "about".
- Retired: "20 min → 20 s" (superseded by the CC20 measured figures, pending Hamza's OK), 79% fraud accuracy, 60% faster delivery, Blauwtrust, MT940.
