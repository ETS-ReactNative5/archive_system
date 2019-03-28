import React from 'react';
import AntTabs from '../../AntTabs';
import MainInfo from './MainInfo';
import Description from './Description';
import ResultDescription from './ResultDescription';
import Applicant from './Applicant';
import Bibliography from './Bibliography';
import { getObjByProp } from '../../../actions/actions.js';

class InqueryRegCard extends React.PureComponent {

 state = {
    result: {}
};

  componentDidMount() {
    const fd = new FormData();
    fd.append('value', String(this.props.initialValues.key).split('_')[1]);
    fd.append('clsConsts', 'responseToRequest,performPaidReq,conductResearch');
    fd.append('propConst', 'propResearcheRequests');
    fd.append('withProps', 'resultDescription,resultResearch');
    getObjByProp(fd).then(res => {
  if(res.success==true) {
      const resultResearch = res.data[0] && res.data[0].resultResearch;
      const id = resultResearch && resultResearch[localStorage.getItem('i18nextLng')];
      const f = new File([id], id);
      f.uid = `rc-upload-${id}`;
      const result = {
        resultDescription: res.data[0] && res.data[0].resultDescription,
        resultResearch: Number(id) ? [f] : []
      };
      this.setState({ result })
    }
    });

  }

  render() {
    const {t, tofiConstants, initialValues, saveProps, onCreateObj, user} = this.props;

    return (
      <AntTabs tabs={[
        {
          tabKey: 'MainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfo
            tofiConstants={tofiConstants}
            t={t}
            onCreateObj={onCreateObj}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        {
          tabKey: 'Applicant',
          tabName: t('APPLICANT'),
          disabled: !initialValues.key,
          tabContent: <Applicant
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        {
          tabKey: 'Description',
          tabName: t('DESCRIPTION'),
          disabled: !initialValues.key,
          tabContent: <Description
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        {
          tabKey: 'ResultDescription',
          tabName: t('RESULT_DESCRIPTION'),
          disabled: !initialValues.key || !initialValues.workAuthor || user.obj !== initialValues.workAuthor.value,
          tabContent: <ResultDescription
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={this.state.result}
          />
        },
        {
          tabKey: 'Bibliography',
          tabName: t('BIBLIOGRAPHY'),
          disabled: !initialValues.key || !initialValues.workAuthor || user.obj !== initialValues.workAuthor.value,
          tabContent: <Bibliography
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        }
        /*{
          tabKey: 'ResultResearch',
          tabName: t('RESULT_RESEARCH'),
          tabContent: <ResultResearch
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        }*/
      ]}/>
    )
  }
}

export default InqueryRegCard;