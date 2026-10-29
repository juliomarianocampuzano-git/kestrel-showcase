# Verification scope

- TypeScript strict checking.
- Production Next.js static export.
- Seed counts, unique tool IDs, risk summary and CSV input bounds.
- Public/private source boundary scan.
- Browser checks: landing, inventory creation/search, sample quiz correction and acknowledgment, language selection and evidence links.
- Visual inspection of all four sample PDF pages and the generic sample certificate.
- SHA-256 hashes recalculated after generating sample documents.

The canonical DOCX renderer could not run because the bundled LibreOffice executable was absent. DOCX structure can be inspected and opened in Word; a target Word/LibreOffice pagination check remains a release requirement if that native review cannot be completed in the authoring environment. The public DOCX is a sample, not a signed certificate.

The showcase does not test or prove production legal compliance, employee training, provider integrations or the private application's authorization. Its role selector is a visual preview; there is no real user account in the demo.
