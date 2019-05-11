import React from 'react';
import DamageTable from "./DamageTableWorks"
import IrrDamageTable from "./IrrDamageTable"
class DamageWorks extends React.Component{

  render(){
                                            console.log(this.props.stateRecord,);
      return(
          <div>
              {this.props.stateRecord.workType.workTypeClass!=='caseExamination' &&
              <DamageTable stateRecord={this.props.stateRecord} initialValues={this.props.initialValues} header="Работы по устранению повреждений" tofiConstants={this.props.tofiConstants} date={true}/>}
            <IrrDamageTable stateRecord={this.props.stateRecord} initialValues={this.props.initialValues}  idDimObjCase={this.props.idDimObjCase} header="Неисправимые повреждений" tofiConstants={this.props.tofiConstants} date={false}/>
          </div>
      )
  }
}
export default DamageWorks;