# NEXUS HRMS — Hệ Thống Quản Trị Nhân Sự Doanh Nghiệp (Fullstack Monorepo)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%20%2F%2016-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-black.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac.svg)](https://tailwindcss.com/)

**NEXUS HRMS** (FwB HRMS) là giải pháp quản trị nhân sự toàn diện dành cho doanh nghiệp, được cấu trúc theo mô hình **Monorepo** tích hợp chặt chẽ giữa **Frontend (React 18 + Vite)**, **Backend (Node.js + Express RESTful API)** và cơ sở dữ liệu quan hệ **PostgreSQL**.

---

## 📑 Mục lục
1. [Kiến trúc Monorepo](#1-kiến-trúc-monorepo)
2. [Yêu cầu môi trường](#2-yêu-cầu-môi-trường)
3. [Cài đặt nhanh (Quick Start 1 Lệnh)](#3-cài-đặt-nhanh-quick-start-1-lệnh)
4. [Khởi tạo Cơ sở Dữ liệu & Biến Môi trường](#4-khởi-tạo-cơ-sở-dữ-liệu--biến-môi-trường)
5. [Khởi chạy Hệ thống](#5-khởi-chạy-hệ-thống)
6. [Bộ công cụ Kiểm thử Tự động (Automation Scripts)](#6-bộ-công-cụ-kiểm-thử-tự-động-automation-scripts)
7. [Danh mục Tài khoản Demo Kiểm thử](#7-danh-mục-tài-khoản-demo-kiểm-thử)
8. [Danh mục API Endpoints](#8-danh-mục-api-endpoints)
9. [Tài liệu Tham khảo Liên quan](#9-tài-liệu-tham-khảo-liên-quan)

---

## 1. Kiến trúc Monorepo

Dự án quy tụ toàn bộ mã nguồn Frontend, Backend và Database Schema trong một repository duy nhất:

```
QLDACNTT_THUC_HIEN_LAM_TEST/
├── package.json                         # Monorepo root config & orchestration scripts
├── README.md                            # Tài liệu hướng dẫn fullstack tổng quan
├── HUONG_DAN_KIEN_TRUC_VA_DAC_TA_HE_THONG_HRMS.md # Đặc tả hệ thống chi tiết
├── database/
│   └── schema.sql                       # 20 bảng PostgreSQL, triggers & dữ liệu mẫu seed
├── Backend/                             # RESTful API Service (Express.js)
│   ├── package.json                     # Backend dependencies & scripts
│   ├── server.js                        # Điểm khởi chạy API server (Port 8000)
│   ├── db.js                            # PostgreSQL connection pool (pg)
│   ├── .env.example                     # Mẫu cấu hình môi trường Backend
│   ├── .env                             # Cấu hình môi trường thực tế (chứa DB credentials)
│   ├── middleware/                      # Middleware xác thực JWT và phân quyền RBAC
│   │   └── auth.js
│   ├── routes/                          # Các RESTful API routes
│   │   ├── auth.js                      # Đăng nhập, thông tin user, đổi mật khẩu
│   │   ├── employees.js                 # Quản lý hồ sơ nhân viên
│   │   ├── departments.js               # Quản lý cơ cấu phòng ban
│   │   ├── attendance.js                # Chấm công, check-in, check-out
│   │   ├── leaves.js                    # Quản lý nghỉ phép, phê duyệt 2 cấp
│   │   ├── payroll.js                   # Tính toán bảng lương, phiếu lương
│   │   ├── projects.js                  # Dự án, công việc (Kanban), Squads
│   │   └── dashboard.js                 # Chỉ số KPIs, thông báo hệ thống
│   └── scripts/                         # Automation & Health Check Scripts
│       ├── test-db.js                   # Kiểm tra kết nối và đối chiếu 20 bảng DB
│       └── smoke-test.js                # Kiểm thử toàn diện chuỗi API endpoints
└── FrontEnd/                            # Giao diện người dùng (React 18 + Vite)
    ├── package.json                     # Frontend dependencies & scripts
    ├── vite.config.js                   # Cấu hình Vite (Port 3000, alias @)
    ├── .env                             # VITE_API_URL=http://localhost:8000/api
    └── src/
        ├── App.jsx                      # Root Router & Shell layout
        ├── context/                     # Context quản lý Auth, Notifications, v.v.
        │   └── AuthContext.jsx
        ├── services/                    # Tầng giao tiếp Backend API
        │   ├── api.js                   # Fetch wrapper, tự động gắn Bearer JWT
        │   ├── authService.js           # API đăng nhập & xác thực
        │   ├── employeeService.js       # API nhân viên
        │   ├── attendanceService.js     # API chấm công
        │   ├── leaveService.js          # API nghỉ phép
        │   ├── payrollService.js        # API tiền lương
        │   ├── projectService.js        # API dự án & Kanban
        │   └── dashboardService.js      # API thống kê KPIs
        ├── pages/                       # Các trang tính năng chính
        └── components/                  # UI components tái sử dụng
```

---

## 2. Yêu cầu môi trường

Để chạy trơn tru toàn bộ hệ thống, máy trạm cần cài đặt:
- **Node.js**: Phiên bản `18.x` trở lên (Khuyến nghị `v20.x LTS`).
- **npm**: Phiên bản `9.x` hoặc `10.x`.
- **PostgreSQL**: Phiên bản `14.x` hoặc `16.x` (đang lắng nghe tại cổng `5432`).
- **Hệ điều hành**: Windows 10/11, macOS, hoặc Linux.

---

## 3. Cài đặt nhanh (Quick Start 1 Lệnh)

Tại thư mục gốc `QLDACNTT_THUC_HIEN_LAM_TEST`, cài đặt toàn bộ dependencies cho cả root, Backend và Frontend chỉ với một câu lệnh:

```bash
npm run install:all
```

*Lệnh trên tương đương với: `npm install && npm install --prefix Backend && npm install --prefix FrontEnd`.*

---

## 4. Khởi tạo Cơ sở Dữ liệu & Biến Môi trường

### Bước 4.1: Tạo Database PostgreSQL và nạp Schema
Mở PostgreSQL CLI (`psql`) hoặc pgAdmin:

```sql
-- 1. Tạo cơ sở dữ liệu
CREATE DATABASE nexus_hrms;
```

Sau đó import file schema và dữ liệu mẫu:
- **Trên Windows (cmd/powershell):**
  ```bash
  psql -U postgres -d nexus_hrms -f database/schema.sql
  ```
- **Hoặc qua pgAdmin**: Mở database `nexus_hrms` -> Mở công cụ `Query Tool` -> Đọc nội dung `database/schema.sql` -> Nhấn **Execute (F5)**.

*File `database/schema.sql` đã bao gồm cấu trúc 20 bảng chuẩn, ràng buộc khóa ngoại, triggers tính toán và tập dữ liệu mẫu ban đầu.*

### Bước 4.2: Cấu hình biến môi trường Backend (`Backend/.env`)
Tạo file `Backend/.env` dựa trên `Backend/.env.example`:

```env
# Server
PORT=8000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=nexus_hrms
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Authentication
JWT_SECRET=nexus_hrms_jwt_secret_key_2026_fwb
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:3000
```

### Bước 4.3: Cấu hình biến môi trường Frontend (`FrontEnd/.env`)
File `FrontEnd/.env` đã được thiết lập mặc định để kết nối đến Backend:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 5. Khởi chạy Hệ thống

### Cách 1: Khởi chạy Fullstack 1 lệnh duy nhất (Khuyến nghị)
Sử dụng công cụ `concurrently` để chạy song song Backend API và Frontend Dev Server:

```bash
npm run dev
```

Hệ thống sẽ đồng thời kích hoạt:
- 📡 **Backend API**: `http://localhost:8000` (Health Check: `http://localhost:8000/api/health`)
- 💻 **Frontend Web App**: `http://localhost:3000`

### Cách 2: Khởi chạy độc lập từng dịch vụ
Nếu cần debug hoặc kiểm thử độc lập:
- **Chỉ chạy Backend**:
  ```bash
  npm run dev:backend
  ```
- **Chỉ chạy Frontend**:
  ```bash
  npm run dev:frontend
  ```
- **Build Frontend cho Production**:
  ```bash
  npm run build:frontend
  ```

---

## 6. Bộ công cụ Kiểm thử Tự động (Automation Scripts)

Dự án cung cấp sẵn hai bộ công cụ kiểm thử tích hợp tại root:

### 1. Kiểm tra kết nối & đối chiếu Schema Database (`npm run db:test`)
```bash
npm run db:test
```
- **Mục đích**: Kiểm tra tức thời kết nối PostgreSQL, đo độ trễ kết nối, đọc trực tiếp file `database/schema.sql` và xác thực sự hiện diện của toàn bộ **20 bảng chuẩn** cùng các views nghiệp vụ.
- **Tiêu chí đạt**: 20/20 bảng đã sẵn sàng (100%).

### 2. Kiểm thử luồng API Smoke Test (`npm run test:smoke`)
*Lưu ý: Cần khởi chạy backend (`npm run dev` hoặc `npm run dev:backend`) trước khi chạy test.*

```bash
npm run test:smoke
```
- **Chuỗi kiểm thử tự động gồm 5 bước**:
  1. `GET /api/health`: Kiểm tra sức khỏe hệ thống và kết nối DB thời gian thực.
  2. `GET /api`: Kiểm tra danh mục định tuyến API.
  3. `POST /api/auth/login`: Xác thực tài khoản kiểm thử và lấy JWT token.
  4. `GET /api/auth/me`: Kiểm tra xác thực Bearer token và lấy hồ sơ người dùng đăng nhập.
  5. `GET /api/employees`: Kiểm tra quyền truy cập và dữ liệu danh bạ nhân sự.

### 3. Backend tests, migrations and API docs

```bash
npm run test:unit --prefix Backend   # unit tests (no database)
npm test --prefix Backend            # recreates nexus_hrms_test from database/schema.sql + migrations, then runs all tests
npm run migrate --prefix Backend     # applies pending SQL files from Backend/migrations to the DB in Backend/.env
```

Schema changes go in `Backend/migrations/NNN_description.sql`; never edit `database/schema.sql` for new changes.

API reference for the frontend: `Backend/docs/openapi.yaml` (OpenAPI 3). Sessions use a short-lived `accessToken` plus a single-use `refreshToken` (`POST /api/auth/refresh`); `POST /api/auth/login` still returns the legacy `token` field. Set `JWT_EXPIRES_IN=30m` in `Backend/.env` once the frontend refreshes tokens; set `TRUST_PROXY=1` when running behind a reverse proxy.

---

## 7. Danh mục Tài khoản Demo Kiểm thử

Hệ thống được thiết kế sẵn các nhóm tài khoản theo phân quyền đa cấp (RBAC):

| Vai trò | Chức danh | Email | Mật khẩu (Database Seed) | Mật khẩu (Brief/Alt) |
| :--- | :--- | :--- | :--- | :--- |
| **CEO** | Tổng Giám Đốc | `ceo@fwbnexus.vn` | `Ceo@123456` | `password123` |
| **HR Director** | Giám Đốc Nhân Sự | `hrd@fwbnexus.vn` | `Hrd@123456` | `password123` |
| **Line Manager** | Trưởng Phòng KT | `lead@fwbnexus.vn` | `Lead@12345` | `password123` |
| **Employee** | Kỹ Sư Phần Mềm | `employee@fwbnexus.vn` | `Emp@123456` | `password123` |

> 💡 **Tính năng Đăng nhập 1-Chạm (Quick Login):**  
> Trên giao diện màn hình đăng nhập (`http://localhost:3000`), hệ thống hỗ trợ các nút chuyển đổi tài khoản mẫu nhanh. Người dùng chỉ cần nhấp chọn vai trò tương ứng để trải nghiệm hệ thống ngay lập tức mà không cần nhập thông tin thủ công.

---

## 8. Danh mục API Endpoints

Base URL: `http://localhost:8000/api`. Tài liệu đầy đủ (request, response, mã lỗi, quyền) nằm ở **[`Backend/docs/openapi.yaml`](Backend/docs/openapi.yaml)** (OpenAPI 3); bảng thay đổi ảnh hưởng frontend nằm ở **[`docs/API_CHANGES.md`](docs/API_CHANGES.md)**. `GET /api` trả danh mục endpoint dạng JSON.

| Nhóm | Đường dẫn | Nội dung chính |
| :--- | :--- | :--- |
| Xác thực | `/api/auth` | login, refresh token xoay vòng, logout, me, đổi mật khẩu |
| Tài khoản | `/api/users` | tạo tài khoản, đổi vai trò, khóa/mở khóa, cấp mật khẩu tạm |
| Nhân sự | `/api/employees`, `/api/contracts` | hồ sơ, onboarding, nghỉ việc, nhập hàng loạt, hợp đồng |
| Cơ cấu | `/api/departments`, `/api/positions` | phòng ban, chức danh |
| Chấm công | `/api/attendance` | check-in/out, **QR kiosk**, bảng công tháng, đi muộn/vắng, điều chỉnh |
| Phép, OT, y tế | `/api/leaves`, `/api/ot-requests`, `/api/medical-claims` | chuỗi duyệt NV → Trưởng phòng → HRD (QL/HRD → CEO) |
| Lương | `/api/payroll` | tính lương, chốt, chuyển khoản, bất thường, phiếu lương |
| Dự án | `/api/projects`, `/api/tasks`, `/api/squads` | Kanban có nghiệm thu, nhóm và chat nhóm |
| Thông báo | `/api/notifications`, `/api/notices`, `/api/handbook` | thông báo cá nhân/vai trò, thông báo nội bộ, cẩm nang |
| Phân tích | `/api/analytics` | đánh giá năng lực, 9-box, rủi ro nghỉ việc, PIP |
| Hệ thống | `/api/dashboard`, `/api/audit-logs`, `/api/health` | KPI theo phạm vi, nhật ký hệ thống |

**Quy ước chung:** thành công `{ success: true, data, pagination? }`; lỗi `{ success: false, code, message, details? }`. Gửi `Authorization: Bearer <accessToken>`. Danh sách có `?page&limit` (giới hạn được kẹp về mức tối đa). Trường ngày (`DATE`) trả về chuỗi `YYYY-MM-DD`.

---

## 9. Tài liệu Tham khảo Liên quan

- 📘 **Tài liệu Kiến trúc & Đặc tả Nghiệp vụ Toàn diện**:  
  [HUONG_DAN_KIEN_TRUC_VA_DAC_TA_HE_THONG_HRMS.md](HUONG_DAN_KIEN_TRUC_VA_DAC_TA_HE_THONG_HRMS.md)
- 🗄️ **Cơ sở Dữ liệu Schema & Seed Script (PostgreSQL)**:  
  [database/schema.sql](database/schema.sql)
- 🔍 **Script Kiểm thử CSDL**:  
  [Backend/scripts/test-db.js](Backend/scripts/test-db.js)
- 🧪 **Script Kiểm thử API Smoke Test**:  
  [Backend/scripts/smoke-test.js](Backend/scripts/smoke-test.js)

---
*© 2026 NEXUS HRMS Project — QLDACNTT Enterprise Software Implementation.*