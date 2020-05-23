import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ButtonProps {
  loading?: number;
}

export const ButtonContainer = styled.button<ButtonProps>`
  background: #ff9000;
  height: 54px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  width: 100%;

  font-weight: 500;
  margin-top: 16px;

  transition: background-color 0.2s;

  ${props =>
    !props.loading &&
    css`
      &:hover {
        background: ${shade(0.2, '#ff9000')};
      }
    `}

  ${props =>
    props.loading &&
    css`
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.65;
    `}
`;
