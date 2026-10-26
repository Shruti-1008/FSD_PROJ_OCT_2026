# Prescription for Healthcare Management (MERN Stack)

A complete **Full-Stack MERN (MongoDB, Express.js, React, Node.js)** project with **Gemini AI** for digital medical prescription creation, patient dose tracking, and clinical guidance.

---

## 🏗️ MERN Stack Architecture

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **M** (Database) | **MongoDB & Mongoose 9.x** | Document-based data storage for `Prescription` and `User` models with validation and indexing. Includes automatic failover to in-memory store so it runs instantly even before local MongoDB is started. |
| **E** (Backend) | **Express.js 4.21.x** | REST API providing `/api/prescriptions`, `/api/users`, `/api/chat`, and `/api/health` endpoints with CORS and JSON middleware. |
| **R** (Frontend) | **React 19 + Tailwind CSS** | Role-based Doctor & Patient portals, interactive recovery timeline, formal printable prescription slips, and Gemini AI assistant modal. |
| **N** (Runtime) | **Node.js 20/22/24+** | Single-process orchestrator running Express backend and serving Vite frontend on port 3001. |

---

## 🛠️ Complete Technologies & Libraries Stack

A breakdown of every technology, library, framework, and service used in this project:

### 1. 🖥️ Frontend (Client-Side)
- **React 19 (`react`, `react-dom` `^19.0.1`)**: Component-based user interface library with modern hooks (`useState`, `useEffect`, `useMemo`, `useRef`) for reactive state and stateful role switches (Doctor vs. Patient views).
- **TypeScript (`typescript` `^7.0.2`)**: Static type system ensuring strong typing across medical data contracts, dosage specifications, user identities, and API payloads.
- **Vite 8 (`vite` `^8.3.0`, `@vitejs/plugin-react`)**: Blazing-fast development bundler, live module replacement, and production asset optimizer.
- **Tailwind CSS v4 (`tailwindcss` `^4.3.3`, `@tailwindcss/vite`)**: Modern utility-first CSS styling engine powering the clinical UI design, responsive grids, color coding for recovery stages, and custom badge styles.
- **Lucide React (`lucide-react` `^0.546.0`)**: Comprehensive iconography for medical terminology, dosage time-slots (morning, afternoon, night), action buttons, and status alerts.
- **Motion (`motion` `^12.23.24`)**: Lightweight animation library providing fluid transitions for tabs, modals, notifications, and timeline progressions.
- **CSS3 Print Stylesheet Engine (`@media print`)**: Formatted printable prescription layout with clinic letterhead, Rx symbol, physician credentials, signature block, and QR verification stamp.

### 2. ⚙️ Backend (Server-Side)
- **Node.js (v20 / v22 / v24)**: High-throughput asynchronous event-driven JavaScript/TypeScript server runtime.
- **Express.js 4 (`express` `^4.21.2`)**: Robust web framework providing RESTful API routing, JSON body parsing, error handling middleware, and serving static assets in production.
- **TSX (`tsx` `^4.21.0`)**: Modern TypeScript execution engine running TypeScript directly without a manual pre-compilation step.
- **CORS (`cors` `^2.8.6`)**: Cross-Origin Resource Sharing middleware facilitating secure communication between client and server layers.
- **Dotenv (`dotenv` `^17.2.3`)**: Loads environment variables from `.env` files for database URIs, API keys, and port numbers.

### 3. 🗄️ Database & Data Layer
- **MongoDB**: NoSQL document database ideal for storing complex, nested medical records and variable-length medication lists.
- **Mongoose 9 (`mongoose` `^9.10.2`)**: Object Data Modeling (ODM) library for schema declaration, strict type validation, default values, and index management for `Prescription` and `User` collections.
- **Dual-Storage Engine (Auto-Failover / In-Memory Store)**: Intelligent data abstraction layer that automatically detects MongoDB availability:
  - Connects to local or MongoDB Atlas when available.
  - Automatically switches to a synchronized in-memory fallback store if MongoDB is not running, ensuring zero downtime and immediate out-of-the-box evaluation.

### 4. 🧠 Artificial Intelligence (AI)
- **Google GenAI SDK (`@google/genai` `^2.4.0`)**: Official modern TypeScript SDK for Google Gemini models.
- **Gemini 2.5 Flash Model (`gemini-2.5-flash`)**: High-speed, multimodal LLM powering the clinical assistant:
  - Verifies drug-drug interactions and flags potential dosage conflicts.
  - Explains medication regimens, potential side effects, and dietary precautions in clear patient-friendly language.
  - Assists doctors with differential diagnosis suggestions and clinical reference points.

### 5. 📦 Development, Tooling & DevOps
- **Vite Express Integration**: Unified single-port dev architecture where Express mounts Vite dev middlewares on port 3001.
- **Autoprefixer (`autoprefixer` `^10.4.21`)**: PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
- **Cloud Run / Container Deployment Ready**: Dynamic port resolution (`process.env.PORT || 3000`) enabling frictionless cloud container deployment and hosting.

---

## 🚀 How to Run in VS Code

### Step 1: Open Terminal in VS Code
In VS Code, press `` Ctrl + ` `` (Windows) or `` Cmd + ` `` (Mac) to open the integrated terminal.

### Step 2: Install Dependencies
Run:
```bash
npm install
```
*(If your npm version raises peer dependency warnings on older packages, use: `npm install --legacy-peer-deps`)*

### Step 3: (Optional) Configure MongoDB
- If you have MongoDB installed locally, start it:
  ```bash
  mongod
  ```
- Or provide your MongoDB Atlas connection string in a `.env` file:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/prescription_db
  ```
- **Note:** If MongoDB is not running, the application **automatically uses the built-in in-memory fallback store**, meaning the project will run smoothly out-of-the-box without crashing!

### Step 4: Start the Full-Stack Application
```bash
npm run dev
```

Open your browser at:
👉 **http://localhost:3001**

---

## 📡 REST API Endpoints

- `GET /api/prescriptions` - List all prescriptions (supports query filters)
- `POST /api/prescriptions` - Create and store new prescription
- `GET /api/prescriptions/:id` - Get specific prescription details
- `PUT /api/prescriptions/:id` - Update patient recovery progress & notes
- `DELETE /api/prescriptions/:id` - Delete prescription
- `POST /api/chat` - Gemini AI clinical guidance for doctors and patients
- `GET /api/health` - Live MERN stack diagnostic status

---

## 🎓 College Viva & Evaluation Notes

1. **Why MongoDB?** Prescriptions contain variable-length arrays of medications (`dosage`, `frequency`, `duration`, `instructions`), which fit MongoDB's document model without heavy relational joins.
2. **Where is Express?** Defined in `server.ts` and modularized in `server/routes/` and `server/controllers/`.
3. **Where is Node.js?** Powers the entire backend server running on port 3001.
4. **Where is React?** The client-side single page application built with React 19 hooks and Tailwind CSS in `src/`.
