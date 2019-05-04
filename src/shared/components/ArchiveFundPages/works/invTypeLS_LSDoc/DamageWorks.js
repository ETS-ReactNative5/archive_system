import React from 'react';
import DamageTable from "./DamageTableWorks"
class DamageWorks extends React.Component{

  render(){
                                            console.log(this.props.initialValues);
      return(
          <div>
            <DamageTable initialValues={this.props.initialValues} header="Работы по устранению повреждений" tofiConstants={this.props.tofiConstants} date={true}/>
        {/*    <DamageTable tableType="" header="Неисправимые повреждения" tofiConstants={this.props.tofiConstants} date={false}/>*/}
          </div>
      )
  }
}
export default DamageWorks;