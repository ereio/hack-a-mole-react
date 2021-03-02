import React from 'react';
import styled from 'styled-components';

const ErrorListBase = styled.div`
  padding: 0 0 0 0;
`;

const ErrorItem = styled.span`
  color: #FF3333; 
  word-wrap: break-word; 
  font-size: 16px; 
`;

export const ErrorList = ({ errors }) => {
  return (
    <ErrorListBase>
      {errors.map((error) => (
        <ErrorItem key={error} >
          {error}
        </ErrorItem>
      ))}
    </ErrorListBase>
  );
};
