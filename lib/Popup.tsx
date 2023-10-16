import { useState, type ReactNode } from 'react';
import { faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const StyledPopup = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;

  background-color: #FFFFFF;

  border-color: rgb(209, 36, 47);
  border-width: 4px;
  border-style: solid;
  border-radius: 8px;

  z-index: 9999;
`;
const Bar = styled.div`
  margin: 0;
  padding: 0.75rem;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;
const Main = styled.div`
  padding: 0.75rem;
`;
const Title = styled.p`
  margin: 0;
  padding: 0;

  font-weight: 600;
`;
const Icon = styled(FontAwesomeIcon)`
  padding: 4px;

  border-color: #000000;
  border-width: 1px;
  border-style: solid;

  cursor: pointer;
`;

type Props = {
  children: ReactNode;
  enabled: boolean;
  title: string;
};

const Popup = ({ children, enabled = false, title }: Props) => {
  const [ minimized, setMinimized ] = useState<boolean>(false);

  return (
    <>
      <StyledPopup style={{ display: enabled ? 'block' : 'none' }}>
        <Bar>
          <Title>{title}</Title>
          <Icon
            icon={minimized ? faWindowRestore : faWindowMinimize}
            onClick={() => setMinimized((minimized) => !minimized)}
          />
        </Bar>
        { !minimized && (
          <Main>
            {children}
          </Main>
        )}
      </StyledPopup>
    </>
  );
};

export default Popup;
