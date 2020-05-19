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
      <div key={label} className="input-field-container">
        <input id={label} className="input-field" type={type} required="required" onChange={onChange} onBlur={onBlur} />
        <span className="highlight" />
        <span className="bar" />
        <label htmlFor={label} className="input-field-label">{label}</label>
      </div>
    );
  }
}
