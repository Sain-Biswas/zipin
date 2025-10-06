import "server-only";

import { env } from "~/env";
import { database } from "~/server/database/index.database";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { haveIBeenPwned, openAPI, username } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Zip In",
  secret: env.BETTER_AUTH_SECRET,
  baseURL: `${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_PROTOCOL}${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
  database: drizzleAdapter(database, {
    provider: "pg"
  }),
  emailAndPassword: {
    enabled: true
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },
  plugins: [
    nextCookies(),
    openAPI({
      theme: "bluePlanet",
      disableDefaultReference: env.NODE_ENV === "production"
    }),
    username({
      maxUsernameLength: 120,
      usernameValidator: (username) => {
        if (username === "admin") {
          return false;
        }
        return true;
      }
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "Provided password is found in compromised password database."
    })
  ]
});
