import React, { Component } from 'react';
import Header from '../components/Header';

class MainLayout extends Component {

/*  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  onSubmit = () => {
    console.log('submitted');
    this.closeModal();
  };*/

  render() {

    return (
      <div className="main-layout">
        <Header/>
        <div className="main-content">
          <div className="sidebar">
          </div>
          <div className="content">Контент</div>
        </div>
        {/*<Modal showModal={this.state.showModal} onCloseModal={this.closeModal}> <LoginForm onSubmit={this.onSubmit} /> </Modal>*/}
      </div>
    );
  }
}

export default MainLayout;
