import { renderHook } from '@testing-library/react-hooks';
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
});
