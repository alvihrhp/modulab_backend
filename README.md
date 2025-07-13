# Monolab Backend

A modern Node.js backend built with Express, TypeScript, and Prisma.

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string

## Database Setup

1. Create a new PostgreSQL database
2. Run the initial migration:
   ```bash
   npx prisma migrate dev --name init
   ```

## Development

To start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm test` - Run tests (coming soon)
- `npx prisma studio` - Open Prisma Studio to manage your database

## Project Structure

```
backend/
├── src/
│   ├── app.ts          # Express application setup
│   └── index.ts        # Application entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## API Endpoints

- `GET /health` - Health check endpoint

## License

ISC

---

## 🚀 Deployment ke Railway

1. **Klik "New Project" di Railway, pilih "Deploy from GitHub repo"**
2. **Pilih repo ini, lalu deploy**
3. **Set Environment Variables di Railway:**
   - `DATABASE_URL` (contoh: postgresql://user:password@host:port/db)
   - `JWT_SECRET` (contoh: hamburger)
   - `API_PORT` (contoh: 3001)
   - (opsional) variabel lain sesuai kebutuhan
4. **Railway otomatis menjalankan:**
   - `npm run build` (build TypeScript)
   - `npm start` (start node dist/index.js)
5. **Pastikan database sudah siap dan terhubung**

**Catatan:**
- Untuk development lokal, gunakan `npm run dev`.
- Untuk production (Railway), gunakan `npm run build` lalu `npm start`.
