import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Remind App. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200 flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>GitHub</span>
            </a>
            <div className="text-neutral-500 flex items-center">
              <span className="mr-1">Made with</span>
              <Heart className="h-4 w-4 text-error-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;