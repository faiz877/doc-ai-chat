import { useState } from 'react';

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

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

  const reset = () => {
    setFile(null);
    setUploaded(false);
  };

  return {
    file,
    setFile,
    uploading,
    uploaded,
    handleUpload,
    reset
  };
};