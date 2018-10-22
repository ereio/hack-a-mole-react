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
    return (
      <div className="hole" onClick={this.onClick}>  
      </div>
    );
  }
} 
 
export default Hole; 