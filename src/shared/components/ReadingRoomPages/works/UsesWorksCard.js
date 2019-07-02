import React from 'react';
import AntTabs from '../../AntTabs';
import WorksPropertyForm from './WorksPropertyForm';
import WorkDescription from './WorkDescription';
import ResultDescription from './ResultDescription';
import Bibliography from './Bibliography';
import Documents from '../ResearcherCabinet/Documents.js';
import IdDataTab from './idDataTab.js';
import {parseCube_new} from "../../../utils/cubeParser";
import moment from "moment";
import {getCube, getObjListNew} from "../../../actions/actions";
import { message } from 'antd';
import UserStatusTab from "./userStatusTab.js";


class UsesWorksCard extends React.PureComponent {

  state = {
    docs: null,
    activeKey: 'props',
    loadingDocs: false,
  };

  handleChange = key => {
    alert("handleChange!!");
    this.setState({activeKey: key});
    if(key !== 'Documents') return;
    this.populateDocs();
  };

  populateDocs = () => {
    const { workRegCase, workType, docsResearch } = this.props.initialValues;

    if(workType && workType.workTypeClass === 'orderCopyDoc'){
      // if it is child request
      this.setState({ docs: []});
      if(!docsResearch.length) return;
      this.setState({ loadingDocs: true });
      const fd = new FormData();
      fd.append('ids', docsResearch.map(o => o.value).join(','));
      fd.append('propConsts', 'fundNumber,pageNumberStart,pageNumberEnd,archiveCipher,documentDate');
      getObjListNew(fd)
        .then(res => {
          if(!res.success) {
            res.errors.forEach(err => {
              message.error(err.text);
              return;
            })
          }
          this.setState({
            docs: res.data.map(o => ({
              key: o.id,
              documentDate: moment(o.documentDate.documentDate),
              pageNumberEnd: o.pageNumberEnd.pageNumberEnd,
              pageNumberStart: o.pageNumberStart.pageNumberStart,
              fundNumber: o.fundNumber,
              archiveCipher: o.archiveCipher[this.lng]
            })),
            loadingDocs: false
          })
        })
    }
  };


  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues && this.state.activeKey === 'Documents') {
      this.populateDocs();
    }
  }

  render() {
    const {t, tofiConstants, initialValues, saveProps, onCreateObj, clsStatusMap, user, childWorks} = this.props;
    this.lng = localStorage.getItem('i18nextLng');
      return (
        <AntTabs style={{userSelect:'none'}} tabs={[
        {
          tabKey: 'props',
          tabName: t('PROPS'),
          tabContent: <WorksPropertyForm
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            initialValues={initialValues}
            onCreateObj={onCreateObj}
            clsStatusMap={clsStatusMap}
          />
        },
        {
          tabKey: 'Description',
          disabled: !initialValues.key,
          tabName: t('REASONS_FOR_REFUSAL'),
          tabContent: <WorkDescription
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            initialValues={initialValues}
            cubeForWorksSingle={this.props.cubeForWorksSingle}
          />
        },
        {
            tabKey: 'Documents',
            tabName: t('DOCUMENTS'),
            hidden: !initialValues.workType || initialValues.workType.workTypeClass != "orderCopyDoc",
            tabContent: <Documents
              tofiConstants={tofiConstants}
              loadingDocs={this.state.loadingDocs}
              t={t}
              onCreateObj={onCreateObj}
              initialValues={initialValues}
              user={user}
              childWorks={childWorks}
              cubeForWorksSingle={this.props.cubeForWorksSingle}
            />
        },
        {
          tabKey: 'ResultDescription',
          tabName: t('RESULT_DESCRIPTION'),
          disabled: !initialValues.key,
          hidden: !initialValues.workType ||
                initialValues.workType.workTypeClass == "userRegistration" ||
                initialValues.workType.workTypeClass == "caseDeliveryToRR",
          tabContent: <ResultDescription
            id={initialValues.key}
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            user={user}
            initialValues={initialValues}
            cubeForWorksSingle={this.props.cubeForWorksSingle}
            updateCard={this.props.updateCard}
          />
        },
        {
          tabKey: 'Bibliography',
          tabName: t('BIBLIOGRAPHY'),
          disabled: !initialValues.key,
          hidden: !initialValues.workType ||
            initialValues.workType.workTypeClass == "userRegistration" ||
            initialValues.workType.workTypeClass == "caseDeliveryToRR" ||
            initialValues.workType.workTypeClass == "orderCopyDoc" || true,
          tabContent: <Bibliography
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
            cubeForWorksSingle={this.props.cubeForWorksSingle}
          />
        },
            {
                tabKey: 'idData',
                tabName: t("ID_DATA"),
                hidden: !initialValues.workType || initialValues.workType.workTypeClass != "userRegistration",
                tabContent: <IdDataTab
                tofiConstants={tofiConstants}
                t={t}
                saveProps={saveProps}
                initialValues={initialValues}
                />
            },            {
                tabKey: 'userStatus',
                tabName: t("STATUS"),
                hidden: !initialValues.workType || initialValues.workType.workTypeClass != "userRegistration",
                tabContent: <UserStatusTab
                tofiConstants={tofiConstants}
                t={t}
                saveProps={saveProps}
                initialValues={initialValues}
                />
            },
      ]}/>)
    }
}

export default UsesWorksCard;