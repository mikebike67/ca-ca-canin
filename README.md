# Ca-Ca Canin

This project is a Next.js 14 app prepared for deployment to Cloudflare Workers using `@opennextjs/cloudflare`.

## What was added

- Cloudflare/OpenNext scripts in [`package.json`](/Users/michaelatallah/Desktop/CA-CA CANIN WEBSITE CURSOR/package.json)
- Worker config in [`wrangler.jsonc`](/Users/michaelatallah/Desktop/CA-CA CANIN WEBSITE CURSOR/wrangler.jsonc)
- OpenNext config in [`open-next.config.ts`](/Users/michaelatallah/Desktop/CA-CA CANIN WEBSITE CURSOR/open-next.config.ts)
- A fixed ESM Next config in [`next.config.mjs`](/Users/michaelatallah/Desktop/CA-CA CANIN WEBSITE CURSOR/next.config.mjs)

## Install

```bash
npm install
```

## Cloudflare setup

1. Create a Cloudflare Worker project.
2. Authenticate Wrangler:

```bash
npx wrangler login
```

3. Update the Worker name in [`wrangler.jsonc`](/Users/michaelatallah/Desktop/CA-CA CANIN WEBSITE CURSOR/wrangler.jsonc) if you want something different from `ca-ca-canin`.
4. Add your production secrets:

```bash
npx wrangler secret put SMTP_HOST
npx wrangler secret put SMTP_PORT
npx wrangler secret put SMTP_USER
npx wrangler secret put SMTP_PASS
npx wrangler secret put SMTP_FROM
npx wrangler secret put ADMIN_EMAIL
```

If you still use `SMTP_TO` instead of `ADMIN_EMAIL`, add that too.

## Local preview with the Worker runtime

Create a local `.dev.vars` file:

```bash
NEXTJS_ENV=development
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=your-from-address
ADMIN_EMAIL=your-admin-address
```

Then run:

```bash
npm run preview
```

This builds the app with OpenNext and serves it in the Workers runtime, which is closer to production than `next dev`.

## Deploy

```bash
npm run deploy
```

## Notes

- The booking API route uses `nodemailer` and environment variables from `process.env`. The Worker is configured with `nodejs_compat` so this can run on Cloudflare, but the SMTP flow should be tested in preview before production deploy.
- [`vercel.json`](/Users/michaelatallah/Desktop/CA-CA CANIN WEBSITE CURSOR/vercel.json) can remain in the repo, but it is not used by Cloudflare.
