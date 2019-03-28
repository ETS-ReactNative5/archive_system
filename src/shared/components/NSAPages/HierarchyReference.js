import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import ObjectView from './ObjectView';

const Search = Input.Search;

class HierarchyReference extends React.Component {

  state = {
    refs: [
      {
        name: 'Структурное подразделение'
      },
      {
        name: 'Местоположение дела'
      },
      {
        name: 'Географический указатель'
      }
    ],
    activeRef: {
      name: 'Структурное подразделение'
    },
    search: ''
  };

  renderRefs = (item, idx) => {
    return (
      <li key={item.name}>
        <span onClick={() =>
          this.setState({ activeRef: {name: item.name} })}>{item.name}</span>
      </li>
    )
  };

  onSearch = e => {
    this.setState({ search: e.target.value });
  };

  render() {
    const { search, refs } = this.state;
    const { t } = this.props;
    const filteredRefs = refs.filter(item => item.name.toLowerCase().includes(search.toLocaleLowerCase())).map(this.renderRefs)
    return (
      <div className="HierarchyReference">
        <div className="NSA__list">
          <Search
            placeholder="search"
            onChange={this.onSearch}
            value={search}
          />
          <ul>
            { filteredRefs }
          </ul>
        </div>
        <div className="NSA__content">
          <ObjectView t={t} />
        </div>
      </div>
    )
  }
}

HierarchyReference.propTypes = {
  t: PropTypes.func.isRequired
};

export default HierarchyReference;