import React from 'react';

import {Popup, GameOverModal} from './Modals';
import Keyboard from './Keyboard';
import {generateWord, isValidWord} from './utils';
import { createRoot } from 'react-dom/client';
import './index.css';


class Square extends React.Component {
  initialState =  {
    value: '',
    matched: false,
    elsewhere: false,
    nowhere: false,
  }

  constructor(props) {
    super(props);
    this.state = {...this.initialState};
  }

  newGame = () => {
    this.setState({...this.initialState});
  }

  render() {
    const match = this.state.matched ? 'matched': '';
    const elsewhere = !match && this.state.elsewhere ? 'elsewhere': '';
    const nowhere = this.state.value && this.state.nowhere ? 'nowhere': '';
    const classes = `letter ${match} ${elsewhere} ${nowhere}`;
    return (
      <div
        className={classes}
      >
        {this.state.value}
      </div>
    );
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.wordLength = 5;
    this.sqMapping = new Map();
  }

  newGame() {
    this.sqMapping.forEach(s => {
      s.current.newGame();
      const b = s.current.button;
      if (b) {
        b.newGame();
      }
    });
  }

  parseGuess(guess) {
    var answer = this.props.game.answer.split("");
    var guessArray = guess.split("");

    var elsewheres = [];

    const getAllIndexes = (arr, val) => {
      var indexes = [], i;
      for(i = 0; i < arr.length; i++)
          if (arr[i] === val)
              indexes.push(i);
      return indexes;

    }

    guessArray.forEach((g, i) => {
      let stateUpdate = {};
      let sq = this.sqMapping.get(i).current;
      let indexes = getAllIndexes(answer, g);
      const matched = indexes.includes(i);
      const nowhere = indexes.length === 0;

      if (matched) {
        stateUpdate['matched'] = true;
        answer[i] = null;
      }
      else if (nowhere) {
        stateUpdate['nowhere'] = true;
      }
      else {
        elsewheres.push(sq);
      }

      sq.setState(stateUpdate);
      sq.button.setState(stateUpdate);
    });


    while(elsewheres.length) {
      let sq = elsewheres.shift();
      let stateUpdate = {};
      let indexes = getAllIndexes(answer, sq.state.value);
      if (indexes.length) {
        stateUpdate['elsewhere'] = true;
        answer[indexes[0]] = null;
      }
      else {
        stateUpdate['nowhere'] = true;
      }
      sq.setState(stateUpdate);
      sq.button.setState(stateUpdate);
    }
    return this.props.game.answer === guess;
  }

  renderSquare(i) {
    const r = React.createRef();
    this.sqMapping.set(i, r);

    return (
      <Square
        key={i}
        ref={r}
        pos={i}
      />
    );
  }

  render() {
    return (
      <div
        className="row"
      >
        <>
         { [...Array(5)].map( ( el, i) => (this.renderSquare(i) ) ) }
        </>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.wordLength = 5;
    this.modalRef = React.createRef();
    this.gameOverModal = React.createRef();
    this.rowMapping = new Map();
    this.wordState = [];
    this.rowPos = 0;
    this.won = false;
    this.answer = generateWord(this.wordLength);
    this.wordState = [];
  }

  newGame = () => {
    this.rowPos = 0;
    this.won = false;
    this.answer = generateWord(this.wordLength);
    this.wordState = [];

    this.rowMapping.forEach(r => {
      r.current.newGame();
    });
    //this.forceUpdate();
  }

  renderRow(i) {
    const r = React.createRef();
    this.rowMapping.set(i, r);
    return (
      <Row
        key={i}
        id={i}
        ref={r}
        //answer={this.answer}
        game={this}
      />
    );
  }

  popModal = (content, target) => {
    this.modalRef.current.setState({content: content, isOpen: true});
    setTimeout(() => this.modalRef.current.setState({content: "", isOpen: false}), 850)
  }

  popGameOverModal = (content) => {
    this.gameOverModal.current.setState({content: content, isOpen: true, answer: this.answer});
  }

  getRefs(pos) {
    const row = this.rowMapping.get(this.rowPos).current;
    const sq = row.sqMapping.get(pos).current;
    return [row, sq];
  }

  onKeyDown = (key, target) => {
    var pos = null;
    var letter = null;
    switch(key.toLowerCase()) {
      case 'enter':
        const wordLength = this.wordState.length;
        const guess = this.wordState.join("");
        if (wordLength < 5) {
          this.popModal("TOO SHORT");
          return;
        }
        isValidWord(guess).then(valid => {
          if (valid) {
            if (this.rowPos === 0 && guess === 'month' && this.answer !== 'month') {
              this.popModal("BE MORE CREATIVE");
              return;
            }
            let [row, sq] = this.getRefs(0);
            var won = row.parseGuess(guess);
            if (won) {
              this.popGameOverModal('FANTASTIC JOB! YOU DID IT!', target);
              target.gameOver();
            }
            if (!won && this.rowPos === 5) {
              this.popGameOverModal('BETTER LUCK NEXT TIME', target);
            }
            this.rowPos++;
            this.wordState = [];
          }
          else {
            this.popModal("Word Not Valid");
            return;
          }
        })
        return;
      case 'backspace':
      case 'delete':
        this.wordState.pop();
        pos = this.wordState.length;
        letter = ''
        break;
      default:
        pos = this.wordState.length;
        if (pos === 5)
          return;
        letter = key;
        this.wordState.push(key);
    }
    const [row, sq] = this.getRefs(pos);
    sq.button = target;
    sq.setState({value: letter});
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <>
           {[...Array(6)].map((el, i) => (this.renderRow(i)))}
          </>
        </div>
        <Keyboard
          gameHandle={this.onKeyDown}
        />
        <Popup
          isOpen={false}
          ref={this.modalRef}
        />
        <GameOverModal
          ref={this.gameOverModal}
          restart={this.newGame}
        />
      </div>
    );
  }
}

// ========================================
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Game />,
);

