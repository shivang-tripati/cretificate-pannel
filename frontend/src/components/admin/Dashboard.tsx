import React, { useState } from "react";
import CertificateForm from "./CertificateForm";
import CertificateList from "./CertificateList";

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <button
        onClick={handleShowForm}
        className="mb-6 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
      >
        Add New Certificate
      </button>

      {showForm && (
        <CertificateForm
          onCertificateChange={handleHideForm}
          onClose={handleHideForm}
        />
      )}

      <CertificateList />
    </div>
  );
};

export default Dashboard;
