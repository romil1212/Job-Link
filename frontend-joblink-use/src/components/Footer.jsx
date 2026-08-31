import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        <div className="col-span-2 space-y-4">
          <Logo size="normal" />
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            JobLink is an intelligent developer learning and coding assessment platform helping programmers master data structures, algorithms, and technical interviews.
          </p>
          <div className="flex space-x-4 text-slate-400">
            <a href="#" className="hover:text-emerald-600 transition-colors"><FaGithub className="w-5 h-5" /></a>
            <a href="#" className="hover:text-emerald-600 transition-colors"><FaTwitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-emerald-600 transition-colors"><FaLinkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:text-emerald-600 transition-colors"><FaDiscord className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-4">Product</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#problems" className="hover:text-emerald-600 transition-colors">Problems</a></li>
            <li><a href="#learning-paths" className="hover:text-emerald-600 transition-colors">Learning Paths</a></li>
            <li><a href="#ai-mentor" className="hover:text-emerald-600 transition-colors">AI Mentor</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-4">Resources</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">API Docs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-4">Company</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © 2026 JobLink. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;