/**
 * Created by Mars on 06.12.2018.
 */
import React from 'react';
import AntTabs from '../../AntTabs';
import WorksPropertyForm from './WorksPropertyForm';
import WorkDescription from './WorkDescription';


class ArchiveFundWorksCard extends React.PureComponent {

  render() {
    const { t, tofiConstants, initialValues, optionsData, onSaveCubeData, onCreateObj } = this.props;

    return (
        <AntTabs tabs={[
          {
            tabKey: 'props',
            tabName: t('PROPS'),
            tabContent: <WorksPropertyForm tofiConstants={tofiConstants}
                                           onSaveCubeData={onSaveCubeData}
                                           t={t}
                                           optionsData={optionsData}
                                           initialValues={initialValues}
                                           onCreateObj={onCreateObj}
                                           clsFirstStatusMap={this.props.clsFirstStatusMap}
            />
          },
          {
            tabKey: 'Description',
            tabName: t('DESCRIPTION'),
            tabContent: <WorkDescription  initialValues={initialValues} tofiConstants={tofiConstants} t={t}/>
          }
        ]}/>
    )
  }
}

export default ArchiveFundWorksCard;
