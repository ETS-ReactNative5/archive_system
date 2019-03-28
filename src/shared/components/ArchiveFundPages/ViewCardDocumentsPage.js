import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { translate } from 'react-i18next';

import AntTabs from '../AntTabs';
import {Breadcrumb} from 'antd';
import ViewCardDocumentsMain from './ViewCardDocumentsMain';
import ViewCardDocumentsTheDoc from './ViewCardDocumentsTheDoc';

class ViewCardCases extends Component {

  handleTabChange = () => {
    console.log('tap changed');
  };

  render() {
    const { t } = this.props;
    return (
      <div className="ViewCardCases">
        <h2>{ t('CASE_CARD') + ':' } <Link to={`/archiveFund/editFundCard/${this.props.match.params.idFundCard}/${this.props.match.params.idInventCard}/${this.props.match.params.idCaseCard}`}>{this.props.match.params.idDocumentCard}</Link></h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to={`/archiveFund/editFundCard/${this.props.match.params.idFundCard}`}>{ t('FUND') + ': ' + this.props.match.params.idFundCard}</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/archiveFund/editFundCard/${this.props.match.params.idFundCard}/${this.props.match.params.idInventCard}`}>{ t('INVENTORY') + ': ' + this.props.match.params.idInventCard}</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/archiveFund/editFundCard/${this.props.match.params.idFundCard}/${this.props.match.params.idInventCard}/${this.props.match.params.idCaseCard}`}>{ t('CASE') + ': ' + this.props.match.params.idCaseCard}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{ t('DOC') + ': ' + this.props.match.params.idDocumentCard}</Breadcrumb.Item>
        </Breadcrumb>
        <AntTabs
          tabs={[
            {
              tabName: t('MAIN'),
              tabKey: 'Tab 1',
              tabContent: <ViewCardDocumentsMain t={ t }/>
            },
            {
              tabName: t('VIEW_DOC'),
              tabKey: 'Tab 2',
              tabContent: <ViewCardDocumentsTheDoc t={ t }/>
            }
          ]}
          type="line"
          onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

export default translate('archiveFund')(ViewCardCases);
