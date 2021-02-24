

import React from 'react';
import styled from 'styled-components';

const ContainerBase = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; 
     margin: 70px auto 0;

  `;

const Container = (props) => {
  return (
    <ContainerBase>
      {props.children}
    </ContainerBase>
  );
};


export { Container };
