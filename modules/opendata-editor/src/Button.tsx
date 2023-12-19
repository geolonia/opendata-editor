import type { MouseEventHandler, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { styled } from 'styled-components';

const StyledButton = styled.button`
  background: #F39813;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  box-shadow:
    0 1.9px 2.5px rgba(243, 152, 19, 0.057),
    0 5px 6.1px rgba(243, 152, 19, 0.076),
    0 10.1px 11.4px rgba(243, 152, 19, 0.086);
  transition-duration: .4s;
  cursor: pointer;
  &:hover{
    background: #EE730D;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  margin-right: 8px;
`;

interface Props {
  className?: string; // Required to apply styles by styled-components
  children: ReactNode;
  icon: IconDefinition;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  'data-e2e'?: string;
}

const Component = ({ className, children, icon, disabled = false, onClick = () => {}, 'data-e2e': dataE2e }: Props) => {
  return (
    <StyledButton disabled={disabled} className={className} onClick={onClick} data-e2e={dataE2e}>
      <Icon icon={icon} />
      {children}
    </StyledButton>
  );
};

export default Component;
