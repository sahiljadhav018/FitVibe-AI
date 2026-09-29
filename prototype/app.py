import os
import sys
import socket
import sqlite3
import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fitvibe.db')

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '10.225.164.238'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        college TEXT,
        branch TEXT,
        hostel TEXT,
        xp INTEGER DEFAULT 1850,
        level INTEGER DEFAULT 4,
        streak_days INTEGER DEFAULT 7,
        avatar TEXT DEFAULT '⚡'
    )
    ''')

    # Workouts Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        exercise TEXT NOT NULL,
        reps INTEGER NOT NULL,
        accuracy INTEGER NOT NULL,
        calories REAL NOT NULL,
        duration_sec INTEGER NOT NULL,
        feedback_summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    # Nutrition Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS nutrition_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        meal_name TEXT NOT NULL,
        items_json TEXT,
        total_calories REAL NOT NULL,
        protein_g REAL NOT NULL,
        carbs_g REAL NOT NULL,
        fats_g REAL NOT NULL,
        date_str TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    # Habits Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        water_glasses INTEGER DEFAULT 5,
        posture_break_count INTEGER DEFAULT 2,
        date_str TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, date_str)
    )
    ''')

    # Check if primary user exists, else seed demo data
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    if count == 0:
        demo_users = [
            ("Sahil (You)", "sahil@college.edu", "Govt College of Engg", "Comp Engg", "Hostel B", 1850, 4, 7, "🔥"),
            ("Aarav Sharma", "aarav@college.edu", "Govt College of Engg", "Mechanical", "Hostel A", 2120, 5, 12, "🦾"),
            ("Pooja Kulkarni", "pooja@college.edu", "Govt College of Engg", "IT", "Hostel C", 1950, 4, 9, "⚡"),
            ("Rohan Deshmukh", "rohan@college.edu", "Govt College of Engg", "Civil", "Hostel B", 1720, 3, 4, "🎯"),
            ("Sneha Patil", "sneha@college.edu", "Govt College of Engg", "Electronics", "Hostel C", 1640, 3, 6, "✨"),
            ("Aditya Joshi", "aditya@college.edu", "Govt College of Engg", "Comp Engg", "Day Scholar", 1490, 3, 3, "🚀"),
            ("Tanvi Shinde", "tanvi@college.edu", "Govt College of Engg", "IT", "Hostel A", 1380, 2, 5, "⭐")
        ]
        for u in demo_users:
            cursor.execute('''
            INSERT INTO users (name, email, college, branch, hostel, xp, level, streak_days, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', u)

        # Preseed workouts for Sahil
        now = datetime.datetime.now()
        yesterday = (now - datetime.timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        two_days_ago = (now - datetime.timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S")

        cursor.execute('''
        INSERT INTO workouts (user_id, exercise, reps, accuracy, calories, duration_sec, feedback_summary, created_at)
        VALUES 
        (1, 'Squats', 20, 95, 28.0, 90, 'Full depth & upright spine', ?),
        (1, 'Push-ups', 15, 90, 18.0, 75, 'Good elbow depth, tight plank core', ?)
        ''', (yesterday, two_days_ago))

        today_str = datetime.date.today().isoformat()
        cursor.execute('''
        INSERT OR IGNORE INTO habits (user_id, water_glasses, posture_break_count, date_str)
        VALUES (1, 5, 2, ?)
        ''', (today_str,))

    conn.commit()
    conn.close()

init_db()

# Indian Food Database
INDIAN_FOODS = [
    {"id": "roti", "name": "Chapati / Roti (1 pc)", "calories": 85, "protein": 3.0, "carbs": 16.0, "fats": 0.5, "category": "Carbs"},
    {"id": "dal", "name": "Dal Tadka (1 bowl)", "calories": 140, "protein": 8.0, "carbs": 18.0, "fats": 4.0, "category": "Protein"},
    {"id": "rice", "name": "White Rice (1 bowl)", "calories": 180, "protein": 3.5, "carbs": 40.0, "fats": 0.4, "category": "Carbs"},
    {"id": "paneer", "name": "Paneer Bhurji / Curry", "calories": 260, "protein": 18.0, "carbs": 6.0, "fats": 19.0, "category": "Protein"},
    {"id": "sprouts", "name": "Boiled Moong Sprouts", "calories": 120, "protein": 9.5, "carbs": 19.0, "fats": 0.8, "category": "Superfood"},
    {"id": "curd", "name": "Curd / Dahi (1 bowl)", "calories": 98, "protein": 4.5, "carbs": 5.0, "fats": 4.0, "category": "Dairy"},
    {"id": "poha", "name": "Kanda Poha (1 plate)", "calories": 220, "protein": 5.5, "carbs": 38.0, "fats": 6.0, "category": "Breakfast"},
    {"id": "idli", "name": "Idli Sambhar (2 pcs)", "calories": 160, "protein": 6.0, "carbs": 30.0, "fats": 1.5, "category": "Breakfast"},
    {"id": "egg", "name": "Boiled Eggs (2 pcs)", "calories": 155, "protein": 13.0, "carbs": 1.1, "fats": 11.0, "category": "Protein"},
    {"id": "chicken", "name": "Chicken Curry (1 bowl)", "calories": 240, "protein": 24.0, "carbs": 4.0, "fats": 14.0, "category": "Protein"},
    {"id": "samosa", "name": "Samosa (1 pc)", "calories": 260, "protein": 3.5, "carbs": 32.0, "fats": 14.0, "category": "Snacks"},
    {"id": "chai", "name": "Masala Chai (1 cup)", "calories": 75, "protein": 1.8, "carbs": 11.0, "fats": 2.5, "category": "Beverage"}
]

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'manifest.json', mimetype='application/json')

@app.route('/api/network/info', methods=['GET'])
def network_info():
    lan_ip = get_lan_ip()
    tunnel_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tunnel_url.txt')
    public_url = None
    if os.path.exists(tunnel_file):
        try:
            with open(tunnel_file) as f:
                public_url = f.read().strip()
        except Exception:
            pass
            
    chosen_public = public_url or "https://infinite-massive-andale-stainless.trycloudflare.com"
    return jsonify({
        "status": "success",
        "lan_ip": lan_ip,
        "port": 5050,
        "public_url": chosen_public,
        "https_url": chosen_public,
        "http_url": f"http://{lan_ip}:5050"
    })

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = 1")
    user = dict(cursor.fetchone())

    cursor.execute("SELECT COUNT(*) + 1 as rank FROM users WHERE xp > ?", (user['xp'],))
    user['rank'] = cursor.fetchone()['rank']

    cursor.execute("SELECT COUNT(*), COALESCE(SUM(calories), 0), COALESCE(SUM(reps), 0) FROM workouts WHERE user_id = 1")
    stats = cursor.fetchone()
    user['total_workouts'] = stats[0]
    user['total_calories_burned'] = round(stats[1], 1)
    user['total_reps'] = stats[2]

    conn.close()
    return jsonify({"status": "success", "user": user})

@app.route('/api/workout/save', methods=['POST'])
def save_workout():
    data = request.get_json() or {}
    user_id = 1
    exercise = data.get('exercise', 'Squats')
    reps = int(data.get('reps', 0))
    accuracy = int(data.get('accuracy', 85))
    calories = float(data.get('calories', reps * 1.4))
    duration_sec = int(data.get('duration_sec', 60))
    feedback = data.get('feedback', 'Tracked with Edge AI')

    if reps <= 0:
        return jsonify({"status": "error", "message": "At least 1 rep required"}), 400

    xp_earned = (reps * 10) + int((accuracy / 100) * 50)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO workouts (user_id, exercise, reps, accuracy, calories, duration_sec, feedback_summary)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, exercise, reps, accuracy, calories, duration_sec, feedback))

    cursor.execute("SELECT xp, level, streak_days FROM users WHERE id = ?", (user_id,))
    u = cursor.fetchone()
    new_xp = u['xp'] + xp_earned
    new_level = (new_xp // 500) + 1

    cursor.execute('''
    UPDATE users SET xp = ?, level = ? WHERE id = ?
    ''', (new_xp, new_level, user_id))

    conn.commit()

    cursor.execute("SELECT COUNT(*) + 1 as rank FROM users WHERE xp > ?", (new_xp,))
    new_rank = cursor.fetchone()['rank']

    conn.close()

    return jsonify({
        "status": "success",
        "message": "Workout saved successfully!",
        "xp_earned": xp_earned,
        "new_xp": new_xp,
        "new_level": new_level,
        "new_rank": new_rank,
        "calories": calories,
        "reps": reps
    })

@app.route('/api/workout/history', methods=['GET'])
def get_workout_history():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT * FROM workouts WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10
    ''')
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"status": "success", "workouts": rows})

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT id, name, college, branch, hostel, xp, level, streak_days, avatar
    FROM users
    ORDER BY xp DESC
    LIMIT 20
    ''')
    rows = [dict(r) for r in cursor.fetchall()]

    for idx, r in enumerate(rows, 1):
        r['rank'] = idx
        r['is_current_user'] = (r['id'] == 1)

    conn.close()
    return jsonify({"status": "success", "leaderboard": rows})

@app.route('/api/nutrition/items', methods=['GET'])
def get_food_items():
    return jsonify({"status": "success", "items": INDIAN_FOODS})

@app.route('/api/nutrition/log', methods=['POST'])
def log_meal():
    data = request.get_json() or {}
    meal_name = data.get('meal_name', 'Quick Meal')
    items = data.get('items', [])

    tot_cal = sum(item.get('calories', 0) * item.get('qty', 1) for item in items)
    tot_prot = sum(item.get('protein', 0) * item.get('qty', 1) for item in items)
    tot_carbs = sum(item.get('carbs', 0) * item.get('qty', 1) for item in items)
    tot_fats = sum(item.get('fats', 0) * item.get('qty', 1) for item in items)

    today_str = datetime.date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO nutrition_logs (user_id, meal_name, items_json, total_calories, protein_g, carbs_g, fats_g, date_str)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    ''', (meal_name, str(items), round(tot_cal, 1), round(tot_prot, 1), round(tot_carbs, 1), round(tot_fats, 1), today_str))

    cursor.execute("UPDATE users SET xp = xp + 30 WHERE id = 1")
    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Meal logged! +30 XP earned",
        "meal": {
            "name": meal_name,
            "calories": round(tot_cal, 1),
            "protein": round(tot_prot, 1),
            "carbs": round(tot_carbs, 1),
            "fats": round(tot_fats, 1)
        }
    })

@app.route('/api/nutrition/today', methods=['GET'])
def get_today_nutrition():
    today_str = datetime.date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT * FROM nutrition_logs WHERE user_id = 1 AND date_str = ? ORDER BY created_at DESC
    ''', (today_str,))
    logs = [dict(r) for r in cursor.fetchall()]

    tot_cal = sum(r['total_calories'] for r in logs)
    tot_prot = sum(r['protein_g'] for r in logs)
    tot_carbs = sum(r['carbs_g'] for r in logs)
    tot_fats = sum(r['fats_g'] for r in logs)

    conn.close()
    return jsonify({
        "status": "success",
        "date": today_str,
        "summary": {
            "calories": round(tot_cal, 1),
            "target_calories": 2200,
            "protein": round(tot_prot, 1),
            "target_protein": 75,
            "carbs": round(tot_carbs, 1),
            "target_carbs": 260,
            "fats": round(tot_fats, 1),
            "target_fats": 60
        },
        "meals": logs
    })

@app.route('/api/habits/water/increment', methods=['POST'])
def increment_water():
    today_str = datetime.date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO habits (user_id, water_glasses, posture_break_count, date_str)
    VALUES (1, 1, 0, ?)
    ON CONFLICT(user_id, date_str) DO UPDATE SET water_glasses = water_glasses + 1
    ''', (today_str,))
    conn.commit()

    cursor.execute("SELECT water_glasses FROM habits WHERE user_id = 1 AND date_str = ?", (today_str,))
    glasses = cursor.fetchone()['water_glasses']
    conn.close()
    return jsonify({"status": "success", "water_glasses": glasses})

@app.route('/api/habits/today', methods=['GET'])
def get_today_habits():
    today_str = datetime.date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM habits WHERE user_id = 1 AND date_str = ?", (today_str,))
    row = cursor.fetchone()
    if not row:
        cursor.execute("INSERT INTO habits (user_id, water_glasses, posture_break_count, date_str) VALUES (1, 5, 2, ?)", (today_str,))
        conn.commit()
        data = {"water_glasses": 5, "posture_break_count": 2, "date_str": today_str}
    else:
        data = dict(row)
    conn.close()
    return jsonify({"status": "success", "habits": data})

if __name__ == '__main__':
    lan_ip = get_lan_ip()
    cert_path = os.path.join(os.path.dirname(__file__), 'cert.pem')
    key_path = os.path.join(os.path.dirname(__file__), 'key.pem')
    
    use_ssl = os.path.exists(cert_path) and os.path.exists(key_path) and ('--no-ssl' not in sys.argv)
    
    print("=" * 60)
    print("       FitVibe AI Server - SIH 2026 (PS-26196)")
    print("=" * 60)
    if use_ssl:
        print(f" PC Local URL   : https://127.0.0.1:5050")
        print(f" Mobile Phone   : https://{lan_ip}:5050")
        print(f" SSL Encryption : Active (Enables Mobile Camera & PWA)")
        print("=" * 60)
        app.run(host='0.0.0.0', port=5050, ssl_context=(cert_path, key_path), debug=False)
    else:
        print(f" PC Local URL   : http://127.0.0.1:5050")
        print(f" Mobile Phone   : http://{lan_ip}:5050")
        print(f" SSL Encryption : Disabled")
        print("=" * 60)
        app.run(host='0.0.0.0', port=5050, debug=False)
