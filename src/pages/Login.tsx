import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminIsProcessing, setAdminIsProcessing] = useState(false);
  const { signInWithGoogle, loginAsAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setIsProcessing(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      setAdminError('Please enter both email and password');
      return;
    }
    setAdminError('');
    setAdminIsProcessing(true);
    try {
      await loginAsAdmin(adminEmail, adminPassword);
      navigate('/admin');
    } catch (err: any) {
      setAdminError(err.message || 'Invalid admin credentials');
      console.error(err);
    } finally {
      setAdminIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl border border-slate-200 p-8">
        <h2 className="text-center text-2xl font-semibold text-slate-900 mb-6">Sign in with Google</h2>
        <p className="text-center text-slate-600 mb-8">Access RHIBMS Heritage content</p>
        {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
        <button
          onClick={handleGoogleLogin}
          disabled={isProcessing || loading}
          className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 ${
            isProcessing || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-[1.02]'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.83l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>
        
        {/* OR Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-slate-200"></div>
          <span className="px-6 text-xs text-slate-500 font-medium uppercase tracking-wider">OR</span>
          <div className="flex-grow h-px bg-slate-200"></div>
        </div>

        {/* Admin Login */}
        {!showAdminForm ? (
          <button
            onClick={() => setShowAdminForm(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-xl hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Login as Admin
          </button>
        ) : (
          <div className="space-y-4">
            {adminError && <p className="text-sm text-red-600 mb-4 text-center bg-red-50 p-3 rounded-xl border border-red-200">{adminError}</p>}
            <input
              type="email"
              placeholder="admin@rhibmsheritage.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm text-sm"
              disabled={adminIsProcessing}
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm text-sm"
              disabled={adminIsProcessing}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminForm(false);
                  setAdminEmail('');
                  setAdminPassword('');
                  setAdminError('');
                }}
                className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition shadow-sm"
                disabled={adminIsProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                disabled={adminIsProcessing}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                  adminIsProcessing
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                {adminIsProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </div>
        )}
        
        <p className="text-xs text-slate-500 mt-6 text-center">
          Use your Google account to sign in. Admin access for rhibmsadmin@gmail.com
        </p>
      </div>
    </div>
  );
}

