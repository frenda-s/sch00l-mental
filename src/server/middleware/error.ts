import type { ErrorHandler } from "hono";
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error(`[API Error] ${c.req.method} ${c.req.url}:`, err.message);

  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Dữ liệu không hợp lệ: ${formatted}`,
        },
      },
      400
    );
  }

  const isProduction = c.env?.APP_ENV === "production";

  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: isProduction
          ? "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau."
          : err.message || "Lỗi không xác định",
      },
    },
    500
  );
};
