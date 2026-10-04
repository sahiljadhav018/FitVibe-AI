# FitVibe AI — Campus Movement & Natural Student Fitness

**Created by Sahil Jadhav**  
*The modern web platform turning everyday student routines into natural, lifelong health — without a gym.*

---

## 🌟 Why FitVibe AI?

Most traditional fitness apps tell busy college students to spend 60 minutes at the gym. When students have lectures from 9 AM to 4 PM, commute for 2 hours, and study for exams, they quickly quit.

**FitVibe AI takes a radically different approach:**
Instead of asking students to find spare time for fitness, it finds fitness inside their existing daily schedule:
- **Campus Transit:** Turns walks between lecture halls and library into step missions.
- **Micro-Breaks:** Detects long sitting periods and recommends 2–4 minute desk spine decompressions.
- **Stair Challenges:** Encourages taking the canteen and academic stairs instead of waiting for the elevator.
- **Anti-Dropout Network:** Matches students with roommates and classmates based on timetable free slots.
- **On-Device AI Camera:** Real-time pose correction and rep counting running 100% locally in the browser with full privacy.

---

## 🚀 Key Features

1. **Live On-Device AI Motion Coach:** MediaPipe-powered joint tracking for bodyweight squats and pushups directly via mobile or webcam.
2. **Interactive Behavioral AI Coach:** Answers custom student lifestyle situations (*"Exam tomorrow, 5m break"*, *"Neck stiffness"*).
3. **FitQuest Campus Environment:** Location-based missions and inter-college/hostel fitness league.
4. **MicroFit Timetable Engine:** Automatically schedules 2–4 minute activity pockets between lecture transitions.
5. **FitCircle Smart Pattern Score:** Scientifically rewards movement break distribution over dangerous uninterrupted 8-hour sitting.
6. **Anti-Dropout Accountability Partner Network:** Pair with campus buddies to maintain shared consistency streaks.
7. **Campus Activity Digital Twin:** Institutional analytics identifying high-sedentary zones across campus.

---

## 💻 Tech Stack

- **Frontend:** Responsive HTML5, Tailwind CSS, Lucide Icons
- **Computer Vision:** Google MediaPipe Pose (WebAssembly, on-device edge AI)
- **Backend & Database:** Python Flask, SQLite
- **Audio & Haptics:** Web Audio API, Web Speech API synthesis
- **Deployment:** Zero-dependency Netlify standalone package & local server

---

## 🏃 Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run local server
python app.py --no-ssl
```

Open `http://localhost:5050` in your browser.
