import React from 'react';
import { FiLogIn } from 'react-icons/fi';

import logoimg from '../../assets/logo.svg';

import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => (
  <Container>
    <Content>
      <img src={logoimg} alt="Barbershop" />

      <form>
        <h1>Faça seu logon</h1>

        <input type="text" placeholder="E-mail" />
        <input type="password" placeholder="Password" />

        <button type="submit">Log in</button>

        <a href="forgot">Forgot password</a>
      </form>

      <a href="login">
        <FiLogIn />
        Create account
      </a>
    </Content>

    <Background />
  </Container>
);

export default SignIn;
