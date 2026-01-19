# Quick Start Guide

Get your TrickBD clone up and running in 5 minutes!

## 🚀 Instant Deploy (Recommended)

### Via v0 Platform

1. **Click "Publish"** in the top right of v0
2. **Connect Vercel** if not already connected
3. **Deploy!** - Done! Your site is live 🎉

The Supabase integration is automatically configured.

---

## 🛠️ Manual Setup

### Step 1: Database Setup (Already Done!)

The database migrations have already been executed:
- ✅ Tables created
- ✅ RLS policies enabled
- ✅ Triggers configured
- ✅ Categories seeded
- ✅ Storage buckets ready

### Step 2: Create Your First Admin

1. **Sign up** at `/signup`
2. **Verify your email** (check inbox)
3. **Promote yourself to admin** in Supabase dashboard:

   Go to Table Editor > profiles > Find your user > Edit:
   ```
   role: admin
   ```

### Step 3: Start Creating

You're ready to go! You can now:
- ✅ Create posts
- ✅ Manage users
- ✅ Moderate content
- ✅ Configure categories

---

## 📋 Initial Configuration Checklist

### Essential Setup
- [ ] Create admin account
- [ ] Update site name in `/app/layout.tsx` if desired
- [ ] Add/edit categories in Supabase
- [ ] Configure email templates in Supabase
- [ ] Test image uploads
- [ ] Create first post

### Optional Setup
- [ ] Add custom domain in Vercel
- [ ] Set up custom email provider
- [ ] Configure analytics
- [ ] Add social media links in footer
- [ ] Customize about page content
- [ ] Set up monitoring

---

## 🎯 Quick Tasks

### Create a Post

1. Click **"Create Post"** in header
2. Add title, content, and thumbnail
3. Select category
4. Click **"Publish"**

### Manage Users

1. Go to **`/admin`**
2. Click **"Users"** tab
3. Change roles, suspend, or delete users

### Moderate Content

1. Go to **`/admin`**
2. Click **"Posts"** tab
3. Approve, reject, or edit posts

---

## 🧪 Testing

### Test These Features

1. **Authentication**
   - Sign up new user
   - Login/logout
   - Password reset

2. **Posts**
   - Create post with images
   - Edit post
   - Delete post
   - View post

3. **Comments**
   - Add comment
   - Reply to comment
   - Edit comment (within 15min)
   - Delete comment

4. **Social**
   - Like post
   - Bookmark post
   - View bookmarks in dashboard

5. **Search**
   - Search posts
   - Filter by category
   - View author profiles

6. **Admin**
   - Access admin panel
   - Change user role
   - Approve pending post
   - View statistics

---

## 📱 Mobile Testing

Test on mobile devices:
- [ ] Homepage responsive
- [ ] Post creation works
- [ ] Comments functional
- [ ] Navigation menu
- [ ] Image uploads
- [ ] Touch interactions

---

## 🐛 Common Issues & Fixes

### Issue: Can't upload images

**Fix:** Check storage bucket policies in Supabase:
- Storage > post-images > Policies
- Should allow authenticated uploads

### Issue: Posts not showing

**Fix:** Check post status:
- Contributors need approval
- Authors+ auto-publish
- Check post status in database

### Issue: Can't access admin panel

**Fix:** Check your role:
```sql
SELECT role FROM profiles WHERE id = 'your-user-id';
```

Should be 'admin' or 'moderator'

### Issue: Not receiving emails

**Fix:** Check Supabase Auth settings:
- Authentication > Email Templates
- Verify email provider configured

---

## 📚 Next Steps

### Learn More

- 📖 [Features Documentation](./FEATURES.md) - Complete feature list
- 🔌 [API Documentation](./API.md) - Server actions and APIs
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- 📘 [README](../README.md) - Project overview

### Customize Your Site

1. **Branding**
   - Update logo in `/components/header.tsx`
   - Change colors in `/app/globals.css`
   - Modify footer in `/components/footer.tsx`

2. **Content**
   - Edit about page at `/app/about/page.tsx`
   - Add/remove categories in database
   - Customize email templates

3. **Features**
   - Add new post categories
   - Customize role permissions
   - Add custom pages

---

## 💡 Tips & Best Practices

### Content Creation
- Use descriptive titles
- Add relevant categories
- Upload quality images
- Write clear excerpts
- Use markdown formatting

### Moderation
- Review posts regularly
- Respond to flags quickly
- Be consistent with rules
- Communicate with users

### Community Building
- Feature quality posts
- Recognize top contributors
- Respond to comments
- Create guidelines

---

## 🎓 Role Progression

Understanding the role system:

```
User (Default)
    ↓ (Create quality content)
Contributor (Posts need approval)
    ↓ (Build reputation)
Author (Posts auto-approved)
    ↓ (Trusted member)
Moderator (Can moderate content)
    ↓ (Full trust)
Admin (Full control)
```

**Promote users through Admin Panel** → Users tab → Change Role

---

## ⚙️ Configuration Files

### Key Files to Know

- `/app/layout.tsx` - Site metadata, fonts
- `/app/globals.css` - Colors, theme
- `/middleware.ts` - Auth protection
- `/components/header.tsx` - Navigation
- `/components/footer.tsx` - Footer links
- `/lib/actions/*` - Server actions
- `/scripts/*` - Database migrations

---

## 🔐 Security Tips

1. **Keep secrets safe**
   - Never commit `.env` files
   - Use Vercel environment variables
   - Rotate keys periodically

2. **Monitor activity**
   - Review admin logs
   - Check for suspicious users
   - Monitor upload sizes

3. **Regular updates**
   - Update dependencies monthly
   - Review security advisories
   - Test after updates

---

## 📊 Growth Tracking

### Metrics to Monitor

- **Users:** Total signups, active users
- **Content:** Posts per day, categories used
- **Engagement:** Comments, likes, views
- **Performance:** Load times, error rates

### Tools

- Vercel Analytics (built-in)
- Supabase Dashboard
- Google Analytics (optional)
- Custom admin stats

---

## 🎉 You're All Set!

Your TrickBD clone is ready to build an amazing tech community!

### Need Help?

- 💬 Check documentation
- 🐛 Report issues
- 📧 Contact support
- 💡 Join community

Happy building! 🚀
