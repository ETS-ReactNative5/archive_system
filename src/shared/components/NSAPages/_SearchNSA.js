import React, { Component } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types'

import AntTabs from '../AntTabs';
import LinearReference from './LinearReference';
import HierarchyReference from './HierarchyReference';
import Classifier from './Classifier';

class SearchNSA extends Component {

  state = {
    loading: false
  };

  render() {
    const { loading } = this.state;
    const { t } = this.props;

    return (
      <div className="SearchNSA">
        <AntTabs
          onChange={this.handleTabChange}
          tabs={[
            {
              tabName: t('LINEAR_REFERENCES'),
              tabKey: 'LinearReferences',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', top: '50%', transform: "translateX(-50%)" }}/> :
                  <LinearReference t={t}/>
              )
            },
            {
              tabName: t('HIERARCHY_REFERENCES'),
              tabKey: 'HierarchyReferences',
              tabContent: <HierarchyReference t={t}/>
            },
            {
              tabName: t('CLASSIFIERS'),
              tabKey: 'classifiers',
              tabContent: <Classifier t={t}/>
            }
          ]}
        />
      </div>
    )
  }
}

SearchNSA.propTypes = {
  t: PropTypes.func.isRequired
};

export default SearchNSA;

