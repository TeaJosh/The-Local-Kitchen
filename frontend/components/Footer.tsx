import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-600 text-white py-6">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Top Section: Logo and Navigation */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-10">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <img src="/Logo.svg" alt="Logo" className="h-12 w-12 mb-1" />
            <span className="text-lg font-bold">The Local Kitchen</span>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 flex-1 text-sm mt-4">
            {/* Company */}
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="space-y-1 text-gray-200">
                <li>
                  <a href="/about" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold mb-2">Explore</h4>
              <ul className="space-y-1 text-gray-200">
                <li>
                  <a href="/restaurants" className="hover:text-white">
                    Restaurants
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/community" className="hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-1 text-gray-200">
                <li>
                  <a href="/help" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/faqs" className="hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/guidelines" className="hover:text-white">
                    Community Guidelines
                  </a>
                </li>
                <li>
                  <a href="/report" className="hover:text-white">
                    Report Content
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-2">Legal</h4>
              <ul className="space-y-1 text-gray-200">
                <li>
                  <a href="/terms" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="/accessibility" className="hover:text-white">
                    Accessibility Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider and Bottom Section */}
        <div className="border-t border-red-400 mt-6 pt-6 text-center">
          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mt-3 mb-3 text-xl">
            <a href="#" className="hover:text-gray-200">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-gray-200">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-200">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-gray-200">
              <FaYoutube />
            </a>
            <a href="#" className="hover:text-gray-200">
              <FaTiktok />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-200">
            &copy; {currentYear} The Local Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
