import React, { Component } from 'react';
import AntTable from '../AntTable';
import { Pie } from 'react-chartjs';

class Indicators extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div id="Indicators">
        <div className="indicators-heading">

        </div>
        <div className="indicators-body">
          <div className="indicators-body__table">
            <AntTable
              loading={true}
              columns={
                [
                  {
                    key: '',
                    title: '',
                    dataIndex: ''
                  }
                ]
              }
            />
          </div>
          <div className="indicators-body__chart">
            <Pie data={
              [
                {
                  value: 300,
                  color:"#F7464A",
                  highlight: "#FF5A5E",
                  label: "Red"
                },
                {
                  value: 50,
                  color: "#46BFBD",
                  highlight: "#5AD3D1",
                  label: "Green"
                },
                {
                  value: 100,
                  color: "#FDB45C",
                  highlight: "#FFC870",
                  label: "Yellow"
                }
              ]
            }/>
          </div>
        </div>
      </div>
    );
  }
}

export default Indicators;
