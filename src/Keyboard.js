import React, {useEffect} from 'react';

class Key extends React.Component {
  initialState =  {
    matched: false,
    elsewhere: false,
    nowhere: false,
  }

  constructor(props) {
    super(props);
    this.state = {...this.initialState};
  }

  newGame() {
    this.setState({...this.initialState});
    document.addEventListener('keydown', this.props.kd);
  }
  addLetter = (e) => {
    this.props.gameHandle(e.key, this);
  }

  handleClick = (e) => {
    const letter = e.target.innerHTML;
    this.props.gameHandle(letter, this);
  }

  gameOver() {
    document.removeEventListener('keydown', this.props.kd);
  }

  render() {
    const match = this.state.matched ? 'matched': '';
    const elsewhere = !match && this.state.elsewhere ? 'elsewhere': '';
    const nowhere = !match && !elsewhere && this.state.nowhere ? 'nowhere': '';
    const classes = `${match} ${elsewhere} ${nowhere}`;

    return (
      <button
        onClick={this.handleClick}
        id={this.props.value.toLowerCase()}
        className={classes}
      >
        {this.props.value}
      </button>
    );
  }
}


class Keyboard extends React.Component {
  constructor(props) {
    super(props);
    this.mapping = new Map();
  }

  onKeyDown = (e => {
    try {
      const k = this.mapping.get(e.key).current;
      k.addLetter(e);
    }
    catch(e) {}
  });

  keyClicked = (e) => {
    this.props.keyDown(e.target.innerHTML);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  renderKey(k) {
    const r = React.createRef();
    this.mapping.set(k, r);
    return (
      <Key
        key={k}
        value={k}
        ref={r}
        kd={this.onKeyDown}
        gameHandle={this.props.gameHandle}
      />
    );
  }

  render() {
    const keyboardKeys = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',],
      ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
    ];


    return (
      <div className="keyboard">
        {keyboardKeys.map((keyboardRow, rowIndex) => (
          <div key={rowIndex} className="mb-2 flex justify-center space-x-1">
            {keyboardRow.map((keyp, index) => {
              return this.renderKey(keyp)
            })}
          </div>
        ))}
      </div>
    );

    return (
      <div className="keyboard">
        {keyboardKeys.map((keyboardRow, rowIndex) => (
          <div key={rowIndex} className="mb-2 flex justify-center space-x-1">
            {keyboardRow.map((keyp, index) => {
              return (
                <button
                  key={keyp + index}
                  onClick={this.keyClicked}
                  id={keyp.toLowerCase()}
                  className="keyPiece"
                >
                  {keyp}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

export default Keyboard
