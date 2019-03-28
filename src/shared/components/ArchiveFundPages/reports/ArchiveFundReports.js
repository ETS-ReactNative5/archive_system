/**
 * Created by Mars on 03.11.2018.
 */

import React from 'react';
import { connect } from 'react-redux';
import { getCube } from '../../../actions/actions'

class ArchiveFundReports extends React.Component {

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
        <h2>Reports of ArciveFund</h2>
      </div>
    )
  }


}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(ArchiveFundReports);
