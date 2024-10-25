// Footer.tsx
import React from 'react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-50 text-black p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-4 md:mb-0">
          Made by <strong>Bigyan Adhikari</strong>
        </p>
        <div className="flex space-x-4">
          <a
            href="https://www.linkedin.com/in/bigyanadhikari07/" // Replace with your LinkedIn URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-purple-500 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://github.com/bigyanadk07/" // Replace with your GitHub URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-purple-500 transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://x.com/Bigyanadk" // Replace with your Twitter URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-purple-500 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Bigyan Adhikari. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
