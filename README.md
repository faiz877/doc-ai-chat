# Document AI Chat App  

## 📌 About  
A simple full‑stack app to **upload documents and chat with them using AI**.  
The backend handles file upload & AI processing, while the frontend provides a clean chat‑style UI.  

---

## ⚙️ Tech Stack  
- **Frontend:** Next.js (TypeScript, Tailwind CSS)  
- **Backend:** FastAPI (Python), pdfplumber, Ollama (local LLM)  
- **Containerization:** Docker  

---

## 🚀 Setup  

### Backend  
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

With Docker:  
```bash
cd backend
docker build -t doc-ai-backend .
docker run -p 8000:8000 doc-ai-backend
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

- Frontend → [http://localhost:3000](http://localhost:3000)  
- Backend → [http://localhost:8000/docs](http://localhost:8000/docs)  

---

## 🛠️ How It Works  
- **/health** → Server status check  
- **/upload** *(POST file)* → Upload document (PDF, DOC, TXT), extract text  
- **/ask** *(POST JSON `{ "question": "..." }`)* → Send question + stored doc → Ollama LLM → return answer  

**Flow:**  
1. Start backend (FastAPI + Ollama)  
2. Upload document → text extracted & stored in memory  
3. Ask a question → backend sends context + query to Ollama → return answer  
4. Frontend shows answer in a **chat interface**  

---

## ✅ Summary  
This project demonstrates **FastAPI + Docker + AI integration**, paired with a **Next.js frontend**, to build an end‑to‑end document Q&A chat app.