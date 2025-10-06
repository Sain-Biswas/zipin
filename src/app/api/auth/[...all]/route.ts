import "server-only";

import { auth } from "~/server/authentication/server.auth";

import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
