import React, { Component } from 'react';
import './styles.css';

import { FiX, FiCheck } from 'react-icons/fi';
import { LoadingIndicator } from '../loading';

export class MaterialInput extends Component {
  // static propTypes = {
  //   label: PropTypes.string.isRequired,
  //   onChange: PropTypes.func.isRequired
  // };

  // eslint-disable-next-line
  renderError() {
    return (
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        borderRadius: 16,
        backgroundColor: 'red',
        height: 24,
        width: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      >
        <FiX
          style={{
            fontSize: 16,
          }}
        />
      </div>
    );
  }

  // eslint-disable-next-line
  renderLoading() {
    return (
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        borderRadius: 16,
        height: 24,
        width: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      >
        <LoadingIndicator size={24} />
      </div>
    );
  }

  // eslint-disable-next-line
  renderValid() {
    return (
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        borderRadius: 16,
        backgroundColor: 'green',
        height: 24,
        width: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      >
        <FiCheck
          style={{
            fontSize: 16,
          }}
        />
      </div>
    );
  }


  render() {
    const {
      label, type, error, valid, loading, onBlur, onChange,
    } = this.props;

    return (
      <div key={label} className="input-field-container">
        <input id={label} className="input-field" type={type} required="required" onChange={onChange} onBlur={onBlur} />
        <span className="highlight" />
        <span className="bar" />
        <label htmlFor={label} className="input-field-label">{label}</label>
        {error ? this.renderError() : undefined}
        {loading ? this.renderLoading() : undefined}
        {valid ? this.renderValid() : undefined}
      </div>
    );
  }
}
