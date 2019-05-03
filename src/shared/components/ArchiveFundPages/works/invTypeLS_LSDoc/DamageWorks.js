import React from 'react';
import DamageTable from "./DamageTableWorks"
class DamageWorks extends React.Component{

  render(){

      return(
          <div>
            <DamageTable header="Работы по устранению повреждений" tofiConstants={this.props.tofiConstants} date={true}/>
            <DamageTable header="Неисправимые повреждения" tofiConstants={this.props.tofiConstants} date={false}/>
          </div>
      )
  }
}
export default DamageWorks;