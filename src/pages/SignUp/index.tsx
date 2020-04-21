import React from 'react';
import { Form } from '@unform/web';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';

import logoimg from '../../assets/logo.svg';

import Button from '../../componentes/Button';
import Input from '../../componentes/Input';

import { Container, Content, Background } from './styles';

const SignUp: React.FC = () => {
  function handleSubmit(data: object): void {
    console.log(data);
  }

  return (
    <Container>
      <Background />

      <Content>
        <img src={logoimg} alt="Barbershop" />

        <Form onSubmit={handleSubmit}>
          <h1>Create an account</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="name" />
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />

          <Button type="submit"> Sign up </Button>
        </Form>

        <a href="login">
          <FiArrowLeft />
          Back to Log in
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
