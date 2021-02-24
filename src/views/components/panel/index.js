import React from 'react';
import styled from 'styled-components';

const PanelBase = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 500px;   
  min-height: 500px;
  padding: 0 8vw 0 8vw;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  border-radius: 24px;  
`;

const Panel = (props) => {
  return (
    <PanelBase>
      {props.children}
    </PanelBase>
  );
};


export { Panel };
