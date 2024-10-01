// src/pages/HomePage.tsx
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">
            Certificate Management System
          </h1>
          <p className="text-lg mb-8">
            A platform to issue, manage and verify digital certificates.
          </p>
          <a
            href="/register"
            className="bg-white text-purple-700 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-200"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold mb-2">Certificate Generation</h3>
              <p className="text-gray-700">
                Create digital certificates with custom fields and templates.
              </p>
            </div>
            <div className="feature bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold mb-2">Certificate Management</h3>
              <p className="text-gray-700">
                Manage certificate issuance, renewal and revocation.
              </p>
            </div>
            <div className="feature bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold mb-2">
                Certificate Verification
              </h3>
              <p className="text-gray-700">
                Verify certificate status and authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta bg-purple-600 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg mb-8">
            Sign up today and start issuing digital certificates.
          </p>
          <a
            href="/register"
            className="bg-white text-purple-700 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-200"
          >
            Join Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
