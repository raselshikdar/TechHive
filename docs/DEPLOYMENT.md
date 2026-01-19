# Deployment Guide

This guide walks you through deploying the TrickBD clone to production.

## Quick Deploy (v0 Platform)

The easiest way to deploy is directly from v0:

1. **Click the "Publish" button** in the top right of v0
2. **Connect your Vercel account** if not already connected
3. **Configure your domain** (optional)
4. **Deploy!** - Your site will be live in seconds

The Supabase integration is automatically configured with your environment variables.

---

## Manual Deployment

### Prerequisites

- Node.js 18+
- A Vercel account
- A Supabase project
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Prepare Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name, password, and region

2. **Run Database Migrations**
   
   In the Supabase SQL Editor, run these scripts in order:
   
   ```bash
   /scripts/001_initial_schema.sql
   /scripts/002_rls_policies.sql
   /scripts/003_triggers_functions.sql
   /scripts/004_seed_data.sql
   /scripts/005_storage_buckets.sql
   ```

3. **Get Your Credentials**
   
   From Project Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

4. **Configure Email Templates** (Optional)
   
   Go to Authentication > Email Templates to customize signup confirmation emails.

### Step 2: Deploy to Vercel

#### Option A: Deploy via Git

1. **Push your code to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure environment variables (see below)
   - Click "Deploy"

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Step 3: Configure Environment Variables

In your Vercel project settings, add these variables:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Development redirect URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

**Important:** Never commit sensitive keys to Git!

### Step 4: Configure Supabase Auth Redirect

1. Go to your Supabase project
2. Navigate to Authentication > URL Configuration
3. Add your production domain to "Site URL"
4. Add callback URLs:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com
   ```

### Step 5: Set Up Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS as instructed by Vercel
4. Wait for DNS propagation (usually 5-10 minutes)

---

## Post-Deployment

### 1. Create First Admin User

After deployment, create your first user through the signup page. Then manually promote them to admin in Supabase:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 2. Test Core Functionality

- [ ] User registration and login
- [ ] Post creation with image upload
- [ ] Commenting system
- [ ] Like and bookmark features
- [ ] Admin panel access
- [ ] Search functionality
- [ ] Mobile responsiveness

### 3. Configure Email Provider (Optional)

For custom email templates and better deliverability:

1. Go to Supabase > Project Settings > Auth
2. Enable "Custom SMTP"
3. Configure your email provider (SendGrid, AWS SES, etc.)

### 4. Set Up Analytics (Optional)

Vercel Analytics is automatically enabled. For more detailed analytics:

- Google Analytics
- Plausible
- Mixpanel
- PostHog

---

## Environment-Specific Configurations

### Development

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local_dev_key
```

### Staging

Use a separate Supabase project for staging to avoid affecting production data.

### Production

Always use production Supabase credentials and enable all security features.

---

## Security Checklist

Before going live, ensure:

- [ ] RLS policies are enabled on all tables
- [ ] Service role key is kept secret
- [ ] CORS is properly configured
- [ ] File upload limits are set
- [ ] Rate limiting is in place
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized markdown)
- [ ] HTTPS is enforced
- [ ] Environment variables are properly set

---

## Performance Optimization

### 1. Enable Caching

Vercel automatically caches static assets and images.

### 2. Database Indexes

The migration scripts include necessary indexes. Monitor slow queries in Supabase and add indexes as needed.

### 3. Image Optimization

Next.js Image component is used throughout for automatic optimization.

### 4. Database Connection Pooling

Supabase automatically handles connection pooling.

---

## Monitoring

### Application Monitoring

- **Vercel Dashboard**: View deployments, errors, and performance
- **Supabase Dashboard**: Monitor database usage and API requests

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Rollbar

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

---

## Backup Strategy

### Database Backups

Supabase automatically backs up your database daily. For additional protection:

1. Enable Point-in-Time Recovery (PITR) in Supabase
2. Export database manually for critical milestones
3. Store backups in a separate location

### Storage Backups

1. Regularly export storage bucket contents
2. Use Supabase CLI to backup files
3. Consider S3 replication for critical assets

---

## Scaling Considerations

### Database

- Monitor query performance
- Add indexes for slow queries
- Consider read replicas for high traffic
- Upgrade Supabase plan as needed

### Storage

- Implement CDN for images (Vercel handles this)
- Compress images before upload
- Clean up unused files regularly

### API

- Implement rate limiting (already included)
- Cache frequently accessed data
- Use edge functions for global performance

---

## Troubleshooting

### Common Issues

**Issue:** "Not authenticated" errors
**Solution:** Check Supabase auth configuration and callback URLs

**Issue:** Images not uploading
**Solution:** Verify storage bucket policies and file size limits

**Issue:** Slow database queries
**Solution:** Check for missing indexes and optimize queries

**Issue:** CORS errors
**Solution:** Configure allowed origins in Supabase dashboard

### Getting Help

- Check [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase docs](https://supabase.com/docs)
- Visit [Vercel support](https://vercel.com/support)
- Open an issue on GitHub

---

## Rollback Procedure

If you need to rollback a deployment:

### Vercel

1. Go to your project dashboard
2. Click on "Deployments"
3. Find the previous working deployment
4. Click "..." and select "Promote to Production"

### Database

1. Access Supabase dashboard
2. Go to Database > Backups
3. Restore from a previous backup
4. Verify data integrity

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to your main branch.

### Preview Deployments

Every pull request gets a unique preview URL for testing.

### Deployment Protection

1. Enable "Deployment Protection" in Vercel
2. Require approval for production deployments
3. Set up deployment hooks for notifications

---

## Maintenance

### Regular Tasks

- **Weekly:** Review error logs and fix issues
- **Monthly:** Update dependencies (`npm update`)
- **Quarterly:** Review and optimize database
- **Yearly:** Audit security and compliance

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Cost Estimation

### Vercel
- **Hobby Plan:** Free (good for small sites)
- **Pro Plan:** $20/month (recommended for production)

### Supabase
- **Free Plan:** Up to 500MB database, 1GB file storage
- **Pro Plan:** $25/month (unlimited up to fair use)

### Total Monthly Cost
- Small site: $0 (free tiers)
- Medium site: ~$45/month
- Large site: $100+/month (with CDN, etc.)

---

## Success! 🎉

Your TrickBD clone is now live and ready to build a thriving tech community!

For questions or issues, please refer to the documentation or open an issue on GitHub.
