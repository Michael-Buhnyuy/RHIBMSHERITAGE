import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../firebase';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          isAdmin: firebaseUser.email === ADMIN_EMAIL,
        };
        setUser(authUser);
        setRole(authUser.isAdmin ? 'admin' : 'user');
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
      
      // Fallback to localStorage admin auth if no Firebase user
      if (!firebaseUser) {
        const storedUser = localStorage.getItem('rhibmsAuthUser');
        const storedRole = localStorage.getItem('rhibmsRole');
        if (storedUser && storedRole) {
          try {
            const parsedUser = JSON.parse(storedUser) as AuthUser;
            setUser(parsedUser);
            setRole(storedRole as UserRole);
          } catch (e) {
            localStorage.removeItem('rhibmsAuthUser');
            localStorage.removeItem('rhibmsRole');
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  };

  const loginAsAdmin = async (email: string, password: string) => {
    const ADMIN_EMAIL = 'rhibmsadmin@gmail.com';
    const ADMIN_PASSWORD = 'Rhibmsadmin@123';
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: AuthUser = {
        uid: 'admin-manual',
        email,
        displayName: 'RHIBMS Admin',
        photoURL: '',
        isAdmin: true,
      };
      setUser(adminUser);
      setRole('admin');
      
      // Persist to localStorage
      localStorage.setItem('rhibmsAuthUser', JSON.stringify(adminUser));
      localStorage.setItem('rhibmsRole', 'admin');
      
      return;
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('rhibmsAuthUser');
      localStorage.removeItem('rhibmsRole');
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Persist user/role changes to localStorage (for admin auth)
  useEffect(() => {
    if (user && role === 'admin') {
      localStorage.setItem('rhibmsAuthUser', JSON.stringify(user));
      localStorage.setItem('rhibmsRole', role);
    }
  }, [user, role]);

  const value: AuthContextType = {
    user,
    role,
    loading,
    signInWithGoogle,
    logout,
    loginAsAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

