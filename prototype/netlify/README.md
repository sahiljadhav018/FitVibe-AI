# FitVibe AI - Netlify Deployment Package

This folder is pre-configured and ready to deploy directly to **Netlify** with zero configuration needed.

---

## 🚀 Quick Deploy in 10 Seconds (Drag & Drop)

1. Open **[https://app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
2. Sign in to your Netlify account (or sign up with GitHub/Google).
3. Drag and drop this entire folder (`FitVibe_Netlify_Deploy` or `netlify`) onto the upload box on Netlify.
4. Netlify will instantly build and provide a live URL (e.g., `https://fitvibe-ai-xxxx.netlify.app`).

---

## 📁 Package Structure

```
netlify/
├── index.html          # Main application UI with 3D Canvas, wrestling theme & rings
├── manifest.json       # PWA manifest for mobile installation (Add to Home Screen)
├── _redirects          # Netlify routing rules: proxies /api/* to Flask backend & SPA routing
├── netlify.toml        # Production Netlify configuration with security headers & proxy
├── js/
│   ├── app.js          # App state, tabs, sound synthesizer, 3D trophy & API/offline sync
│   └── pose_coach.js   # MediaPipe AI 3D Pose Coach (Rep counting, posture feedback)
└── README.md           # Deployment instructions
```

---

## ⚡ Features Included

- **AI Pose Estimation**: MediaPipe real-time skeleton tracking and rep counting (Pushups, Squats, Wrestling Bithak, Suryanamaskar).
- **Audio Coach**: Web Audio Synthesizer sound effects (boxing bell, whistle, rep chime, victory fanfare) + Web Speech voice synthesis.
- **3D Trophy Arena**: Three.js 3D rotating gold trophy.
- **Activity Rings & Goals**: Interactive 3-ring movement tracker (Move, Exercise, Stand) + Daily Fitness goals checklist.
- **PWA & Mobile Ready**: Responsive viewport, touch controls, home-screen launchable.
- **Dual Mode**:
  - Automatically proxies `/api/*` requests to your live Cloudflare tunnel or Flask backend.
  - Gracefully falls back to local storage and browser state if offline.
