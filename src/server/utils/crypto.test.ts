import { describe, it, expect } from "vitest";
import { generateTrackingCode } from "./tracking-code.js";
import { hashPassword, verifyPassword } from "./crypto.js";

describe("Server Utils Unit Tests", () => {
  it("generateTrackingCode nên tạo mã ngẫu nhiên đúng định dạng TAMSU-XXXX", () => {
    const code1 = generateTrackingCode("TAMSU");
    const code2 = generateTrackingCode("TAMSU");

    expect(code1).toMatch(/^TAMSU-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    expect(code2).toMatch(/^TAMSU-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    expect(code1).not.toBe(code2); // Khác nhau ngẫu nhiên
  });

  it("hashPassword và verifyPassword nên mã hóa & xác thực chính xác", async () => {
    const pass = "AdminSecret123!";
    const hashed = await hashPassword(pass);

    expect(hashed).toContain(":");
    expect(await verifyPassword(pass, hashed)).toBe(true);
    expect(await verifyPassword("WrongPassword", hashed)).toBe(false);
  });
});
