import React, { useEffect, useState } from "react";
import {
  getCertificates,
  deleteCertificate,
  updateCertificateStatus,
} from "../../services/api";
import CertificateForm from "./CertificateForm";
import { BsPencil, BsTrash, BsCheck, BsX } from "react-icons/bs";

const CertificateList: React.FC = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<any | null>(
    null
  );
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch certificates from database
  const fetchCertificates = async () => {
    try {
      const response = await getCertificates();
      const certificates = response.data.certificates;
      setCertificates(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setCertificates([]);
    }
  };

  // Fetch certificates on component load
  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCertificateChange = () => {
    fetchCertificates(); // Re-fetch certificates after change
  };

  // Delete certificate
  const handleDelete = async (id: string) => {
    try {
      await deleteCertificate(id);
      setCertificates(
        certificates.filter((certificate) => certificate.certificateId !== id)
      );
    } catch (error) {
      console.error("Error deleting certificate:", error);
    }
  };

  // Toggle certificate status between valid and invalid
  const handleToggleStatus = async (certificate: any) => {
    try {
      const newStatus = certificate.status === "valid" ? "invalid" : "valid";
      await updateCertificateStatus(certificate.certificateId, newStatus); // Update in the database

      // Refetch certificates from the database to reflect updated status
      await fetchCertificates();
    } catch (error) {
      console.error("Error updating certificate status:", error);
    }
  };

  // Open form to edit
  const handleEdit = (certificate: any) => {
    setSelectedCertificate(certificate);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedCertificate(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <CertificateForm
          selectedCertificate={selectedCertificate}
          onClose={handleCloseForm}
          onCertificateChange={handleCertificateChange}
        />
      )}

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="py-2 px-4 border-b">Certificate ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <tr key={certificate.certificateId} className="border-b">
                <td className="py-2 px-4">{certificate.certificateId}</td>
                <td className="py-2 px-4">{certificate.title}</td>
                <td className="py-2 px-4">
                  {certificate.status === "valid" ? (
                    <span className="text-green-500">Valid</span>
                  ) : (
                    <span className="text-red-500">Invalid</span>
                  )}
                </td>
                <td className="py-2 px-4 flex space-x-3">
                  <button
                    onClick={() => handleEdit(certificate)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <BsPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(certificate.certificateId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <BsTrash />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(certificate)}
                    className={`${
                      certificate.status === "valid"
                        ? "text-green-600"
                        : "text-gray-500"
                    } hover:text-green-800 `}
                  >
                    {certificate.status === "valid" ? <BsCheck /> : <BsX />}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center">
                No certificates available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateList;
