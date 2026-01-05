# Production Deployment Guide

## Overview

This guide covers deploying Mizan to production with a cloud backend and static frontend hosting.

## Architecture Options

### Option 1: Separate Hosting (Recommended)
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: SQLite file persisted on backend

### Option 2: Single Server
- **Full Stack**: Single VPS (DigitalOcean, Linode, AWS EC2)
- **Nginx**: Serve frontend + proxy API requests
- **PM2**: Process manager for backend

## Pre-Deployment Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Update API_URL in frontend to production backend URL
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set proper CORS origins
- [ ] Configure database backups
- [ ] Test registration and sync on staging

## Option 1: Separate Hosting

### Backend Deployment (Railway Example)

1. **Prepare Backend**
```bash
cd server
```

2. **Create `Procfile`**
```
web: npm start
```

3. **Update `package.json`** add build script:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  }
}
```

4. **Deploy to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables in Railway dashboard:
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NODE_ENV=production

# Deploy
railway up
```

5. **Get Backend URL**: Copy from Railway dashboard (e.g., `https://mizan-api.railway.app`)

### Frontend Deployment (Vercel Example)

1. **Update API URL**

Edit `src/utils/api.ts`:
```typescript
const API_URL = import.meta.env.PROD 
  ? 'https://mizan-api.railway.app/api'  // Your backend URL
  : 'http://localhost:3001/api';
```

2. **Build Frontend**
```bash
cd mizan-vite
npm run build
```

3. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

4. **Update CORS on Backend**

Edit `server/src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5174'],
  credentials: true
}));
```

Redeploy backend with updated CORS.

## Option 2: Single VPS Deployment

### 1. Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 2. Clone and Setup Project

```bash
# Create app directory
sudo mkdir -p /var/www/mizan
sudo chown $USER:$USER /var/www/mizan

# Clone repository
cd /var/www/mizan
git clone <your-repo-url> .

# Install dependencies
npm install
cd server
npm install
cd ..
```

### 3. Configure Environment

```bash
# Create production .env
cat > server/.env << EOF
PORT=3001
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
```

### 4. Build Applications

```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
cd ..
```

### 5. Configure PM2

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'mizan-api',
    cwd: './server',
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configure Nginx

Create `/etc/nginx/sites-available/mizan`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    root /var/www/mizan/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/mizan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Enable HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 8. Setup Database Backups

Create backup script `/var/www/mizan/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mizan"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp /var/www/mizan/server/mizan.db $BACKUP_DIR/mizan_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "mizan_*.db" -mtime +30 -delete
```

Add to crontab:
```bash
chmod +x backup.sh
crontab -e
# Add line:
0 2 * * * /var/www/mizan/backup.sh
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-min-32-characters-random-string

# Optional: Logging
LOG_LEVEL=info
```

### Frontend

Update `src/utils/api.ts`:
```typescript
const API_URL = import.meta.env.PROD 
  ? 'https://your-domain.com/api'  // Production backend
  : 'http://localhost:3001/api';   // Development
```

## Security Best Practices

### 1. JWT Secret
```bash
# Generate strong secret
openssl rand -base64 32
```

### 2. CORS Configuration
```typescript
// Only allow your domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com'
    : 'http://localhost:5174'
}));
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Helmet for Security Headers
```bash
cd server
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs mizan-api
pm2 status
```

### Check Server Health
```bash
curl https://your-domain.com/health
```

## Maintenance

### Update Application
```bash
cd /var/www/mizan
git pull
npm install
npm run build
cd server
npm install
npm run build
pm2 restart mizan-api
```

### View Logs
```bash
pm2 logs mizan-api --lines 100
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Database
```bash
./backup.sh
```

### Restore Database
```bash
cp /var/backups/mizan/mizan_YYYYMMDD_HHMMSS.db /var/www/mizan/server/mizan.db
pm2 restart mizan-api
```

## Scaling Considerations

### Horizontal Scaling
- Use PostgreSQL instead of SQLite
- Add Redis for session management
- Deploy multiple backend instances behind load balancer

### Database Migration (SQLite → PostgreSQL)
1. Export SQLite data
2. Setup PostgreSQL on managed service (e.g., Railway, Supabase)
3. Update database connection code
4. Import data
5. Update connection strings

## Troubleshooting

### Backend not starting
```bash
pm2 logs mizan-api --err
# Check JWT_SECRET is set
# Check PORT is not in use
```

### Frontend can't reach API
- Check CORS settings
- Verify API_URL is correct
- Check browser console for errors
- Test API endpoint: `curl https://your-domain.com/health`

### Database errors
- Check file permissions on mizan.db
- Verify backup exists
- Check disk space

## Cost Estimates

### Free Tier Options
- **Frontend**: Vercel/Netlify Free (Fine for personal use)
- **Backend**: Railway Hobby $5/month or Render Free tier
- **Total**: $0-5/month

### Paid VPS
- **DigitalOcean Droplet**: $6/month (1GB RAM)
- **Domain**: $12/year
- **Total**: ~$8/month

## Support Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and loads
- [ ] Registration works
- [ ] Login works
- [ ] Data syncs between devices
- [ ] HTTPS enabled
- [ ] Backups configured
- [ ] Monitoring setup

---

**Production Ready!** Your Mizan app is now accessible worldwide with multi-device sync.
