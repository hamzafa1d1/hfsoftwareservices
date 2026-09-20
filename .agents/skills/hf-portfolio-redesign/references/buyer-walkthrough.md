# Buyer walkthrough — one prospect, one visit (2026-09-20)

A persona pass over the rebuilt site, done as a real buyer would experience it, followed by what was changed because of it and what still needs the owner.

## The persona

**Maya Lindqvist, COO at a 40-person B2B SaaS (support tooling, Stockholm).** She posted an Upwork job: "AI agent to triage support tickets into Jira, must not hallucinate, must integrate with our .NET backend." She has read 30 proposals tonight. Hamza's proposal linked to the `/upwork` page. It is 22:10, she is on her phone, and she will give the page about ten seconds before deciding whether to shortlist.

Her fears, in order: the freelancer disappears mid-project; she gets a notebook demo instead of a system; nobody can tell her whether the agent is actually working once it is live; the price is a surprise.

## The visit, step by step

1. **First screen (0–3 s).** Headline "AI agents that survive production. Not just the demo." lands on fear two directly. Eyebrow tells her where he is and his timezone (one hour from hers). Primary button is large and reads as a deliverable, not "contact". Pass.
2. **Sub-head (3–8 s).** "wired into the tools your team already runs — Jira, Confluence, your CRM" matches the job post word for word. ".NET and TypeScript" matches her stack. She keeps scrolling.
3. **Proof chips.** "Payments & card systems in production since 2022" and "AWS & Terraform certified" register as "has shipped real things". "Registered company · EU hours" answers a procurement question before she asks it.
4. **Pipeline figure.** She does not read every box, but "eval gate — fails → blocked" is the single phrase that speaks to fear three. Good that it is visible on the first scroll on mobile.
5. **Trust strip.** She does not know Expensya or Clearco. "Mastercard, Adyen & Swan integrations" she does recognise. No logos, only text: weak but honest.
6. **Who this is for.** Card A is her exact problem ("answers wrong one time in twenty"). Card B is the Jira sync. She now believes he has seen this before.
7. **Offers.** She reads the free audit card fully. "You leave the call knowing which single build is worth doing next, and what it costs" is the sentence that gets the click. She skims the sprint card, notes "quoted after the audit" with mild irritation because she wanted a number, then reads "Not for you if the scope is still moving" and finds it reassuring rather than off-putting.
8. **Case studies.** Case 01 (20 minutes to 20 seconds) proves he can go into an ugly legacy system and measure. Case 02 is the one she cares about: an AI-assisted workflow with quality gates used for production fixes, with a concrete "16 signals every 15 minutes" monitoring line. Case 03 proves an LLM feature in production at volume. She does not open "+4 More work".
9. **Process.** Four steps, fixed price at step two, evals in CI at step three. Fear four is handled. "Replies within one business day" sets expectations she can live with.
10. **Colleague quotes.** Two real, attributed, dated recommendations with a link to LinkedIn. She recognises the format as verifiable and does not read them fully. Their presence, not their content, does the work.
11. **About.** Photo, three sentences, facts strip. "Same person on the call in month six" hits fear one. Enough.
12. **FAQ.** She opens "What happens if you're unavailable?" and "Who owns the code?". Both answers are direct.
13. **Contact.** On the `/upwork` page she gets one button, "Message me on Upwork". She goes back to Upwork and shortlists him. On the public page she would have found an email fallback instead of a calendar and would probably have written the email, but with less certainty.

**Outcome:** shortlisted. The page did its job. The friction she felt was concentrated in two places: no price floor and no calendar.

## What changed because of this pass

- Every number now traces to the private evidence library (`hamza-career-skills`, claim IDs CC01, CC10, CC12, CC13, EX01–EX05, PUB01). The unverified "~60% faster delivery" figure was removed; the measured "20 minutes → about 20 seconds" replaced it as the lead metric.
- Dossier incidents are no longer tied to the employer name. Case 01 and 02 read "US HR SaaS platform"; Clearco appears only in the employment chronology (trust strip, About). This follows the dossier's own public-sharing rule.
- "Rebuilt with AI agents" became "AI-assisted delivery with quality gates". The rebuild is ongoing architecture work, not a shipped platform.
- Fraud case: the undefined 79% figure stays out; "10,000+ transactions a day" and "manual reviews halved" come from the public LinkedIn About; "€3,000+ recovered" is scoped to the pilot.
- Payments case says "contributed to", names Swan alongside Adyen, and labels the 30%/20% figures as reported.
- MT940 reconciliation was dropped: it is absent from the evidence library and appears to have belonged to the removed employer. Live schema migration (zero downtime, <2% CPU) took its slot in "More work".
- Testimonials section is now visible, with two verbatim LinkedIn recommendations and a link to the profile. Nothing paraphrased into a quote.
- LinkedIn URL corrected to `linkedin.com/in/hamzafaidi` (the public URL shown in the profile); the old site linked a non-existent slug.
- Availability pill reads "Open for new work · EU hours" instead of a slot count that could not be verified.
- Hero chip "6 production systems in fintech" replaced with the supportable "Payments & card systems in production since 2022".
- Pain card D now names the legacy .NET timeout, which is the strongest proof on the page.
- Public demo sysdesigncoach.org added under "More work"; Arabic added to languages; teaching added to the facts strip.

## What still needs the owner

| Friction Maya felt | Fix | Who |
|---|---|---|
| No calendar, only email | Set `CONFIG.SCHEDULER_URL` in `script.js` (Cal.com or Calendly). The page embeds it automatically. | Owner |
| No price floor on sprint/retainer | Decide floors, replace the two "quoted after the audit" spans in `index.html`. Market bands are in `ai-agent-dev-positioning`. | Owner |
| Unknown employer names | Add an Upwork badge or JSS once earned, or a recognisable client logo with permission. | Owner |
| `/upwork` CTA points at a guessed profile URL | Confirm the exact Upwork profile URL in `scripts/build-upwork.py`, re-run it. | Owner |
| Case studies have no visuals | Add one conceptual diagram per case (specs already written in `hamza-career-skills/prompts/upwork-portfolio-diagrams.md`). | Owner + Claude |
| WhatsApp absent | Publish a number only if you want it public; the slot is a commented TODO in `index.html`. | Owner |

## Positioning tension to be aware of

On 2026-09-20 the career library records the owner's stated default as ".NET/React SaaS delivery, with AI workflows as a differentiator". The design file this site implements leads with "AI agents that survive production". Both are true of the evidence, but they weight it differently. The current page keeps the design's headline and makes the case studies carry the .NET/SaaS delivery proof (Case 01, Case 04). If Upwork traffic skews toward .NET/React jobs rather than agent jobs, swap the H1 to something like "Production .NET and React, with AI agents that hold up" and keep everything else.
