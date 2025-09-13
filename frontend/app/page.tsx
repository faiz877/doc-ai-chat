"use client";

import { useFileUpload } from '../hooks/useFileUpload';
import { useChat } from '../hooks/useChat';
import { UploadScreen } from '../components/UploadScreen';
import { ChatScreen } from '../components/ChatScreen';

export default function Home() {
  const fileUpload = useFileUpload();
  const chat = useChat();

  const resetChat = () => {
    chat.resetChat();
    fileUpload.reset();
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
          {fileUpload.uploaded && (
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
        {!fileUpload.uploaded ? (
          <UploadScreen
            file={fileUpload.file}
            setFile={fileUpload.setFile}
            uploading={fileUpload.uploading}
            onUpload={fileUpload.handleUpload}
          />
        ) : (
          <ChatScreen
            file={fileUpload.file}
            chat={chat.chat}
            question={chat.question}
            setQuestion={chat.setQuestion}
            asking={chat.asking}
            onAsk={chat.handleAsk}
            onKeyPress={chat.handleKeyPress}
            chatEndRef={chat.chatEndRef}
          />
        )}
      </div>
    </div>
  );
}