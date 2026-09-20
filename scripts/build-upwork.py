#!/usr/bin/env python3
"""Generate /upwork/index.html from index.html.

Upwork forbids off-platform contact details on pages linked from a profile
before a contract exists, so this variant strips the scheduler, form, email
and phone, and points every CTA at the Upwork profile. Run after editing
index.html:  python3 scripts/build-upwork.py
"""
import re, pathlib

UPWORK_PROFILE_URL = "https://www.upwork.com/freelancers/hamzafaidi"  # TODO: confirm exact profile URL

root = pathlib.Path(__file__).resolve().parents[1]
src = (root / "index.html").read_text()

# 1. swap the contact blocks
src = re.sub(r"<!--@public-->.*?<!--/@public-->", "", src, flags=re.S)
src = re.sub(r"<!--@upwork\s*(.*?)\s*@upwork-->", r"\1", src, flags=re.S)
src = src.replace("UPWORK_PROFILE_URL", UPWORK_PROFILE_URL)

# 2. every CTA goes to Upwork
src = re.sub(r'href="#contact"( data-scheduler)?', f'href="{UPWORK_PROFILE_URL}" target="_blank" rel="noopener"', src)
src = src.replace("Book a 30-minute reliability audit", "Message me on Upwork")
src = src.replace("Book a reliability audit", "Message on Upwork")
src = src.replace("Scope a sprint", "Message on Upwork").replace("Discuss a retainer", "Message on Upwork")

# 3. no contact details anywhere (LinkedIn counts as a contact channel on Upwork)
src = re.sub(r'\s*<a href="https://www\.linkedin\.com/[^"]*"[^>]*>LinkedIn</a>', "", src)
assert "mailto:" not in src, "mailto survived"
assert "wa.me" not in src, "WhatsApp survived"
src = src.replace('<script src="/script.js" defer></script>', "")

# 4. metadata: canonical stays on the public page, keep this one out of search
src = src.replace('<link rel="canonical" href="https://www.hfsoftwareservices.com/" />',
                  '<link rel="canonical" href="https://www.hfsoftwareservices.com/" />\n    <meta name="robots" content="noindex, nofollow" />')
src = src.replace("<title>HF Software Services — AI agents that survive production</title>",
                  "<title>HF Software Services — AI agents that survive production (Upwork)</title>")
# relative asset paths already absolute (/styles.css etc.)
(root / "upwork" / "index.html").write_text(src)
print("wrote upwork/index.html", len(src), "bytes")
