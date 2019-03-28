import React from 'react';
import { translate } from 'react-i18next';

import Question from './Question';

const FAQPage = (props) => {

  const { FAQ } = props.translations;

  const renderQuestions = (item, idx) => {
    return <Question key={idx} question={item}/>
  };

  return (
    <div className="FAQPage help-question">
      <h2>{FAQ}</h2>
      {props.questions.map(renderQuestions)}
    </div>
  )

};

export default translate('helpScreen')(FAQPage);
