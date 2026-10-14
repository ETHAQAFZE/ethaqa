
### 4.2 Directive Rationale

| Directive | Value | Reason |
|---|---|---|
| `default-src` | `'self'` | Everything defaults to same-origin |
| `script-src` | `'self' 'unsafe-inline' cdnjs googletagmanager` | Allows inline scripts (needed for GA4) and CDN assets |
| `script-src-elem` | (same as script-src) | Explicit, prevents fallback to broader policy |
| `style-src` | `'self' 'unsafe-inline' fonts cdnjs` | Allows inline styles and Font Awesome |
| `font-src` | `'self' gstatic cdnjs` | Allows Google Fonts and Font Awesome fonts |
| `img-src` | `'self' data: https:` | Allows local, data-URI, and any HTTPS image |
| `connect-src` | `'self' web3forms google-analytics` | Allows form submissions and GA4 beacon |
| `form-action` | `'self' web3forms` | Restricts where forms may POST |
| `frame-ancestors` | `'none'` | Prevents framing (clickjacking defense) |
| `object-src` | `'none'` | Blocks plugins, Flash, Java applets |
| `base-uri` | `'self'` | Prevents base-tag injection |
| `upgrade-insecure-requests` | (flag) | Forces HTTPS on HTTP resource loads |

### 4.3 Deliberate Trade-offs

**`'unsafe-inline'` in `script-src`:** Required because both the corporate site and GA4 use inline `<script>` blocks. Replacing this with nonces would require a server runtime, which the static architecture doesn't have.

**Risk:** moderate. Acceptable for a static site with no user-generated content.

**Mitigations in place:** no user input reflected into HTML, no `eval()`, no dynamic script creation, forms submitted to external origin.

**Future improvement:** when the architecture supports it, migrate to nonce-based CSP. Tracked as ETH-SEC-002.

## 5. Cache Rules

| Path | Cache-Control |
|---|---|
| `/assets/brand/*.svg` | `public, max-age=31536000, immutable` |
| `/assets/brand/*.png` | `public, max-age=31536000, immutable` |
| `/assets/brand/*.ico` | `public, max-age=31536000, immutable` |
| `/assets/css/*` | `public, max-age=31536000, immutable` |
| `/publishing/_astro/*` | `public, max-age=31536000, immutable` |
| `/*.html` | `public, max-age=0, must-revalidate` |
| Everything else | Cloudflare default |

## 6. Cookie Posture

| Attribute | Value |
|---|---|
| No cookies are set by the site itself | ✅ |
| Google Analytics sets `_ga`, `_ga_*` | External — governed by GA4 |
| Cloudflare may set `__cf_bm` | External — governed by Cloudflare |
| No first-party tracking cookies | ✅ |

## 7. Verification Checklist

Run before every major release:

- [ ] `securityheaders.com` — Grade A or A+
- [ ] `https://ethaqa.com/` — no CSP violations in console
- [ ] `https://ethaqa.com/publishing/` — no CSP violations
- [ ] Legal pages — all load, no errors
- [ ] Contact form — submits and delivers email
- [ ] HSTS preload status active
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] No mixed content warnings

## 8. Governance

Changes to this policy require:

1. A formal change request (per Design Governance Manual)
2. Impact assessment (which sources are being added/removed)
3. Re-run the verification checklist
4. Version bump (PATCH for additions, MINOR for new directives, MAJOR for policy structure changes)

## 9. Inheritance

This standard is inherited by every future Ethaqa property. Business units:

- May add sources to `script-src`, `style-src`, `img-src`, `connect-src` as needed
- May NOT remove existing directives
- May NOT weaken existing values
- Must document additions in their own ETH-SEC-XXX documents

## 10. Cloudflare Web Analytics Decision

**Status:** Disabled by default.

The corporate site uses Google Analytics 4 (GA4). Adding Cloudflare Web Analytics would require extending the CSP. Unless a specific business need arises, GA4 is the only analytics platform.

**If enabling Cloudflare Web Analytics later, add:**

- To `script-src`: `https://static.cloudflareinsights.com`
- To `connect-src`: `https://cloudflareinsights.com`

This extension is documented here so it's not forgotten.

## 11. Version History

| Version | Date | Change |
|---|---|---|
| 1.0.0 | October 2026 | Initial standard |

## 12. Approval

Signature: ______________________  Date: __________