import type { MouseEventHandler, ReactNode } from 'react';
import { styled } from 'styled-components';

const StyledEventLink = styled.span`
  cursor: pointer;

  color: #0000EE;
  &:hover{
    color: #0000EE;
    text-decoration: underline;
  }
  &:active {
    color: #551A8B;
  }
`;

type Props = {
  className?: string; // Required to apply styles by styled-components
  children: ReactNode;
  onClick: MouseEventHandler<HTMLSpanElement>;
};

const EventLink = ({ className, children, onClick = () => {} }: Props) => {
  return (
    <StyledEventLink className={className} onClick={onClick}>
      {children}
    </StyledEventLink>
  );
};

export default EventLink;
