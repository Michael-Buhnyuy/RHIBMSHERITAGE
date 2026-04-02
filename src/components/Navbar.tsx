import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, MessageCircle } from 'lucide-react';

interface NavLink {
  to: string;
  label: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What programs and degrees does RHIBMS offer?',
    answer: 'RHIBMS offers accredited programs across Biomedical Sciences, Management Sciences, Engineering and Technology, Agriculture, Arts and Education, and more.',
  },
  {
    question: 'How much is the tuition and how long do programs last?',
    answer: 'HND programs are about 250,000 F/year for 2-3 years; BSc top-up programs are about 390,000 F for 1-2 years.',
  },
  {
    question: 'Is RHIBMS accredited and recognized by the government?',
    answer: 'Yes. Established 2010 under the Ministry of Public Health with nationally recognized certification.',
  },
  {
    question: 'What are the admission requirements?',
    answer: 'Applicants generally need GCE A-Level or equivalent, academic records and health fitness.',
  },
  {
    question: 'What unique benefits do students receive?',
    answer: 'Free transport, Starlink internet, international tours, UMES partnership, and startup awards.',
  },
  {
    question: 'What is the success rate of graduates?',
    answer: 'RHIBMS reports a career-focused education with over 90% graduate employment rate.',
  },
  {
    question: 'Where is the campus located and how can I contact them?',
    answer: 'Molyko, Buea opposite Pres Hostel on Tarred Malingo. Contact: (+237) 677 172 022 / 681 019 578 / 671 507 814 / 233 324 850.',
  },
];

const latestFAQ = faqItems[0];

interface NavbarProps {
  onAdminClick: () => void;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/partners', label: 'Partners' },
  { to: '/documentary', label: 'Documentary' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar({ onAdminClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 bg-clip-text text-transparent">
              RHIBMS Heritage
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowFAQ((prev) => !prev)}
              className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition"
              title="Latest RHIBMS question"
            >
              <MessageCircle size={22} />
            </button>
            {showFAQ && (
              <div className="absolute right-0 top-14 max-h-96 w-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                <div className="text-sm font-semibold text-gray-800">Most asked RHIBMS questions</div>
                <div className="mt-2 space-y-3">
                  {faqItems.map((item, index) => (
                    <div key={index} className="rounded-md p-2 bg-gray-50 border border-gray-100">
                      <div className="text-xs font-semibold text-gray-800">{index + 1}. {item.question}</div>
                      <div className="mt-1 text-xs text-gray-600">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onAdminClick}
              className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition"
              title="Admin Access"
            >
              <User size={22} />
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === link.to
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
