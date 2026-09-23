# 🚀 Deployment Guide — College Placement Portal

## Step 1: Set Up Google Sheet & Apps Script Backend

### 1.1 Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet
2. Name it **"Placement Portal DB"** (or anything you like)

### 1.2 Open Apps Script Editor
1. In your spreadsheet, go to **Extensions → Apps Script**
2. This opens the Apps Script editor at `script.google.com`

### 1.3 Add the Backend Code
1. **Delete** the default `Code.gs` content
2. Copy and paste the content of each file from the `apps-script/` folder:
   - `Code.gs` → main file (replace the default)
   - `Auth.gs` → click **+** (Add a file) → Script → name it `Auth`
   - `Crud.gs` → click **+** → Script → name it `Crud`
   - `Upload.gs` → click **+** → Script → name it `Upload`
   - `Setup.gs` → click **+** → Script → name it `Setup`

### 1.4 Run Initial Setup
1. In the Apps Script editor, select the **`fullSetup`** function from the dropdown
2. Click ▶️ **Run**
3. The first time, Google will ask for permissions — click **Review Permissions → Allow**
4. Check the **Execution Log** (View → Execution log) — you should see:
   ```
   ✅ Full setup complete!
   ```
5. Go back to your spreadsheet — you'll see two sheets: **Companies** and **Admins**

### 1.5 Deploy as Web App
1. In Apps Script, click **Deploy → New deployment**
2. Click the ⚙️ gear icon and select **Web app**
3. Configure:
   - **Description**: "Placement Portal API"
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> ⚠️ **Important**: Every time you change the Apps Script code, you must create a **New Deployment** (or update the existing version) for changes to take effect.

---

## Step 2: Configure the React Frontend

### 2.1 Set the API URL
1. Open the `.env` file in the project root
2. Set your Web App URL:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

### 2.2 Test Locally
```bash
npm run dev
```
- Visit `http://localhost:5173`
- The homepage should load (will show "No drives found" if the sheet is empty)
- Go to `/admin/login` and log in with:
  - **Username**: `admin`
  - **Password**: `admin123`
- Add a test drive from the dashboard

---

## Step 3: Deploy Frontend to Vercel (Free)

### Option A: Vercel (Recommended)
1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New → Project** → Import your repo
4. Set **Environment Variables**:
   - `VITE_APPS_SCRIPT_URL` = your Web App URL
5. Click **Deploy**
6. Your site will be live at `https://your-project.vercel.app`

### Option B: Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click **Add new site → Import from Git** → Select your repo
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Set **Environment Variables**:
   - `VITE_APPS_SCRIPT_URL` = your Web App URL
6. Click **Deploy site**

---

## Step 4: Post-Deployment

### Change Default Admin Password
The default credentials (`admin / admin123`) are for initial setup only:
1. Open your Google Sheet
2. Go to the **Admins** sheet
3. To change the password, you'll need to:
   - Run this in Apps Script console: `Logger.log(hashPassword('your_new_password'))`
   - Copy the hash and paste it into the `password_hash` column

### Adding More Admins
Add a new row in the **Admins** sheet with:
- `id`: Any unique string
- `username`: The new admin's username
- `password_hash`: Run `hashPassword('their_password')` in Apps Script to get the hash

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Make sure `Who has access` is set to **Anyone** in the deployment |
| 401 Unauthorized | Token may have expired (24h). Log in again. |
| File upload fails | Check Google Drive storage quota. Max file size: 5MB. |
| Changes not reflecting | Create a **New Deployment** version in Apps Script |
| Slow API responses | Normal for Apps Script (1-3 seconds). India latency may add ~500ms. |

---

## Architecture Summary

```
React Frontend (Vercel/Netlify)
  ↕ HTTPS (fetch)
Google Apps Script Web App
  ↕ SpreadsheetApp / DriveApp APIs
Google Sheets (DB) + Google Drive (Files)
```

**Total cost: ₹0 forever** 🎉
