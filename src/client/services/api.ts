import type { ApiResponse } from "../types/index.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // Tự động gửi HttpOnly cookie
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      return {
        success: false,
        error: {
          code: res.status === 502 || res.status === 504 ? "GATEWAY_ERROR" : `HTTP_${res.status}`,
          message:
            res.status === 502 || res.status === 504
              ? "Máy chủ backend chưa được khởi động (cổng 8787)."
              : text || `Máy chủ phản hồi trạng thái ${res.status}`,
        },
      };
    }

    const json = (await res.json()) as ApiResponse<T>;
    if (!res.ok && json.success) {
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message: json.error?.message || "Yêu cầu thất bại",
        },
      };
    }
    return json;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err.message || "Không thể kết nối đến máy chủ",
      },
    };
  }
}
