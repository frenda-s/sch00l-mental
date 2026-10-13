import { app } from "./app.js";
import type { ServerEnv } from "./db/client.js";

// Cloudflare Workers Entry (Production / wrangler dev)
export default {
  async fetch(request: Request, env: ServerEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Đường dẫn /api -> Hono xử lý
    if (url.pathname.startsWith("/api")) {
      return app.fetch(request, env, ctx);
    }

    // Static assets / SPA fallback qua ASSETS binding
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Local dev không có ASSETS binding
    return new Response("Not Found", { status: 404 });
  },
};
