import os
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_sih_presentation(output_path):
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    BG_COLOR = RGBColor(248, 250, 252)       # #F8FAFC
    NAVY_PRIMARY = RGBColor(15, 30, 54)      # #0F1E36 (Dark Navy)
    NAVY_CARD = RGBColor(26, 44, 76)         # #1A2C4C
    ORANGE_ACCENT = RGBColor(243, 112, 35)   # #F37023 (SIH Saffron)
    TEAL_ACCENT = RGBColor(13, 148, 136)     # #0D9488 (Teal)
    WHITE = RGBColor(255, 255, 255)
    TEXT_DARK = RGBColor(15, 23, 42)         # #0F172A
    TEXT_MUTED = RGBColor(71, 85, 105)       # #475569
    CARD_BG = RGBColor(255, 255, 255)
    CARD_BORDER = RGBColor(226, 232, 240)    # #E2E8F0
    LIGHT_ORANGE = RGBColor(254, 243, 199)

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background() # no line
        return bg

    def add_header(slide, title_text, category_text="SIH 2026 | PS ID: 26196 | Theme: Fitness & Sports"):
        # Header banner
        header_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(1.15))
        header_bar.fill.solid()
        header_bar.fill.fore_color.rgb = NAVY_PRIMARY
        header_bar.line.fill.background()

        # Orange accent strip
        accent_strip = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(1.15), Inches(13.333), Inches(0.06))
        accent_strip.fill.solid()
        accent_strip.fill.fore_color.rgb = ORANGE_ACCENT
        accent_strip.line.fill.background()

        # Top subtitle / category badge
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.12), Inches(11.733), Inches(0.35))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        tf_sub.margin_left = tf_sub.margin_right = tf_sub.margin_top = tf_sub.margin_bottom = 0
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = category_text.upper()
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = ORANGE_ACCENT
        p_sub.font.name = "Arial"

        # Main slide title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.55))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE
        p_title.font.name = "Arial"

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    # ==========================================
    # SLIDE 1: COVER / TITLE SLIDE
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)

    # Top Navy Banner (Large)
    banner1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(4.3))
    banner1.fill.solid()
    banner1.fill.fore_color.rgb = NAVY_PRIMARY
    banner1.line.fill.background()

    # Orange accent bar
    strip1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(4.3), Inches(13.333), Inches(0.08))
    strip1.fill.solid()
    strip1.fill.fore_color.rgb = ORANGE_ACCENT
    strip1.line.fill.background()

    # Hackathon Tag
    tag_box = slide1.shapes.add_textbox(Inches(0.9), Inches(0.5), Inches(11.5), Inches(0.4))
    tf_tag = tag_box.text_frame
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = "SMART INDIA HACKATHON (SIH) 2026 | IDEA SUBMISSION"
    p_tag.font.size = Pt(13)
    p_tag.font.bold = True
    p_tag.font.color.rgb = ORANGE_ACCENT
    p_tag.font.name = "Arial"

    # Project Title
    proj_box = slide1.shapes.add_textbox(Inches(0.9), Inches(0.95), Inches(11.5), Inches(1.2))
    tf_proj = proj_box.text_frame
    tf_proj.word_wrap = True
    p_proj = tf_proj.paragraphs[0]
    p_proj.text = "FitVibe AI: Student Fitness & Wellness Ecosystem"
    p_proj.font.size = Pt(32)
    p_proj.font.bold = True
    p_proj.font.color.rgb = WHITE
    p_proj.font.name = "Arial"

    # Subtitle
    sub_proj = slide1.shapes.add_textbox(Inches(0.9), Inches(2.05), Inches(11.5), Inches(0.7))
    tf_sp = sub_proj.text_frame
    tf_sp.word_wrap = True
    p_sp = tf_sp.paragraphs[0]
    p_sp.text = "Edge AI Real-Time Pose Correction, Gamified Campus Leagues & Smart Desi Nutrition"
    p_sp.font.size = Pt(16)
    p_sp.font.color.rgb = RGBColor(186, 215, 233)
    p_sp.font.name = "Arial"

    # PS Meta Pill Card in Slide 1
    meta_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(2.9), Inches(11.533), Inches(1.05))
    meta_box.fill.solid()
    meta_box.fill.fore_color.rgb = NAVY_CARD
    meta_box.line.color.rgb = ORANGE_ACCENT
    meta_box.line.width = Pt(1)

    tf_meta = meta_box.text_frame
    tf_meta.word_wrap = True
    p_m1 = tf_meta.paragraphs[0]
    p_m1.text = "• Problem Statement ID: 26196       • Category: Software       • Theme: Fitness & Sports"
    p_m1.font.size = Pt(13)
    p_m1.font.bold = True
    p_m1.font.color.rgb = WHITE
    p_m1.font.name = "Arial"

    p_m2 = tf_meta.add_paragraph()
    p_m2.text = "• Problem Statement: Student Innovation - Ideas that can boost fitness activities and assist in keeping fit."
    p_m2.font.size = Pt(12)
    p_m2.font.color.rgb = RGBColor(226, 232, 240)
    p_m2.font.name = "Arial"

    # Team Info Cards (Bottom Half)
    # Team Left Card
    add_card(slide1, Inches(0.9), Inches(4.7), Inches(5.6), Inches(2.3), CARD_BG, CARD_BORDER)
    tb_team = slide1.shapes.add_textbox(Inches(1.1), Inches(4.85), Inches(5.2), Inches(2.0))
    tf_t = tb_team.text_frame
    tf_t.word_wrap = True
    p_t1 = tf_t.paragraphs[0]
    p_t1.text = "TEAM DETAILS"
    p_t1.font.size = Pt(14)
    p_t1.font.bold = True
    p_t1.font.color.rgb = NAVY_PRIMARY

    bullets_team = [
        ("Team Name:", "[Enter Your Team Name]"),
        ("Team Leader:", "[Leader Name] | [Contact / Email]"),
        ("College / Institute:", "[Your College / University Name]"),
        ("State / City:", "[City, State]"),
    ]
    for label, val in bullets_team:
        p = tf_t.add_paragraph()
        run1 = p.add_run()
        run1.text = f"{label} "
        run1.font.bold = True
        run1.font.size = Pt(11)
        run1.font.color.rgb = TEXT_DARK
        run2 = p.add_run()
        run2.text = val
        run2.font.size = Pt(11)
        run2.font.color.rgb = TEXT_MUTED

    # Team Members Right Card
    add_card(slide1, Inches(6.833), Inches(4.7), Inches(5.6), Inches(2.3), CARD_BG, CARD_BORDER)
    tb_mem = slide1.shapes.add_textbox(Inches(7.033), Inches(4.85), Inches(5.2), Inches(2.0))
    tf_m = tb_mem.text_frame
    tf_m.word_wrap = True
    p_m_title = tf_m.paragraphs[0]
    p_m_title.text = "TEAM MEMBERS"
    p_m_title.font.size = Pt(14)
    p_m_title.font.bold = True
    p_m_title.font.color.rgb = NAVY_PRIMARY

    members = [
        "1. [Member 1 / Leader] - AI / Full-Stack Lead",
        "2. [Member 2] - Mobile App Developer (Flutter/RN)",
        "3. [Member 3] - Computer Vision & ML Engineer",
        "4. [Member 4] - Backend & Cloud Architect",
        "5. [Member 5] - UI/UX & Gamification Designer",
        "6. [Member 6] - Testing & Research Analyst"
    ]
    for m in members:
        p = tf_m.add_paragraph()
        p.text = m
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 2: PROPOSED SOLUTION & IDEA DESCRIPTION
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "1. Proposed Solution & Core Innovation", "SIH 2026 | PS ID: 26196 | Software Category")

    # Left Column: Problem Context & Solution Concept
    add_card(slide2, Inches(0.8), Inches(1.4), Inches(5.6), Inches(5.6), CARD_BG, CARD_BORDER)
    tb_s2_left = slide2.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.2), Inches(5.3))
    tf_s2_l = tb_s2_left.text_frame
    tf_s2_l.word_wrap = True

    p = tf_s2_l.paragraphs[0]
    p.text = "PROBLEM CONTEXT & STUDENT CHALLENGE"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE_ACCENT

    p = tf_s2_l.add_paragraph()
    p.text = "• Sedentary Lifestyle: Students spend 8-12 hours sitting for lectures, coding, and study sessions, causing posture deformities and lethargy."
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_DARK

    p = tf_s2_l.add_paragraph()
    p.text = "• Barriers to Entry: Expensive gym memberships, lack of trainers, and lack of guidance lead to incorrect exercise forms and injuries."
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_DARK

    p = tf_s2_l.add_paragraph()
    p.text = "• Low Motivation: Standard fitness apps lack social relevance, causing >70% student abandonment within 14 days."
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_DARK

    p = tf_s2_l.add_paragraph()
    p.text = "\nOUR PROPOSED SOLUTION: FitVibe AI"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT

    p = tf_s2_l.add_paragraph()
    p.text = "FitVibe AI is an AI-powered, privacy-first mobile fitness platform tailored specifically for Indian students. It turns any budget smartphone camera into a personal real-time fitness trainer without requiring smartwatches or gym equipment."
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_MUTED

    p = tf_s2_l.add_paragraph()
    p.text = "By fusing Edge Computer Vision with Campus Gamification and Affordable Indian Diet Tracking, FitVibe AI makes daily fitness intuitive, social, and habit-forming."
    p.font.size = Pt(10.5)
    p.font.color.rgb = TEXT_MUTED

    # Right Column: 4 Key Feature Pillars (2x2 grid of mini-cards)
    cards_data = [
        ("AI Real-Time Pose Coach", ORANGE_ACCENT, [
            "Uses smartphone camera to track 33 body keypoints.",
            "Validates posture (Squats, Push-ups, Surya Namaskar).",
            "Gives instant audio voice cues (e.g., 'Straighten back').",
            "Automated repetition counting & form accuracy score."
        ]),
        ("Gamified Campus Leagues", NAVY_PRIMARY, [
            "Intra-college and hostel leaderboards & streak loops.",
            "1v1 asynchronous fitness battles between friends.",
            "Earn XP points, unlock fitness badges & avatar gear.",
            "Converts peer pressure into positive fitness motivation."
        ]),
        ("Desi Nutrition & Canteen AI", TEAL_ACCENT, [
            "Tailored for Indian student diet & mess food.",
            "Photo-based food scanner detects Dal, Roti, Rice, Sabzi.",
            "Calculates daily macros & suggests budget high-protein options.",
            "Hydration alerts synced with student class timetables."
        ]),
        ("Micro-Workouts & Habit Loops", NAVY_PRIMARY, [
            "3 to 5-minute study-break stretching routines.",
            "Desk posture alert using laptop webcam or phone gyroscope.",
            "Zero equipment needed; 100% dormitory/room friendly.",
            "Guided breathing and relaxation for exam stress relief."
        ])
    ]

    coords = [
        (Inches(6.7), Inches(1.4)),
        (Inches(9.95), Inches(1.4)),
        (Inches(6.7), Inches(4.25)),
        (Inches(9.95), Inches(4.25))
    ]

    for (c_title, c_color, c_bullets), (cx, cy) in zip(cards_data, coords):
        add_card(slide2, cx, cy, Inches(3.05), Inches(2.75), CARD_BG, CARD_BORDER)
        tb = slide2.shapes.add_textbox(cx + Inches(0.15), cy + Inches(0.15), Inches(2.75), Inches(2.45))
        tf = tb.text_frame
        tf.word_wrap = True
        p_ct = tf.paragraphs[0]
        p_ct.text = c_title
        p_ct.font.size = Pt(11.5)
        p_ct.font.bold = True
        p_ct.font.color.rgb = c_color

        for b in c_bullets:
            pb = tf.add_paragraph()
            pb.text = f"• {b}"
            pb.font.size = Pt(9.5)
            pb.font.color.rgb = TEXT_DARK

    # ==========================================
    # SLIDE 3: TECHNICAL APPROACH (TECHNOLOGIES USED & DEVELOPMENT FLOW)
    # Matching exact visual architecture from user specification
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "2. Technical Approach: Tech Stack & Development Flow", "SIH 2026 | PS ID: 26196 | Architecture & Methodology")

    # --- TOP SECTION: TECHNOLOGIES USED ---
    sec1_banner = slide3.shapes.add_textbox(Inches(0.75), Inches(1.22), Inches(11.833), Inches(0.35))
    tf_s1 = sec1_banner.text_frame
    tf_s1.margin_left = tf_s1.margin_right = tf_s1.margin_top = tf_s1.margin_bottom = 0
    p = tf_s1.paragraphs[0]
    p.text = "⚙ TECHNOLOGIES USED"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY_PRIMARY

    # 6 Technology Cards (Horizontal Grid)
    card_w = Inches(1.88)
    card_gap = Inches(0.11)
    card_h = Inches(2.65)
    y_tech = Inches(1.58)

    tech_categories = [
        ("Frontend", "User Interface & 3D", RGBColor(239, 246, 255), RGBColor(191, 219, 254), RGBColor(30, 64, 175), [
            ("HTML5", "PWA Structure"),
            ("Tailwind", "3D Dark Styling"),
            ("JS (ES6+)", "Interactivity"),
            ("Three.js", "3D Trophy & Tilt"),
            ("MediaPipe", "3D Pose Vision")
        ]),
        ("Backend", "Logic & AI Rules", RGBColor(245, 243, 255), RGBColor(221, 214, 254), RGBColor(109, 40, 217), [
            ("Python 3.10", "Core Runtime"),
            ("Flask", "REST API Server"),
            ("Angle Engine", "Biomechanical Math"),
            ("Web Audio", "Gong / Hit Synthesizer"),
            ("Speech API", "Voice Commentary")
        ]),
        ("Databases", "Stores & Manages Data", RGBColor(236, 253, 245), RGBColor(167, 243, 208), RGBColor(4, 120, 87), [
            ("SQLite 3", "fitvibe.db Database"),
            ("JSON DB", "Indian Food Macros"),
            ("Session Store", "Local Caching"),
            ("Leaderboard", "Fast Ranking Engine")
        ]),
        ("Development Tools", "Code & Collaborate", RGBColor(255, 251, 235), RGBColor(253, 230, 138), RGBColor(180, 83, 9), [
            ("VS Code", "Primary IDE"),
            ("Git", "Version Control"),
            ("GitHub", "Code Repository"),
            ("Postman", "REST API Testing")
        ]),
        ("Local Environment", "Local Dev & Testing", RGBColor(240, 253, 250), RGBColor(153, 246, 228), RGBColor(15, 118, 110), [
            ("Localhost", "Port 5050 Server"),
            ("OpenSSL", "SSL Cert Context"),
            ("Start_App.bat", "1-Click Launcher"),
            ("Chrome / Edge", "WebRTC Testing")
        ]),
        ("Deployment", "Host Application", RGBColor(255, 241, 242), RGBColor(254, 205, 211), RGBColor(190, 18, 60), [
            ("Cloudflare", "Zero-Trust Tunnel"),
            ("PWA Manifest", "Mobile Standalone"),
            ("TryCloudflare", "Worldwide Live URL"),
            ("QR Gateway", "Mobile Phone Sync")
        ])
    ]

    for idx, (cat_name, sub_title, bg_c, border_c, accent_c, techs) in enumerate(tech_categories):
        x = Inches(0.75) + idx * (card_w + card_gap)
        add_card(slide3, x, y_tech, card_w, card_h, bg_c, border_c)

        tb = slide3.shapes.add_textbox(x + Inches(0.08), y_tech + Inches(0.08), card_w - Inches(0.16), card_h - Inches(0.16))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_h = tf.paragraphs[0]
        p_h.text = cat_name
        p_h.font.size = Pt(11)
        p_h.font.bold = True
        p_h.font.color.rgb = accent_c

        p_sub = tf.add_paragraph()
        p_sub.text = sub_title
        p_sub.font.size = Pt(7.8)
        p_sub.font.color.rgb = TEXT_MUTED

        for tech_name, tech_desc in techs:
            p_t = tf.add_paragraph()
            r_name = p_t.add_run()
            r_name.text = f"• {tech_name}: "
            r_name.font.bold = True
            r_name.font.size = Pt(8.2)
            r_name.font.color.rgb = TEXT_DARK
            r_desc = p_t.add_run()
            r_desc.text = tech_desc
            r_desc.font.size = Pt(7.8)
            r_desc.font.color.rgb = TEXT_MUTED

    # --- BOTTOM SECTION: DEVELOPMENT FLOW ---
    y_flow_banner = Inches(4.4)
    sec2_banner = slide3.shapes.add_textbox(Inches(0.75), y_flow_banner, Inches(11.833), Inches(0.35))
    tf_s2 = sec2_banner.text_frame
    tf_s2.margin_left = tf_s2.margin_right = tf_s2.margin_top = tf_s2.margin_bottom = 0
    p = tf_s2.paragraphs[0]
    p.text = "⚙ DEVELOPMENT FLOW"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY_PRIMARY

    # 7 Step Chevron Horizontal Cards
    step_w = Inches(1.60)
    step_gap = Inches(0.10)
    step_h = Inches(2.4)
    y_steps = Inches(4.75)

    steps = [
        ("1. Plan & Design", "Requirement Analysis, Biomechanics Angle Research & 3D UI/UX Wireframing", RGBColor(255, 241, 242), RGBColor(254, 205, 211), RGBColor(225, 29, 72)),
        ("2. Frontend Dev", "HTML5, Tailwind CSS, Three.js 3D Visualizer & Mobile Touch Navigation", RGBColor(239, 246, 255), RGBColor(191, 219, 254), RGBColor(37, 99, 235)),
        ("3. CV & AI Edge", "MediaPipe 33-Landmark 3D Pose, Desi Baithak/Dand Angles & Audio Coach", RGBColor(245, 243, 255), RGBColor(221, 214, 254), RGBColor(124, 58, 237)),
        ("4. Backend Dev", "Python 3 Flask Server, SQLite Schema, REST APIs & XP Leaderboard Engine", RGBColor(236, 253, 245), RGBColor(167, 243, 208), RGBColor(5, 150, 105)),
        ("5. Testing & Debug", "On-Device 30+ FPS Latency Benchmarking, Calibration & 1-Click Batch Run", RGBColor(254, 252, 232), RGBColor(254, 240, 138), RGBColor(202, 138, 4)),
        ("6. Version Control", "Modular File Architecture, Git Branch Management & GitHub Code Sync", RGBColor(243, 232, 255), RGBColor(216, 180, 254), RGBColor(147, 51, 234)),
        ("7. Deployment", "Cloudflare Zero-Trust Tunnel, PWA Setup & Worldwide Live Mobile Testing", RGBColor(255, 247, 237), RGBColor(254, 215, 170), RGBColor(234, 88, 12))
    ]

    for idx, (st_title, st_desc, bg_c, border_c, accent_c) in enumerate(steps):
        x = Inches(0.75) + idx * (step_w + step_gap)
        add_card(slide3, x, y_steps, step_w, step_h, bg_c, border_c)

        tb = slide3.shapes.add_textbox(x + Inches(0.08), y_steps + Inches(0.08), step_w - Inches(0.16), step_h - Inches(0.16))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_st = tf.paragraphs[0]
        p_st.text = st_title
        p_st.font.size = Pt(10)
        p_st.font.bold = True
        p_st.font.color.rgb = accent_c

        p_desc = tf.add_paragraph()
        p_desc.text = f"\n{st_desc}"
        p_desc.font.size = Pt(8.2)
        p_desc.font.color.rgb = TEXT_DARK


    # ==========================================
    # SLIDE 4: FEASIBILITY, VIABILITY & POTENTIAL RISKS
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "3. Feasibility, Viability & Potential Risks", "SIH 2026 | PS ID: 26196 | Feasibility & Risk Mitigation")

    # Top Half: Feasibility & Commercial Viability (2 Cards)
    top_w = Inches(5.65)
    top_h = Inches(2.65)

    # Feasibility
    add_card(slide4, Inches(0.8), Inches(1.4), top_w, top_h, CARD_BG, CARD_BORDER)
    tb_feas = slide4.shapes.add_textbox(Inches(1.0), Inches(1.55), top_w - Inches(0.4), top_h - Inches(0.3))
    tf_f = tb_feas.text_frame
    tf_f.word_wrap = True
    p = tf_f.paragraphs[0]
    p.text = "TECHNICAL FEASIBILITY"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT

    f_bullets = [
        "Zero Expensive Hardware: Requires only a standard smartphone camera ($0 extra investment).",
        "Offline Execution: Pose detection runs entirely on-device; works in low-connectivity dorms.",
        "Resource Efficient: MediaPipe models optimized for Android 8.0+ and 2GB+ RAM devices.",
        "Proven Tech Stack: Built on industry-tested open-source libraries (OpenCV, Flutter, FastAPI)."
    ]
    for b in f_bullets:
        p = tf_f.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK

    # Viability
    add_card(slide4, Inches(6.883), Inches(1.4), top_w, top_h, CARD_BG, CARD_BORDER)
    tb_viab = slide4.shapes.add_textbox(Inches(7.083), Inches(1.55), top_w - Inches(0.4), top_h - Inches(0.3))
    tf_v = tb_viab.text_frame
    tf_v.word_wrap = True
    p = tf_v.paragraphs[0]
    p.text = "COMMERCIAL & PRACTICAL VIABILITY"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE_ACCENT

    v_bullets = [
        "University Campus Adoption: Ready to pilot across AICTE colleges & sports departments.",
        "Ultra-Low Infrastructure Cost: Edge processing reduces cloud server costs by >85%.",
        "Sustainable Model: Freemium model with sponsored campus sports events and brand rewards.",
        "High Retention: Peer challenges and campus tournaments provide sustained active engagement."
    ]
    for b in v_bullets:
        p = tf_v.add_paragraph()
        p.text = f"• {b}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK

    # Bottom Half: Challenges & Mitigation Table/Card
    add_card(slide4, Inches(0.8), Inches(4.25), Inches(11.733), Inches(2.8), CARD_BG, CARD_BORDER)
    tb_risk = slide4.shapes.add_textbox(Inches(1.0), Inches(4.35), Inches(11.333), Inches(2.6))
    tf_r = tb_risk.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "POTENTIAL CHALLENGES & PROVEN MITIGATION STRATEGIES"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY_PRIMARY

    risks = [
        ("Dorm Room Clutter & Dim Lighting", "Adaptive CLAHE contrast normalization and landmark confidence score gating to ignore messy backgrounds."),
        ("User Motivation Drop-off (>2 Weeks)", "Streak protection freeze mechanics, micro-challenges (3-minute workouts), and campus community rewards."),
        ("Accuracy Across Diverse Body Types", "Trained on synthetic variations; calibrated using relative bone length ratios rather than fixed pixel dimensions."),
        ("Data Privacy & Security Apprehensions", "Architecture guarantees zero video upload. Video frames processed entirely in volatile device RAM and discarded.")
    ]

    for title, mitig in risks:
        p = tf_r.add_paragraph()
        r1 = p.add_run()
        r1.text = f"• Challenge: {title}  ➔  "
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = NAVY_PRIMARY
        r2 = p.add_run()
        r2.text = f"Mitigation: {mitig}"
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 5: NOVELTY, INNOVATION & USP
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "4. Novelty, Innovation & Competitive Matrix (USP)", "SIH 2026 | PS ID: 26196 | Innovation & Market Differentiator")

    # Left: 3 Core USPs
    add_card(slide5, Inches(0.8), Inches(1.4), Inches(5.65), Inches(5.6), CARD_BG, CARD_BORDER)
    tb_usp = slide5.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(5.25), Inches(5.3))
    tf_u = tb_usp.text_frame
    tf_u.word_wrap = True
    p = tf_u.paragraphs[0]
    p.text = "KEY NOVELTIES & UNIQUE SELLING POINTS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE_ACCENT

    usps = [
        ("1. Real-Time Vision Correction on Budget Phones",
         "Unlike pre-recorded workout videos, FitVibe AI actively watches, evaluates joint angles, and provides live audio feedback without expensive wearable sensors."),

        ("2. Tailored to Indian Context & Desi Fitness",
         "Supports traditional Indian wellness practices (Surya Namaskar pose accuracy, Pranayama rhythms) along with mess/canteen Indian food recognition."),

        ("3. Campus-Centric Social Gamification",
         "Harnesses university peer networks: inter-hostel leagues, branch leaderboards, and study-break fitness streaks that cultivate sustainable lifestyle habits."),

        ("4. 100% Privacy by Design (Zero Cloud Video)",
         "Edge AI ensures no video data is ever saved or transmitted over the internet, addressing female and privacy-sensitive student concerns completely.")
    ]
    for u_title, u_desc in usps:
        p = tf_u.add_paragraph()
        r1 = p.add_run()
        r1.text = f"\n{u_title}\n"
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = NAVY_PRIMARY
        r2 = p.add_run()
        r2.text = u_desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    # Right: Competitive Comparison Table
    add_card(slide5, Inches(6.883), Inches(1.4), Inches(5.65), Inches(5.6), CARD_BG, CARD_BORDER)
    tb_comp = slide5.shapes.add_textbox(Inches(7.083), Inches(1.55), Inches(5.25), Inches(5.3))
    tf_c = tb_comp.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "COMPETITIVE COMPARISON MATRIX"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT

    table_data = [
        ("Feature / Capability", "FitVibe AI", "Cult.fit / Nike", "Strava / MFP"),
        ("Real-time AI Pose Guidance", "✅ Yes (Free)", "❌ Video Only / $", "❌ No"),
        ("No Costly Equipment Needed", "✅ 100% Smartphone", "⚠️ Requires Gear", "⚠️ GPS/Smartwatch"),
        ("Campus & Hostel Leagues", "✅ Native Feature", "❌ Generic / Global", "❌ Global Only"),
        ("Indian Mess Diet Recognition", "✅ Built-in AI", "⚠️ Partial / Western", "⚠️ Generic Database"),
        ("100% Edge Privacy Guarantee", "✅ Zero Cloud Video", "❌ Cloud Stream", "N/A"),
        ("Affordability for Students", "✅ 100% Free Tier", "❌ Costly Subscription", "❌ Paywalled Metrics")
    ]

    p_header = tf_c.add_paragraph()
    p_header.text = f"{'Parameter':<24} | {'FitVibe AI':<14} | {'Others':<14}"
    p_header.font.size = Pt(10)
    p_header.font.bold = True
    p_header.font.color.rgb = NAVY_PRIMARY

    for row in table_data[1:]:
        p_row = tf_c.add_paragraph()
        r1 = p_row.add_run()
        r1.text = f"\n• {row[0]}:\n"
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = NAVY_PRIMARY
        r2 = p_row.add_run()
        r2.text = f"   FitVibe: {row[1]}  vs  Competitors: {row[2]} / {row[3]}"
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 6: IMPACT, FUTURE SCOPE & NATIONAL ALIGNMENT
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "5. Impact, Future Scope & National Alignment", "SIH 2026 | PS ID: 26196 | Social Impact & Future Roadmap")

    # 3 Horizontal / Column Cards
    col_w = Inches(3.64)
    gap = Inches(0.3)
    left_start = Inches(0.8)
    x2 = left_start + col_w + gap
    x3 = x2 + col_w + gap

    # Box 1: Social & Student Impact
    add_card(slide6, left_start, Inches(1.4), col_w, Inches(5.6), CARD_BG, CARD_BORDER)
    tb_imp = slide6.shapes.add_textbox(left_start + Inches(0.2), Inches(1.55), col_w - Inches(0.4), Inches(5.3))
    tf_i = tb_imp.text_frame
    tf_i.word_wrap = True
    p = tf_i.paragraphs[0]
    p.text = "SOCIAL & HEALTH IMPACT"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ORANGE_ACCENT

    imp_bullets = [
        ("Combat Sedentary Lifestyle:", "Helps prevent posture disorders (forward head, rounded shoulders) and chronic fatigue among youth."),
        ("Democratize Fitness:", "High-grade posture coaching made accessible to Tier-2, Tier-3 and rural college students free of cost."),
        ("Mental Health Benefits:", "Physical exercise releases endorphins, directly reducing study fatigue, anxiety, and depression during exams."),
        ("Injury Prevention:", "Real-time angle correction ensures correct form, preventing common weightlifting and bodyweight injuries.")
    ]
    for h, b in imp_bullets:
        p = tf_i.add_paragraph()
        r1 = p.add_run()
        r1.text = f"\n{h} "
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = NAVY_PRIMARY
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    # Box 2: Alignment with National Initiatives
    add_card(slide6, x2, Inches(1.4), col_w, Inches(5.6), CARD_BG, CARD_BORDER)
    tb_nat = slide6.shapes.add_textbox(x2 + Inches(0.2), Inches(1.55), col_w - Inches(0.4), Inches(5.3))
    tf_n = tb_nat.text_frame
    tf_n.word_wrap = True
    p = tf_n.paragraphs[0]
    p.text = "ALIGNMENT WITH MISSIONS"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = TEAL_ACCENT

    nat_bullets = [
        ("Fit India Movement:", "Directly accelerates the Government of India's flagship mission by ingraining daily fitness into academic routines."),
        ("National Education Policy (NEP 2020):", "Supports holistic student development by bridging academic stress with sports and physical well-being."),
        ("Khelo India Initiative:", "Identifies grassroot athletic talent through standardized fitness benchmark assessments on campus."),
        ("Digital India & Atmanirbhar Bharat:", "Indigenous AI technology engineered locally for Indian lifestyle, diets, and vernacular languages.")
    ]
    for h, b in nat_bullets:
        p = tf_n.add_paragraph()
        r1 = p.add_run()
        r1.text = f"\n{h} "
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = NAVY_PRIMARY
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    # Box 3: Future Roadmap
    add_card(slide6, x3, Inches(1.4), col_w, Inches(5.6), CARD_BG, CARD_BORDER)
    tb_fut = slide6.shapes.add_textbox(x3 + Inches(0.2), Inches(1.55), col_w - Inches(0.4), Inches(5.3))
    tf_fut = tb_fut.text_frame
    tf_fut.word_wrap = True
    p = tf_fut.paragraphs[0]
    p.text = "FUTURE ROADMAP (NEXT PHASES)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = NAVY_PRIMARY

    fut_bullets = [
        ("Phase 1 (MVP - Hackathon):", "Core AI pose detection (Push-ups, Squats, Planks), rep counter, student profiles, and leaderboard."),
        ("Phase 2 (Campus Pilot):", "Hostel vs Hostel leagues, Surya Namaskar module, canteen diet scanner, and Health Connect sync."),
        ("Phase 3 (AI Rehab & Physiotherapy):", "Post-injury physical therapy guidance, sports biomechanics analysis for college athletes."),
        ("Phase 4 (Vernacular Voice AI):", "Multi-lingual voice coach supporting Marathi, Hindi, Tamil, Telugu, and other Indian regional languages.")
    ]
    for h, b in fut_bullets:
        p = tf_fut.add_paragraph()
        r1 = p.add_run()
        r1.text = f"\n{h} "
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = ORANGE_ACCENT if "MVP" in h else NAVY_PRIMARY
        r2 = p.add_run()
        r2.text = b
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_DARK

    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    out_dir = r"C:\Users\Sahil\.gemini\antigravity\scratch\SIH_2026_PS26196"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "SIH_2026_PS26196_Idea_Presentation.pptx")
    create_sih_presentation(out_file)
