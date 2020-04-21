import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import logoimg from '../../assets/logo.svg';

import Button from '../../componentes/Button';
import Input from '../../componentes/Input';

import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({}); // eslint-disable-line no-unused-expressions

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email is required')
          .email('Type a valid email'),
        password: Yup.string().required('Password is required'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors); // eslint-disable-line no-unused-expressions
    }
  }, []);

  return (
    <Container>
      <Content>
        <img src={logoimg} alt="Barbershop" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Sign In</h1>

          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Log in</Button>

          <a href="forgot">Forgot password</a>
        </Form>

        <a href="login">
          <FiLogIn />
          Create account
        </a>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
