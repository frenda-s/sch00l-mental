import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

export interface ServerEnv {
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
  SESSION_SECRET?: string;
  APP_ENV?: string;
  CORS_ORIGIN?: string;
  ASSETS?: Fetcher;
}

const isNode = typeof process !== "undefined" && !!process.versions?.node;

type StringEnvKey =
  | "TURSO_DATABASE_URL"
  | "TURSO_AUTH_TOKEN"
  | "SESSION_SECRET"
  | "APP_ENV"
  | "CORS_ORIGIN";

function getEnvVar(env: ServerEnv | undefined, key: StringEnvKey): string | undefined {
  if (env?.[key]) return env[key] as string;
  if (isNode && process.env) {
    // Mapping keys
    if (key === "TURSO_DATABASE_URL") return process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    if (key === "TURSO_AUTH_TOKEN") return process.env.TURSO_AUTH_TOKEN;
    if (key === "SESSION_SECRET") return process.env.SESSION_SECRET;
    if (key === "APP_ENV") return process.env.APP_ENV;
    if (key === "CORS_ORIGIN") return process.env.CORS_ORIGIN;
  }
  return undefined;
}

export function createDbClient(env?: ServerEnv): {
  client: Client;
  db: LibSQLDatabase<typeof schema>;
} {
  const url = getEnvVar(env, "TURSO_DATABASE_URL") || "file:local.db";
  const authToken = getEnvVar(env, "TURSO_AUTH_TOKEN");

  const client = createClient({
    url,
    authToken,
  });

  const db = drizzle(client, { schema });

  return { client, db };
}
