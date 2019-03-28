import { SubmissionError } from 'redux-form';

export const parseFormErrors = (error) => {
  if (error && error.message) {
    throw new SubmissionError({ _error: error.message });
  } else {
    throw new SubmissionError({ _error: error });
  }
};
