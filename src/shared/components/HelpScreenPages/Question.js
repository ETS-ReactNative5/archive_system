import React from 'react';

const Question = (props) => {

  const { title, body } = props.question;

  return (
    <div className="Question">
      <h3 className="Question__title"> {title} </h3>
      <div className="Question__body">
        <p>{body}</p>
      </div>
    </div>
  )

};

export default Question;
