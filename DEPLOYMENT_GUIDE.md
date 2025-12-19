# Deployment Guide - Fund Tracker

## ✅ Frontend - Vercel (Already Completed)
Your frontend is already hosted on Vercel!

---

## 🚀 Backend - Render Deployment Steps

### Step 1: Prepare Your Backend Repository
Ensure your backend code is pushed to GitHub/GitLab/Bitbucket with these files:
- ✅ `requirements.txt`
- ✅ `main.py`
- ✅ `render.yaml` (created)

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up or login (can use GitHub authentication)

### Step 3: Create PostgreSQL Database
1. Click **"New +"** → Select **"PostgreSQL"**
2. Fill in details:
   - **Name**: `fund-tracker-db`
   - **Database**: `fund_tracker`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Plan**: Free tier is fine for testing
3. Click **"Create Database"**
4. **Copy the Internal Database URL** (you'll need this)

### Step 4: Deploy Backend Web Service
1. Click **"New +"** → Select **"Web Service"**
2. Connect your repository:
   - Select your Git provider
   - Authorize Render
   - Choose your repository
3. Configure the service:
   - **Name**: `fund-tracker-backend`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free tier for testing

### Step 5: Configure Environment Variables
In the Render dashboard for your web service, go to **Environment** tab and add:

```
DATABASE_URL=<paste your PostgreSQL Internal Database URL>
SECRET_KEY=<generate a strong random key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

**Important**: 
- For `DATABASE_URL`, use the Internal Database URL from Step 3
- For `SECRET_KEY`, generate a strong random key:
  ```python
  # Run this in Python to generate a key:
  import secrets
  print(secrets.token_urlsafe(32))
  ```

### Step 6: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://fund-tracker-backend.onrender.com`

### Step 7: Update Frontend Environment Variables
In Vercel dashboard, update your frontend environment variable:

```
VITE_API_URL=https://fund-tracker-backend.onrender.com
```

Redeploy your frontend on Vercel for the changes to take effect.

### Step 8: Update CORS Settings
The backend CORS is currently open (`allow_origins=["*"]`). For production, you should update this:

In `backend/main.py`, change:
```python
allow_origins=["*"]
```

To:
```python
allow_origins=["https://your-vercel-app.vercel.app"]
```

---

## 📝 Important Notes

### Database
- SQLite won't work on Render (ephemeral filesystem)
- Use PostgreSQL (provided by Render)
- Migrations will run automatically on startup

### File Uploads
- Render's filesystem is ephemeral
- For production, consider using:
  - **AWS S3**
  - **Cloudinary**
  - **Render Disks** (persistent storage, paid)

### Free Tier Limitations
- **Render Free Tier**:
  - Service spins down after 15 min of inactivity
  - First request after spin-down takes ~30 seconds
  - 750 hours/month free

### Monitoring
- Check logs in Render dashboard
- Monitor database usage
- Set up health checks

---

## 🔧 Troubleshooting

### Issue: Build Fails
- Check `requirements.txt` has all dependencies
- Ensure Python version compatibility
- Check build logs in Render dashboard

### Issue: Database Connection Error
- Verify `DATABASE_URL` is set correctly
- Use **Internal Database URL**, not External
- Check database is running

### Issue: CORS Errors
- Update CORS origins in `main.py`
- Add your Vercel domain
- Redeploy backend

### Issue: Cold Starts (Free Tier)
- First request after inactivity is slow
- Consider upgrading to paid tier for production
- Use scheduled pings to keep service warm (optional)

---

## 🎯 Post-Deployment Checklist

- [ ] Backend is accessible via Render URL
- [ ] Database connection works
- [ ] Frontend can communicate with backend
- [ ] User authentication works
- [ ] Invoice upload works (or configure S3/Cloudinary)
- [ ] Update CORS to restrict origins
- [ ] Set strong SECRET_KEY
- [ ] Monitor logs for errors
- [ ] Test all features end-to-end

---

## 🔐 Security Recommendations

1. **Change SECRET_KEY** to a cryptographically secure random string
2. **Restrict CORS** origins to your Vercel domain only
3. **Use HTTPS** (Render provides this automatically)
4. **Enable environment variable encryption** in Render
5. **Regular security updates** for dependencies
6. **Database backups** (configure in Render)

---

## 💰 Cost Considerations

### Free Tier (Good for MVP/Testing)
- Render Web Service: Free (with limitations)
- Render PostgreSQL: Free (256 MB storage)
- Vercel: Free (generous limits)

### Paid Tier (Production Ready)
- Render Web Service: $7/month (no spin-down)
- Render PostgreSQL: $7/month (more storage)
- Vercel Pro: $20/month (if needed)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Vercel Documentation](https://vercel.com/docs)

---

Good luck with your deployment! 🚀
