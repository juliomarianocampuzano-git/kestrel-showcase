# Cloudflare deployment

## Pages

1. Use a dedicated public repository with no production credentials.
2. Install Node.js 24 and run `npm ci`.
3. Run `npm run typecheck`, `npm test`, `npm run check:boundary`, then `npm run build`.
4. Create the Cloudflare Pages project `kestrel-showcase` with production branch `main`. With recent Wrangler versions, use `npx wrangler pages project create kestrel-showcase --production-branch main --force` for the first creation to retain Pages hosting rather than migrating to Workers. Do not use the creation flag on an existing project.
5. Deploy `out/` using `npx wrangler pages deploy out --project-name kestrel-showcase` or configure the Pages Git integration with build command `npm run build` and output `out`.

The `_headers` file sets a static CSP and other browser security headers. There are no analytics, contact forms, live billing or production API requests. Cloudflare may still process operational access logs; describe this separately if adding a production privacy notice.

## Optional mock Worker

```sh
npx wrangler deploy --config worker/wrangler.toml
```

`GET /api/demo/summary` returns Northwind Studio sample counts. `GET /api/demo/workspace` serves its fictional inventory and employee fixtures. The binding limits requests by client IP to 30 per minute. Cloudflare's rate-limiting binding uses regional counters and should not be treated as a globally exact billing quota. No IP address is written to an application database. Other paths return 404 and mutations return 405.

The UI consumes this public mock Worker and falls back to bundled fixtures if unavailable or rate-limited. Set NEXT_PUBLIC_DEMO_API_URL and update the CSP connect-src if deploying the Worker under a different account. Do not point it at the private API.

## Rollback

Use Pages deployment history to promote the last known good deployment. For the Worker, use its deployment history. No schema migration is involved in this static showcase.

## Media regeneration

Screenshots in `docs/screenshots/` represent the static production build. `public/media/kestrel-tour.mp4` is a short screenshot tour. The samples are regenerated independently with `scripts/generate-samples.py`; commit their new hashes whenever their bytes change.
