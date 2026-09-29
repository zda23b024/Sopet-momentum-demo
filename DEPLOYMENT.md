# SOPET Momentum — Production & Development Deployment Guide (No Docker)

SOPET Momentum is designed for deployment on modern Linux VPS (Ubuntu/Debian, AlmaLinux, RHEL) or bare-metal servers without requiring Docker or containerization.

---

## 1. Prerequisites on Host Server

- **Node.js**: v20+ or v22 LTS (`node -v`)
- **Package Manager**: npm, bun, or yarn
- **Process Manager**: PM2 (`npm install -g pm2`)
- **Database**: PostgreSQL 15+ (local or managed like Neon, Supabase, Cloud SQL)
- **Web Server & Reverse Proxy**: Nginx or Caddy

---

## 2. Directory Structure

```text
/opt/sopet-momentum/
├── backend/            # NestJS API Server (Port 4000)
│   ├── dist/           # Compiled TypeScript output
│   ├── prisma/         # Prisma schema and migrations
│   └── .env            # Production secrets (chmod 600)
├── dist/               # Built static frontend files (SPA)
└── ecosystem.config.cjs # PM2 process supervisor configuration
```

---

## 3. Database Setup & Migrations

```bash
# Set PostgreSQL credentials in /opt/sopet-momentum/backend/.env
# DATABASE_URL="postgresql://sopet_user:SECURE_PASSWORD@127.0.0.1:5432/sopet_momentum?schema=public"

cd /opt/sopet-momentum/backend
npm install --production=false
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

---

## 4. Building Backend and Frontend

```bash
# Build Backend
cd /opt/sopet-momentum/backend
npm run build

# Build Frontend
cd /opt/sopet-momentum
npm install
npm run build
# Frontend static bundle is output to /opt/sopet-momentum/dist
```

---

## 5. Process Management with PM2

Use the provided `ecosystem.config.cjs`:

```bash
# Start backend service
pm2 start ecosystem.config.cjs

# Save PM2 process list to survive reboots
pm2 save
pm2 startup
```

---

## 6. Nginx Reverse Proxy & Static Serving

Example `/etc/nginx/sites-available/sopet-momentum`:

```nginx
server {
    listen 80;
    server_name momentum.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name momentum.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/momentum.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/momentum.yourdomain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Frontend Single Page App (SPA)
    root /opt/sopet-momentum/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Swagger Documentation
    location /api/docs {
        proxy_pass http://127.0.0.1:4000/api/docs;
        proxy_set_header Host $host;
    }
}
```

---

## 7. Zero-Downtime Update Script

```bash
#!/usr/bin/env bash
set -e

echo "=== Pulling updates ==="
git pull origin main

echo "=== Updating backend ==="
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload sopet-backend

echo "=== Updating frontend ==="
cd ..
npm install
npm run build

echo "=== Deployment Complete ==="
```
