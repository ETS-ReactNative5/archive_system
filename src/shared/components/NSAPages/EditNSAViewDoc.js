import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';

const EditNSAViewDoc = ({t}) => {

  return (
    <div className="EditNSAViewDoc">
      <div className="NSA__list">
        <div className="EditNSAViewDoc__list__heading">
          <Button>{t('ADD')}</Button>
          <Button type='danger'>{t('REMOVE')}</Button>
        </div>
        <ul className="EditNSAViewDoc__list__body">
          <li><span>Документ 1.pdf</span></li>
          <li><span>Документ 2.pdf</span></li>
        </ul>
      </div>
      <div className="NSA__content">
        <iframe title="EditNSAViewDoc" src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" frameBorder="0" width='100%' height='100%'/>
      </div>
    </div>
  );
};

EditNSAViewDoc.propTypes = {
  t: PropTypes.func.isRequired
};

export default EditNSAViewDoc;