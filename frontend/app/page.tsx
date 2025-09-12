"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<{ q: string; a: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // State management
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [asking, setAsking] = useState(false);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploaded(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploaded(true);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    const currentQuestion = question;
    setQuestion("");
    
    // Add user question to chat immediately
    const newChat = [...chat, { q: currentQuestion, a: "" }];
    setChat(newChat);
    
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      const data = await res.json();
      
      // Update the last chat entry with the answer
      setChat(prev => {
        const updated = [...prev];
        updated[updated.length - 1].a = data.answer;
        return updated;
      });
    } finally {
      setAsking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const resetChat = () => {
    setChat([]);
    setFile(null);
    setUploaded(false);
    setQuestion("");
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Document Chat</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Upload a document and ask questions about its content
            </p>
          </div>
          {uploaded && (
            <button
              onClick={resetChat}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              New Chat
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        {!uploaded ? (
          /* Upload State */
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Get started with your document
                </h2>
                <p className="text-gray-600 text-sm">
                  Upload a PDF, Word document, or text file to begin asking questions
                </p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        setFile(e.target.files?.[0] || null);
                        setUploaded(false);
                      }}
                    />
                    <div className="space-y-2">
                      <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {file ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900">Click to upload</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    !file || uploading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Upload Document"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Chat State */
          <>
            {/* Document Info Bar */}
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">{file?.name}</p>
                  <p className="text-xs text-blue-600">Document ready for questions</p>
                </div>
              </div>
            </div>

            {/* Chat Messages - Fixed container with proper overflow */}
            <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
              {chat.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Start a conversation</h3>
                  <p className="text-sm text-gray-500">Ask any question about your document</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {chat.map((c, i) => (
                    <div key={i} className="space-y-4">
                      {/* User Question */}
                      <div className="flex justify-end">
                        <div className="max-w-2xl bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 break-words">
                          <p className="text-sm whitespace-pre-wrap break-words">{c.q}</p>
                        </div>
                      </div>
                      
                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="max-w-2xl w-full">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex-1 min-w-0">
                              {c.a ? (
                                <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{c.a}</p>
                              ) : (
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse animation-delay-100"></div>
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse animation-delay-200"></div>
                                  <span className="text-sm">Thinking...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your document..."
                    rows={1}
                    className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm text-gray-900 max-h-32"
                    style={{ minHeight: '44px' }}
                    disabled={asking}
                  />
                </div>
                <button
                  onClick={handleAsk}
                  disabled={!question.trim() || asking}
                  className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                    !question.trim() || asking
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {asking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}