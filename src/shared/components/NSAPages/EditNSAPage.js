import React, { Component } from 'react';
import {DatePicker, Icon, Spin} from 'antd';
import PropTypes from 'prop-types'

import AntTabs from '../AntTabs';
import EditNSAViewDoc from './EditNSAViewDoc';
import {Link} from 'react-router-dom';
import DialogBox from '../DialogBox';
import EditDialogBody from '../EditDialogBody';
import EditNSADocCardManagement from './EditNSADocCardManagement';
import EditNSADocCardPhoto from './EditNSADocCardPhoto';
import EditNSADocCardMovie from './EditNSADocCardMovie';
import EditNSADocCardVideo from './EditNSADocCardVideo';
import EditNSADocCardPhono from './EditNSADocCardPhono';
import EditNSADocCardNTD from './EditNSADocCardNTD';
import EditNSADocCardNominal from './EditNSADocCardNominal';

class EditNSAPage extends Component {

  state = {
    loading: false,
    dialogBox: {
      visible: false
    }
  };

  onDateChange = (date, dateString) => {
    console.log(date, dateString)
  };

  openDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: true} })
  };

  closeDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: false} })
  };

  renderEditNSADocCard = () => {
    const { t, tofiConstants, match: { params } } = this.props;
    switch (params.type) {
      case "1": return <EditNSADocCardManagement t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      case "2": return <EditNSADocCardPhoto t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      case "3": return <EditNSADocCardMovie t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      case "4": return <EditNSADocCardVideo t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      case "5": return <EditNSADocCardPhono t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      case "6": return <EditNSADocCardNTD t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      case "7": return <EditNSADocCardNominal t={t} tofiConstants={tofiConstants} openDialogBox={this.openDialogBox}/>;
      default: return <div>default</div>
    }
  };

  render() {
    const { loading, dialogBox: {visible} } = this.state;
    const { t } = this.props;

    return (
      <div className="EditNSAPage">
        <div className="EditNSAPage__heading">
          <h3><Link to="/sra/createDocument"><Icon type="arrow-left"/> 123</Link></h3>
          <DatePicker onChange={this.onDateChange}/>
        </div>
        <AntTabs
          onChange={this.handleTabChange}
          tabs={[
            {
              tabName: t('DOC_CARD'),
              tabKey: 'EditNSADocCard',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', top: '50%', transform: "translateX(-50%)" }}/> :
                  this.renderEditNSADocCard()
              )
            },
            {
              tabName: t('VIEW_DOC'),
              tabKey: 'EditNSAViewDoc',
              tabContent: <EditNSAViewDoc t={t} />
            }
          ]}
        />
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

EditNSAPage.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      type: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
};

export default EditNSAPage;

