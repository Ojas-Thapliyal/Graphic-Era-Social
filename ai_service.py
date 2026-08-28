import os
from dotenv import load_dotenv
import httpx
from fastapi import HTTPException
from typing import List, Dict, Any, Optional

load_dotenv()

SYSTEM_PROMPT = (
    "You are GEU AI, the official AI-powered student assistant for Graphic Era Deemed to be University "
    "and Graphic Era Hill University (Dehradun, Bhimtal, Haldwani campuses).\n"
    "Your core role is to assist students with:\n"
    "1. Academic subjects (Computer Science, IT, AI & Data Science, Mechanical, ECE, Management, etc.).\n"
    "2. Exam preparation, tutorial sheets, handwritten notes, and Previous Year Questions (PYQs).\n"
    "3. Campus life, university societies, clubs (CodeChef GEU, IEEE, GERC, E-Cell, Rotaract), and events (Grafest, TechFest, Hackathons).\n"
    "4. Career advice, technical interview prep, and student project guidance.\n\n"
    "Guidelines:\n"
    "- Maintain a friendly, supportive, and campus-oriented tone.\n"
    "- Provide clear, concise, and accurate answers.\n"
    "- If asked about specific GEU details, refer accurately to Graphic Era Deemed and Graphic Era Hill University."
)

async def get_ai_response(message: str, conversation_history: Optional[List[Dict[str, Any]]] = None) -> str:
    """
    Backend AI Service function.
    Reads provider API key exclusively from environment variables on the backend.
    Supports OpenAI, Gemini, or Groq APIs via httpx.
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")

    if not (openai_key or gemini_key or groq_key):
        raise HTTPException(
            status_code=500,
            detail=(
                "AI Provider API Key not configured. Please add OPENAI_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY "
                "to your backend/.env file."
            )
        )

    history = conversation_history or []

    # --- 1. OpenAI or Groq API ---
    if openai_key or groq_key:
        api_key = openai_key or groq_key
        base_url = "https://api.openai.com/v1/chat/completions" if openai_key else "https://api.groq.com/openai/v1/chat/completions"
        model = "gpt-3.5-turbo" if openai_key else "llama3-8b-8192"

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role in ["user", "assistant", "system"] and content:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": message})

        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                resp = await client.post(base_url, json=payload, headers=headers)
                if resp.status_code != 200:
                    err_json = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
                    detail = err_json.get("error", {}).get("message", f"API request failed with status code {resp.status_code}")
                    raise HTTPException(status_code=502, detail=f"AI Provider error: {detail}")

                data = resp.json()
                return data["choices"][0]["message"]["content"]
            except httpx.RequestError as e:
                raise HTTPException(status_code=503, detail=f"Failed to communicate with AI Provider: {str(e)}")

    # --- 2. Google Gemini API ---
    if gemini_key:
        models_to_try = [
            "gemini-1.5-flash",
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-pro-latest",
            "gemini-flash-lite-latest"
        ]
        
        contents = []
        contents.append({"role": "user", "parts": [{"text": SYSTEM_PROMPT}]})
        contents.append({"role": "model", "parts": [{"text": "Understood! I am GEU AI, ready to assist Graphic Era students."}]})

        for msg in history:
            role = "user" if msg.get("role") == "user" else "model"
            content = msg.get("content", "")
            if content:
                contents.append({"role": role, "parts": [{"text": content}]})

        contents.append({"role": "user", "parts": [{"text": message}]})

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1000
            }
        }

        last_error = "Failed to connect to Gemini API"
        async with httpx.AsyncClient(timeout=30.0) as client:
            for model_name in models_to_try:
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
                try:
                    resp = await client.post(gemini_url, json=payload, headers={"Content-Type": "application/json"})
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0] and "parts" in candidates[0]["content"]:
                            return candidates[0]["content"]["parts"][0]["text"]
                    
                    err_json = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
                    last_error = err_json.get("error", {}).get("message", f"Gemini model {model_name} returned HTTP {resp.status_code}")
                except httpx.RequestError as e:
                    last_error = f"Request failed: {str(e)}"

        raise HTTPException(status_code=502, detail=f"Gemini API error: {last_error}")

    raise HTTPException(status_code=500, detail="No supported AI provider configured.")
