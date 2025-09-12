from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import pdfplumber
import requests

app = FastAPI()

# 1. Health check
@app.get("/health")
def health():
    return {"status": "ok"}

# Variable to store the uploaded document text
DOCUMENT_TEXT = ""

# 2. Upload document
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global DOCUMENT_TEXT
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    DOCUMENT_TEXT = text
    return {"filename": file.filename, "chars": len(DOCUMENT_TEXT)}

# Request model for /ask
class Question(BaseModel):
    question: str

# 3. Ask a question
@app.post("/ask")
async def ask(body: Question):
    if not DOCUMENT_TEXT:
        return {"error": "No document uploaded yet"}

    q = body.question
    payload = {
        "model": "mistral",
        "prompt": f"Document: {DOCUMENT_TEXT[:2000]}\n\nQ: {q}\nA:",
        "stream": False
    }
    r = requests.post("http://host.docker.internal:11434/api/generate", json=payload)
    data = r.json()
    return {"answer": data.get("response", "")}