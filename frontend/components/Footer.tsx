import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-4">
          <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
          <li><a href="/accessibility" className="hover:text-white">Accessibility Policy</a></li>
        </ul>

        {/* Divider and Bottom Section */}
        <div className="border-t border-red-400 mt-6 pt-6 text-center">
          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mt-3 mb-3 text-xl">
            <a href="#" className="hover:text-gray-200"><FaFacebook /></a>
            <a href="#" className="hover:text-gray-200"><FaInstagram /></a>
            <a href="#" className="hover:text-gray-200"><FaXTwitter /></a>
            <a href="#" className="hover:text-gray-200"><FaYoutube /></a>
            <a href="#" className="hover:text-gray-200"><FaTiktok /></a>
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
