#!/usr/bin/env python3
"""Small dependency-free checks for the static portfolio."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "img":
            self.images.append(attrs)


for file in (ROOT / "index.html", ROOT / "upwork/index.html"):
    source = file.read_text()
    page = Page()
    page.feed(source)
    assert all(not link.startswith("#") or link[1:] in page.ids for link in page.links), file
    assert all(image.get("alt") for image in page.images), file
    assert all((ROOT / link.lstrip("/")).exists() for link in page.links if link.startswith("/") and not link.startswith("//")), file
    assert all((ROOT / image["src"].lstrip("/")).exists() for image in page.images), file
    structured = re.search(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
    assert structured, file
    json.loads(structured.group(1))
    if file.parent.name == "upwork":
        assert all(contact not in source.lower() for contact in ("mailto:", "@gmail.com", "linkedin.com")), file
        assert 'content="noindex, nofollow"' in source, file
    print(f"OK: {file.relative_to(ROOT)}")
