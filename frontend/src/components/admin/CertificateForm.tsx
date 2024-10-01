import React, { useState, useEffect } from "react";
import { createCertificate, updateCertificate } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { FaTimes } from "react-icons/fa";

interface CertificateFormProps {
  selectedCertificate?: any;
  onClose: () => void;
  onCertificateChange: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  selectedCertificate,
  onClose,
  onCertificateChange,
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState<string>("");
  const [status, setStatus] = useState<string>("valid");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCertificate) {
      setCertificateName(selectedCertificate.title);
      setStatus(selectedCertificate.status);
    }
  }, [selectedCertificate]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !selectedCertificate) {
      setError("Please select a file.");
      return;
    }
    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("certificate", file);
    formData.append("certificateName", certificateName);
    formData.append("userId", user.id);
    formData.append("status", status);

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedCertificate) {
        console.log("selectedCertificate", selectedCertificate);
        await updateCertificate(selectedCertificate.certificateId, formData);
        setSuccess("Certificate updated successfully!");
      } else {
        await createCertificate(formData);
        setSuccess("Certificate uploaded successfully!");
      }

      onCertificateChange(); // Notify CertificateList to refresh
      onClose(); // Close the form after success
    } catch (error) {
      setError("Error saving the certificate. Please try again.");
      console.error("Error saving file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg mt-3 mb-5 relative">
      {/* Close button */}
      {loading && <div className="loader">Loading...</div>}
      <button
        onClick={onClose}
        aria-label="Close form"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        <FaTimes />
      </button>

      <h2 className="text-2xl font-semibold text-center mb-6">
        {selectedCertificate ? "Update Certificate" : "Upload Certificate"}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* File Input */}
        {!selectedCertificate && (
          <div className="mb-4">
            <label
              htmlFor="certificate"
              className="block text-gray-700 font-medium mb-2"
            >
              Choose a certificate (PDF only)
            </label>
            <input
              type="file"
              id="certificate"
              accept="application/pdf"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="block border-gray-400 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}

        {/* Certificate Name */}
        <div className="mb-4">
          <label
            htmlFor="certificateName"
            className="block text-gray-700 font-medium mb-2"
          >
            Certificate Name
          </label>
          <input
            type="text"
            id="certificateName"
            placeholder="Enter certificate name"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            className="block w-full border-2 p-1 border-gray-200 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 font-medium">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full border-2 p-1 border-gray-300 rounded-md shadow-sm"
          >
            <option value="valid">Valid</option>
            <option value="invalid">Invalid</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-4 rounded-md`}
            disabled={loading}
          >
            {loading ? "Saving..." : selectedCertificate ? "Update" : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
