import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Partners from './pages/Partners';
import Admin, { DocumentaryData } from './pages/Admin';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Documentary from './pages/Documentary';
import { UserProtectedRoute } from './components/UserProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function AppContent() {
  const [data, setData] = useState<DocumentaryData>({
    internationalTours: [],
    nationalTours: [],
    events: [],
    awards: [],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhibms-red-50 via-white to-rhibms-sky-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={
            <UserProtectedRoute>
              <About />
            </UserProtectedRoute>
          } />
          <Route path="/programs" element={
            <UserProtectedRoute>
              <Programs />
            </UserProtectedRoute>
          } />
          <Route path="/partners" element={
            <UserProtectedRoute>
              <Partners />
            </UserProtectedRoute>
          } />
          <Route path="/documentary" element={
            <UserProtectedRoute>
              <Documentary data={data} />
            </UserProtectedRoute>
          } />
          <Route path="/questions" element={
            <UserProtectedRoute>
              <div>Latest RHIBMS Questions (FAQ integrated in Navbar)</div>
            </UserProtectedRoute>
          } />
          <Route path="/contact" element={
            <UserProtectedRoute>
              <Contact />
            </UserProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <Admin setData={setData} />
            </AdminProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

