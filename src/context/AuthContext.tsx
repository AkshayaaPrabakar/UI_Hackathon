import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    joinDate: '2024-01-15',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'admin',
    department: 'HR',
    joinDate: '2023-08-20',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        token: savedToken,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock authentication - in production, this would be an API call
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }

    const token = `mock-jwt-${Date.now()}`;
    
    setAuthState({
      user,
      isAuthenticated: true,
      token,
    });

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const resetPassword = async (email: string): Promise<void> => {
    // Mock password reset
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    // In production, this would send a reset email
    console.log(`Password reset email sent to ${email}`);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};