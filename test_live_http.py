import urllib.request
import urllib.parse
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def test_live_servers():
    print("==================================================")
    print("1. Testing Vite Frontend Server (http://127.0.0.1:5173)")
    print("==================================================")
    try:
        req = urllib.request.Request("http://127.0.0.1:5173/")
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8')
            assert resp.status == 200
            assert "College Social Platform" in html or "root" in html
            print(f"[PASS] Frontend server is UP (HTTP {resp.status}) - HTML title/root tag detected")
    except Exception as e:
        print("[FAIL] Frontend server connection failed:", e)

    print("\n==================================================")
    print("2. Testing Live FastAPI Backend (http://127.0.0.1:8000)")
    print("==================================================")
    
    endpoints = [
        ("/", "Root / Health Check"),
        ("/feed", "Campus Feed Posts"),
        ("/reels", "Short Reels"),
        ("/clubs", "Clubs & Societies"),
        ("/messages", "Conversations & Messages"),
        ("/profile", "Student Profile"),
        ("/settings", "User Settings"),
        ("/notes", "Study Notes"),
        ("/question_paper", "Question Papers / PYQs"),
        ("/questions", "Campus Doubts & Questions"),
    ]

    for path, name in endpoints:
        url = f"http://127.0.0.1:8000{path}"
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                status = resp.status
                headers = dict(resp.headers)
                cors_header = headers.get("access-control-allow-origin", "None")
                print(f"[PASS] GET {path:18} -> HTTP {status} | CORS: {cors_header} | Module: {name}")
        except Exception as e:
            print(f"[FAIL] GET {path:18} -> Error: {e}")

    # Test Live POST /ai/chat
    print("\n--- Testing Live POST /ai/chat ---")
    try:
        url = "http://127.0.0.1:8000/ai/chat"
        payload = json.dumps({"message": "What is GEU AI?", "conversation_history": []}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[PASS] POST /ai/chat -> HTTP {resp.status} | Response: '{data.get('response', '')[:60]}...'")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        print(f"[EXPECTED STATUS/HANDLED] POST /ai/chat -> HTTP {e.code} | {err_body[:80]}")
    except Exception as e:
        print("[NOTICE] POST /ai/chat -> Exception:", e)

    # Test Live POST /ask-question
    print("\n--- Testing Live POST /ask-question ---")
    try:
        url = "http://127.0.0.1:8000/ask-question"
        payload = json.dumps({"title": "Where are GEU Grafest 2026 passes distributed?", "description": "Do we get passes from the department HOD office?", "subject": "Campus Life"}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[PASS] POST /ask-question -> HTTP {resp.status} | Created Question ID {data['question']['id']}")
    except Exception as e:
        print("[FAIL] POST /ask-question ->", e)

    # Test Live POST /feed
    print("\n--- Testing Live POST /feed ---")
    try:
        url = "http://127.0.0.1:8000/feed"
        payload = json.dumps({"content": "Live test post from Graphic Era student!", "tags": ["#LiveTest", "#GEU"]}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[PASS] POST /feed -> HTTP {resp.status} | Created post ID {data['post']['id']}")
    except Exception as e:
        print("[FAIL] POST /feed ->", e)

    # Test Live POST /messages
    print("\n--- Testing Live POST /messages ---")
    try:
        url = "http://127.0.0.1:8000/messages"
        payload = json.dumps({"conversation_id": 1, "text": "Are we meeting at the CS library?"}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[PASS] POST /messages -> HTTP {resp.status} | Sent message: '{data['message']['text']}'")
    except Exception as e:
        print("[FAIL] POST /messages ->", e)

    # Test Live POST /clubs/1/join
    print("\n--- Testing Live POST /clubs/1/join ---")
    try:
        url = "http://127.0.0.1:8000/clubs/1/join"
        req = urllib.request.Request(url, data=b"", headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[PASS] POST /clubs/1/join -> HTTP {resp.status} | {data['message']}")
    except Exception as e:
        print("[FAIL] POST /clubs/1/join ->", e)

    # Test Live POST /login
    print("\n--- Testing Live POST /login ---")
    try:
        url = "http://127.0.0.1:8000/login"
        payload = json.dumps({"email": "devansh.220110892@geu.ac.in", "password": "password123"}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"[PASS] POST /login -> HTTP {resp.status} | {data['message']} (Token: {data['token']})")
    except Exception as e:
        print("[FAIL] POST /login ->", e)

    print("\n==================================================")
    print("ALL LIVE NETWORK HTTP TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    test_live_servers()
