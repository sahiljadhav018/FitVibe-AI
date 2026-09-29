// ==============================================================
// FitVibe AI - 3D Dangal AI Pose Engine (Mobile-Optimized & 3D Depth)
// ==============================================================

let camera = null;
let pose = null;
let isCameraRunning = false;
let currentExercise = "Baithak"; // Default: Desi Baithak
let repCount = 0;
let stage = "UP"; // "UP" or "DOWN"
let currentAccuracy = 95;
let caloriesBurned = 0.0;
let workoutStartTime = null;
let voiceEnabled = true;
let lastSpokenTime = 0;
let cameraFacingMode = "user"; // "user" or "environment"
let wakeLock = null;
let audioCtx = null;
let mediaStream = null;
let animFrameId = null;
let isProcessingFrame = false;

// Mobile device detection
const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// Initialize Web Audio API for synthesized Wrestling Ring Bell & Hits
function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// Auto-unlock AudioContext on first touch for mobile devices
function unlockMobileAudio() {
    try {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    } catch (e) {}
}
['touchstart', 'touchend', 'click'].forEach(evt => {
    document.addEventListener(evt, unlockMobileAudio, { once: true, passive: true });
});

// 1. Synthesized Wrestling Ring Bell (Gong - Ding! Ding!)
function playGongSound() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const freqs = [840, 1120, 1480, 2100];
        freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = idx % 2 === 0 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.3 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.6);
        });
    } catch (e) {
        console.warn("Audio error:", e);
    }
}

// 2. Combat Impact Hit Thud
function playPunchSound() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.16);

        gain.gain.setValueAtTime(0.65, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    } catch (e) {}
}

// 3. Victory Fanfare
function playVictorySound() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(0.3, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.45);
        });
    } catch (e) {}
}

// Visual Combat Impact: Golden Ripple & 3D Screen Shake
function triggerCombatEffects() {
    playPunchSound();

    const overlay = document.getElementById('combat_impact_overlay');
    if (overlay) {
        overlay.style.opacity = '1';
        setTimeout(() => { overlay.style.opacity = '0'; }, 320);
    }

    if (repCount % 5 === 0 && repCount > 0) {
        playGongSound();
        const body = document.getElementById('app_body');
        if (body) {
            body.classList.add('shake-impact');
            setTimeout(() => { body.classList.remove('shake-impact'); }, 420);
        }
    }
}

// Voice Commentary Engine in English (Safe for Mobile iOS & Android)
function speak(text, force = false) {
    if (!voiceEnabled) return;
    const now = Date.now();
    if (!force && now - lastSpokenTime < 1600) return;
    lastSpokenTime = now;

    try {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.05;
            utterance.pitch = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    } catch (e) {
        console.warn("Speech error:", e);
    }
    const voiceTextEl = document.getElementById('coach_voice_text');
    if (voiceTextEl) voiceTextEl.innerText = `"${text}"`;
}

function triggerHaptic() {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate([60]);
        } catch (e) {}
    }
}

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) {}
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release().then(() => { wakeLock = null; }).catch(() => {});
    }
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const icon = document.getElementById('icon_voice');
    if (voiceEnabled) {
        if (icon) icon.className = "w-4 h-4 text-amber-400";
        speak("Voice commentary active!", true);
    } else {
        if (icon) icon.className = "w-4 h-4 text-slate-500";
        try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
    }
    triggerHaptic();
}

function updateCameraMirror() {
    const video = document.getElementById('webcam_video');
    const canvas = document.getElementById('pose_canvas');
    const transformStyle = (cameraFacingMode === "user") ? "scaleX(-1)" : "none";
    if (video) video.style.transform = transformStyle;
    if (canvas) canvas.style.transform = transformStyle;
}

function flipCamera() {
    cameraFacingMode = (cameraFacingMode === "user") ? "environment" : "user";
    updateCameraMirror();
    triggerHaptic();
    if (isCameraRunning) {
        toggleCamera().then(() => { toggleCamera(); });
    } else {
        speak(`Camera switched to ${cameraFacingMode === "user" ? "Front" : "Rear"}`);
    }
}

function selectExercise(name) {
    currentExercise = name;
    stage = "UP";
    triggerHaptic();

    ['Baithak', 'Dand', 'SuryaNamaskar', 'Bridge'].forEach(ex => {
        const btn = document.getElementById(`ex_${ex}`);
        if (!btn) return;
        if (ex === name) {
            btn.className = "ex-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-black shadow-md shadow-amber-500/30 whitespace-nowrap transition flex items-center space-x-1";
        } else {
            btn.className = "ex-pill px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 hover:text-white whitespace-nowrap transition flex items-center space-x-1";
        }
    });

    const labels = {
        'Baithak': 'DESI BAITHAK (HINDU SQUATS)',
        'Dand': 'DESI DAND (HINDU PUSH-UPS)',
        'SuryaNamaskar': 'SURYA NAMASKAR FLOW',
        'Bridge': 'WRESTLER NECK BRIDGE'
    };

    const hudLabel = document.getElementById('hud_exercise_label');
    if (hudLabel) hudLabel.innerText = labels[name] || name.toUpperCase();

    playGongSound();
    speak(`Selected ${labels[name] || name}. Ready to train!`);
}

function adjustReps(delta) {
    repCount = Math.max(0, repCount + delta);
    const repEl = document.getElementById('metric_reps');
    if (repEl) repEl.innerText = repCount;
    caloriesBurned = +(repCount * 1.5).toFixed(1);
    const calEl = document.getElementById('metric_calories');
    if (calEl) calEl.innerText = caloriesBurned;
    triggerHaptic();
    triggerCombatEffects();
}

function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360.0 - angle;
    return Math.round(angle);
}

function updateHUD(angle, stageText, feedbackText, isGoodForm = true) {
    const angleEl = document.getElementById('hud_angle_val');
    const stageEl = document.getElementById('hud_stage_val');
    const barEl = document.getElementById('hud_angle_progress');
    const badge = document.getElementById('hud_feedback_badge');

    if (angleEl) angleEl.innerText = `${angle}°`;
    if (stageEl) stageEl.innerText = `STAGE: ${stageText}`;
    if (barEl) {
        const pct = Math.min(100, Math.max(5, Math.round((angle / 180) * 100)));
        barEl.style.width = `${pct}%`;
    }
    if (badge) {
        badge.innerText = feedbackText;
        badge.className = isGoodForm 
            ? "bg-amber-500 text-black font-black text-xs px-3 py-1.5 rounded-xl shadow-lg font-wrestling"
            : "bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg font-wrestling";
    }
}

// MediaPipe Pose Callback with 3D Depth
function onPoseResults(results) {
    const video = document.getElementById('webcam_video');
    const canvas = document.getElementById('pose_canvas');
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');

    const targetW = video.videoWidth || 640;
    const targetH = video.videoHeight || 480;
    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.poseLandmarks) {
        ctx.restore();
        return;
    }

    const lm = results.poseLandmarks;

    const leftHip = lm[23], rightHip = lm[24];
    const leftKnee = lm[25], rightKnee = lm[26];
    const leftAnkle = lm[27], rightAnkle = lm[28];
    const leftShoulder = lm[11], rightShoulder = lm[12];
    const leftElbow = lm[13], rightElbow = lm[14];
    const leftWrist = lm[15], rightWrist = lm[16];

    const isVisible = (leftHip && rightHip && leftKnee && rightKnee);
    const checkVis = document.getElementById('check_visibility');
    if (checkVis) {
        checkVis.innerHTML = isVisible 
            ? '<span class="text-amber-400 font-bold">✓</span> <span class="text-white">Full Body in 3D Frame</span>'
            : '<span class="text-red-400 font-bold">!</span> <span class="text-slate-400">Step back into view</span>';
    }

    let jointAngle = 180;
    let isGoodForm = true;

    // 1. DESI BAITHAK (HINDU SQUATS)
    if (currentExercise === "Baithak" && leftHip && leftKnee && leftAnkle) {
        jointAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const torsoAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

        const checkDepth = document.getElementById('check_depth');
        const checkBack = document.getElementById('check_back');

        if (jointAngle < 95) {
            if (stage === "UP") {
                stage = "DOWN";
                speak("Deep depth! Drive up!");
            }
            if (checkDepth) checkDepth.innerHTML = '<span class="text-amber-400 font-bold">✓</span> <span class="text-white">Full Depth Achieved</span>';
        }

        if (torsoAngle < 130) {
            isGoodForm = false;
            updateHUD(jointAngle, stage, "Chest up! Keep spine upright!", false);
            if (checkBack) checkBack.innerHTML = '<span class="text-red-400 font-bold">!</span> <span class="text-red-300">Torso leaning too forward</span>';
        } else {
            if (checkBack) checkBack.innerHTML = '<span class="text-amber-400 font-bold">✓</span> <span class="text-white">Upright Torso & Aligned Spine</span>';
        }

        if (jointAngle > 160 && stage === "DOWN") {
            stage = "UP";
            repCount++;
            caloriesBurned = +(caloriesBurned + 1.5).toFixed(1);
            const repEl = document.getElementById('metric_reps');
            const calEl = document.getElementById('metric_calories');
            if (repEl) repEl.innerText = repCount;
            if (calEl) calEl.innerText = caloriesBurned;
            triggerHaptic();
            triggerCombatEffects();
            speak(`Rep ${repCount}! Excellent power!`);
            updateHUD(jointAngle, stage, `Rep ${repCount} Complete! Solid form!`, true);
        } else if (isGoodForm) {
            updateHUD(jointAngle, stage, stage === "DOWN" ? "Power back to top!" : "Descend smoothly", true);
        }
    }

    // 2. DESI DAND (HINDU PUSH-UPS)
    else if (currentExercise === "Dand" && leftShoulder && leftElbow && leftWrist) {
        jointAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        const checkDepth = document.getElementById('check_depth');
        const checkBack = document.getElementById('check_back');

        if (jointAngle < 90) {
            if (stage === "UP") {
                stage = "DOWN";
                speak("Bottom chest swoop! Push up!");
            }
            if (checkDepth) checkDepth.innerHTML = '<span class="text-amber-400 font-bold">✓</span> <span class="text-white">Chest to Mat Depth</span>';
        }

        if (jointAngle > 160 && stage === "DOWN") {
            stage = "UP";
            repCount++;
            caloriesBurned = +(caloriesBurned + 2.0).toFixed(1);
            const repEl = document.getElementById('metric_reps');
            const calEl = document.getElementById('metric_calories');
            if (repEl) repEl.innerText = repCount;
            if (calEl) calEl.innerText = caloriesBurned;
            triggerHaptic();
            triggerCombatEffects();
            speak(`Dand ${repCount}! Pure Pehelwan strength!`);
            updateHUD(jointAngle, stage, `Dand ${repCount} Complete!`, true);
            if (checkBack) checkBack.innerHTML = '<span class="text-amber-400 font-bold">✓</span> <span class="text-white">Cobra Arch Locked</span>';
        } else {
            updateHUD(jointAngle, stage, stage === "DOWN" ? "Arch into upward dog!" : "Dip down smoothly", true);
        }
    }

    // 3. SURYA NAMASKAR
    else if (currentExercise === "SuryaNamaskar" && leftShoulder && leftHip && leftAnkle) {
        jointAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
        if (jointAngle < 90 && stage === "UP") {
            stage = "DOWN";
            speak("Forward fold. Reach feet.");
        }
        if (jointAngle > 165 && stage === "DOWN") {
            stage = "UP";
            repCount++;
            caloriesBurned = +(caloriesBurned + 3.2).toFixed(1);
            const repEl = document.getElementById('metric_reps');
            const calEl = document.getElementById('metric_calories');
            if (repEl) repEl.innerText = repCount;
            if (calEl) calEl.innerText = caloriesBurned;
            triggerHaptic();
            triggerCombatEffects();
            speak(`Cycle ${repCount} complete! Salute!`);
            updateHUD(jointAngle, stage, `Salute ${repCount} Complete`, true);
        } else {
            updateHUD(jointAngle, stage, stage === "DOWN" ? "Extend back to mountain" : "Inhale and arch", true);
        }
    }

    // 4. NECK BRIDGE
    else if (currentExercise === "Bridge" && leftShoulder && leftHip && leftKnee) {
        jointAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
        if (jointAngle > 165) {
            if (stage === "UP") {
                stage = "HOLD";
                speak("Hold bridge! Squeeze glutes!");
            }
            updateHUD(jointAngle, "HOLDING", "Peak Bridge Locked! Hold firm!", true);
        } else {
            if (stage === "HOLD") {
                stage = "UP";
                repCount++;
                caloriesBurned = +(caloriesBurned + 1.2).toFixed(1);
                const repEl = document.getElementById('metric_reps');
                const calEl = document.getElementById('metric_calories');
                if (repEl) repEl.innerText = repCount;
                if (calEl) calEl.innerText = caloriesBurned;
                triggerHaptic();
                triggerCombatEffects();
            }
            updateHUD(jointAngle, "DRIVE", "Drive hips upward", true);
        }
    }

    // 3D Skeleton Rendering
    draw3DSkeleton(ctx, lm, canvas.width, canvas.height, isGoodForm);
    ctx.restore();
}

// 3D Skeleton Render: Depth Line-Width + Metallic Spheres
function draw3DSkeleton(ctx, landmarks, w, h, isGoodForm) {
    const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
        [11, 23], [12, 24], [23, 24],
        [23, 25], [25, 27], [24, 26], [26, 28]
    ];

    connections.forEach(([p1, p2]) => {
        const pt1 = landmarks[p1];
        const pt2 = landmarks[p2];
        if (pt1 && pt2 && (pt1.visibility > 0.35 || pt1.visibility === undefined)) {
            const avgZ = ((pt1.z || 0) + (pt2.z || 0)) / 2;
            const depthWidth = Math.max(2.0, Math.min(6.0, 3.8 - avgZ * 5.0));

            ctx.beginPath();
            ctx.lineWidth = depthWidth;
            ctx.strokeStyle = isGoodForm ? '#F59E0B' : '#EF4444';
            ctx.shadowColor = isGoodForm ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)';
            ctx.shadowBlur = 6;
            ctx.moveTo(pt1.x * w, pt1.y * h);
            ctx.lineTo(pt2.x * w, pt2.y * h);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    });

    landmarks.forEach((pt, i) => {
        if (i >= 11 && (pt.visibility > 0.35 || pt.visibility === undefined)) {
            const z = pt.z || 0;
            const radius = Math.max(3.0, Math.min(8.0, 5.0 - z * 7.0));
            const x = pt.x * w;
            const y = pt.y * h;

            const grad = ctx.createRadialGradient(
                x - radius * 0.35, y - radius * 0.35, radius * 0.1,
                x, y, radius
            );
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.3, '#F59E0B');
            grad.addColorStop(0.8, '#EA580C');
            grad.addColorStop(1, '#7C2D12');

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = grad;
            ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });
}

// Stop Camera Cleanly
function stopCameraStream(video) {
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    if (mediaStream) {
        try {
            mediaStream.getTracks().forEach(track => track.stop());
        } catch (e) {}
        mediaStream = null;
    }
    if (video) {
        video.srcObject = null;
    }
    if (camera) {
        try { camera.stop(); } catch (e) {}
        camera = null;
    }
}

// Toggle Camera Function with Native getUserMedia & MediaPipe Fallback
async function toggleCamera() {
    const btnText = document.getElementById('btn_cam_text');
    const placeholder = document.getElementById('camera_placeholder');
    const hud = document.getElementById('camera_hud');
    const bottomBar = document.getElementById('camera_bottom_bar');
    const video = document.getElementById('webcam_video');
    const canvas = document.getElementById('pose_canvas');

    if (isCameraRunning) {
        isCameraRunning = false;
        stopCameraStream(video);

        if (btnText) btnText.innerText = "Turn On Camera";
        if (placeholder) placeholder.classList.remove('hidden');
        if (hud) hud.classList.add('hidden');
        if (bottomBar) bottomBar.classList.add('hidden');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        releaseWakeLock();
        speak("Session paused. Outstanding effort!");
        return;
    }

    try {
        if (btnText) btnText.innerText = "Starting Camera...";
        workoutStartTime = Date.now();
        requestWakeLock();
        playGongSound();

        // 1. Initialize Pose model
        if (!pose) {
            pose = new Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
            });
            pose.setOptions({
                // Model complexity 0 on mobile phones ensures 30-60 FPS without overheating
                modelComplexity: isMobileDevice ? 0 : 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            pose.onResults(onPoseResults);
        }

        // 2. Start Native getUserMedia Camera
        const constraints = {
            audio: false,
            video: {
                facingMode: { ideal: cameraFacingMode },
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        };

        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (constraintErr) {
            console.warn("Flexible constraint retry:", constraintErr);
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: { facingMode: cameraFacingMode }
            });
        }

        video.srcObject = mediaStream;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.muted = true;
        await video.play();

        updateCameraMirror();

        isCameraRunning = true;
        if (btnText) btnText.innerText = "Stop Camera";
        if (placeholder) placeholder.classList.add('hidden');
        if (hud) hud.classList.remove('hidden');
        if (bottomBar) bottomBar.classList.remove('hidden');
        speak(`3D AI Coach active! Begin your ${currentExercise}!`);

        // 3. Process Video Frames (Crash-proof check for readyState & dimensions)
        async function renderLoop() {
            if (!isCameraRunning) return;

            if (pose && video.readyState >= 2 && video.videoWidth > 0 && !isProcessingFrame) {
                isProcessingFrame = true;
                try {
                    await pose.send({ image: video });
                } catch (sendErr) {
                    console.warn("Frame send:", sendErr);
                } finally {
                    isProcessingFrame = false;
                }
            }
            animFrameId = requestAnimationFrame(renderLoop);
        }

        animFrameId = requestAnimationFrame(renderLoop);

    } catch (err) {
        console.error("Camera access error:", err);
        stopCameraStream(video);
        isCameraRunning = false;
        if (btnText) btnText.innerText = "Turn On Camera";
        releaseWakeLock();

        alert("📱 Camera Permission Alert:\n\nPlease tap 'Allow' when your browser asks for camera access.\n\n• If blocked: Tap the Lock 🔒 icon in the URL bar and enable Camera.\n• You can also tap '💥 Simulate 1 Rep' right now to test 3D effects and audio without a camera!");
    }
}

// Simulate 1 Rep with 3D Impact & Sound
function simulateRep() {
    repCount++;
    caloriesBurned = +(caloriesBurned + 1.5).toFixed(1);
    currentAccuracy = Math.floor(Math.random() * (98 - 93 + 1)) + 93;

    const repEl = document.getElementById('metric_reps');
    const calEl = document.getElementById('metric_calories');
    const accEl = document.getElementById('metric_accuracy');

    if (repEl) repEl.innerText = repCount;
    if (calEl) calEl.innerText = caloriesBurned;
    if (accEl) accEl.innerText = currentAccuracy;

    updateHUD(84, "REP COMPLETE", `Rep ${repCount} Complete! Outstanding!`, true);
    triggerHaptic();
    triggerCombatEffects();
    speak(`Rep ${repCount} complete!`);
}

// Save Workout to Backend SQLite (with LocalStorage Mobile Fallback)
async function saveCurrentWorkout() {
    if (repCount === 0) {
        alert("Complete at least 1 rep (or click 'Simulate 1 Rep') before saving!");
        return;
    }

    const duration = workoutStartTime ? Math.round((Date.now() - workoutStartTime) / 1000) : 60;
    const currentReps = repCount;
    const currentCals = caloriesBurned || (repCount * 1.5);
    const xpEarned = repCount * 25;

    try {
        const res = await fetch('/api/workout/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                exercise: currentExercise,
                reps: currentReps,
                accuracy: currentAccuracy,
                calories: currentCals,
                duration_sec: duration,
                feedback: `Tracked with 3D AI Vision. Average Form Accuracy: ${currentAccuracy}%`
            })
        });

        const data = await res.json();
        if (data.status === "success") {
            triggerHaptic();
            playVictorySound();
            speak(`Workout saved! +${data.xp_earned} XP earned! You climbed the campus ranks!`, true);
            alert(`🏆 Workout Saved Successfully!\n\n• Completed: ${currentReps} ${currentExercise}\n• Energy: ${data.calories} kcal\n• XP Earned: +${data.xp_earned} XP\n• Campus Rank: #${data.new_rank}`);
            
            repCount = 0;
            caloriesBurned = 0.0;
            const repEl = document.getElementById('metric_reps');
            const calEl = document.getElementById('metric_calories');
            if (repEl) repEl.innerText = "0";
            if (calEl) calEl.innerText = "0.0";

            if (typeof fetchUserProfile === 'function') fetchUserProfile();
            if (typeof fetchLeaderboard === 'function') fetchLeaderboard();
            if (typeof fetchWorkoutHistory === 'function') fetchWorkoutHistory();
            return;
        }
    } catch (e) {
        console.warn("Server save offline, saving to mobile storage:", e);
    }

    // Mobile Offline Fallback (never loses user workout or XP!)
    try {
        let localWorkouts = JSON.parse(localStorage.getItem('fitvibe_workouts') || '[]');
        localWorkouts.unshift({
            id: Date.now(),
            exercise: currentExercise,
            reps: currentReps,
            accuracy: currentAccuracy,
            calories: currentCals,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            feedback: "Tracked with 3D AI Vision (Mobile Synced)"
        });
        localStorage.setItem('fitvibe_workouts', JSON.stringify(localWorkouts.slice(0, 20)));

        let userXp = parseInt(localStorage.getItem('fitvibe_xp') || '2273') + xpEarned;
        localStorage.setItem('fitvibe_xp', userXp.toString());

        triggerHaptic();
        playVictorySound();
        speak(`Workout saved! +${xpEarned} XP earned!`, true);
        alert(`🏆 Workout Saved Successfully (Mobile Sync)!\n\n• Completed: ${currentReps} ${currentExercise}\n• Energy: ${currentCals} kcal\n• XP Earned: +${xpEarned} XP\n• Status: Saved to device`);

        repCount = 0;
        caloriesBurned = 0.0;
        const repEl = document.getElementById('metric_reps');
        const calEl = document.getElementById('metric_calories');
        if (repEl) repEl.innerText = "0";
        if (calEl) calEl.innerText = "0.0";

        if (typeof fetchUserProfile === 'function') fetchUserProfile();
        if (typeof fetchWorkoutHistory === 'function') fetchWorkoutHistory();
    } catch (localErr) {
        console.error("Local save error:", localErr);
    }
}
