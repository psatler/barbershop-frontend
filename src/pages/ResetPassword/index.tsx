import React, { useCallback, useRef, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useLocation, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';

import logoimg from '../../assets/logo.svg';

import Button from '../../componentes/Button';
import Input from '../../componentes/Input';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({}); // eslint-disable-line no-unused-expressions

        const schema = Yup.object().shape({
          password: Yup.string().required('Password is required'),
          // eslint-disable-next-line @typescript-eslint/camelcase
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Passwords must match',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // create API call
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }
        await api.post('/password/reset', {
          password,
          password_confirmation, // eslint-disable-line @typescript-eslint/camelcase
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors); // eslint-disable-line no-unused-expressions

          return;
        }

        // trigger a toast for a more generic error
        addToast({
          type: 'error',
          title: 'Reset password error',
          description:
            'An error has occurred while resetting your password. Try again later.',
        });
      } finally {
        setLoading(false);
      }
    },
    [location.search, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoimg} alt="Barbershop" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset Password</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New password"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirm password"
            />

            <Button loading={loading} type="submit">
              Reset password
            </Button>
          </Form>

          {/* <Link to="/signin">
            <FiLogIn />
            Get Back to Log in
          </Link> */}
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
