# Verification scope

## Frontend redesign checks

The landing and inventory were checked in the browser at 360, 390, 768, 1024 and 1440 CSS pixels. At every width, the document scroll width equaled its client width; wide data tables scroll within their own container. The workspace sidebar folds away on smaller screens. These are browser viewport tests, not tests on physical phones.

Verified the mobile menu, overview shortcuts, inventory modal name, interactive workflow links, EUR/USD display switch, FAQ expansion, EN/IT/ES headings and sample download targets. Reviewed the refreshed mobile screenshots and replaced the visual tour with current product captures. No browser console errors were observed during the final local evidence screen check.

Strict TypeScript checking, the production build, all four public tests, dependency audit and the public/private boundary check passed. This change does not modify the private application's server logic or sample document bytes. Lighthouse and axe scores were not measured in this revision; no score or full WCAG conformance is claimed.

## Existing sample and data checks

- TypeScript strict checking.
- Production Next.js static export.
- Seed counts, unique tool IDs, risk summary and CSV input bounds.
- Public/private source boundary scan.
- Browser checks: landing, inventory creation/search, sample quiz correction and acknowledgment, language selection and evidence links.
- Visual inspection of all four sample PDF pages and the generic sample certificate.
- SHA-256 hashes recalculated after generating sample documents.

The canonical DOCX renderer could not run because the bundled LibreOffice executable was absent. DOCX structure can be inspected and opened in Word; a target Word/LibreOffice pagination check remains a release requirement if that native review cannot be completed in the authoring environment. The public DOCX is a sample, not a signed certificate.

The showcase does not test or prove production legal compliance, employee training, provider integrations or the private application's authorization. Its role selector is a visual preview; there is no real user account in the demo.
