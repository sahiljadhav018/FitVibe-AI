// ==============================================================
// FitVibe AI AI - Core Interactive Engine for Campus Edition
// Built exclusively around the 7 Student Innovation Pillars
// ==============================================================

// 1. RAHUL'S DAY MILESTONES DATA
const RAHUL_MILESTONES = [
    {
        time: "09:00 AM • Morning Transit",
        title: "300m Campus Walk Challenge",
        icon: "🚶",
        pts: "+45 Points",
        prompt: "\"Rahul, your next lecture is at Block B in 12 mins. Skipping the campus shuttle for a brisk 4-min walk burns 35 kcal and hits your morning circulation target.\"",
        activeTime: "4 Minutes",
        cal: "38 kcal",
        cumActive: "4 Minutes",
        cumCal: "38 kcal",
        cumFatigue: "-10% Risk"
    },
    {
        time: "11:30 AM • Post-Lecture Break",
        title: "3-Minute Desk Thoracic Reset",
        icon: "🧘",
        pts: "+30 Points",
        prompt: "\"You've been seated for 2.5 hours in Thermodynamics theory. Do 60 seconds of chin tucks & shoulder rolls before moving to the next room.\"",
        activeTime: "3 Minutes",
        cal: "18 kcal",
        cumActive: "7 Minutes",
        cumCal: "56 kcal",
        cumFatigue: "-25% Risk"
    },
    {
        time: "01:00 PM • Canteen / Mess Rush",
        title: "3-Flight Stair Climbing Quest",
        icon: "🪜",
        pts: "+40 Points",
        prompt: "\"Canteen is on the 3rd floor. Take the stairs instead of queuing for the slow elevator. 48 steps burns quick glycogen and activates glutes!\"",
        activeTime: "3 Minutes",
        cal: "32 kcal",
        cumActive: "10 Minutes",
        cumCal: "88 kcal",
        cumFatigue: "-32% Risk"
    },
    {
        time: "04:30 PM • Peer Schedule Sync",
        title: "Campus Walking Match with Rohan",
        icon: "👥",
        pts: "+60 Points",
        prompt: "\"FitVibe AI detected both you and Rohan (Hostel B) are free until 5:15 PM. 15-minute campus loop sync accepted! Accountability streak active.\"",
        activeTime: "12 Minutes",
        cal: "75 kcal",
        cumActive: "22 Minutes",
        cumCal: "163 kcal",
        cumFatigue: "-40% Risk"
    },
    {
        time: "06:00 PM • Evening Wind-Down",
        title: "8-Minute Dorm-Room Calisthenics",
        icon: "⚡",
        pts: "+55 Points",
        prompt: "\"No gym membership or equipment needed. 8-minute push-up and Hindu squat drill in your hostel room to close your daily Move ring.\"",
        activeTime: "8 Minutes",
        cal: "65 kcal",
        cumActive: "30 Minutes",
        cumCal: "228 kcal",
        cumFatigue: "-48% Risk"
    }
];

let currentRahulIndex = 0;
let rahulAutoTimer = null;

function setRahulStep(index) {
    currentRahulIndex = index;
    const data = RAHUL_MILESTONES[index];
    if (!data) return;

    for (let i = 0; i < 5; i++) {
        const btn = document.getElementById(`rahul_btn_${i}`);
        if (btn) {
            if (i === index) {
                btn.className = "rahul-step-btn p-3 rounded-2xl border text-center transition bg-blue-600 text-white border-blue-500 shadow-md";
            } else {
                btn.className = "rahul-step-btn p-3 rounded-2xl border text-center transition bg-white/10 text-white border-white/15 hover:bg-white/20";
            }
        }
    }

    const icon = document.getElementById('rahul_icon');
    const timeLabel = document.getElementById('rahul_time_label');
    const title = document.getElementById('rahul_title');
    const pts = document.getElementById('rahul_pts');
    const prompt = document.getElementById('rahul_prompt');
    const timeStat = document.getElementById('rahul_time_stat');
    const calStat = document.getElementById('rahul_cal_stat');

    const cumActive = document.getElementById('cum_active_time');
    const cumCal = document.getElementById('cum_calories');
    const cumFatigue = document.getElementById('cum_fatigue');

    if (icon) icon.innerText = data.icon;
    if (timeLabel) timeLabel.innerText = data.time;
    if (title) title.innerText = data.title;
    if (pts) pts.innerText = data.pts;
    if (prompt) prompt.innerText = data.prompt;
    if (timeStat) timeStat.innerText = data.activeTime;
    if (calStat) calStat.innerText = data.cal;

    if (cumActive) cumActive.innerText = data.cumActive;
    if (cumCal) cumCal.innerText = data.cumCal;
    if (cumFatigue) cumFatigue.innerText = data.cumFatigue;
}

function advanceRahulStep() {
    const next = (currentRahulIndex + 1) % RAHUL_MILESTONES.length;
    setRahulStep(next);
}

function runAutoRahulDemo() {
    const storySec = document.getElementById('story');
    if (storySec) storySec.scrollIntoView({ behavior: 'smooth' });

    if (rahulAutoTimer) {
        clearInterval(rahulAutoTimer);
        rahulAutoTimer = null;
    }
    setRahulStep(0);
    let step = 0;
    rahulAutoTimer = setInterval(() => {
        step++;
        if (step >= RAHUL_MILESTONES.length) {
            clearInterval(rahulAutoTimer);
            rahulAutoTimer = null;
            return;
        }
        setRahulStep(step);
    }, 2800);
}

// 2. FITQUEST QUEST CLAIM
let userXP = 1850;

function claimQuest(btn, xp) {
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    userXP += xp;
    btn.className = "px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold whitespace-nowrap shadow-sm";
    btn.innerHTML = `<span class="flex items-center gap-1">✓ Claimed +${xp} XP</span>`;

    const xpEl = document.getElementById('user_total_xp');
    if (xpEl) xpEl.innerText = userXP.toLocaleString();

    // Trigger visual confetti/toast
    const toast = document.createElement('div');
    toast.className = "fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500";
    toast.innerHTML = `<span class="text-base">🎉</span><span>Quest Completed! +${xp} XP added to your College League.</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// 3. AI BEHAVIORAL INACTIVITY DIAGNOSIS
const DIAG_SCENARIOS = [
    {
        tag: "Time-Crunched Protocol",
        recommendation: "“You do NOT need a 1-hour workout. Here is a 12-minute activity plan distributed across your day: 4 min walking at morning bus stop, 4 min stair climb to 2nd-floor lab, and 4 min shoulder decompression before bed.”",
        steps: [
            { name: "1. Morning Transit Stride", desc: "4 Minutes • +35 kcal" },
            { name: "2. Inter-Lecture Stair Climb", desc: "4 Minutes • +32 kcal" },
            { name: "3. Post-Study Spine Decompression", desc: "4 Minutes • Spinal alignment" }
        ]
    },
    {
        tag: "Anti-Gym Protocol",
        recommendation: "“Zero gym required. You don't need weights or gym mirrors. Your plan relies 100% on outdoor campus walks, stairs, and bodyweight posture resetting.”",
        steps: [
            { name: "1. Botanical Garden Walk Loop", desc: "10 Minutes • Natural sunlight" },
            { name: "2. Tree-Lined Spine Brisk Walk", desc: "6 Minutes • +55 kcal" },
            { name: "3. Doorframe Chest Opener", desc: "2 Minutes • Zero sweat" }
        ]
    },
    {
        tag: "Consistency Rebuilder",
        recommendation: "“You keep quitting because 45 minutes is too high a barrier. We reduce your daily goal to just 4 minutes. A 7-day streak builds behavioral habit before intensity.”",
        steps: [
            { name: "1. 7-Day Consistency Micro-Challenge", desc: "4 Minutes Daily • 100% completion target" },
            { name: "2. Accountability Partner Matching", desc: "Paired with roommate to prevent skipping" },
            { name: "3. Streak Milestone Shield", desc: "Earn campus canteen points on Day 7" }
        ]
    },
    {
        tag: "Ergonomic & Neck Relief",
        recommendation: "“Hyperfocus while coding causes anterior pelvic tilt and forward head posture. We install silent background prompts every 50 minutes to decompress your cervical spine.”",
        steps: [
            { name: "1. Chin Tucks & Levator Scapulae Stretch", desc: "90 sec • Immediate neck release" },
            { name: "2. 20-20-20 Eye & Posture Break", desc: "Look 20ft away for 20 sec" },
            { name: "3. Standing Glute Activations", desc: "Reactivates dormant hip flexors" }
        ]
    }
];

function diagnoseInactivity(index) {
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`diag_btn_${i}`);
        if (btn) {
            btn.className = (i === index)
                ? "diag-btn w-full p-4 rounded-2xl border text-left transition bg-purple-50 border-purple-300 shadow-sm"
                : "diag-btn w-full p-4 rounded-2xl border text-left transition bg-slate-50 border-slate-200 hover:bg-slate-100";
        }
    }

    const data = DIAG_SCENARIOS[index];
    if (!data) return;

    const tagEl = document.getElementById('ai_diag_tag');
    const textEl = document.getElementById('ai_diag_text');
    const stepsEl = document.getElementById('ai_diag_steps');

    if (tagEl) tagEl.innerText = data.tag;
    if (textEl) textEl.innerText = data.recommendation;
    if (stepsEl) {
        stepsEl.innerHTML = data.steps.map(s => `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span class="font-bold text-slate-800">${s.name}</span>
                <span class="text-slate-500">${s.desc}</span>
            </div>
        `).join('');
    }
}

// 4. MICROFIT TIMETABLE ROUTINE & COUNTDOWN
let microLiveMinutes = 4;
let microLiveSeconds = 240;
let microLiveTimer = null;
let isMicroLiveRunning = false;

function launchMicroFitSession(mins) {
    microLiveMinutes = mins;
    microLiveSeconds = mins * 60;
    updateMicroLiveTimerDisp();
    
    const badge = document.getElementById('micro_active_badge');
    const title = document.getElementById('micro_active_title');
    if (badge) badge.innerText = `${mins}-Min Routine Selected`;
    if (title) title.innerText = mins === 4 ? "4-Minute Desk & Spine Reset" : "3-Minute Canteen Stair Surge";

    const microSec = document.getElementById('microfit');
    if (microSec) microSec.scrollIntoView({ behavior: 'smooth' });
}

function updateMicroLiveTimerDisp() {
    const mins = Math.floor(microLiveSeconds / 60);
    const secs = microLiveSeconds % 60;
    const disp = document.getElementById('micro_live_timer');
    if (disp) {
        disp.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

function toggleMicroTimerLive() {
    const label = document.getElementById('btn_micro_live_label');
    if (isMicroLiveRunning) {
        clearInterval(microLiveTimer);
        isMicroLiveRunning = false;
        if (label) label.innerText = "Resume Session";
    } else {
        isMicroLiveRunning = true;
        if (label) label.innerText = "Pause Session";

        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance("Starting micro session. Keep your spine straight.");
            utter.rate = 1.0;
            window.speechSynthesis.speak(utter);
        }

        microLiveTimer = setInterval(() => {
            if (microLiveSeconds > 0) {
                microLiveSeconds--;
                updateMicroLiveTimerDisp();
            } else {
                clearInterval(microLiveTimer);
                isMicroLiveRunning = false;
                if (label) label.innerText = "Session Complete! (+30 XP)";
                alert("🎉 MicroFit Routine Complete! You earned +30 XP for breaking your sedentary cycle.");
            }
        }, 1000);
    }
}

function resetMicroTimerLive() {
    clearInterval(microLiveTimer);
    isMicroLiveRunning = false;
    microLiveSeconds = microLiveMinutes * 60;
    updateMicroLiveTimerDisp();
    const label = document.getElementById('btn_micro_live_label');
    if (label) label.innerText = "Start Micro Session";
}

// 5. FITCIRCLE NOVEL SCIENTIFIC SCORE
function calculateFitCircleScore() {
    const stepsInput = document.getElementById('fc_steps');
    const sittingInput = document.getElementById('fc_sitting');
    const breaksInput = document.getElementById('fc_breaks');

    if (!stepsInput || !sittingInput || !breaksInput) return;

    const steps = parseInt(stepsInput.value);
    const sitting = parseFloat(sittingInput.value);
    const breaks = parseInt(breaksInput.value);

    document.getElementById('fc_steps_val').innerText = `${steps.toLocaleString()} Steps`;
    document.getElementById('fc_sitting_val').innerText = `${sitting.toFixed(1)} Hours Continuous`;
    document.getElementById('fc_breaks_val').innerText = `${breaks} Breaks (2-5 min each)`;

    // FitVibe AI Scientific Heuristic:
    const baseContribution = (steps / 1000) * 3.5;
    const sitPenalty = Math.max(0, sitting - 1.5) * 7.0;
    const breakBonus = breaks * 9.0;
    let score = Math.round(baseContribution - sitPenalty + breakBonus + 38);
    score = Math.max(15, Math.min(99, score));

    const disp = document.getElementById('fc_score_disp');
    const tier = document.getElementById('fc_tier_disp');
    const desc = document.getElementById('fc_desc_disp');
    const circle = document.getElementById('fc_circle');

    if (disp) disp.innerText = score;

    if (score >= 82) {
        tier.innerText = "Optimal Active Pattern (Grade A+)";
        tier.className = "text-lg font-bold text-emerald-400";
        desc.innerText = "Frequent breaks prevent cardiovascular stagnation and preserve posture.";
        if (circle) circle.className = "absolute inset-0 rounded-full border-4 border-emerald-400";
    } else if (score >= 60) {
        tier.innerText = "Moderate Active Routine (Grade B)";
        tier.className = "text-lg font-bold text-amber-400";
        desc.innerText = "Reasonable steps, but prolonged sitting creates neck and back strain.";
        if (circle) circle.className = "absolute inset-0 rounded-full border-4 border-amber-400";
    } else {
        tier.innerText = "High Sedentary Risk (Sedentary Penalty)";
        tier.className = "text-lg font-bold text-rose-400";
        desc.innerText = "High continuous sitting hours negate step gains. Add 2-min movement breaks.";
        if (circle) circle.className = "absolute inset-0 rounded-full border-4 border-rose-400";
    }
}

function applyOptimalFitCirclePreset() {
    const stepsInput = document.getElementById('fc_steps');
    const sittingInput = document.getElementById('fc_sitting');
    const breaksInput = document.getElementById('fc_breaks');
    if (stepsInput) stepsInput.value = 5500;
    if (sittingInput) sittingInput.value = 2.0;
    if (breaksInput) breaksInput.value = 6;
    calculateFitCircleScore();
}

// 6. ANTI-DROPOUT BUDDY MATCHER
function requestBuddy(name, btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.className = "w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-2";
    btn.innerHTML = `<span>✓ Paired with ${name.split(' ')[0]}</span>`;

    setTimeout(() => {
        alert(`🤝 Connected! You and ${name} now share an Accountability Score. When either of you walks or climbs stairs, both receive streak points!`);
    }, 200);
}

// 7. CAMPUS DIGITAL TWIN ZONE INSPECTOR
const CAMPUS_ZONES = {
    academic: {
        name: "Academic Block A • Lecture Halls",
        desc: "High density seating. Average uninterrupted sitting: 3.4 hrs. Action: Prompting 2-min chair mobility between lecture changeovers."
    },
    ground: {
        name: "Central Sports Arena & Oval",
        desc: "Peak movement zone. Football & athletics leagues active. Points multiplier 1.5x during evening hours."
    },
    labs: {
        name: "Central Coding Labs & Library",
        desc: "🔴 High Sedentary Risk Zone. Average continuous sitting: 4.5 hrs. FitVibe AI schedules silent posture nudges."
    },
    hostelA: {
        name: "Boys Hostel A Quadrangle",
        desc: "Current ranking #2 in Inter-Hostel Olympics. Active walking route: 79% resident participation."
    },
    corridor: {
        name: "Tree-Lined Central Spine",
        desc: "Main pedestrian corridor. 4,200 student crossings daily. Ideal location for 300m walking challenges."
    },
    hostelB: {
        name: "Hostel B Titans (Rank #1)",
        desc: "🏆 Campus consistency leader! 94% residents completed daily micro-stretch routines this week."
    }
};

function inspectCampusZone(zoneKey) {
    const data = CAMPUS_ZONES[zoneKey];
    if (!data) return;

    const nameEl = document.getElementById('zone_ins_name');
    const descEl = document.getElementById('zone_ins_desc');
    if (nameEl) nameEl.innerText = data.name;
    if (descEl) descEl.innerText = data.desc;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setRahulStep(0);
    calculateFitCircleScore();
});
