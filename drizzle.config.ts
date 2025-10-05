import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/database/index.schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env["DATABASE_URL"] ?? ""
  }
});
