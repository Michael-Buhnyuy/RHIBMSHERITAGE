import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-rhibms-red-900 to-rhibms-sky-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-rhibms-red-400 to-rhibms-sky-400 bg-clip-text text-transparent">
              RHIBMS Heritage
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Preserving the history and legacy of Redemption Higher Institute of Biomedical and Management Science.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="/programs" className="hover:text-blue-400 transition-colors">Programs</a></li>
              <li><a href="/metrics" className="hover:text-blue-400 transition-colors">Metrics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>Molyko Buea, Tared Malingo </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+237 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>info@rhibms.org</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 RHIBMS Heritage. All rights reserved. | Data preserved for generations.</p>
        </div>
      </div>
    </footer>
  );
}
