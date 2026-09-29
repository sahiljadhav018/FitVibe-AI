# 🤼 FitVibe AI — 3D Dangal Wrestling & Campus Fitness Ecosystem
### Smart India Hackathon (SIH 2026) | Problem Statement ID: 26196

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3%2B-black.svg)](https://flask.palletsprojects.com/)
[![MediaPipe 3D](https://img.shields.io/badge/MediaPipe-3D%20Vision-FF6F00.svg)](https://developers.google.com/mediapipe)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black.svg)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-38B2AC.svg)](https://tailwindcss.com/)
[![Netlify Ready](https://img.shields.io/badge/Deploy-Netlify-00C7B7.svg)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Project Overview

**FitVibe AI** is an intelligent, gamified student fitness and health ecosystem created for **Smart India Hackathon 2026 (Problem Statement ID: 26196)**. It blends cutting-edge **Computer Vision AI (3D Pose Landmark Tracking)** with time-tested **traditional Indian wrestling (Akhada & Dangal) exercises** (Desi Baithak, Desi Dand, Surya Namaskar Flow, and Wrestler Neck Bridge).

Designed specifically for college students, FitVibe AI eliminates screen fatigue and sedentary campus lifestyles through real-time audio commentary, dynamic 3D joint angle feedback, concentric Apple Fitness activity rings, and campus peer leaderboards.

---

## 🌟 Key Features

### 1. 🤼 3D AI Dangal Pose Coach (Edge Vision)
- **Zero-Latency In-Browser Vision**: Powered by MediaPipe 33-landmark skeleton tracking running 100% on the user's device with complete privacy.
- **Biomechanical Angle HUD**: Real-time knee, hip, elbow, and torso angle calculation with dynamic form correction ("Chest up! Keep spine upright!").
- **Visual Combat Impacts**: Golden shockwave ripple overlay and 3D screen vibration on completing rep milestones.
- **Synthesized Audio Engine**: Web Audio API ring bell gong (Ding! Ding!), combat punch thuds, victory fanfares, and Web Speech synthesis commentary.

### 2. ⭕ Apple Fitness Concentric Activity Rings & Daily Goals
- **Interactive Concentric Rings**: Live SVG arc visualizers for **Move** (Calories), **Exercise** (Minutes), and **Stand** (Hours).
- **Interactive Daily Habits Checklist**: Quick-tap toggle for hydration, focus blocks, steps, and workout goals with instant progress recalculation.

### 3. 🏆 Interactive 3D Championship Mace & Trophy
- **WebGL Three.js 3D Visualizer**: Rendered 3D Gada (Wrestler Mace) with metallic gold specular shaders and ambient arena lighting.
- **Full Touch & Mouse Controls**: Drag, rotate, and interact with the 3D trophy on mobile and desktop.

### 4. 🥇 Akhada Gamification & Campus Leaderboard
- **Pehelwan Wrestling Tiers**: Progress from *Akhada Initiate 🌱* → *Senior Malla Warrior 🦾* → *Kesari Contender 🏆* → *Rustam-e-Hind Titan 👑*.
- **Live SQLite Leaderboard**: Real-time rankings, streak shields, and XP progression.

### 5. 🥗 Warrior Diet & Campus Canteen Tracker
- **Student-Friendly Meals**: Pre-configured campus canteen items (Sprouts Usal, Paneer Bhurji, Sattu Drink, Boiled Eggs, Oats).
- **Macro Breakdown**: Real-time tracking of Protein (g), Carbs (g), and Total Calories.

### 6. 📱 Mobile First & PWA Ready
- **Lightweight AI Engine**: Automatically switches to ultra-fast model complexity on mobile phones for 30–60 FPS without battery drain.
- **Offline LocalStorage Sync**: Workouts and XP are securely preserved even if network connectivity drops.
- **Add to Home Screen**: Includes `manifest.json` for native app-like installation on iOS and Android.

---

## 🏗️ System Architecture

```text
+-------------------------------------------------------------------------+
|                           CLIENT BROWSER (PWA)                          |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | MediaPipe Pose 3D  |  | Three.js 3D Trophy |  | Web Audio Engine  |  |
|  | (Edge Vision AI)   |  | (WebGL Canvas)     |  | (Gong & Voice)    |  |
|  +--------------------+  +--------------------+  +-------------------+  |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | shadcn Activity    |  | Akhada Ranks &     |  | Canteen Macro     |  |
|  | 3-Ring Visualizer  |  | Campus Arena HUD   |  | Nutrition Tracker |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+-------------------------------------------------------------------------+
                                    |
                           REST API / Proxies
                                    v
+-------------------------------------------------------------------------+
|                          BACKEND (Flask + SQLite)                       |
|                                                                         |
|  • /api/workout/save      • /api/leaderboard      • /api/nutrition/log  |
|  • /api/user/profile      • /api/habits/today     • /api/network/info   |
|                                                                         |
|                     Database: fitvibe.db (SQLite3)                      |
+-------------------------------------------------------------------------+
```

---

## 📁 Repository Structure

```
FitVibe-AI/
├── prototype/
│   ├── app.py                  # Flask Application Server & SQLite Database APIs
│   ├── fitvibe.db              # SQLite Database (Users, Workouts, Leaderboard, Nutrition)
│   ├── requirements.txt        # Backend dependencies
│   ├── tunnel_service.py       # Cloudflare Tunnel integration for HTTPS mobile testing
│   ├── templates/
│   │   └── index.html          # Main Application Template (Tailwind, Lucide, 3D Canvas)
│   ├── static/
│   │   ├── manifest.json       # PWA Configuration
│   │   └── js/
│   │       ├── app.js          # App State, Three.js 3D Trophy, Activity Rings, Audio
│   │       └── pose_coach.js   # MediaPipe 3D Pose Detection & Rep Counting
│   ├── components/
│   │   ├── ui/
│   │   │   └── activity-card.tsx      # shadcn/ui React ActivityCard component
│   │   └── examples/
│   │       └── activity-card-demo.tsx # Demo integration
│   └── netlify/                # Standalone Static Deployment Package
│       ├── index.html
│       ├── netlify.toml        # Production headers and backend proxy redirects
│       ├── _redirects          # SPA fallback and API rewrites
│       ├── manifest.json
│       └── js/
├── SIH_2026_PS26196_Idea_Presentation.pptx # Official SIH 2026 Presentation PPT
├── generate_sih_ppt.py                     # Automated PPT generator script
├── requirements.txt                        # Top-level dependencies
├── .gitignore                              # Git exclusion rules
└── README.md                               # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.9+
- A modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox) with Webcam access

### 1. Clone the Repository
```bash
git clone https://github.com/sahiljadhav018/FitVibe-AI.git
cd FitVibe-AI
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Full-Stack Prototype
```bash
cd prototype
python app.py
```
Open **`https://127.0.0.1:5050`** in your browser. (Accept self-signed certificate for local webcam permissions).

---

## ⚡ Instant Netlify Deployment (Zero Backend Needed)

1. Open **[Netlify Drop](https://app.netlify.com/drop)**.
2. Drag and drop the `prototype/netlify/` folder onto the page.
3. Your application is live immediately on a custom `.netlify.app` domain!

---

## 🎯 Smart India Hackathon (SIH 2026) Submission Details

* **Problem Statement ID:** 26196
* **Domain:** Healthcare & Fitness / Student Well-being
* **Idea PPT:** Included in the root directory as [`SIH_2026_PS26196_Idea_Presentation.pptx`](./SIH_2026_PS26196_Idea_Presentation.pptx)

---

## 👨‍💻 Developed By
* **Sahil Jadhav** ([@sahiljadhav018](https://github.com/sahiljadhav018))
* Project Repository: [https://github.com/sahiljadhav018/FitVibe-AI](https://github.com/sahiljadhav018/FitVibe-AI)
