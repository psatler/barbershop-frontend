/* eslint-disable @typescript-eslint/camelcase  */
import React, { useCallback, useRef, useState, ChangeEvent } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../componentes/Button';
import Input from '../../componentes/Input';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

import avatarPlaceholder from '../../assets/avatar-placeholder.png';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({}); // eslint-disable-line no-unused-expressions

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('Email is required')
            .email('Type a valid email'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Field is required'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Field is required'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'New passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // handling when the user does not provide any new password, only updating name or email
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Profile updated!',
          description: 'Your profile data has been updated successfully.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors); // eslint-disable-line no-unused-expressions

          return;
        }

        // trigger a toast for a more generic error
        addToast({
          type: 'error',
          title: 'Profile update error',
          description:
            'An error has occurred when updating profile. Try again later.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        try {
          // console.log(e.target.files[0]);
          const data = new FormData();

          data.append('avatar', e.target.files[0]);

          const response = await api.patch('/users/avatar', data);

          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar has been updated!',
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url ?? avatarPlaceholder} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </label>
          </AvatarInput>

          <h1>My profile</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="name" />
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Current password"
          />
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
            Confirm changes
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
