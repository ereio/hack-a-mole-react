import React from 'react';

import './styles.css';

export const TouchableButton = ({
  large, start, end, disabled, onClick, children
}) => {
  // static propTypes = {
  //   buttonText: PropTypes.string,
  //   large: PropTypes.bool
  // };

  const onClickWrapper = () => {
    if (!disabled) {
      onClick();
    }
  };

  let containerStyles = 'touchable-button-field';
  containerStyles += large ? ' large' : '';
  containerStyles += end ? ' end' : '';
  containerStyles += start ? ' start' : '';

  let buttonStyles = 'touchable-button';
  buttonStyles += disabled ? ' disabled' : '';

  return (
    <div className={containerStyles} onClick={onClickWrapper}>
      <div className={buttonStyles}>
        {children}
      </div>
    </div>
  );
};
