// File: src/components/CsvUploader.jsx

import { useState } from "react";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

const CsvUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const { uploadCSV, isUploadingCSV, isCSVUploadSuccessfully } =
    useAdminAuthStore();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading...");
      await uploadCSV(file);

      setUploadStatus(`Success: ${response.data.message}`);
    } catch (error) {
      setUploadStatus(
        `Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="min-h-[20vh] bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto mt-10 flex flex-col gap-5 border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Upload Cohort CSV
      </h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="file-input file-input-primary  w-full"
      />
      <button
        onClick={handleUpload}
        disabled={isUploadingCSV}
        className="btn btn-primary w-full flex items-center justify-center"
      >
        {isUploadingCSV ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          "Upload CSV"
        )}
      </button>

      {/* Upload Status Message */}
      {uploadStatus && (
        <p className="text-sm text-center text-gray-600">{uploadStatus}</p>
      )}

      {/* Success Message */}
      {isCSVUploadSuccessfully && (
        <div className="flex items-center justify-center text-green-600 text-sm mt-2">
          <CheckCircle className="w-5 h-5 mr-2" />
          File uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
