import React from 'react';
import styled from 'styled-components';

const PanelBase = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  max-width: 500px;
  min-height: 500px;
  margin: 70px auto 0;
  padding: 0 25px 0 25px;
  border-radius: 24px;
  background-clip: padding-box;
`;

const Panel = (props) => {
  return (
    <PanelBase>
      {props.children}
    </PanelBase>
  );
};


export { Panel };
