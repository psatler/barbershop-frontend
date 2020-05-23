import React, { ButtonHTMLAttributes } from 'react';

import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <ButtonContainer loading={Number(loading)} type="button" {...rest}>
    {loading ? 'Loading...' : children}
  </ButtonContainer>
);

export default Button;
