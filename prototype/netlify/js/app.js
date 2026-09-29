// ==============================================================
// FitVibe AI - 3D Visualizer & Full English Client Controller
// ==============================================================

let currentPlate = [];
let allFoodItems = [];
let filteredFoodItems = [];
let postureTimerInterval = null;
let postureTimerSeconds = 25 * 60;
let mobileUrl = "https://infinite-massive-andale-stainless.trycloudflare.com";

// Three.js 3D Visualizer variables
let scene, camera3D, renderer, trophyMesh;
let isDragging3D = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    init3DTrophy();
    initCard3DTilt();
    fetchNetworkInfo();
    fetchUserProfile();
    fetchLeaderboard();
    fetchFoodItems();
    fetchTodayNutrition();
    fetchTodayHabits();
    fetchWorkoutHistory();
    renderActivityGoals();
});

// ==============================================================
// 1. Three.js Interactive 3D Championship Trophy / Mace Model
// ==============================================================
function init3DTrophy() {
    const container = document.getElementById('three_canvas_container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 112;
    const height = container.clientHeight || 112;

    scene = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera3D.position.set(0, 0, 3.8);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for trophy
    trophyMesh = new THREE.Group();

    // Golden metallic material
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xF59E0B,
        metalness: 0.88,
        roughness: 0.18,
    });

    const bronzeMaterial = new THREE.MeshStandardMaterial({
        color: 0xEA580C,
        metalness: 0.82,
        roughness: 0.25,
    });

    // 1. Shaft (Mace / Gada Handle)
    const shaftGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.8, 16);
    const shaft = new THREE.Mesh(shaftGeo, bronzeMaterial);
    shaft.position.y = -0.3;
    trophyMesh.add(shaft);

    // 2. Mace Head (Golden Fluted Sphere)
    const headGeo = new THREE.SphereGeometry(0.48, 24, 16);
    const head = new THREE.Mesh(headGeo, goldMaterial);
    head.position.y = 0.65;
    trophyMesh.add(head);

    // 3. Central Championship Ring / Crown
    const ringGeo = new THREE.TorusGeometry(0.52, 0.08, 16, 32);
    const ring = new THREE.Mesh(ringGeo, goldMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.65;
    trophyMesh.add(ring);

    // 4. Base Knob
    const knobGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const knob = new THREE.Mesh(knobGeo, goldMaterial);
    knob.position.y = -1.2;
    trophyMesh.add(knob);

    scene.add(trophyMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xFFD700, 1.8);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xFF4500, 0.8);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    // Mouse / Touch Rotation Listeners
    container.addEventListener('mousedown', (e) => {
        isDragging3D = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging3D = false; });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging3D || !trophyMesh) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        trophyMesh.rotation.y += deltaX * 0.02;
        trophyMesh.rotation.x += deltaY * 0.02;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Touch Support for Mobile
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging3D = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging3D || !trophyMesh || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        trophyMesh.rotation.y += deltaX * 0.025;
        trophyMesh.rotation.x += deltaY * 0.025;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging3D = false; });

    // Render loop
    function animate3D() {
        requestAnimationFrame(animate3D);
        if (trophyMesh && !isDragging3D) {
            trophyMesh.rotation.y += 0.015;
            trophyMesh.rotation.z = Math.sin(Date.now() * 0.0015) * 0.08;
        }
        renderer.render(scene, camera3D);
    }
    animate3D();
}

// ==============================================================
// 2. Interactive 3D Card Tilt / Parallax Effect
// ==============================================================
function initCard3DTilt() {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// ==============================================================
// 3. Network / Public Link Controller
// ==============================================================
async function fetchNetworkInfo() {
    try {
        const res = await fetch('/api/network/info');
        const data = await res.json();
        if (data.status === 'success') {
            mobileUrl = data.public_url || data.https_url || "https://infinite-massive-andale-stainless.trycloudflare.com";
            const qrImg = document.getElementById('qr_code_img');
            const qrUrlText = document.getElementById('qr_mobile_url');
            if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(mobileUrl)}`;
            if (qrUrlText) qrUrlText.innerText = mobileUrl;
        }
    } catch (e) {
        console.warn("Network info fetch:", e);
    }
}

function openQrModal() {
    document.getElementById('qr_modal').classList.remove('hidden');
}

function closeQrModal() {
    document.getElementById('qr_modal').classList.add('hidden');
}

function copyMobileUrl() {
    navigator.clipboard.writeText(mobileUrl).then(() => {
        alert("Live mobile link copied to clipboard:\n\n" + mobileUrl);
    }).catch(() => {
        prompt("Copy this URL:", mobileUrl);
    });
}

// ==============================================================
// 4. Tab Navigation (Mobile & Desktop)
// ==============================================================
function switchTab(tabId) {
    const tabs = ['coach', 'leaderboard', 'nutrition', 'habits'];
    tabs.forEach(t => {
        const sec = document.getElementById(`section_${t}`);
        const desktopBtn = document.getElementById(`tab_${t}`);
        const mobileBtn = document.getElementById(`mob_tab_${t}`);

        if (t === tabId) {
            sec.classList.remove('hidden');
            if (desktopBtn) desktopBtn.className = "tab-btn py-3 px-4 font-semibold text-sm border-b-2 border-amber-500 text-amber-400 flex items-center space-x-2 transition";
            if (mobileBtn) mobileBtn.className = "mob-tab flex flex-col items-center text-amber-400 font-bold transition";
        } else {
            sec.classList.add('hidden');
            if (desktopBtn) desktopBtn.className = "tab-btn py-3 px-4 font-semibold text-sm border-b-2 border-transparent text-slate-400 hover:text-white flex items-center space-x-2 transition";
            if (mobileBtn) mobileBtn.className = "mob-tab flex flex-col items-center text-slate-400 font-medium transition";
        }
    });

    if (tabId === 'leaderboard') fetchLeaderboard();
    if (tabId === 'nutrition') fetchTodayNutrition();
    if (tabId === 'habits') {
        fetchTodayHabits();
        fetchWorkoutHistory();
    }
    lucide.createIcons();
    initCard3DTilt();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==============================================================
// 5. User Profile & Pehelwan Ranks
// ==============================================================
async function fetchUserProfile() {
    try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data.status === 'success') {
            const u = data.user;
            const nameEl = document.getElementById('header_user_name');
            const rankEl = document.getElementById('header_rank');
            const podiumXp = document.getElementById('podium_user_xp');
            const habitStreak = document.getElementById('habit_streak_val');
            const headerXp = document.getElementById('header_user_xp');

            if (nameEl) nameEl.innerText = u.name;
            if (rankEl) rankEl.innerText = u.rank;
            if (podiumXp) podiumXp.innerText = `${u.xp.toLocaleString()} XP 🔥`;
            if (habitStreak) habitStreak.innerText = u.streak_days;
            if (headerXp) headerXp.innerText = `${u.xp.toLocaleString()} XP`;

            // English Pehelwan Wrestling Tier Badges
            let tier = "Initiate 🌱";
            let title = "Akhada Initiate";
            let nextTierText = "Next: Malla Warrior (+500 XP required)";

            if (u.xp >= 2500) {
                tier = "Rustam-e-Hind 👑";
                title = "Rustam-e-Hind Titan";
                nextTierText = "Supreme Arena Champion (Max Rank Reached!)";
            } else if (u.xp >= 1500) {
                tier = "Kesari Contender 🏆";
                title = "Kesari Champion Contender";
                const needed = 2500 - u.xp;
                nextTierText = `Next: Rustam-e-Hind Titan (+${needed} XP)`;
            } else if (u.xp >= 700) {
                tier = "Malla 🦾";
                title = "Senior Malla Warrior";
                const needed = 1500 - u.xp;
                nextTierText = `Next: Kesari Contender (+${needed} XP)`;
            }

            const tierEl = document.getElementById('header_wrestler_tier');
            const titleEl = document.getElementById('pehelwan_title');
            const nextEl = document.getElementById('pehelwan_next_tier');

            if (tierEl) tierEl.innerText = tier;
            if (titleEl) titleEl.innerText = title;
            if (nextEl) nextEl.innerText = nextTierText;
        }
    } catch (e) {
        console.error("Profile fetch error:", e);
    }
}

// ==============================================================
// 6. Campus Arena Leaderboard
// ==============================================================
async function fetchLeaderboard() {
    try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.status === 'success') {
            const container = document.getElementById('leaderboard_table_body');
            container.innerHTML = '';

            data.leaderboard.forEach(item => {
                const isUser = item.is_current_user;
                const row = document.createElement('div');
                row.className = `p-3.5 flex items-center justify-between transition ${isUser ? 'bg-amber-500/15 border-l-4 border-amber-500' : 'hover:bg-slate-800/40'}`;

                let badge = `#${item.rank}`;
                if (item.rank === 1) badge = "🥇";
                else if (item.rank === 2) badge = "🥈";
                else if (item.rank === 3) badge = "🥉";

                row.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <span class="text-sm font-bold w-6 text-center ${item.rank <= 3 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}">${badge}</span>
                        <span class="text-lg">${item.avatar || '⚡'}</span>
                        <div>
                            <span class="text-xs font-bold ${isUser ? 'text-amber-400' : 'text-white'}">${item.name}</span>
                            <span class="text-[10px] text-slate-400 block">${item.branch} • ${item.hostel}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-black ${isUser ? 'text-amber-400' : 'text-slate-100'} block">${item.xp.toLocaleString()} XP</span>
                        <span class="text-[10px] text-amber-300 font-semibold">🔥 ${item.streak_days}d streak</span>
                    </div>
                `;
                container.appendChild(row);
            });
        }
    } catch (e) {
        console.error("Leaderboard fetch error:", e);
    }
}

// ==============================================================
// 7. Warrior Nutrition & Plate Builder
// ==============================================================
async function fetchFoodItems() {
    try {
        const res = await fetch('/api/nutrition/items');
        const data = await res.json();
        if (data.status === 'success') {
            allFoodItems = data.items;
            filteredFoodItems = [...allFoodItems];
            renderFoodGrid();
        }
    } catch (e) {
        console.error("Food items fetch error:", e);
    }
}

function filterFoodItems() {
    const q = document.getElementById('food_search_input').value.toLowerCase().trim();
    if (!q) {
        filteredFoodItems = [...allFoodItems];
    } else {
        filteredFoodItems = allFoodItems.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    renderFoodGrid();
}

function renderFoodGrid() {
    const grid = document.getElementById('food_items_grid');
    grid.innerHTML = '';

    filteredFoodItems.forEach(food => {
        const card = document.createElement('div');
        card.className = "card-3d p-2.5 rounded-xl hover:border-amber-500/50 transition flex flex-col justify-between";

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-1">
                    <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">${food.category}</span>
                    <span class="text-[11px] font-black text-amber-400">${food.calories} kcal</span>
                </div>
                <h4 class="font-bold text-white text-xs leading-tight">${food.name}</h4>
                <div class="flex items-center space-x-1.5 text-[9px] text-slate-400 mt-1">
                    <span class="text-emerald-400 font-semibold">P: ${food.protein}g</span>
                    <span>C: ${food.carbs}g</span>
                </div>
            </div>
            <button onclick="addToPlate('${food.id}')" class="mt-2 w-full py-1 text-[10px] bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-black font-bold rounded-lg transition text-center btn-3d">
                + Add to Thali
            </button>
        `;
        grid.appendChild(card);
    });
    initCard3DTilt();
}

function addToPlate(foodId) {
    const food = allFoodItems.find(f => f.id === foodId);
    if (!food) return;

    const existing = currentPlate.find(i => i.id === food.id);
    if (existing) {
        existing.qty += 1;
    } else {
        currentPlate.push({ ...food, qty: 1 });
    }
    renderPlate();
    if (typeof triggerHaptic === 'function') triggerHaptic();
}

function removeFromPlate(id) {
    currentPlate = currentPlate.filter(i => i.id !== id);
    renderPlate();
}

function clearPlate() {
    currentPlate = [];
    renderPlate();
}

function renderPlate() {
    const container = document.getElementById('plate_items_list');
    if (currentPlate.length === 0) {
        container.innerHTML = `<p class="text-slate-500 py-6 text-center text-xs">Your plate is empty. Select food items on the left!</p>`;
        return;
    }

    container.innerHTML = '';
    let totalP = 0, totalCal = 0;

    currentPlate.forEach(item => {
        totalCal += item.calories * item.qty;
        totalP += item.protein * item.qty;

        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs";
        row.innerHTML = `
            <div>
                <span class="font-bold text-white">${item.name}</span>
                <span class="text-[10px] text-slate-400 block">${item.qty}x • ${(item.calories * item.qty)} kcal</span>
            </div>
            <button onclick="removeFromPlate('${item.id}')" class="text-red-400 hover:text-red-300 font-bold px-1.5 py-0.5">✕</button>
        `;
        container.appendChild(row);
    });

    const tipEl = document.getElementById('diet_tip_text');
    if (totalP < 20) {
        tipEl.innerText = `Current meal provides ${totalP.toFixed(1)}g protein. Recommendation: Add Boiled Moong Sprouts or 2 Boiled Eggs for cheap high protein!`;
    } else {
        tipEl.innerText = `Outstanding nutrition! Your thali provides ${totalP.toFixed(1)}g protein and ${totalCal} calories.`;
    }
}

async function logCurrentMeal() {
    if (currentPlate.length === 0) {
        alert("Please add at least 1 food item to your plate!");
        return;
    }

    try {
        const res = await fetch('/api/nutrition/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meal_name: "Mess / Canteen Meal",
                items: currentPlate
            })
        });
        const data = await res.json();
        if (data.status === 'success') {
            alert(`✅ ${data.message}\nTotal Meal Calories: ${data.meal.calories} kcal | Protein: ${data.meal.protein}g`);
            currentPlate = [];
            renderPlate();
            fetchTodayNutrition();
            fetchUserProfile();
        }
    } catch (e) {
        console.error("Meal log error:", e);
    }
}

async function fetchTodayNutrition() {
    try {
        const res = await fetch('/api/nutrition/today');
        const data = await res.json();
        if (data.status === 'success') {
            const s = data.summary;
            const cEl = document.getElementById('nutri_cal');
            const pEl = document.getElementById('nutri_prot');
            const cbEl = document.getElementById('nutri_carbs');
            const fEl = document.getElementById('nutri_fats');

            if (cEl) cEl.innerText = s.calories;
            if (pEl) pEl.innerText = `${s.protein}g`;
            if (cbEl) cbEl.innerText = `${s.carbs}g`;
            if (fEl) fEl.innerText = `${s.fats}g`;
        }
    } catch (e) {
        console.error("Fetch today nutrition error:", e);
    }
}

// ==============================================================
// 8. Habits: Water & Focus Timer
// ==============================================================
async function drinkWater() {
    try {
        const res = await fetch('/api/habits/water/increment', { method: 'POST' });
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('habit_water_count').innerText = data.water_glasses;
            if (typeof triggerHaptic === 'function') triggerHaptic();
        }
    } catch (e) {
        console.error("Water error:", e);
    }
}

async function fetchTodayHabits() {
    try {
        const res = await fetch('/api/habits/today');
        const data = await res.json();
        if (data.status === 'success') {
            const w = document.getElementById('habit_water_count');
            if (w) w.innerText = data.habits.water_glasses;
        }
    } catch (e) {
        console.error("Habits error:", e);
    }
}

function startPostureTimer() {
    const btn = document.getElementById('btn_posture_timer');
    const txt = document.getElementById('posture_timer_text');

    if (postureTimerInterval) {
        clearInterval(postureTimerInterval);
        postureTimerInterval = null;
        txt.innerText = "Start 25m Focus Block";
        btn.className = "mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 btn-3d";
        return;
    }

    txt.innerText = "Session Active (Tap to Stop)";
    btn.className = "mt-3 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 btn-3d";

    postureTimerInterval = setInterval(() => {
        postureTimerSeconds--;
        const m = Math.floor(postureTimerSeconds / 60);
        const s = postureTimerSeconds % 60;
        txt.innerText = `Focus: ${m}:${s < 10 ? '0' : ''}${s}`;

        if (postureTimerSeconds <= 0) {
            clearInterval(postureTimerInterval);
            postureTimerInterval = null;
            if (typeof speak === 'function') speak("Time for a quick stretch and water break!", true);
            alert("⏰ 25-Minute Study Block Done! Stand up, stretch and drink 1 glass of water.");
            postureTimerSeconds = 25 * 60;
            txt.innerText = "Start 25m Focus Block";
        }
    }, 1000);
}

// ==============================================================
// 9. Workout History Logs
// ==============================================================
async function fetchWorkoutHistory() {
    const container = document.getElementById('history_list');
    if (!container) return;

    try {
        const res = await fetch('/api/workout/history');
        const data = await res.json();
        if (data.status === 'success') {
            container.innerHTML = '';
            let list = data.workouts || [];
            const localW = JSON.parse(localStorage.getItem('fitvibe_workouts') || '[]');
            if (localW.length > 0) {
                list = [...localW, ...list];
            }

            if (list.length === 0) {
                container.innerHTML = `<div class="p-4 text-center text-slate-500 text-xs">No workouts logged yet. Complete a session on the AI Live Coach tab!</div>`;
                return;
            }

            list.slice(0, 15).forEach(w => {
                const item = document.createElement('div');
                item.className = "p-3 flex items-center justify-between text-xs hover:bg-slate-800/30 transition";
                item.innerHTML = `
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-white">${w.exercise}</span>
                            <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">${w.accuracy}% accuracy</span>
                        </div>
                        <span class="text-[10px] text-slate-400 block">${w.created_at || w.timestamp || 'Today'}</span>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-amber-400">${w.reps} reps</span>
                        <span class="text-[10px] text-orange-300 block">${w.calories} kcal</span>
                    </div>
                `;
                container.appendChild(item);
            });
            return;
        }
    } catch (e) {
        console.warn("History fetch API offline, showing cached local history:", e);
        const localW = JSON.parse(localStorage.getItem('fitvibe_workouts') || '[]');
        if (localW.length > 0) {
            container.innerHTML = '';
            localW.forEach(w => {
                const item = document.createElement('div');
                item.className = "p-3 flex items-center justify-between text-xs hover:bg-slate-800/30 transition";
                item.innerHTML = `
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-bold text-white">${w.exercise}</span>
                            <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">${w.accuracy}% accuracy</span>
                        </div>
                        <span class="text-[10px] text-slate-400 block">${w.timestamp || 'Today'}</span>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-amber-400">${w.reps} reps</span>
                        <span class="text-[10px] text-orange-300 block">${w.calories} kcal</span>
                    </div>
                `;
                container.appendChild(item);
            });
        }
    }
}

// ==============================================================
// 10. Apple Fitness shadcn ActivityCard State & Handlers
// ==============================================================
let dailyGoals = [
    { id: "1", title: "30min Desi Baithak & Dand", isCompleted: true },
    { id: "2", title: "10k Campus Steps", isCompleted: false },
    { id: "3", title: "Drink 2L Water", isCompleted: true },
    { id: "4", title: "25m Posture Break", isCompleted: false }
];

function renderActivityGoals() {
    const container = document.getElementById('activity_goals_list');
    if (!container) return;
    container.innerHTML = '';

    dailyGoals.forEach(goal => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => toggleDailyGoal(goal.id);
        btn.className = "w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all text-left group";

        btn.innerHTML = `
            <div class="${goal.isCompleted ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors">
                <i data-lucide="${goal.isCompleted ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
            </div>
            <span class="text-xs ${goal.isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-200'} transition-all flex-1">
                ${goal.title}
            </span>
            ${goal.isCompleted ? '<span class="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10">Done</span>' : ''}
        `;
        container.appendChild(btn);
    });
    lucide.createIcons();
}

function toggleDailyGoal(id) {
    dailyGoals = dailyGoals.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g);
    renderActivityGoals();
    if (typeof triggerHaptic === 'function') triggerHaptic();
}

function handleAddGoalPrompt() {
    const title = prompt("Enter your daily campus fitness or study goal:");
    if (title && title.trim()) {
        dailyGoals.push({
            id: `goal-${Date.now()}`,
            title: title.trim(),
            isCompleted: false
        });
        renderActivityGoals();
        if (typeof triggerHaptic === 'function') triggerHaptic();
    }
}

function viewActivityDetails() {
    alert("📊 Activity Details & Rings Breakdown:\n\n• Move: 420/500 cal burned (84%)\n• Exercise: 35/45 mins active (77%)\n• Stand: 10/12 hours with posture breaks (83%)\n\nKeep training to close all 3 Apple Fitness rings today!");
}
