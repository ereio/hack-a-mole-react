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

class Board extends Component {
  constructor() {
    super();

    this.state = {
      spawner: null,
      despawner: null,
      killer: null,
      fullstory: null,
    };

    this.onWhackMole = this.onWhackMole.bind(this);
    this.onSpawnMole = this.onSpawnMole.bind(this);
    this.onDespawnMole = this.onDespawnMole.bind(this);
    this.onCheckGameOver = this.onCheckGameOver.bind(this);
  }

  componentDidMount() {
    const { onWhackAttempt } = this.props;

    const spawner = setInterval(this.onSpawnMole, 750);
    const despawner = setInterval(this.onDespawnMole, 500);
    const killer = setInterval(this.onCheckGameOver, 500);
    const fullstory = (mouseEvent) => {
      onWhackAttempt({ event: mouseEvent });
    };
    document.addEventListener('click', fullstory);

    this.setState(() => ({
      spawner,
      despawner,
      killer,
      fullstory,
    }));
  }

  componentWillUnmount() {
    this.onClearSpawners();
  }

  onClearSpawners() {
    const {
      spawner, despawner, killer, fullstory,
    } = this.state;

    clearInterval(spawner);
    clearInterval(despawner);
    clearInterval(killer);
    document.removeEventListener('click', fullstory);

    this.setState({
      spawner: null,
      despawner: null,
      killer: null,
      fullstory: null,
    });
  }

  onCheckGameOver() {
    const { endTime } = this.props.game;
    const { onEndGame } = this.props;
    const timeLeft = moment(endTime).diff(moment(), 'seconds');
    if (timeLeft < 1) {
      onEndGame();
    }
  }

  onSpawnMole() {
    const { rows, holes } = this.props.game;
    const { spawnMole } = this.props;
    const row = Math.floor((Math.random() * 10) + 1);
    const hole = Math.floor((Math.random() * 10) + 1);
    const cell = rows[row % 3] + holes[hole % 3];
    spawnMole(cell);
  }

  onDespawnMole() {
    const { rows, holes } = this.props.game;
    const { despawnMole } = this.props;
    const row = Math.floor((Math.random() * 10) + 1);
    const hole = Math.floor((Math.random() * 10) + 1);
    const cell = rows[row % 3] + holes[hole % 3];
    despawnMole(cell);
  }

  onWhackMole(cell) {
    const { whackMole } = this.props;
    whackMole(cell);
  }

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
  whackMole: gameActions.whackMole,
  spawnMole: gameActions.spawnMole,
  despawnMole: gameActions.despawnMole,
  onEndGame: gameActions.endGame,
  onWhackAttempt: gameActions.saveWhackAttempt,
}, dispatch);

// no actions needed yet at app layer
export default connect(mapStateToProps, mapDispatchToProps)(Board);
