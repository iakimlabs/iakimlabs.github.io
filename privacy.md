---
layout: page
title: Privacy policies
eyebrow: Legal
lead: One place for every privacy policy at iakimlabs — one for each app and game, and one for this website.
permalink: /privacy/
---

## Apps and games

Each app has its own policy, because each one handles data differently.

<div class="policy-list">
{% assign policy_apps = site.apps | sort: 'order' %}
{% for a in policy_apps %}
  <a class="policy-item" href="{{ a.url | append: 'privacy/' | relative_url }}">
    <img src="{{ a.icon | relative_url }}" alt="" width="48" height="48" loading="lazy">
    <span class="policy-item__text">
      <b class="notranslate" translate="no">{{ a.title }}</b>
      <small>{% if a.type == 'game' %}Game{% else %}App{% endif %} · Updated {{ a.privacy.updated | default: a.updated | date: '%B %-d, %Y' }}</small>
    </span>
    <i class="bi bi-arrow-right"></i>
  </a>
{% endfor %}
</div>

## This website

*Last updated: October 14, 2026*

This website, **iakimlabs.com**, is a static site. It has no user accounts, no
comment system and no analytics or advertising trackers.

### Information we collect

We do not collect personal information through this website. The contact form
does not send data to us directly — it opens a pre-filled message in your own
email app, and you decide whether to send it.

If you email us, we receive your email address and the content of your message
and use them only to reply to you.

### Third-party services

- **GitHub Pages** hosts this website and may log technical data such as IP
  addresses for security purposes. See the
  [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- **Google Fonts** and **jsDelivr** deliver fonts, styles and icons.
- **Google Translate** is loaded only if you pick a language other than English
  in the language menu. Your choice is stored in a `googtrans` cookie so the
  site stays in that language. See the
  [Google Privacy Policy](https://policies.google.com/privacy).

Your light/dark theme choice is stored in your browser's local storage and
never leaves your device.

### Contact

Questions about privacy? Email us at [iakimlabs@gmail.com](mailto:iakimlabs@gmail.com).
