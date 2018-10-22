import React, { Component } from 'react';
  
import './styles.css';

class Hole extends Component {
  constructor(){
    super(); 
    this.onClick = this.onClick.bind(this);
  }
  onClick(){
    const {id, onWhack} = this.props;
    onWhack(id);
  }
  
  render() { 
    const {isActive} = this.props;

    let styles = "mole-hole ";
    styles += isActive ? "active " : "";

    return (
      <div className={styles} onClick={this.onClick}>  
      </div>
    );
  }
} 
 
export default Hole; 