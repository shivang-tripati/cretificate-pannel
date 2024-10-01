// src/components/CertificateVerification.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface CertificateData {
  certificateId: string;
  title: string;
  qrCodeUrl: string;
  s3Url: string;
  status: string;
  issuedDate: string;
  issuedBy: string;
}

const CertificateVerification: React.FC = () => {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract certificateId from URL (assuming URL structure is /verify/:certificateId)
  const certificateId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/certificates/${certificateId}`
        );
        setCertificate(response.data.certificateData);
      } catch (err) {
        setError("Certificate not found or invalid.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading)
    return <p className="text-center ">Loading certificate details...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center font-bold text-xl mt-10">
        {error}
      </p>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 gap-10 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center border-b-2 border-gray-300 pb-2 rounded-full">
          <span className="relative">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 -skew-x-12"></span>
            <span className="relative text-ita text-white">
              Certificate Verification
            </span>
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row lg:items-start justify-between mb-8">
          <div className="flex-1 lg:mr-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Certificate Name: {certificate?.title}
            </h2>

            <p
              className={`text-xl font-bold mb-2 ${
                certificate?.status === "valid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Status: {certificate?.status}
            </p>
            <p className="text-gray-700 text-md">
              Issued Date:{" "}
              {new Date(certificate?.issuedDate!).toLocaleDateString()}
            </p>
            <p className="text-gray-700 text-md">
              Issued By: {certificate?.issuedBy}
            </p>
            <p className="text-gray-700 text-md lg:text-nowrap ">
              Certificate ID: {certificate?.certificateId}
            </p>
          </div>

          <div className="flex-shrink-0 flex-1 lg:mb-0 mr-0">
            <img
              src={certificate?.qrCodeUrl}
              alt="QR Code"
              className=" h-[8rem] object-contain rounded-lg border border-gray-300 shadow-md"
            />
          </div>
        </div>

        <div className="w-full h-[600px]">
          <iframe
            src={certificate?.s3Url}
            className="w-full h-full rounded-lg border border-gray-300 shadow-md"
            title="Certificate PDF"
          />
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
