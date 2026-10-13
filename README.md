# HỆ THỐNG WEBSITE HỖ TRỢ SÀNG LỌC VÀ TƯ VẤN TÂM LÝ HỌC ĐƯỜNG THPT

> **Dự án Nghiên cứu Khoa học Kỹ thuật (KHKT) cấp THPT**
>
> **LƯU Ý Y TẾ QUAN TRỌNG:** Đây là hệ thống hỗ trợ nghiên cứu khoa học kỹ thuật và hỗ trợ sàng lọc ban đầu. **TUYỆT ĐỐI KHÔNG** tuyên bố hệ thống có khả năng chẩn đoán bệnh tâm lý hoặc thay thế bác sĩ/chuyên gia tâm lý. Kết quả chỉ phản ánh chỉ báo mức độ biểu hiện và gợi ý hướng chăm sóc phù hợp.

---

## 1. MỤC TIÊU & TÍNH NĂNG CHÍNH

1. **Sàng lọc tâm lý 8 nhóm chủ đề:** Stress, Trầm cảm, Lo âu, Tập trung, Tăng động, Xã hội, Học tập, Định hướng tương lai.
2. **Sử dụng ẩn danh hoàn toàn:** Không yêu cầu đăng nhập đối với học sinh.
3. **Smart Alert:** Cảnh báo nguy cơ cao (High Risk) với thông điệp bình tĩnh, gợi ý Tổng đài 111 hoặc kết nối phòng tư vấn.
4. **Gửi thư tâm sự ẩn danh:** Nhận mã tra cứu ngẫu nhiên an toàn `TAMSU-XXXX`.
5. **Tra cứu phản hồi:** Tra cứu câu trả lời của thầy cô tư vấn bằng mã mà không lộ danh tính/PII.
6. **Đặt lịch tư vấn:** Đăng ký khung giờ gặp trực tiếp hoặc trực tuyến.
7. **Dashboard Counselor/Admin:** Quản lý ca nguy cơ, trả lời thư, duyệt lịch hẹn.

---

## 2. TECH STACK

- **Frontend:** Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Vue Router 4, Pinia, Tailwind CSS, Lucide Icons.
- **Backend:** Hono framework, TypeScript, Cloudflare Workers, Edge Runtime compatible.
- **Database:** Turso (libSQL / SQLite), Drizzle ORM.
- **Security:** Web Crypto API (HMAC SHA-256 session cookie, PBKDF2 password hashing), Zod validation.

---

## 3. CẤU HÌNH & CHẠY LOCAL DEVELOPMENT

### 3.1. Yêu cầu hệ thống
- **Node.js:** v18.0.0 trở lên (Đã test thành công trên Node v26).
- **Package Manager:** `npm` hoặc `pnpm`.

### 3.2. Cài đặt Dependencies
```bash
npm install
```

### 3.3. Cấu hình Turso Database

1. Cài đặt Turso CLI và đăng nhập:
```bash
turso auth login
```

2. Tạo Database mới trên Turso:
```bash
turso db create school-mental-health
```

3. Lấy Database URL:
```bash
turso db show school-mental-health
```
*(Kết quả có dạng: `libsql://school-mental-health-[user].aws-[region].turso.io`)*

4. Sinh Auth Token cho Database:
```bash
turso db tokens create school-mental-health
```

5. Cấu hình file `.dev.vars` (dùng cho local development):
Tạo file `.dev.vars` dựa trên `.dev.vars.example`:
```ini
TURSO_DATABASE_URL=libsql://school-mental-health-youruser.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=ey...your-turso-token
SESSION_SECRET=chieu-dap-bo-mat-session-it-nhat-32-ky-tu-crypto
APP_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3.4. Khởi tạo Database & Seed dữ liệu demo

Tạo bảng trong SQLite / Turso và chèn dữ liệu mẫu:
```bash
npm run db:migrate
npm run db:seed
```

### 3.5. Chạy Local Development

**Cách 1 (Khuyến nghị, không cần Turso token): Chạy Backend bằng Node + `file:local.db`**

Chạy Backend API (dùng SQLite local, không cần đăng ký Turso):
```bash
npm run dev:api
```

Chạy Frontend (Vite Dev Server) ở terminal khác:
```bash
npm run dev
```
Truy cập: `http://localhost:5173` (Vite đã cấu hình proxy `/api` → `http://localhost:8787`)

**Cách 2 (Đúng kiến trúc production): Chạy bằng Wrangler + Turso thật**

Backend chạy bằng Cloudflare Workers runtime (miniflare) cần Turso token thật trong `.dev.vars`:
```bash
npm run worker:dev
```
Lưu ý: `wrangler dev` KHÔNG hỗ trợ `file:` URL (libSQL web client chỉ hỗ trợ `libsql://` hoặc `https://`). Vì vậy phải có `TURSO_DATABASE_URL` và `TURSO_AUTH_TOKEN` thật trong `.dev.vars`.

---

## 4. TÀI KHOẢN DEMO

- **Ban Tư Vấn (Counselor):**
  - Username: `counselor_demo`
  - Password: `123456`
- **Quản Trị Viên (Admin):**
  - Username: `admin_demo`
  - Password: `admin123`

---

## 5. HƯỚNG DẪN DEPLOY LÊN CLOUDFLARE WORKERS

1. Đăng nhập Cloudflare bằng Wrangler:
```bash
npx wrangler login
```

2. Cấu hình Secret trên Cloudflare Workers:
```bash
npx wrangler secret put TURSO_DATABASE_URL
npx wrangler secret put TURSO_AUTH_TOKEN
npx wrangler secret put SESSION_SECRET
```

3. Build & Deploy:
```bash
npm run deploy
```

---

## 6. DANH SÁCH KIỂM TRA MÃ NGUỒN (TESTING)

Chạy bộ kiểm thử tự động (Unit Tests) cho Thuật toán Sàng lọc, Phân loại Severity, Red Flag và Mã mã hóa:
```bash
npm run test
```

---

## 7. BẢO MẬT & QUYỀN RIÊNG TƯ (PRIVACY)

- Thu thập dữ liệu tối thiểu.
- Không lưu IP, không theo dõi định danh học sinh.
- Mọi dữ liệu nhạy cảm được bảo vệ bằng Zod schema validation & Drizzle ORM prepared statements (chống SQL injection).
- Không expose Turso Token hoặc Session Secret ở Frontend.
