# Pulse Response Dashboard

Next.js dashboard for the Pulse Response Discord operations system.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
## Local development

Create `.env.local` with the variables listed below, then run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

Set these in Vercel Project Settings > Environment Variables. Keep the values server-side and do not commit `.env.local`.

| Variable | Value |
| --- | --- |
| `BETTER_AUTH_SECRET` | A long random secret used to sign auth data |
| `BETTER_AUTH_URL` | The deployed Vercel URL, for example `https://your-project.vercel.app` |
| `NEXTAUTH_URL` | The same value as `BETTER_AUTH_URL` |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_CLIENT_SECRET` | Discord application client secret |
| `DATABASE_URL` | Neon direct PostgreSQL connection string, not the pooled connection string |

In the Discord Developer Portal, add this exact redirect URI after deployment:

`https://your-project.vercel.app/api/auth/callback/discord`

Replace `your-project` with the deployed Vercel project hostname.

## Vercel deployment

1. Import the repository into Vercel.
2. Set the project root directory to `dashboard`.
3. Use the default Next.js framework preset and build settings.
4. Add the six environment variables above for Production, Preview, and Development as appropriate.
5. Deploy the project.
6. Copy the production Vercel URL into `BETTER_AUTH_URL` and `NEXTAUTH_URL`, then redeploy.
7. Add the production callback URI to Discord and test sign-in.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
