import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto text-center md:flex md:justify-between">
        <p className="text-sm">&copy; 2024 CertifyPro. All rights reserved.</p>
        <div className="flex space-x-4 justify-center mt-4 md:mt-0">
          <a
            href="/privacy"
            className="hover:text-gray-400 transition duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-gray-400 transition duration-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
