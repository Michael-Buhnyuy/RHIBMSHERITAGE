import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Partners from './pages/Partners';
import Admin, { DocumentaryData } from './pages/Admin';
import Contact from './pages/Contact';
import Login from './pages/Login';
import './index.css';
import Documentary from './pages/Documentary';

const AUTH_KEY = 'adminAuth';

function App() {
  const [data, setData] = useState<DocumentaryData>({
    internationalTours: [],
    nationalTours: [],
    events: [],
    awards: [],
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    const auth = stored === 'true';
    setIsAuthenticated(auth);

    if (auth && window.location.pathname === '/login') {
      window.history.replaceState({}, '', '/admin');
    }
  }, []);

  const handleAdminIconClick = () => {
    window.location.href = isAuthenticated ? '/admin' : '/login';
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-rhibms-red-50 via-white to-rhibms-sky-50">
        <Navbar onAdminClick={handleAdminIconClick} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/Documentary" element={<Documentary data={data} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <Admin setData={setData} onLogout={handleLogout} />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

