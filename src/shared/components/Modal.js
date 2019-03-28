import React from 'react';
import PropTypes  from 'prop-types'

const Modal = (props) => {

  if(!props.showModal) {
    return null;
  }

  return (
      <div className="Modal">
        <div className="ModalBox">
          <div className="ModalBox__header">
            <p className="ModalBox__header__text"> Авторизация </p>
            <button className="ModalBox__header__closeBtn" onClick={props.onCloseModal}>&times;</button>
          </div>
          <div className="ModalBox__body">
            {props.children}
          </div>
          <div className="ModalBox__footer">footer</div>
        </div>
      </div>
  );

};

Modal.PropTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

export default Modal;
