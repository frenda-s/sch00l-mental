/**
 * Sinh mã tracking ngẫu nhiên chuẩn an toàn crypto.
 * Format: TAMSU-XXXX (VD: TAMSU-A7K9)
 * KHÔNG sử dụng Math.random()
 */
export function generateTrackingCode(prefix: string = "TAMSU"): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // loại bỏ ký tự dễ nhầm (0, O, 1, I)
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  
  let result = "";
  for (let i = 0; i < array.length; i++) {
    const index = array[i] % chars.length;
    result += chars[index];
  }

  return `${prefix}-${result}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}
