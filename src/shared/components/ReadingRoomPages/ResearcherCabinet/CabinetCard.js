import React from 'react';
import { message } from 'antd';
import AntTabs from '../../AntTabs';
import WorksPropertyForm from './WorksPropertyForm';
import WorkDescription from './WorkDescription';
import Documents from './Documents';
import ResultDescription from './ResultDescription';
import {getCube, getObjListNew} from "../../../actions/actions";
import {connect} from "react-redux";
import {parseCube_new} from "../../../utils/cubeParser";
import moment from "moment";

class CabinetCard extends React.PureComponent {

  state = {
    docs: null,
    activeKey: 'props',
    loadingDocs: false
  };

  handleChange = key => {
    this.setState({activeKey: key});
    if(key !== 'Documents') return;
    this.populateDocs();
  };

  populateDocs = () => {
    const { workRegCase, workType, docsResearch } = this.props.initialValues;

    // if it's parent request
    if(workRegCase && workType && workType.workTypeClass !== 'orderCopyDoc') {
      this.setState({ loadingDocs: true, docs: [] });
      this.props.getDocs(workRegCase.value)
        .then(objsByProp => {
          const filters = {
            filterDOAnd: [{
              dimConst: 'doDocuments',
              concatType: "and",
              conds: [{
                obj: objsByProp.data.map(o => o.id).join(',')
              }]
            }],
            filterDPAnd: [{
              dimConst: 'dpDocuments',
              concatType: 'and',
              conds: [{
                consts: 'start,fundNumber,end,pageNumberStart,pageNumberEnd,archiveCipher,documentDate'
              }]
            }]
          };
          return this.props.getCube('cubeDocuments', JSON.stringify(filters));
        })
        .then(() => {
          const { doDocuments, dpDocuments } = this.props.tofiConstants;
          const parsedCube = parseCube_new(this.props.cubeDocuments['cube'],
            [],
            'dp',
            'do',
            this.props.cubeDocuments[`do_${doDocuments.id}`],
            this.props.cubeDocuments[`dp_${dpDocuments.id}`],
            `do_${doDocuments.id}`,
            `dp_${dpDocuments.id}`
          );
          this.setState({
            docs: parsedCube,
            loadingDocs: false
          })
        })
        .catch(err => {
          console.warn(err);
          this.setState({ loadingDocs: false })
        });
    } else if(workType && workType.workTypeClass === 'orderCopyDoc'){
      // if it is child request
      this.setState({ docs: []});
      if(!(docsResearch ? docsResearch.length : '')) return;
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
    const {t, tofiConstants, initialValues, onCreateObj, user, childWorks, saveProps } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    const { workType } = this.props.initialValues;
    return (
      <AntTabs
        onChange={this.handleChange}
        activeKey={this.state.activeKey}
        tabs={[
          {
            tabKey: 'props',
            tabName: t('PROPS'),
            tabContent: <WorksPropertyForm
              tofiConstants={tofiConstants}
              t={t}
              initialValues={initialValues}
            />
          },
          {
            tabKey: 'Description',
            tabName: t('DESCRIPTION'),
            tabContent: <WorkDescription
              tofiConstants={tofiConstants}
              t={t}
              initialValues={initialValues}
            />
          },
          {
            tabKey: 'Documents',
            tabName: t('DOCUMENTS'),
            tabContent: <Documents
              tofiConstants={tofiConstants}
              docs={this.state.docs}
              loadingDocs={this.state.loadingDocs}
              t={t}
              onCreateObj={onCreateObj}
              initialValues={initialValues}
              user={user}
              childWorks={childWorks}
            />
          },
          {
          tabKey: 'ResultDescription',
          tabName: t('RESULT_DESCRIPTION'),
          disabled: !initialValues.key || workType.workTypeClass != 'orderCopyDoc',
          tabContent: <ResultDescription
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        }
        ]}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    cubeDocuments: state.cubes.cubeDocuments
  }
}

export default connect(mapStateToProps, {getCube})(CabinetCard);