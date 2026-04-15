import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-600 text-white w-full">
      {/* 4-Column section */}

      <div className="flex justify-center px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-24" style={{ marginTop: "24px", marginBottom: "24px" }}>

          {/* Company */}
          <div>
            <h2 className="font-bold text-lg mb-6">Company</h2>
            <ul className="flex flex-col gap-2 text-base text-red-100">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/volunteer" className="hover:text-white transition">Volunteer</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h2 className="font-bold text-lg mb-6">Explore</h2>
            <ul className="flex flex-col gap-2 text-base text-red-100">
              <li><Link href="/restaurants" className="hover:text-white transition">Restaurants</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/community" className="hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="font-bold text-lg mb-6">Support</h2>
            <ul className="flex flex-col gap-2 text-base text-red-100">
              <li><Link href="/support/help-center" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/support/faqs" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/support/community-guideline" className="hover:text-white transition">Community Guideline</Link></li>
              <li><Link href="/support/report-user" className="hover:text-white transition">Report User</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h2 className="font-bold text-lg mb-6">Legal</h2>
            <ul className="flex flex-col gap-2 text-base text-red-100">
              <li><Link href="/legal/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/legal/cookie-policy" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link href="/legal/accessibility" className="hover:text-white transition">Accessibility Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full mx-auto my-8 border-b-2 border-red-400" />

      {/* Bottom Section */}
      <div className="w-full px-8 py-6 flex flex-col items-center gap-2">
        <div className="flex justify-center gap-6 text-xl" style={{ marginTop: "12px"}}>
          <a href="#" className="hover:text-gray-200"><FaFacebook /></a>
          <a href="#" className="hover:text-gray-200"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-200"><FaXTwitter /></a>
          <a href="#" className="hover:text-gray-200"><FaYoutube /></a>
          <a href="#" className="hover:text-gray-200"><FaTiktok /></a>
        </div>
        <p className="text-base text-gray-200">&copy; {currentYear} The Local Kitchen. All rights reserved.</p>
      </div>
    </footer>
  );
}
