const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      'ngrok-skip-browser-warning': 'true'
    },
    body: formData,
  });
  return response;
};

export const askQuestion = async (question: string) => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify({ question }),
  });
  return response;
};