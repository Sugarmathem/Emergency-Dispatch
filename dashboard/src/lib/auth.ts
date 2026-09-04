import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './db';

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'http://127.0.0.1:3000';
const discordRedirectUri = new URL('/api/auth/callback/discord', baseURL).toString();
console.log('[better-auth] Discord callback URL:', discordRedirectUri);
console.log('[better-auth] Discord credentials configured:', {
  clientId: Boolean(process.env.DISCORD_CLIENT_ID),
  clientSecret: Boolean(process.env.DISCORD_CLIENT_SECRET),
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      redirectURI: discordRedirectUri,
    },
  },
});
