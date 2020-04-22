import React from 'react';
import {
  RouteProps as ReactDOMRoutePros,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRoutePros {
  isPrivate?: boolean;
  component: React.ComponentType;
}

//    route / authenticated?
// 1  true  / true  OK
// 2  true  / false Redirect to login
// 3  false / true  Redirect to Dashboard
// 4  false / false OK

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  const isSigned = Boolean(user); // same as doing !!user

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === isSigned ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: {
                from: location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
