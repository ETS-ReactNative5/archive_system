import React from 'react';
import AntTabs from '../AntTabs';

import ClassificationInfo from './ClassificationInfo';
import ClassificationHierarchy from './ClassificationHierarchy';
import ClassificationRequisites from './ClassificationRequisites';

class SiderCard extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      hierarchyRefresh: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey && nextProps.activeKey === 'hierarchy') {
      this.setState({hierarchyRefresh: this.state.hierarchyRefresh + 1})
    }
  }

  render() {
    const { t, tofiConstants, initialValues, record, parentKey, 
            activeKey, hierarchyData, referenceSubtype, refreshRecord } = this.props;
    
    return (
      <div className="card">  
        {this.props.closer}
        <AntTabs activeKey={activeKey} tabs={[
          {
            tabKey: 'description',
            tabName: t('DESCRIPTION'),
            tabContent: <ClassificationInfo 
                          tofiConstants={tofiConstants} 
                          t={t} 
                          initialValues={initialValues} 
                          record={record} 
                          refreshRecord={refreshRecord}
                        />
          },
          {
            tabKey: 'hierarchy',
            tabName: t('HIERARCHY'),
            tabContent: <ClassificationHierarchy 
                          t={t} 
                          parentKey={parentKey}
                          readOnly={initialValues.approvalDateMetodika !=='' ? true : false}
                          referenceSubtype={referenceSubtype} 
                          hierarchyRefresh={this.state.hierarchyRefresh}
                          refreshRecord={refreshRecord}
                        />
          },
          // {
          //   tabKey: 'requisites',
          //   tabName: t('REQUISITES'),
          //   tabContent: <ClassificationRequisites 
          //                 tofiConstants={tofiConstants} 
          //                 t={t} 
          //                 data={initialValues.requisites} 
          //               />
          // }
        ]} onTabClick={this.props.onTabClick} />
      </div>
    )

  }
}

export default SiderCard;