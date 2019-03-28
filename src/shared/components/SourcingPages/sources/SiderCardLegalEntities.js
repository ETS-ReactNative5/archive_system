import React from 'react';
import classnames from 'classnames';

class SiderCardLegalEntities extends React.Component {

  state = {
    year: null,
    life: null,
    width: 600,
    handleBarLeft: -10,
    mouseDown: false
  };
  startX;
  startLeft;

  handleMouseDown = e => {
    this.startX = e.nativeEvent.clientX;
    this.startLeft = this.state.handleBarLeft - 200;
    this.setState({mouseDown: true, handleBarLeft: this.state.handleBarLeft - 200})};
  handleMouseUp = () => {
    this.setState({mouseDown: false, handleBarLeft: this.state.handleBarLeft + 200}, () => {
      const endLeft = this.state.handleBarLeft + 10;
      this.setState({ width: this.state.width - endLeft, handleBarLeft: -10 })
    });
  };

  handleMouseMove = e => {
    if(!this.state.mouseDown) return;
    const move = e.nativeEvent.clientX - this.startX;
    this.setState({ handleBarLeft: this.startLeft + move });
  };

  render() {
    const { closer, children } = this.props;

    return (
      <div className="card" style={{ width: this.state.width }}>
        <div className={classnames('handleBar', {'mouse-down': this.state.mouseDown})}
             onMouseDown={this.handleMouseDown}
             onMouseUp={this.handleMouseUp}
             onMouseMove={this.handleMouseMove}
             onMouseLeave={this.handleMouseLeave}
             style={{left : this.state.handleBarLeft}}
        >
          <div className="handleBar-bar" />
        </div>
        {closer}
        {children}
      </div>
    )
  }
}

export default SiderCardLegalEntities;
