# 🚀 Heroku Deployment Guide - Causeway Design Pro

## Quick Heroku Deployment

**Your Git Config:**
- Email: crajkumarsingh@hotmail.com
- Name: RAJKUMAR SINGH CHAUHAN

---

## Step 1: Install Heroku CLI

### Windows (Recommended):
Download and install from: https://devcenter.heroku.com/articles/heroku-cli

**Or use PowerShell:**
```powershell
# Download installer
Invoke-WebRequest -Uri "https://cli-assets.heroku.com/heroku-x64.exe" -OutFile "heroku-installer.exe"

# Run installer
.\heroku-installer.exe
```

### Alternative - Use npm:
```bash
npm install -g heroku
```

---

## Step 2: Login to Heroku

After installing Heroku CLI, run:

```bash
heroku login
```

This will open your browser for authentication.

**Or use API key:**
```bash
heroku login -i
# Enter email: crajkumarsingh@hotmail.com
# Enter password: [your Heroku password]
```

---

## Step 3: Prepare Your Application

### Create Procfile (if not exists):
```bash
echo "web: node server.js" > Procfile
```

### Verify package.json has start script:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

---

## Step 4: Create Heroku App

```bash
# Create app with auto-generated name
heroku create

# OR create with custom name
heroku create causeway-design-pro

# OR create with specific name
heroku create your-custom-name
```

---

## Step 5: Deploy to Heroku

```bash
# Push to Heroku
git push heroku main

# If you're on master branch:
git push heroku master
```

---

## Step 6: Open Your App

```bash
heroku open
```

---

## Complete Deployment Commands (Copy & Paste):

```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create causeway-design-pro

# 3. Deploy
git push heroku main

# 4. Open app
heroku open

# 5. View logs (if needed)
heroku logs --tail
```

---

## Alternative: Deploy Without Heroku CLI

### Using Heroku Dashboard:

1. **Go to:** https://dashboard.heroku.com/
2. **Click:** "New" → "Create new app"
3. **Enter:** App name (e.g., causeway-design-pro)
4. **Choose:** Region (US or Europe)
5. **Click:** "Create app"

6. **Connect GitHub:**
   - Go to "Deploy" tab
   - Select "GitHub" as deployment method
   - Connect your GitHub account
   - Search for "Bridge-Causeway-Design"
   - Click "Connect"

7. **Deploy:**
   - Scroll to "Manual deploy"
   - Select "main" branch
   - Click "Deploy Branch"

8. **Enable Auto-Deploy (Optional):**
   - Click "Enable Automatic Deploys"
   - Every push to main will auto-deploy

---

## Environment Variables (If Needed)

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key

# View all config vars
heroku config
```

---

## Troubleshooting

### Issue: "heroku: command not found"
**Solution:** Install Heroku CLI first (see Step 1)

### Issue: "Permission denied"
**Solution:** 
```bash
heroku login
```

### Issue: "App name already taken"
**Solution:** Choose different name:
```bash
heroku create causeway-design-pro-2024
```

### Issue: "Failed to push"
**Solution:** Check git status:
```bash
git status
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Issue: "Application error"
**Solution:** Check logs:
```bash
heroku logs --tail
```

---

## Post-Deployment

### View Your App:
```bash
heroku open
```

### Check Status:
```bash
heroku ps
```

### View Logs:
```bash
heroku logs --tail
```

### Restart App:
```bash
heroku restart
```

### Scale Dynos:
```bash
# Free tier (1 dyno)
heroku ps:scale web=1

# Scale up (paid)
heroku ps:scale web=2
```

---

## Custom Domain (Optional)

```bash
# Add custom domain
heroku domains:add www.yourdomain.com

# View domains
heroku domains
```

---

## Monitoring

### View App Info:
```bash
heroku info
```

### View Metrics:
```bash
heroku logs --tail
```

### Open Dashboard:
```bash
heroku dashboard
```

---

## Quick Reference

### Essential Commands:
```bash
heroku login              # Login to Heroku
heroku create            # Create new app
git push heroku main     # Deploy app
heroku open              # Open app in browser
heroku logs --tail       # View logs
heroku restart           # Restart app
heroku ps                # Check dyno status
```

### App Management:
```bash
heroku apps              # List all apps
heroku apps:info         # App information
heroku apps:destroy      # Delete app
heroku apps:rename       # Rename app
```

---

## Cost Information

### Free Tier:
- 550-1000 dyno hours/month (free)
- Sleeps after 30 min inactivity
- Wakes on first request
- Perfect for development/testing

### Paid Tiers:
- Hobby: $7/month (never sleeps)
- Standard: $25-50/month
- Performance: $250+/month

---

## Your Deployment Checklist

- [ ] Install Heroku CLI
- [ ] Login to Heroku (crajkumarsingh@hotmail.com)
- [ ] Create Procfile
- [ ] Verify package.json
- [ ] Create Heroku app
- [ ] Push to Heroku
- [ ] Open and test app
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring

---

## Success Indicators

✅ **Deployment Successful:**
```
remote: -----> Build succeeded!
remote: -----> Launching...
remote:        https://your-app.herokuapp.com/ deployed to Heroku
```

✅ **App Running:**
```bash
heroku ps
# Should show: web.1: up
```

✅ **No Errors:**
```bash
heroku logs --tail
# Should show normal startup logs
```

---

## Next Steps After Deployment

1. **Test Your App:**
   - Visit the Heroku URL
   - Test all features
   - Check console for errors

2. **Monitor Performance:**
   - Check response times
   - Monitor memory usage
   - Watch error logs

3. **Share with Team:**
   - Send Heroku URL
   - Document deployment
   - Train team members

4. **Set Up CI/CD (Optional):**
   - Enable auto-deploy from GitHub
   - Add deployment notifications
   - Configure review apps

---

## Support

### Heroku Documentation:
- https://devcenter.heroku.com/

### Heroku Status:
- https://status.heroku.com/

### Get Help:
```bash
heroku help
heroku help [command]
```

---

## 🎉 Ready to Deploy!

**Quick Deploy (3 commands):**
```bash
heroku login
heroku create causeway-design-pro
git push heroku main
```

**Then open:**
```bash
heroku open
```

---

**Your app will be live at:**
`https://causeway-design-pro.herokuapp.com`

(or whatever name you choose)

---

**Status: READY TO DEPLOY** ✅

**Platform: Heroku** ✅

**Git Config: SET** ✅

---

*Deploy with confidence!* 🚀
