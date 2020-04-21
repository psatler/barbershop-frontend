import React from 'react';

import GlobalStyle from './styles/global';

import ToastContainer from './componentes/ToastContainer';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import { AuthProvider } from './hooks/AuthContext';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <SignIn />
      {/* <SignUp /> */}
    </AuthProvider>

    <ToastContainer />
    <GlobalStyle />
  </>
);

export default App;
