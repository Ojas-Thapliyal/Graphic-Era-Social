from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("=" * 60)
print("TESTING NOTES & STATIC FILE SERVING")
print("=" * 60)

# 1. Test GET /notes
r1 = client.get("/notes")
print("GET /notes status:", r1.status_code)
data1 = r1.json()
print("Total notes count:", len(data1["notes"]))

# 2. Test GET /notes?semester=1st
r2 = client.get("/notes?semester=1st")
print("\nGET /notes?semester=1st count:", len(r2.json()["notes"]))
for n in r2.json()["notes"]:
    print(f"  * {n['title']}")
    print(f"    Semester: {n['semester']} | Subject: {n['subject']}")
    print(f"    Uploader: {n['uploader']} (Common / Non-personal)")
    print(f"    File URL: {n['file_url']} | Size: {n['file_size']}")

# 3. Test static file serving
print("\nTesting Static /uploads/notes/ endpoints:")
for f in ["Array.pdf", "Functions.pdf", "Pointers.pdf", "All_in_one_components.pdf", "All in one components.pdf"]:
    rf = client.get(f"/uploads/notes/{f}")
    print(f"  GET /uploads/notes/{f}: status {rf.status_code}, size: {len(rf.content)} bytes")

# 4. Test download endpoint
print("\nTesting /download/notes/ endpoint:")
rd = client.get("/download/notes/Functions.pdf")
print("  GET /download/notes/Functions.pdf:", rd.status_code, "size:", len(rd.content), "bytes")
print("=" * 60)
