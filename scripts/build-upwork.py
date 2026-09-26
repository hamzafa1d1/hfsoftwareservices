#!/usr/bin/env python3
"""Build a contact-free portfolio variant for visitors arriving from Upwork."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
source = (root / "index.html").read_text()
source = re.sub(r"<!--@public-->.*?<!--/@public-->", "", source, flags=re.S)
source = re.sub(r"<!--@upwork\s*(.*?)\s*@upwork-->", r"\1", source, flags=re.S)
source = re.sub(r'<a class="inline-link".*?</a>', "", source, flags=re.S)
source = re.sub(r'<div class="contact-social">.*?</div>', "", source, flags=re.S)
source = re.sub(r',"sameAs":\[.*?\]', "", source)
source = source.replace(" · LinkedIn recommendation, September 2026", " · Public recommendation, September 2026")
source = "\n".join(line.rstrip() for line in source.splitlines()) + "\n"
source = source.replace("<title>Hamza Faidi — .NET & React software engineer</title>", "<title>Hamza Faidi — software engineering portfolio</title>\n  <meta name=\"robots\" content=\"noindex, nofollow\">")
assert "mailto:" not in source
assert "hamza.faidi.software.eng@gmail.com" not in source
assert "linkedin.com" not in source.lower()
assert "upwork.com/freelancers/" not in source
(root / "upwork" / "index.html").write_text(source)
print("Built upwork/index.html")
