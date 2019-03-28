import React from 'react';
import PropTypes from 'prop-types';
import FactorView from './FactorView';
import { Input } from 'antd';

const Search = Input.Search;

class LinearReference extends React.Component {

  state = {
    refs: [
      {
        name: 'Категория фонда (фактор)'
      },
      {
        name: 'Исторический период'
      },
      {
        name: 'Доступ к фонду'
      },
      {
        name: 'Тип описи'
      },
      {
        name: 'Систематизация дел'
      }
    ],
    activeRef: {
      name: 'Категория фонда (фактор)'
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
      <div className="LinearReference">
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
          <FactorView t={t} />
        </div>
      </div>
    )
  }
}

LinearReference.propTypes = {
  t: PropTypes.func.isRequired
};

export default LinearReference;