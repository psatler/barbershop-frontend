import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn: (credentials: SignInCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Barbershop:token');
    const user = localStorage.getItem('@Barbershop:user');

    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@Barbershop:token', token);
    localStorage.setItem('@Barbershop:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

function isEmpty(obj: object): boolean {
  return !obj || Object.keys(obj).length === 0;
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  console.log('useAuth context', isEmpty(context));
  // if component using this it is inside AuthContext.Provider (which is the AuthProvider component above)

  // if (!context) {
  //   throw new Error('useAuth must be used within a AuthProvider');
  // }
  if (isEmpty(context)) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
