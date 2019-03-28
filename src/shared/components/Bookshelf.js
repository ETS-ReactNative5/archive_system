import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Book from './Book';


class Bookshelf extends Component {

  renderModules = (item, idx) => {
    return (
      <li key={ item.id } style={ {zIndex: 10/2 - Math.abs(10/2 - (idx+1))} }> {/*10 - количество книг*/}
        <Book caseItem={ item } handleMouseEnter={this.props.handleMouseEnter}/>
      </li>
    );
  };

  render() {
    return (
      <div className="bookshelf">
        <ul className='bk-list'>
          { this.props.cases.map(this.renderModules) }
        </ul>
      </div>
    );
  }
}

export default Bookshelf;
