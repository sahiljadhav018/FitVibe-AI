import os
import re
import time
import subprocess

CF_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cloudflared.exe')
URL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tunnel_url.txt')

def run_tunnel():
    print("Starting Cloudflare Tunnel...")
    cmd = [CF_PATH, 'tunnel', '--url', 'https://127.0.0.1:5050', '--no-tls-verify']
    proc = subprocess.Popen(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)

    url_found = False
    for line in proc.stderr:
        print(line.strip())
        match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
        if match:
            url = match.group(0)
            print("==================================================")
            print(" PUBLIC LIVE TUNNEL URL FOR MOBILE:")
            print(f" {url}")
            print("==================================================")
            with open(URL_FILE, 'w') as f:
                f.write(url)
            url_found = True

    proc.wait()

if __name__ == '__main__':
    run_tunnel()
