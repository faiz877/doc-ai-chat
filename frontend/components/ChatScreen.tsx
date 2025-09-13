import { ChatMessage } from "../types/types";

interface ChatScreenProps {
  file: File | null;
  chat: ChatMessage[];
  question: string;
  setQuestion: (q: string) => void;
  asking: boolean;
  onAsk: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatScreen = ({ 
  file, 
  chat, 
  question, 
  setQuestion, 
  asking, 
  onAsk, 
  onKeyPress, 
  chatEndRef 
}: ChatScreenProps) => {
  return (
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

      {/* Chat Messages */}
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

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Ask a question about your document..."
              rows={1}
              className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm text-gray-900 max-h-32"
              style={{ minHeight: '44px' }}
              disabled={asking}
            />
          </div>
          <button
            onClick={onAsk}
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
  );
};