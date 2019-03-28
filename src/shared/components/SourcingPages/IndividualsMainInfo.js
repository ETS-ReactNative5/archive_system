import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import MainInfoFirstForm from './MainInfoFirstForm';
import AntTable from '../AntTable';
import EditDialogBody from '../EditDialogBody';
import DialogBox from '../DialogBox';
import MainInfoSecondForm from './MainInfoSecondForm';

class IndividualsMainInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialogBox: {
        visible: false
      }
    }
  }

  openDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: true} })
  };

  closeDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: false} })
  };

  renderTableHeader = () => {
    const t = this.props.t;
    return (
      <div className="tableHeader__btns">
        <h2>{t('INFO_ON_LABOR_ACTIVITY')}</h2>
        <Button >{t('ADD')}</Button>
        <Button >{t('CHANGE')}</Button>
        <Button type='danger'>{t('REMOVE')}</Button>
      </div>
    )
  };

  render() {

    const { loading, dialogBox: {visible} } = this.state;
    const { t, tofiConstants } = this.props;
    return (
      <div className="IndividualsMainInfo">
        <MainInfoFirstForm openDialogBox={this.openDialogBox} t={t} tofiConstants={tofiConstants} />
        <AntTable
          loading={loading}
          columns={[
            {
              key: 'years',
              title: t('YEARS'),
              dataIndex: 'years',
              width: '20%'
            },
            {
              key: 'occupancy',
              title: t('OCCUPANCY'),
              dataIndex: 'occupancy',
              width: '40%'
            },
            {
              key: 'organization',
              title: t('ORGANIZATION'),
              dataIndex: 'organization',
              width: '40%'
            }
          ]}
          dataSource={[]}
          hidePagination
          title={this.renderTableHeader}
        />
        <MainInfoSecondForm openDialogBox={this.openDialogBox} t={t} tofiConstants={tofiConstants} />
        <DialogBox
          visible={visible}
          handleClose={this.closeDialogBox}
          heading="EDIT"
        >
          <EditDialogBody/>
        </DialogBox>
      </div>
    )
  }
}

IndividualsMainInfo.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape().isRequired
};

export default IndividualsMainInfo;