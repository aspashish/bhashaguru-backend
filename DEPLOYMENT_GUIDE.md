# BhashaGuru — Native Android & Render Backend Deployment Guide

This guide provides instructions for deploying the **BhashaGuru** backend service to Render and compiling the native installable Android application (`.apk` / `.aab`).

---

## Architecture Overview

- **Android Client**: Native Capacitor Android application located in `/android/`.
  - Package ID: `com.bhashaguru.app`
  - App Name: `BhashaGuru`
  - Features: Official 3D circular gold/navy emblem app launcher icons, branded splash screen, hardware back button navigation, hardware audio/mic permissions, and automatic routing to the production Render backend.
- **Backend Service**: Express + Node.js server (`server.ts`).
  - Provides Gemini AI features (speech-to-text, text-to-speech, pronunciation scoring, AI Coach conversations, WebSocket live audio).
  - Handles persistent student profiles and learning progress (vocabulary mastered, streaks, tense practice).
  - Production-ready with CORS, `/health` endpoint, graceful shutdown, and persistent storage directory support.

---

## Part 1: Deploy Backend to Render

### Option A: Using Blueprint (`render.yaml`) — Recommended

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Render Dashboard](https://dashboard.render.com/).
3. Click **Blueprints** -> **New Blueprint Instance**.
4. Select your BhashaGuru repository. Render will automatically detect `render.yaml`.
5. Under Environment Variables, supply your Gemini AI key for `AI_API_KEY`:
   ```env
   AI_API_KEY = *****
   ```
6. Click **Apply**. Render will automatically build and start the service with persistent disk storage mounted.

---

### Option B: Manual Web Service Setup on Render

1. Log in to [Render](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the service:
   - **Name**: `bhashaguru-backend` (or your preferred name)
   - **Region**: Choose the region closest to your users (e.g., Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root of project)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (runs `node --loader tsx server.ts`)
   - **Health Check Path**: `/health`
4. Under **Environment Variables**, add:
   - `AI_API_KEY` = `*****` (Your Google Gemini API Key)
   - `NODE_ENV` = `production`
   - `STORAGE_DIR` = `/var/data/bhashaguru` (or leave default `.data/students`)
5. *(Optional for data persistence)*: Under **Disks**, add a disk:
   - **Name**: `bhashaguru-data`
   - **Mount Path**: `/var/data/bhashaguru`
   - **Size**: 1 GB
6. Click **Create Web Service**.
7. Once deployed, note your service URL (e.g. `https://bhashaguru-backend.onrender.com`).

---

### Verify Backend Health

Open your browser or terminal and test:
```bash
curl https://YOUR_RENDER_URL.onrender.com/health
```
Expected response:
```json
{"status":"ok","app":"BhashaGuru","version":"1.0.0","uptime":12.34,"timestamp":"2026-11-05T..."}
```

---

## Part 2: Connect the Android App to Render Backend

In the project root, open `src/config/appConfig.ts`:

```typescript
export const RENDER_BACKEND_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RENDER_BACKEND_URL) ||
  'https://YOUR_RENDER_URL.onrender.com'; // <--- Insert your Render URL here
```

Or set the environment variable in `.env`:
```env
RENDER_BACKEND_URL = *****
VITE_RENDER_BACKEND_URL="https://YOUR_RENDER_URL.onrender.com"
```

Then rebuild and synchronize the Android web assets:
```bash
npm run build
npm run cap:sync
```

---

## Part 3: Build & Install Native Android App

### Requirements
- [Android Studio](https://developer.android.com/studio) (Koala / Iguana or later)
- JDK 17 or JDK 21
- Android SDK (API 34 or later recommended)

### Step 1: Open Project in Android Studio
1. Launch Android Studio.
2. Select **Open an Existing Project**.
3. Select the `android` folder inside the BhashaGuru root directory (`/android`).
4. Allow Gradle to sync dependencies.

### Step 2: Build Debug APK (For Immediate Testing on Device)
1. In Android Studio, go to menu: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
2. Once build completes, click **locate** or find the APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Transfer `app-debug.apk` to your Android phone via USB, Google Drive, or `adb install`:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Step 3: Run Directly on a Connected Device
1. Enable **Developer Options** and **USB Debugging** on your Android phone.
2. Connect your phone via USB.
3. In Android Studio, select your device from the device dropdown and click the green **Run (▶)** button.
4. The BhashaGuru app will install and open automatically with the splash screen and official logo.

---

## Part 4: Generate Release Signed APK or Google Play Store Bundle (.aab)

1. In Android Studio, go to **Build** -> **Generate Signed Bundle / APK...**
2. Choose:
   - **Android App Bundle** (for Google Play Store upload)
   - or **APK** (for standalone sideloading / distribution)
3. Select or create your keystore (`keystore.jks`).
4. Set release build type and select `V1` + `V2` signature schemes.
5. Click **Create**. The signed `.apk` or `.aab` will be generated in `android/app/release/`.

---

## Android App Configurations Included

| Feature | Implementation | Details |
|---|---|---|
| **Launcher Icon** | Standard & Adaptive | Official BhashaGuru 3D circular emblem across `mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi` with navy `#0B1329` adaptive background. |
| **Splash Screen** | Branded Launch Screen | Golden Sanskrit 'भा' medallion centered on deep navy background with gold glow across portrait & landscape sizes. |
| **Permissions** | `AndroidManifest.xml` | `INTERNET`, `ACCESS_NETWORK_STATE`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`. |
| **Auto Mic Prompt** | `MainActivity.java` | Prompts user on first launch for microphone access to ensure seamless pronunciation evaluation and AI voice coaching. |
| **Hardware Back Button** | `src/App.tsx` | Closes active modals and overlays, or minimizes app if on home screen. |
| **Network Security** | `network_security_config.xml` | Enforces TLS/HTTPS in production while permitting local testing if debugging. |

---

## Troubleshooting

- **Microphone not working**:
  - Check phone settings -> Apps -> BhashaGuru -> Permissions -> Microphone -> Set to "Allow while using app".
- **Backend sleeping on Render Free tier**:
  - Render free-tier services spin down after 15 minutes of inactivity and take ~30-50s to wake up on the first request.
  - Test `https://YOUR_RENDER_URL.onrender.com/health` in a browser to warm it up.
- **CORS error**:
  - The backend server is configured with open CORS (`cors()`) to allow requests from Capacitor Android origins (`https://localhost`, `capacitor://localhost`, etc.).
