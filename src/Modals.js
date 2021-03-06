import React from 'react';

// Credit to: https://www.cluemediator.com/create-simple-popup-in-reactjs#cpc
class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      content: ""
    }
  }

  togglePopup = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    if (!this.state.isOpen) {
      return null;
    }
    return (
      <div className="popup-box">
        <div className="box">
          {this.state.content}
        </div>
      </div>
    );
  }
}

class GameOverModal extends Popup {
  handleButtonClick = () => {
    this.setState({isOpen: false});
    this.props.restart();
  };

  render() {
    if (!this.state.isOpen) {
      return null;
    }

    return (
      <div className="popup-box">
        <div className="box">
          <p>{this.state.content}</p>
          <p>Word was: <i>{this.state.answer.toUpperCase()}</i></p>
          <button
            onClick={this.handleButtonClick}
          >
          Restart
          </button>
        </div>
      </div>
    );
  }
}


export {
  Popup,
  GameOverModal
}
