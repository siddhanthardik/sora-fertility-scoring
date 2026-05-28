# Hostinger VPS Deployment

This guide deploys SORA Fertility without touching other projects on the VPS.

## Isolation Rules

- Use a new directory: `/var/www/sora-fertility`
- Use a new PM2 app name: `sora-fertility`
- Use a new internal port: `3107`
- Use a dedicated domain or subdomain, for example `sora.yourdomain.com`
- Add a new Nginx server block instead of editing existing project blocks

## 1. Clone Or Update Code

```bash
sudo mkdir -p /var/www/sora-fertility
sudo chown -R $USER:$USER /var/www/sora-fertility
cd /var/www/sora-fertility
git clone https://github.com/siddhanthardik/sora-fertility-scoring.git .
```

For updates after first deploy:

```bash
cd /var/www/sora-fertility
git pull origin main
```

## 2. Install And Build

```bash
cd /var/www/sora-fertility/landing
npm ci
npm run build
```

## 3. Add Production Env

Create `/var/www/sora-fertility/landing/.env.production`:

```bash
nano /var/www/sora-fertility/landing/.env.production
```

Required values:

```env
NODE_ENV=production
SORA_SUPERADMIN_PASSWORD=replace-with-strong-password
SORA_SUPERADMIN_SESSION_SECRET=replace-with-strong-random-secret
SUPABASE_URL=https://crxwaihhwcqgxarikyyw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-with-supabase-service-role-key
NEXT_PUBLIC_SORA_CLINIC_ID=replace-with-main-verified-clinic-id
SORA_ALLOWED_WIDGET_ORIGINS=https://sora.yourdomain.com,https://www.sora.yourdomain.com
```

Never commit this file.

## 4. Start With PM2

```bash
cd /var/www/sora-fertility/landing
pm2 start npm --name sora-fertility -- run start -- -p 3107
pm2 save
```

Check:

```bash
pm2 status
curl -I http://127.0.0.1:3107
```

## 5. Add Nginx Server Block

Create a new file:

```bash
sudo nano /etc/nginx/sites-available/sora-fertility
```

Use:

```nginx
server {
    listen 80;
    server_name sora.yourdomain.com www.sora.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3107;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable only this new block:

```bash
sudo ln -s /etc/nginx/sites-available/sora-fertility /etc/nginx/sites-enabled/sora-fertility
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Add SSL

```bash
sudo certbot --nginx -d sora.yourdomain.com -d www.sora.yourdomain.com
```

## 7. Post Deploy

1. Open `https://sora.yourdomain.com/superadmin`.
2. Log in with `SORA_SUPERADMIN_PASSWORD`.
3. Create or verify the main clinic.
4. Copy the clinic ID.
5. Update `NEXT_PUBLIC_SORA_CLINIC_ID` if needed.
6. Rebuild and restart:

```bash
cd /var/www/sora-fertility/landing
npm run build
pm2 restart sora-fertility
```

## Rollback

```bash
cd /var/www/sora-fertility
git log --oneline
git checkout <previous_commit>
cd landing
npm ci
npm run build
pm2 restart sora-fertility
```
