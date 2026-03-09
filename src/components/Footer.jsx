import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">

      <div className="grid grid-cols-1 gap-10 px-6 py-12 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-bold">
              Sree Saravana <span className="text-blue-600">Electricials</span>
            </h2>
          </div>
          <p className="mt-3 mb-6 text-gray-600 dark:text-gray-400">
            Your trusted partner for premium electrical products, offering quality wiring,
            cooling solutions, and home appliances with expert installation services.
          </p>

          {/* SOCIAL LINKS */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="flex items-center justify-center w-10 h-10 text-blue-600 transition-colors bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50">
                <Facebook size={18} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-800/50">
                <Twitter size={18} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 text-pink-600 transition-colors bg-pink-100 rounded-lg dark:bg-pink-900/30 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/50">
                <Instagram size={18} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 text-blue-700 transition-colors bg-blue-200 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-300 dark:hover:bg-blue-800/50">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="pb-2 mb-5 text-lg font-bold text-gray-900 border-b border-gray-200 dark:border-gray-700 dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                My Account
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="pb-2 mb-5 text-lg font-bold text-gray-900 border-b border-gray-200 dark:border-gray-700 dark:text-white">
            Categories
          </h3>
          <ul className="space-y-3">
            <li>
              <Link to="/category/switches" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Switches & Sockets
              </Link>
            </li>
            <li>
              <Link to="/category/power" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Power Generation & Transformers
              </Link>
            </li>
            <li>
              <Link to="/category/fan" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Light & Fans
              </Link>
            </li>
            <li>
              <Link to="/category/water-heaters" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Water Heaters & Geyser
              </Link>
            </li>
            <li>
              <Link to="/category/wires & cables" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Wires & Cables
              </Link>
            </li>
            <li>
              <Link to="/category/water-pumps" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Water Pumps & Motor
              </Link>
            </li>
            <li>
              <Link to="/category/metering-distribution" className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                Metering & Distribution
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="pb-2 mb-5 text-lg font-bold text-gray-900 border-b border-gray-200 dark:border-gray-700 dark:text-white">
            Contact Info
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Our Location</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">TamilNadu, India</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <Phone size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Phone Number</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">9843267999</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                <Mail size={18} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Address</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">sreesaravanaelectricals6@gmail.com</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="py-5 bg-gray-900 dark:bg-black">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} <span className="font-semibold text-blue-400">Sree Saravana Electricials</span>. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
              <Link to="/return" className="transition-colors hover:text-white">Return Policy</Link>
              <Link to="/faq" className="transition-colors hover:text-white">FAQs</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
