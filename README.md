<!-- FILE: README.md | STATUS: UPDATED - existing file, replace its whole content with this -->

# Addis MESOB – Gate Asset Control System

**Addis Ketema Branch** · MERN stack (MongoDB, Express, React, Node.js) · **English + አማርኛ (Amharic)**

Replaces the paper register at the gate. Security officers record every laptop, tablet or other asset that leaves
or returns to the building. Nothing is ever erased – a return _closes_ the record instead of deleting it.

## How it works at the gate

| Moment                                  | What the security officer does                                                        | What the system does                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Evening – employee leaves with a laptop | **Gate Desk → Check-out**: scan/type the serial number, type the employee ID, confirm | Creates a log, marks the asset as _Outside_                        |
| Morning – employee returns              | **Gate Desk → Return**: scan/type the serial number, confirm                          | Closes the log (time + officer saved), asset is _In office_        |
| Any time                                | **Currently Outside** page                                                            | Live replacement for the paper list; items outside > 24 h turn red |

Admins additionally manage employees, assets and system users, and can export the full history to CSV (Excel).

## Roles

- **security** – Dashboard, Gate Desk, Currently Outside, History
- **admin** – everything above + Employees, Assets, System Users

## Languages (English / አማርኛ)

Every screen, button, message, validation error, date and the CSV export are available in both languages.

- **Switching:** the **English | አማርኛ** switch is on the login page, at the bottom of the sidebar, and in the top bar on phones.
  The choice is remembered in the browser. The first-time default is set by `DEFAULT_LANG` in `frontend/src/constants.js`
  (`'en'` or `'am'`).
- **Server messages:** the web app sends the chosen language in the `Accept-Language` header, so errors such as
  "Invalid username or password" and the CSV headers come back in the same language.
- **Data is not translated:** names, departments, serial numbers, brands and notes are shown exactly as typed.
  Asset _types_ (Laptop, Tablet…) are stored in English and displayed translated.
- **Dates:** Gregorian calendar with Amharic month and day names, 24-hour time, Addis Ababa time zone.
  (Date pickers and the CSV use the Gregorian calendar, so everything stays consistent.)
- **Fonts:** Amharic uses the fonts already on the device (Nyala / Ebrima on Windows, Noto Sans Ethiopic on Android).
  No internet access is needed.

### Editing a translation or adding a new text

| Where                                    | File                                                    |
| ---------------------------------------- | ------------------------------------------------------- |
| Screens & buttons (frontend)             | `frontend/src/i18n/en.js` and `frontend/src/i18n/am.js` |
| Server messages, validation, CSV headers | `backend/src/i18n/messages.en.js` and `messages.am.js`  |

1. Add the same key to **both** files. `{name}`-style placeholders must be identical in both languages.
2. In React use `const { t } = useI18n();` and then `t('your.key', { name })`.
   Sentences that contain bold text or code use `rich('your.key', { name: <b>{x}</b> })`.
3. Run the completeness check – it fails if a key is missing in one language, a placeholder differs,
   or the code uses a key that does not exist:
   ```bash
   npm run i18n:check      # from the project root; checks frontend and backend
   ```

## Project structure

```
addis-mesob-gate/
├── package.json                 # root helper scripts
├── backend/
│   ├── server.js                # starts DB + HTTP server
│   ├── .env.example             # copy to .env
│   ├── scripts/check-i18n.js    # translation completeness check
│   └── src/
│       ├── app.js               # express app, security middleware, routes, SPA serving in production
│       ├── constants.js
│       ├── config/              # env.js, db.js
│       ├── i18n/                # index.js (translate), messages.en.js, messages.am.js
│       ├── models/              # User, Employee, Asset, GateLog
│       ├── controllers/         # auth, user, employee, asset, gate, dashboard
│       ├── routes/              # one router per resource + index.js
│       ├── middleware/          # auth (JWT + roles), language, validate (zod), errorHandler, notFound
│       ├── validators/schemas.js
│       ├── utils/               # ApiError, asyncHandler, helpers (pagination, dates)
│       └── seed/seed.js         # first admin/security accounts + sample data
└── frontend/
    ├── index.html, vite.config.js
    ├── scripts/check-i18n.mjs   # translation completeness check
    └── src/
        ├── main.jsx, App.jsx, constants.js
        ├── i18n/                # en.js, am.js, index.js (translate), LanguageContext.jsx (useI18n)
        ├── api/client.js        # axios instance (sends Accept-Language) + error helpers
        ├── context/AuthContext.jsx
        ├── hooks/               # useDebounce, usePagedQuery
        ├── utils/format.js      # language-aware dates and durations
        ├── components/
        │   ├── layout/AppLayout.jsx      # sidebar (desktop) / drawer (mobile)
        │   ├── gate/                     # CheckOutPanel, ReturnPanel, Cards
        │   └── ui/                       # Modal, Badge, StatCard, Pagination, LanguageSwitcher, ...
        ├── pages/                # Login, Dashboard, Gate, Outside, History, Employees, Assets, Users
        └── styles/               # theme.css (design system + Amharic typography), layout.css
```

## Quick start (development)

**Requirements:** Node.js 18+ and MongoDB (local install, or a free MongoDB Atlas cluster).

```bash
# 1. install everything
npm run install:all

# 2. configure the backend
cd backend
cp .env.example .env          # Windows: copy .env.example .env
#   edit .env -> set MONGO_URI and a long random JWT_SECRET

# 3. create the first accounts + sample data
npm run seed
#   admin     admin     / Admin@12345
#   security  security1 / Security@123     (change these after the first login!)

# 4. run (two terminals)
npm run dev                   # in backend/   -> http://localhost:5001
cd ../frontend && npm run dev # in frontend/  -> http://localhost:5173
```

The backend port is `PORT` in `backend/.env` (default **5001**). If you change it, change the proxy `target` in
`frontend/vite.config.js` to the same port.

Open http://localhost:5173. To test on a phone connected to the same Wi-Fi, open `http://<your-pc-ip>:5173`.

## Production (single server on the office network)

```bash
npm run build                 # builds frontend/dist
# set NODE_ENV=production and CLIENT_URL in backend/.env, then
npm start                     # Express serves the API *and* the built React app on PORT
```

Use **pm2** (`pm2 start backend/server.js --name mesob-gate`) to keep it running, and put it behind Nginx with HTTPS
if you can. Security officers can then use any PC, tablet or phone browser at `http://<server-ip>:<PORT>`.
Take regular `mongodump` backups – the log is your audit trail.

## API overview

All endpoints are under `/api`, JSON, JWT bearer token (`Authorization: Bearer <token>`).
Send `Accept-Language: am` (or `en`) to receive messages in that language.

| Method         | Endpoint                        | Role   | Purpose                                         |
| -------------- | ------------------------------- | ------ | ----------------------------------------------- |
| POST           | `/auth/login`                   | public | Sign in                                         |
| GET            | `/auth/me`                      | any    | Current user                                    |
| PATCH          | `/auth/password`                | any    | Change own password                             |
| GET            | `/assets/lookup/:code`          | any    | Find asset by serial/tag (+ open log)           |
| GET            | `/employees/lookup/:employeeId` | any    | Find employee by ID                             |
| POST           | `/gate/check-out`               | any    | `{ assetId, employeeId, note }`                 |
| POST           | `/gate/check-in`                | any    | `{ assetId, note }`                             |
| GET            | `/gate/outside`                 | any    | Items currently outside                         |
| GET            | `/gate/history`                 | any    | Filters: `q,status,type,from,to,page,limit`     |
| GET            | `/gate/history/export`          | any    | CSV download (headers in the selected language) |
| GET            | `/dashboard/stats`              | any    | Dashboard numbers                               |
| CRUD           | `/employees`, `/assets`         | admin  | Manage records (delete = deactivate)            |
| GET/POST/PATCH | `/users`                        | admin  | Manage system users                             |

## Design decisions worth knowing

- **One log per trip.** `GateLog` has a partial unique index (one open `OUT` record per asset), so the same laptop can never be checked out twice – even if two officers scan at the same moment.
- **Snapshots.** Each log stores the asset and employee details at that moment, so history stays correct even if records are edited later.
- **Soft delete.** Employees and assets are deactivated, never removed, so history is preserved.
- **Security:** bcrypt password hashing, JWT, role checks, helmet, rate limiting (stricter on login), request validation with zod, CSV formula-injection protection.
- **Time zone:** the "today" counters use `TZ_OFFSET_MINUTES` (Ethiopia = 180) and the UI displays Africa/Addis_Ababa time.
- **Barcode scanners:** USB/Bluetooth scanners work out of the box – they type the code and press Enter, which triggers the lookup.
- **Translations are keys, not sentences.** Code never contains display text; both languages live in dictionary files that are machine-checked for completeness.

## Ideas for later

Print asset QR/barcode labels, SMS/Telegram reminder for overdue items, per-employee asset assignment, multi-branch support, Ethiopian-calendar display option.

## Deployment (Render + Vercel)

- **Backend → Render** (Node web service, root directory `backend`, build `npm install`, start `npm start`, health check `/api/health`).
  Environment variables: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL), `BRANCH_NAME`, `TZ_OFFSET_MINUTES=180`, `OVERDUE_HOURS=24`.
- **Frontend → Vercel** (Vite, root directory `frontend`, build `npm run build`, output `dist`).
  Environment variable: `VITE_API_URL=https://<your-service>.onrender.com/api`.
- MongoDB Atlas → Network Access must allow Render (`0.0.0.0/0`).
- After the first deploy, set `CLIENT_URL` on Render to the Vercel address and redeploy, otherwise the browser blocks requests (CORS).
