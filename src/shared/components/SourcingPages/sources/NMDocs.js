import React from 'react';
import AntTabs from '../../AntTabs';
import RegulationOnArchive from './RegulationOnArchive';
import RegulationOnCommission from './RegulationOnCommission';
import InstructionOnOfficeWork from './InstructionOnOfficeWork';

class NMDocs extends React.PureComponent {

  render() {
    const { t, tofiConstants } = this.props;
    return (
      <div className="NMDocs">
        <AntTabs tabs={[
          /*{
            tabKey: 'caseNomenclature',
            tabName: t('CASE_NOMENCLATURE'),
            tabContent: <CaseNomenclature t={t} tofiConstants={tofiConstants}/>
          },*/
          {
            tabKey: 'regulationOnArchive',
            tabName: t('REGULATION_ON_ARCHIVE'),
            tabContent: <RegulationOnArchive t={t} tofiConstants={tofiConstants}/>
          },
          {
            tabKey: 'regulationOnCommission',
            tabName: t('REGULATION_ON_COMMISSION'),
            tabContent: <RegulationOnCommission t={t} tofiConstants={tofiConstants} />
          },
          {
            tabKey: 'instructionOnOfficeWork',
            tabName: t('INSTRUCTION_ON_OFFICE_WORK'),
            tabContent: <InstructionOnOfficeWork t={t} tofiConstants={tofiConstants}/>
          }
        ]}/>
      </div>
    )
  }
}

export default NMDocs;