import { serve } from "@hono/node-server";
import { app } from "./app.js";

// Local development server (Node) - dùng file:local.db, không cần Turso token.
// Chạy: npm run dev:api
const port = Number(process.env.PORT) || 8787;

serve(
  {
    fetch: (request, env) => app.fetch(request, env as never),
    port,
  },
  (info) => {
    console.log(`✅ API local đang chạy tại http://localhost:${info.port}`);
  }
);
