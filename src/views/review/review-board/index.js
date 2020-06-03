import React, { Component } from 'react';

// redux
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import * as gameActions from 'store/game/actions';

// local components
import Hole from './hole';

import './styles.css';

class ReviewBoard extends Component {
  renderHoles({ rows, holes, moles }) {
    // map the components to each row and hole id
    const rowComponents = rows.map((row) => {
      const holeComponents = holes.map((hole) => {
        // find the cell id for the hole
        const cell = row + hole;

        // see if its on the list of active moles
        const isActive = undefined !== moles.find((mole) => mole.cell === cell);

        return (
          <Hole key={row + hole} id={cell} onWhack={this.onWhackMole} isActive={isActive} />
        );
      });

      return (
        <div key={row} className="mole-row">
          {holeComponents}
        </div>
      );
    });

    return rowComponents;
  }

  render() {
    const { game } = this.props;

    return (
      <div className="board">
        {this.renderHoles(game)}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({ user: state.user, game: state.game });

// binds dispatch to all the actions which allows the actions to be thunked together
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

// no actions needed yet at app layer
export default connect(mapStateToProps, mapDispatchToProps)(ReviewBoard);
