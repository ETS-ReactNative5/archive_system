import React, { Component } from 'react';
import { Button } from 'antd';

class ViewCardCasesTheCase extends Component {

  render() {
    const { t } = this.props;
    return (
      <div className="viewCardCasesTheCase">
        <div className="viewCardCasesTheCase__nav">
          <aside>
            <div className="viewCardCasesTheCase__nav__header">
              <Button>{ t('ATTACH_CASE') }</Button>
            </div>
            <ul>
              <li>Case</li>
            </ul>
          </aside>
        </div>
        <div className="viewCardCasesTheCase__viewer">
          <iframe title="ViewCardCasesTheCase" src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" frameBorder="0" />
        </div>
      </div>
    )
  }
}

export default ViewCardCasesTheCase;
