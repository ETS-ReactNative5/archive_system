import React from 'react';
import { Modal } from 'antd';

class DialogBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      moving: false,
      y: 0,
      x: 0
    }
  }

  onDragStart = e => {
    this.setState({ moving: true });
    this.mouseX = e.nativeEvent.clientX;
    this.mouseY = e.nativeEvent.clientY;
    this.modalX = this.state.x;
    this.modalY = this.state.y;
  };

  onDrag = e => {
    this.setState({
      x: this.modalX + e.nativeEvent.clientX - this.mouseX,
      y: this.modalY + e.nativeEvent.clientY - this.mouseY
    })
  };

  onDragEnd = e => {
    this.setState({
      moving: false,
      x: this.modalX + e.nativeEvent.clientX - this.mouseX,
      y: this.modalY + e.nativeEvent.clientY - this.mouseY
    })
  };

  onCancel = () => {
    this.setState({
      x: 0,
      y: 0
    });
    this.props.handleClose()
  };

  renderDraggableHeader =  (
    <div onDrag={this.onDrag} onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} draggable style={{ cursor: 'move' }}>{this.props.heading}</div>
  );

  render() {
    const { moving } = this.state;
    return (
      <Modal
        style={{ transform: `translate(${this.state.x}px, ${this.state.y}px)` }}
        title={this.renderDraggableHeader}
        maskClosable={false}
        onCancel={this.onCancel}
        {...this.props}
      >
        { !moving && this.props.children }
      </Modal>
    )
  }
}

export default DialogBox;