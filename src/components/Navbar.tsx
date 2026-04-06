import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

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
    answer: 'RHIBMS offers accredited programs across several specialized schools: School of Biomedical Sciences (Nursing, Medical Lab Science, Midwifery, Pharmacy Technology, Physiotherapy, Health Care Management), School of Management Sciences (Accounting, Banking & Finance, Logistics and Transport Management, Human Resource Management, BSc Top-up degrees in Nursing and Midwifery), School of Engineering and Technology (Computer Science & Networks, Civil Engineering Technology, Urban Planning, Geotechnics), School of Agriculture (Agro Pastoral Entrepreneurship and Food Technology), School of Arts and Education (Special Education and Education Management), and Other Schools (Home Economics and Social Work, Law, Petroleum and Mining).'
  },
  {
    question: 'How much is the tuition and how long do programs last?',
    answer: 'HND Programs cost 250,000 F per year (2-3 years). BSc Top-up Programs cost 390,000 F (1-2 years).'
  },
  {
    question: 'Is RHIBMS accredited and recognized by the government?',
    answer: 'Yes. Established in 2010 under the Ministry of Public Health. Provides nationally recognized certification approved by Cameroon\'s Ministry of Public Health for professional Nursing Assistants and State Registered Nurses.'
  },
  {
    question: 'What are the admission requirements?',
    answer: 'Applicants must possess at least a GCE A-Level or equivalent. The admission process evaluates academic records and health fitness.'
  },
  {
    question: 'What unique benefits do students receive?',
    answer: 'Free transportation (2 buses), Starlink internet, international tours, partnership with University of Maryland Eastern Shore (UMES), Startup Capital Awards for graduates.'
  },
  {
    question: 'What is the success rate of graduates?',
    answer: 'Career-focused education with 90%+ graduate employment rate. Alumni employed in top hospitals, corporations, and government agencies across Cameroon.'
  },
  {
    question: 'Where is the campus located and how can I contact them?',
    answer: 'Located in Molyko, Buea, Cameroon, opposite Pres Hostel on Tarred Malingo. Contact: (+237) 677 172 022 / 681 019 578, 671 507 814 / 233 324 850.'
  }
];

import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogoutClick = async () => {
    await logout();
  };

  const userNavLinks: NavLink[] = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/partners', label: 'Partners' },
    { to: '/documentary', label: 'Documentary' }
  ];

  const adminNavLinks: NavLink[] = [
    ...userNavLinks,
    { to: '/admin', label: 'Admin Dashboard' }
  ];

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
            {(user ? (role === 'admin' ? adminNavLinks : userNavLinks) : []).map((link) => (
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
              className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
              title="Latest RHIBMS questions"
            >
              <MessageCircle size={22} />
            </button>
            {showFAQ && (
              <div className="absolute right-0 top-14 max-h-96 w-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                <div className="text-sm font-semibold text-gray-800 mb-2">Most asked RHIBMS questions</div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {faqItems.map((item, index) => (
                    <div key={index} className="rounded-md p-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition cursor-pointer">
                      <div className="text-xs font-semibold text-gray-800 mb-1">{index + 1}. {item.question}</div>
                      <div className="text-xs text-gray-600 leading-relaxed">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || 'User'} 
                  className="w-6 h-6 rounded-full object-cover"
                />
                {role === 'admin' && (
                  <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            )}
            {user ? (
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </button>
            )}

            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {(user ? (role === 'admin' ? adminNavLinks : userNavLinks) : userNavLinks).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {role === 'admin' && user && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-base font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
