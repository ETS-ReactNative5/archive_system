import React, { Component } from 'react';
import {Icon, Modal} from 'antd';
import PropTypes from 'prop-types';

class AntModal extends Component {

  state = {
    wrapClassName: ''
  };

  modalTitle = (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {this.props.title}
      <Icon
        type="laptop"
        onClick={() => this.setState({ wrapClassName: this.state.wrapClassName ? '' : 'full-screen' })}
        style={{ fontSize: '18px', marginLeft: '20px', cursor: 'pointer'}}
      />
    </span>
  );
  render() {
    let okBtnText, cancelBtnText;
    switch(localStorage.getItem('i18nextLng')) {
      case 'kz':
        okBtnText = 'Келісу';
        cancelBtnText = 'Болдырмау';
        break;
      case 'ru':
        okBtnText = 'Подтвердить';
        cancelBtnText = 'Отмена';
        break;
      default:
        okBtnText = 'Ok';
        cancelBtnText = 'Cancel';
        break;
    }

    return (
      <div>
        <Modal
          title={ this.props.allowFullScreen ? this.modalTitle : this.props.title}
          visible={ this.props.visible }
          onCancel={ this.props.onCancel }
          onOk={ this.props.onOk }
          confirmLoading={ this.props.loading }
          width={ this.props.width }
          bodyStyle={{ width: this.state.width, height: this.state.height }}
          okText={ this.props.okBtnText || okBtnText }
          cancelText={ cancelBtnText }
          wrapClassName={ (this.props.wrapClassName || '') + ' ' + this.state.wrapClassName }
          maskClosable={this.props.maskClosable}
          {...this.props}
        >
          { this.props.children }
        </Modal>
      </div>
    );
  }
}

AntModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string
};

export default AntModal;

