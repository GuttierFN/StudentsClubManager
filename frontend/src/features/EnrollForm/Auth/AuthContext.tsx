import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../../shared/types';
import { apiGetMe, apiLogin, apiLogout, apiRegister, tokenStorage } from '../../shared/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, fullName: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!tokenStorage.getAccess() && !tokenStorage.getRefresh()) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await apiGetMe();
        setUser(currentUser);
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    setUser(data.user);
  };

  const register = async (username: string, fullName: string, password: string, role: UserRole) => {
    await apiRegister(username, fullName, password, role);
    const data = await apiLogin(username, password);
    setUser(data.user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}