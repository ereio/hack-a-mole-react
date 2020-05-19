import React, { Component } from 'react';

import './styles.css';

export class MaterialInput extends Component {
  // static propTypes = {
  //   label: PropTypes.string.isRequired,
  //   onChange: PropTypes.func.isRequired
  // };

  render() {
    const {
      onBlur, onChange, label, type,
    } = this.props;

    return (
      <div className="login-field-container">
        <input id="input-id" className="login-field" type={type} required="required" onChange={onChange} onBlur={onBlur} />
        <span className="highlight" />
        <span className="bar" />
        <label htmlFor="input-id" className="login-field-label">
          {label}
        </label>
      </div>
    );
  }
}
