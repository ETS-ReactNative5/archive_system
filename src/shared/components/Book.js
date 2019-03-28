import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Book extends Component {

  static propTypes = {
    handleMouseEnter: PropTypes.func.isRequired
  };

  render() {
    const lng = localStorage.getItem('i18nextLng');
    const {name, fundNumber, fundGuidebookDescription} = this.props.caseItem;
    return (
      <div className="bk-book" onMouseEnter={() => {this.props.handleMouseEnter(name, fundGuidebookDescription)} }>
        <div className="bk-front"> <p> {name[lng]} </p> </div>
        <div className="bk-back"></div>
        <div className="bk-left"> <p>{fundNumber[lng]}</p> </div>
        <div className="bk-top"> </div>
      </div>
    );
  }
}

export default Book;
