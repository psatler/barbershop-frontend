import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';

import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };

    // mocking the return of POST requests to the sessions endpoint
    apiMock.onPost('sessions').reply(200, apiResponse);

    // spying the localStorage call on its setItem
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // console.log(result.current);
    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Barbershop:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@Barbershop:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore the data saved in local storage when the app starts', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Barbershop:token':
          return 'token-123';

        case '@Barbershop:user':
          return JSON.stringify({
            id: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });

        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', () => {
    // to initialize the storage with some piece of data
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@Barbershop:token':
          return 'token-123';

        case '@Barbershop:user':
          return JSON.stringify({
            id: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });

        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2); // called 2 times
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      // eslint-disable-next-line
      avatar_url: 'image-test.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Barbershop:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
