# 🏠 Ghar Setu — Complete Real Estate Ecosystem

A production-ready, enterprise-grade MERN (MongoDB, Express, React, Node.js) web application that provides a comprehensive multi-service real estate platform. Buy, sell, rent properties, access legal services, manage properties remotely, book packers & movers, and promote real estate projects — all in one platform.

## 🎯 Features

### Property Services
- **Buy & Sell** — List properties, submit offers, negotiate deals, track transactions
- **Rentals** — Rental listings, agreement management, rent collection, renewals
- **Property Search** — Advanced filters, geo-search, map integration ready

### Business Services
- **Legal Services** — Title search, registration, dispute resolution, document verification
- **Joint Ventures** — Partner matching, milestone tracking, revenue splits, progress reports
- **Packers & Movers** — Book relocations, cost estimation, provider matching, live tracking
- **Property Management** — Remote management for NRI owners, rent collection, maintenance coordination
- **Marketing** — Campaign creation, lead capture, analytics, multi-channel promotion

### Platform Features
- **Role-Based Access Control** — 9 user roles (Admin, Buyer, Seller, Owner, Tenant, Agent, Builder, Legal Advisor, Service Provider)
- **JWT Authentication** — Access + refresh token rotation, secure password handling
- **Real-Time Notifications** — In-app notification system
- **Scheduling** — Property visits, inspections, consultations with availability checking
- **Payments** — Transaction tracking, payment history
- **Documents** — Upload, review, and manage property documents
- **Feedback** — Ratings and reviews for services, agents, and properties

## 🏗️ Architecture

```
gharsetu/
├── server/                  # Backend — Express + TypeScript
│   ├── src/
│   │   ├── config/          # DB, Redis, Cloudinary, app config
│   │   ├── shared/          # Middleware, utils, types
│   │   └── modules/         # Feature modules (16+ modules)
│   └── Dockerfile
├── client/                  # Frontend — React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # UI + Layout components
│   │   ├── hooks/           # React Query hooks for all APIs
│   │   ├── pages/           # Auth, Properties, Dashboard pages
│   │   ├── stores/          # Zustand stores (auth, app)
│   │   ├── lib/             # API client, utils
│   │   └── types/           # TypeScript interfaces
│   └── Dockerfile
├── docker-compose.yml       # Full-stack Docker setup
└── README.md
```

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| Redis (ioredis) | Caching layer |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Cloudinary | Image/file storage |
| Winston | Structured logging |
| Helmet + CORS | Security |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Query | Server state management |
| Zustand | Client state management |
| React Router v6 | Routing |
| Framer Motion | Animations |
| Axios | HTTP client |
| Lucide | Icons |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, graceful fallback)

### 1. Clone & Install

```bash
git clone <repo-url>
cd gharsetu

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your values
```

Key variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gharsetu
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### 3. Run Development

```bash
# Terminal 1 — Start server
cd server && npm run dev

# Terminal 2 — Start client  
cd client && npm run dev
```

- **Server**: http://localhost:5000
- **Client**: http://localhost:5173

### 4. Docker (Production)

```bash
docker-compose up -d
# Access at http://localhost
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/forgot-password` | Send reset email |

### Properties
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/properties` | List with filters |
| GET | `/api/properties/:id` | Get details |
| POST | `/api/properties` | Create listing |
| GET | `/api/properties/nearby` | Geo-search |

### All Service Modules
`/api/inquiries` · `/api/buy-sell` · `/api/rentals` · `/api/legal` · `/api/joint-ventures` · `/api/packers` · `/api/property-management` · `/api/marketing` · `/api/scheduling` · `/api/payments` · `/api/documents` · `/api/feedback` · `/api/notifications` · `/api/admin`

## 👥 User Roles

| Role | Access |
|---|---|
| `super_admin` / `admin` | Full platform management |
| `buyer` | Search, inquire, make offers |
| `seller` | List properties, manage offers |
| `owner` | Property management, rentals |
| `tenant` | Rental management |
| `agent` | Listings on behalf of clients |
| `builder` | Projects, joint ventures |
| `legal_advisor` | Legal case management |
| `service_provider` | Packers, maintenance |

## 🔒 Security

- JWT access + refresh token rotation
- Bcrypt password hashing (12 rounds)
- Helmet HTTP headers & CORS
- Rate limiting
- Zod input validation
- File type & size restrictions
- Role-based access control

## 📄 License

MIT