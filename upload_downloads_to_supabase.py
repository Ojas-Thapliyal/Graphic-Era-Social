import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Load project environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FILE = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_FILE)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://nenbuwnkecfhpnncgdpb.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY", "sb_publishable__aYnsVHjNVVUIvrdxjUoew_RPKMfqA9")
BUCKET_NAME = os.getenv("SUPABASE_STORAGE_BUCKET", "notes")

DOWNLOADS_DIR = os.path.join(os.environ.get("USERPROFILE", r"C:\Users\admin"), "Downloads")

# Study Notes PDFs downloaded yesterday (Excluding question papers / exam papers)
EXCLUDE_KEYWORDS = ["mechanics", "tme", "exam", "paper", "pyq", "question", "question_paper", "mid-term", "end-term", "examiner"]

TARGET_NOTE_FILES = [
    "Functions.pdf",
    "Pointers.pdf",
    "Array.pdf",
    "All in one components.pdf"
]

def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be configured in .env")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def find_target_notes_pdfs():
    """Finds all study note PDFs downloaded yesterday, explicitly excluding question papers."""
    found_files = []
    
    # 1. Exact match for yesterday's study notes
    for name in TARGET_NOTE_FILES:
        path = os.path.join(DOWNLOADS_DIR, name)
        if os.path.exists(path):
            found_files.append((name, path))
            
    # 2. Also search any other PDFs created/modified in the last 48 hours that are not question papers
    cutoff = datetime.now() - timedelta(days=2)
    if os.path.exists(DOWNLOADS_DIR):
        for f in os.listdir(DOWNLOADS_DIR):
            if f.lower().endswith(".pdf") and f not in [x[0] for x in found_files]:
                if any(kw in f.lower() for kw in EXCLUDE_KEYWORDS):
                    continue
                full = os.path.join(DOWNLOADS_DIR, f)
                try:
                    mtime = datetime.fromtimestamp(os.stat(full).st_mtime)
                    if mtime >= cutoff:
                        found_files.append((f, full))
                except Exception:
                    pass
                
    return found_files

# Alias for backwards compatibility
find_target_pdfs = find_target_notes_pdfs

def sync_notes_to_local_uploads():
    """Copies target study notes from Downloads into backend/uploads/notes folder."""
    import shutil
    uploads_dir = os.path.join(BASE_DIR, "uploads", "notes")
    os.makedirs(uploads_dir, exist_ok=True)
    synced = []
    for name, path in find_target_notes_pdfs():
        safe_name = name.replace(" ", "_")
        dst = os.path.join(uploads_dir, safe_name)
        shutil.copy2(path, dst)
        synced.append((name, dst))
    return synced

def upload_pdf_anonymous(supabase: Client, file_name: str, file_path: str, bucket_name: str = "notes"):
    """Uploads a PDF file to Supabase Storage bucket 'notes' anonymously without requiring login."""
    safe_name = file_name.replace(" ", "_")
    storage_path = f"uploads/{safe_name}"
    
    print(f"[*] Uploading: {file_name} ({os.path.getsize(file_path) / (1024*1024):.2f} MB) to '{bucket_name}' bucket...")
    
    with open(file_path, "rb") as f:
        file_bytes = f.read()

    try:
        res = supabase.storage.from_(bucket_name).upload(
            path=storage_path,
            file=file_bytes,
            file_options={
                "content-type": "application/pdf",
                "upsert": "true"
            }
        )
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{storage_path}"
        print(f" [SUCCESS] Uploaded '{file_name}' -> {public_url}")
        return {
            "name": file_name,
            "path": storage_path,
            "url": public_url,
            "size_bytes": len(file_bytes),
            "size_mb": round(len(file_bytes) / (1024 * 1024), 2),
            "status": "success"
        }
    except Exception as e:
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{storage_path}"
        print(f" [ERROR] Failed to upload '{file_name}': {e}")
        return {
            "name": file_name,
            "error": str(e),
            "url": public_url,
            "status": "error"
        }

def main():
    print("=" * 70)
    print("  SUPABASE ANONYMOUS PDF UPLOADER - STUDY NOTES (NO AUTH REQUIRED)")
    print(f"  Supabase URL: {SUPABASE_URL}")
    print(f"  Target Storage Bucket: {BUCKET_NAME}")
    print("=" * 70)
    
    pdf_files = find_target_notes_pdfs()
    if not pdf_files:
        print(f"[!] No matching study note PDF files found in {DOWNLOADS_DIR}")
        return
    
    print(f"Found {len(pdf_files)} study note PDF(s) from Downloads (question papers excluded):")
    for name, path in pdf_files:
        size_mb = os.path.getsize(path) / (1024 * 1024)
        print(f"  - {name} ({size_mb:.2f} MB)")
    print("-" * 70)
    
    supabase = get_supabase_client()
    
    results = []
    for name, path in pdf_files:
        res = upload_pdf_anonymous(supabase, name, path, BUCKET_NAME)
        results.append(res)
        
    print("\n" + "=" * 70)
    print("UPLOAD SUMMARY:")
    for r in results:
        if r.get("status") == "success":
            print(f" [OK] {r['name']} -> {r['url']}")
        else:
            print(f" [FAILED] {r['name']} -> {r.get('error')}")
    print("=" * 70)

if __name__ == "__main__":
    main()
