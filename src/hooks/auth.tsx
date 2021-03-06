import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';
import { isEmpty } from '../utils/objectUtils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Barbershop:token');
    const user = localStorage.getItem('@Barbershop:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

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

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Barbershop:token');
    localStorage.removeItem('@Barbershop:user');

    setData({} as AuthState);
  }, []);

  // const updateUser = useCallback((updatedData: Partial<User>) => {
  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });

      // update the user on localStorage as well
      localStorage.setItem('@Barbershop:user', JSON.stringify(user));
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  console.log('useAuth context', isEmpty(context));
  // if component using this it is inside AuthContext.Provider (which is the AuthProvider component above)

  // if (!context) {
  //   throw new Error('useAuth must be used within a AuthProvider');
  // }
  if (isEmpty(context)) {
    // throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
