import React, { Component } from 'react';
import { Button } from 'antd';

class ViewCardDocumentsTheDoc extends Component {

  render() {
    const { t } = this.props;
    return (
      <div className="viewCardCasesTheCase">
        <div className="viewCardCasesTheCase__nav">
          <aside>
            <div className="viewCardCasesTheCase__nav__header">
              <Button>{ t('ATTACH_DOC') }</Button>
            </div>
            <ul>
              <li>doc</li>
            </ul>
          </aside>
        </div>
        <div className="viewCardCasesTheCase__viewer">
          <iframe title="ViewCardDocumentsTheDoc" src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" frameBorder="0" />
        </div>
      </div>
    )
  }
}

export default ViewCardDocumentsTheDoc;
