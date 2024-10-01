import React from "react";

const VerificationPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verify Certificate
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="certificateId">
              Certificate ID
            </label>
            <input
              type="text"
              id="certificateId"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter certificate ID"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;
