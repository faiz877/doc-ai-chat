interface UploadScreenProps {
  file: File | null;
  setFile: (file: File | null) => void;
  uploading: boolean;
  onUpload: () => void;
}

export const UploadScreen = ({ file, setFile, uploading, onUpload }: UploadScreenProps) => {
  return (
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
            Upload a PDF document to begin asking questions
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
                  </div>
                )}
              </div>
            </div>
          </label>

          <button
            onClick={onUpload}
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
  );
};