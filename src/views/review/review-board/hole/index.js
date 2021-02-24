import React, { Component } from 'react';

import { ReactComponent as EmptyHole } from 'global/assets/empty-hole.svg';
import { ReactComponent as MoleHole } from 'global/assets/mole-hole.svg';

import './styles.css';

class Hole extends Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { id, onWhack } = this.props;
    onWhack(id);
  }

  render() {
    const { isActive } = this.props;

    let styles = 'mole-hole ';
    styles += isActive ? 'active ' : '';

    return (
      <div>
        {/* { isActive
          ? <div className={styles} onClick={this.onClick} />
          : <div className={styles} onClick={this.onClick} />} */}
        {isActive
          ? <MoleHole className="mole-hole" onClick={this.onClick} />
          : <EmptyHole className="mole-hole" onClick={this.onClick} />}
      </div>
    );
  }
}

export default Hole;
