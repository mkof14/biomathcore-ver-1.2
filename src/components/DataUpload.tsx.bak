"use client";
import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function DataUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setUploadStatus("Uploading...");
      const storageRef = ref(storage, `uploads/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setDownloadUrl(url);
        setUploadStatus("Upload successful!");
      } catch (error) {
        setUploadStatus("Upload failed: " + error.message);
      }
    } else {
      setUploadStatus("Please select a file.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="corporate-heading text-2xl mb-4">Upload Data</h2>
      <div className="bg-gray-800 p-6 rounded-lg text-white">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Upload
        </button>
        {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 mt-2 block"
          >
            View Uploaded File
          </a>
        )}
      </div>
    </div>
  );
}
