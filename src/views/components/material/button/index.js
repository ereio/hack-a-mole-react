import React, { Component } from 'react';

import './styles.css';

import { LoadingIndicator } from '../loading';
import styled from 'styled-components';

const Active = styled.div`

`;
export const MaterialButton = (props) => {
  const {
    large, disabled, buttonText, loading,
  } = props;

  let containerStyles = 'material-button-field';
  containerStyles += large ? ' large' : '';

  let buttonStyles = 'material-button';
  buttonStyles += disabled ? ' disabled ' : '';

  const onClick = () => {
    const { disabled, onClick } = props;
    if (!disabled) {
      onClick();
    }
  }

  return (
    <div className={containerStyles}>
      <div className={buttonStyles} tabIndex={0} role="button" onClick={onClick}>
        {
          loading ? (<LoadingIndicator />)
            : (
              <div className="button-text">
                {buttonText || props.children}
              </div>
            )
        }
      </div>
    </div>
  );
}
