import os

base = os.path.dirname(os.path.abspath(__file__))
t_path = os.path.join(base, 'templates', 'index.html')
j_path = os.path.join(base, 'static', 'js', 'fitverse.js')

with open(t_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(j_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Replace external script tag with inline code so it works with ZERO assets dependencies!
target = '<script src="/static/js/fitverse.js"></script>'
replacement = '<script>\n' + js + '\n</script>'
standalone = html.replace(target, replacement)

out_root = os.path.join(base, 'index.html')
with open(out_root, 'w', encoding='utf-8') as f:
    f.write(standalone)

deploy_dir = os.path.join(base, 'netlify-deploy')
os.makedirs(deploy_dir, exist_ok=True)
out_deploy = os.path.join(deploy_dir, 'index.html')
with open(out_deploy, 'w', encoding='utf-8') as f:
    f.write(standalone)

print(f"Generated standalone index.html at {out_root} and {out_deploy}")
print(f"File size: {len(standalone)} characters.")
