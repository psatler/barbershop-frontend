import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

// import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import logoimg from '../../assets/logo.svg';

import Button from '../../componentes/Button';
import Input from '../../componentes/Input';

import { Container, Content, AnimationContainer, Background } from './styles';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  // const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
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

        // recover pass

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors); // eslint-disable-line no-unused-expressions

          return;
        }

        // trigger a toast for a more generic error
        addToast({
          type: 'error',
          title: 'Password recovery error',
          description:
            'An error has occurred while performing trying to recover your password.',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoimg} alt="Barbershop" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover password</h1>

            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />

            <Button type="submit">Recover Pass</Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Get Back to Login
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
