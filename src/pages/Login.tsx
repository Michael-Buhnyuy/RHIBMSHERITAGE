import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: () => void;
}

const VALID_EMAIL = 'rhibmsadmin@gmail.com';
const VALID_PASSWORD = 'Rhibmsadmin@123';
const STORAGE_KEY = 'adminAuth';

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      onLoginSuccess();
      navigate('/admin');
    }
  }, [onLoginSuccess, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        localStorage.setItem(STORAGE_KEY, 'true');
        onLoginSuccess();
        navigate('/admin');
      } else {
        setError('Invalid credentials');
        setIsProcessing(false);
      }
    }, 350);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEmail('');
    setPassword('');
    setError('');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-slate-200 p-8">
        <h2 className="text-center text-2xl font-semibold text-slate-900 mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="admin@example.com"
              disabled={isProcessing}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              disabled={isProcessing}
            />
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              isProcessing ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
            type="button"
          >
            Clear auth (logout)
          </button>
        </div>
      </div>
    </div>
  );
}
