# Graphic Era Social Platform 🎓🚀

A modern full-stack academic and social platform designed specifically for students and faculty of **Graphic Era Deemed & Hill University**.

---

## ✨ Key Features

- **📰 Campus Feed**: Share announcements, hackathon wins, campus news, and achievements with peer comments & likes.
- **🎬 Campus Reels**: Short video updates, fest performances, campus views, and dance society clips.
- **📚 Study Notes & Interactive Viewer**:
  - Comprehensive peer-shared lecture notes for **all Semesters (1st to 8th)**.
  - **Online Interactive Reader**: Unit-by-unit study layout, code samples with 1-click copy, exam strategy tips, formula cheat sheets, and university end-term questions.
  - **Embedded PDF Viewer** and direct downloads.
- **📑 Question Papers (PYQs)**: 42+ verified previous year end-term and mid-term question papers with solutions.
- **❓ Q&A & Campus Doubts**: Ask and answer subject-specific or placement doubts with upvotes.
- **🏛️ Clubs & Societies**: Discover and join campus chapters (CodeChef GEU, IEEE, GERC Robotics, Rotaract, Zenith E-Cell).
- **💬 Direct Messaging**: Student-to-student chat and peer discussions.
- **🤖 GEU AI Assistant**: Official AI student assistant for instant syllabus and campus guidance.
- **👤 Student Profiles**: Customizable bio, skills, campus badges, and roll numbers.
- **🌓 Dark & Light Mode**: Seamless theme switching with custom Graphic Era branding.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic
- **Cloud & Storage**: Cloudflare Pages, Cloudflare Pages Functions, Supabase Storage
- **Deployment**: Cloudflare Pages (Serverless Edge Full-Stack)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python 3.11+

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
FastAPI backend will run on `http://127.0.0.1:8000`.

---

## ☁️ Deployment on Cloudflare

Deploy both Frontend and Serverless Edge API with 1 command:
```bash
cd frontend
npx wrangler pages deploy dist --project-name=college-social-platform
```

---

## 📄 License
This project is open-source and built for the Graphic Era University student community.
