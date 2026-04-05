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
    answer: 'RHIBMS offers accredited programs across Biomedical Sciences, Management Sciences, Engineering and Technology, Agriculture, Arts and Education, and more.',
  },
  // ... (keep all existing FAQ items)
  // (truncated for brevity - keep original faqItems array)
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
    { to: '/documentary', label: 'Documentary' },
  ];

  const adminNavLinks: NavLink[] = [
    ...userNavLinks,
    { to: '/admin', label: 'Admin' },
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

          {role === 'admin' && (
            <Link
              to="/admin"
              className="px-3 py-2 text-sm font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 ml-2"
            >
              Admin Dashboard
            </Link>
          )}

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

{user && (
            <div className="flex items-center gap-2 p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || 'User'} 
                className="w-6 h-6 rounded-full"
              />
              {role === 'admin' && (
                <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded-full">Admin</span>
              )}
            </div>
          )}
          {user && (
            <button
              onClick={handleLogoutClick}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap ml-2"
            >
              Logout
            </button>
          )}
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}

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
{(user ? userNavLinks : []).map((link) => (
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

