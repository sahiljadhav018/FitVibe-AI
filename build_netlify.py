import os

base = os.path.dirname(os.path.abspath(__file__))
t_path = os.path.join(base, 'templates', 'index.html')
p_path = os.path.join(base, 'static', 'js', 'pose_coach.js')
f_path = os.path.join(base, 'static', 'js', 'fitverse.js')
a_path = os.path.join(base, 'static', 'js', 'app.js')

with open(t_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(p_path, 'r', encoding='utf-8') as f:
    pose_js = f.read()

with open(f_path, 'r', encoding='utf-8') as f:
    fit_js = f.read()

# Inline pose_coach.js and fitverse.js for 100% standalone reliability on Netlify
html = html.replace('<script src="/static/js/pose_coach.js"></script>', '<script>\n' + pose_js + '\n</script>')
html = html.replace('<script src="/static/js/fitverse.js"></script>', '<script>\n' + fit_js + '\n</script>')

out_root = os.path.join(base, 'index.html')
with open(out_root, 'w', encoding='utf-8') as f:
    f.write(html)

deploy_dir = os.path.join(base, 'netlify-deploy')
os.makedirs(deploy_dir, exist_ok=True)
out_deploy = os.path.join(deploy_dir, 'index.html')
with open(out_deploy, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Generated standalone index.html at {out_root} and {out_deploy}")
print(f"File size: {len(html)} characters.")
