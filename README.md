# FitVibe AI - AI-Powered Student Fitness & Dangal Posture Coach

> **Smart India Hackathon 2026** | Problem Statement ID: **26196**  
> **Domain:** Healthcare, Student Wellness & Fitness

FitVibe AI is an interactive, browser-based fitness web application designed to help college students stay active and build healthy daily habits. Instead of relying on generic workout timers or expensive smart wearables, FitVibe AI uses real-time computer vision to track exercise form and count repetitions directly through a phone or laptop camera.

The project incorporates traditional Indian wrestling (*Akhada / Dangal*) bodyweight movements—such as **Desi Baithak** (Hindu Squats), **Desi Dand** (Hindu Pushups), **Surya Namaskar**, and **Wrestler Neck Bridges**—combined with campus peer leaderboards and daily activity tracking.

---

## The Problem It Solves

College students spend 8 to 12 hours a day sitting during lectures, lab sessions, and study hours. This sedentary lifestyle frequently leads to forward head posture, rounded shoulders, lower back stiffness, and reduced energy levels.

Most existing fitness applications either require paid gym subscriptions, wearable smart bands, or simply show video clips with no interactive feedback on whether the student is performing the exercise correctly. FitVibe AI solves this by:
1. Running pose estimation entirely in the browser using WebAssembly—zero latency and full privacy (video frames never leave the device).
2. Providing real-time visual and voice feedback on joint angles and posture alignment.
3. Keeping students motivated through campus ranks, daily movement rings, and friendly peer competition.

---

## Features

- **Real-Time Camera Pose Coach**: Uses MediaPipe Pose (33 3D body landmarks) to calculate joint angles in real time. It detects depth on squats, chest dips on pushups, and warns if the spine or torso leans too far forward.
- **Audio Feedback & Gong Effects**: Built with the Web Audio API to play responsive gym cues, count reps, and provide speech feedback so students don't need to stare at their screen during workouts.
- **Interactive 3D Trophy**: Rendered with Three.js WebGL, allowing students to inspect their milestone trophy with smooth touch and mouse rotation.
- **Daily Activity Rings & Habits**: Tracks daily movement (Move calories, Exercise minutes, Stand hours) alongside a checklist for hydration, posture breaks, and focus blocks.
- **Campus Akhada Ranks & Leaderboard**: Gamified progression tier system (*Akhada Initiate* &rarr; *Malla Warrior* &rarr; *Kesari Contender* &rarr; *Rustam-e-Hind Titan*).
- **Canteen Nutrition Tracker**: Practical macro tracker tailored to common college meals (Sprouts Usal, Paneer Bhurji, Sattu Drink, Boiled Eggs, Oats).
- **Mobile First & Offline Friendly**: Fully responsive on mobile screens with PWA install support. If network connectivity drops on campus Wi-Fi, workout history and XP are cached safely in local storage.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, CSS3, Tailwind CSS (CDN), Vanilla JavaScript |
| **Computer Vision** | MediaPipe Pose (Client-side WebAssembly) |
| **3D Graphics** | Three.js (WebGL) |
| **Audio Engine** | Web Audio API (Synthesizer), Web Speech API |
| **Backend** | Python 3.10+, Flask, Flask-CORS |
| **Database** | SQLite3 (`fitvibe.db`) |
| **Deployment** | Python WSGI / Netlify compatible static assets |

---

## Project Structure

```
FitVibe-AI/
├── docs/
│   └── SIH_2026_Presentation.pptx   # Official SIH idea presentation deck
├── static/
│   ├── js/
│   │   ├── app.js                   # Application state, 3D trophy, habits & audio
│   │   └── pose_coach.js            # MediaPipe camera integration & rep counting
│   └── manifest.json                # PWA configuration for mobile home screen
├── templates/
│   └── index.html                   # Main dashboard interface
├── .gitignore                       # Ignored files (pycache, local certs, logs)
├── app.py                           # Flask server and REST API endpoints
├── fitvibe.db                       # SQLite database seeded with campus leaderboard
├── requirements.txt                 # Python dependencies
└── README.md                        # Project documentation
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sahiljadhav018/FitVibe-AI.git
cd FitVibe-AI
```

### 2. Set up virtual environment & install requirements
```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux / macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Run the development server
```bash
python app.py
```

Open **`https://127.0.0.1:5050`** in your browser.  
*(Note: Because the browser requires HTTPS to grant camera permissions, the local server runs with SSL. Accept the self-signed certificate in your browser to proceed).*

---

## Hackathon Details

- **Event:** Smart India Hackathon (SIH 2026)
- **Problem Statement ID:** 26196
- **Presentation Deck:** The complete presentation file is available in the [`docs/`](./docs/SIH_2026_Presentation.pptx) folder.

---

## Author & Credits

Developed by **Sahil Jadhav** ([@sahiljadhav018](https://github.com/sahiljadhav018)) for Smart India Hackathon 2026.
