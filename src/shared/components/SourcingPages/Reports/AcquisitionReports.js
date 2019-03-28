/**
 * Created by Mars on 03.11.2018.
 */

import React from 'react';
import { connect } from 'react-redux';
import { getCube } from '../../../actions/actions'

class AcquisitionReports extends React.Component {

  state = {
    loading: false,
    selectedRow: null,
    openCard: false,
    openModal: false,
    initialValues: {},
    data: []
  };


  render() {

    return(

      <div>
        Reports
      </div>
    )
  }


  }

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(AcquisitionReports);
