import React from 'react';
import {Breadcrumb, Button, Checkbox, Input, Table, message} from 'antd';
import {Link} from 'react-router-dom';
import {differenceWith, isEmpty, isEqual, pickBy} from 'lodash';
import AntModal from '../../AntModal';
import {CUBE_FOR_WORKS, DO_FOR_WORKS} from '../../../constants/tofiConstants';
import moment from 'moment';
import {addDerivativeWorksExp, getValuesOfObjsWithProps, updateCubeData} from '../../../actions/actions';
import {CSSTransition} from "react-transition-group";
import SiderCard from "../../SiderCard";
import CardCase_invTypeLS_LSDoc from "./invTypeLS_LSDoc/CardCase_invTypeLS_LSDocWorks";

/*eslint eqeqeq:0*/
class ArchiveFundWorksExpertize extends React.PureComponent {

  state = {
    data: [],
    modal: {
      visible: false,
      inputValue: 0
    },
    workRegFundNumber: '',
    workRegFundIndex: '',
    workRegInvNumber: '',
  };

  openModal = () => {
    this.setState({ modal: {...this.state.modal, visible: true} })
  };
  handleModalOk = () => {
    this.sendAddedWorks('temp')
  };
  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  onInputChange = e => {
    if((e.target.value > 0 && e.target.value <= this.state.data.length) || e.target.value === '') {
      this.setState({ modal: { ...this.state.modal, inputValue: e.target.value } })
    }
  };
  componentDidMount() {
    if(this.props.location && this.props.location.state && this.props.location.state.data) {
      this.setState({ data: this.props.location.state.data.map(this.renderTableData) });

      const fd = new FormData();
      const datas = [{objs: `${this.props.match.params.fund.split('_')[0]}`, propConsts: "caseNumber,fundIndex"}, {objs: `${this.props.match.params.fund.split('_')[1]}`, propConsts: "invNumber"}];
      fd.append('datas', JSON.stringify(datas));
      getValuesOfObjsWithProps(fd)
        .then(res => {
          if(res.success) {
            const workRegFundNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).caseNumber[this.lng];
            const workRegFundIndex = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).fundIndex[this.lng];
            const workRegInvNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[1]).invNumber[this.lng];
            this.setState({workRegFundNumber, workRegFundIndex, workRegInvNumber})
          }
        }).catch(err => {
        console.error(err);
      });
    }
  }

  sendAddedWorks = mode => {
    const initData = this.props.location.state.data.map(this.renderTableData);
    const diffInit = differenceWith(initData, this.state.data, isEqual);
    const diffData = this.state.data.filter(el => diffInit.some(elem => elem.key == el.key));
    const fd = new FormData();
    fd.append('workId', this.props.location.state.workId.split('_')[1]);
    fd.append('workRegFund', this.props.match.params.fund.split('_')[0]);
    fd.append('workRegInv', this.props.match.params.fund.split('_')[1]);
    fd.append('mode', mode);
    fd.append('cases', JSON.stringify(diffData.map((el, idx) =>
      ({
        caseId: String(el.key),
        ...pickBy(el, (val, key) => !isEqual(val, diffInit[idx][key]))
      })
    )));
    const hideLoading = message.loading(this.props.t('CREATING_NEW_OBJECT'), 30);
    addDerivativeWorksExp(fd)
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success(this.props.t('OBJECT_CREATED_SUCCESSFULLY'));
          const datas = mode === 'temp' ? [{
            own: [{doConst: DO_FOR_WORKS, doItem: this.props.location.state.workId, isRel: "0", objData: {} }],
            props: [
              {propConst: 'workIndexNumber', val: String(this.state.modal.inputValue), typeProp: '21', periodDepend: '2', isUniq: '1'},
              {propConst: 'intermediateResultDate', val: moment().format('YYYY-MM-DD'), typeProp: '312', periodDepend: '2', isUniq: '1'}
            ],
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }] : [{
            own: [{doConst: DO_FOR_WORKS, doItem: this.props.location.state.workId, isRel: "0", objData: {} }],
            props: [
              {propConst: 'workStatusAdmissionAndExpertise', val: String(this.props.tofiConstants.completed.id), typeProp: '11', periodDepend: '2', isUniq: '1'},
              {propConst: 'workActualEndDate', val: moment().format('YYYY-MM-DD'), typeProp: '312', periodDepend: '2', isUniq: '1'},
              {propConst: 'intermediateResultDate', val: null, typeProp: '312', periodDepend: '2', isUniq: '1', mode: 'del'}
            ],
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }];
          updateCubeData(CUBE_FOR_WORKS, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
            .then(res => {
              if(res.success) {
                this.props.history.push('/works/storageWorks')
              }
            });
        }
      })
  };

  renderTableHeader = () => {
    return (
      <div className="table-header">
        <Breadcrumb>
          <Breadcrumb.Item><a role='button' onClick={this.props.history.goBack}>Работы по учету и хранению</a></Breadcrumb.Item>
          <Breadcrumb.Item>
            <b>{this.props.tofiConstants.caseExamination.name[this.lng]}
              <span style={{fontSize: '13px'}}>&#8594;</span>
              {this.props.t('FUND_NUMB')}: {this.state.workRegFundNumber + this.state.workRegFundIndex}, {this.props.t('INV_NUMB')}: {this.state.workRegInvNumber}</b>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  };
  renderTableData = (item, idx) => {
    return {
      key: item.id,
      numb: idx + 1,
      caseNumber: item.caseNumber[this.lng],
      cases: item.name[this.lng],
      notBeStored: item.notBeStored == 1,
      temporaryUse: item.temporaryUse == 1,
      availability: item.temporaryUse == 0 && item.availability == 0
    }
  };
  renderTableFooter = () => {
    return (
      <div className="table-footer">
        <Button onClick={this.openModal}>{this.props.t('SAVE_TEMPORARY_STATE')}</Button>
        <Link to="/works/storageWorks"><Button>{this.props.t('CANCEL')}</Button></Link>
        <Button onClick={() => this.sendAddedWorks('complete')}>{this.props.t('COMPLETE')}</Button>
      </div>
    )
  };

  onChange = (value, key, column) => {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  };
    getRespCard(invType, docType) {
        const params = {
            t: this.props.t,
            saveProps: this.saveProps,
            initialValues: this.state.selectedRow,
            tofiConstants: this.props.tofiConstants,
            stateRecord:this.state.selectedWorks,
            invType: invType,
            docType: docType,
            onCreateObj:this.onCreateObj,
        };
        return <CardCase_invTypeLS_LSDoc {...params} />;

    }
    changeSelectedRow = rec => {
        this.setState({
            openCard: true,
            selectedRow: rec,
            selectedWorks:this.props.location.state.stateRecord
        })

    }
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;

    const { t, tofiConstants: {caseNumber} } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="WorksChecking EditCardCases__body">
        <Table
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '10%',
            },
            {
              key: 'caseNumber',
              title: caseNumber.name[this.lng],
              dataIndex: 'caseNumber',
              width: '10%',
              sorter: (a, b) => parseInt(a.caseNumber) - parseInt(b.caseNumber),
            },
            {
              key: 'cases',
              title: t('CASE_NAME'),
              dataIndex: 'cases',
              width: '40%',
            },
            {
              key: 'availability',
              title: t('AVAILABILITY'),
              dataIndex: 'availability',
              width: '10%',
              className: 'td-center',
              render: (text, record) =>  (

                <Checkbox checked={text} onChange={ (e) => this.onChange(!record.temporaryUse && e.target.checked, record.key, 'availability')}/>
              )
            },
            {
              key: 'temporaryUse',
              title: t('TEMPORARY_USE'),
              dataIndex: 'temporaryUse',
              width: '10%',
              className: 'td-center',
              render: (text, record) => (
                <Checkbox checked={text} />
              )
            },
            {
              key: 'notBeStored',
              title: t('NOT_BE_STORED'),
              dataIndex: 'notBeStored',
              width: '20%',
              className: 'td-center',
              render: (text, record) => (
                <Checkbox checked={text} disabled={record.temporaryUse} onChange={e => this.onChange(e.target.checked, record.key, 'notBeStored')}/>
              )
            }
          ]}
          bordered
          size="small"
          rowClassName={(rec, idx) => (this.props.location.state && rec.numb == this.props.location.state.workIndexNumber ? "row-selected" : "")}
          pagination={{pageSize: 20, defaultCurrent: this.props.location.state && this.props.location.state.workIndexNumber && Math.ceil(Number(this.props.location.state.workIndexNumber)/20)}}
          title={this.renderTableHeader}
          footer={this.renderTableFooter}
          onRowDoubleClick={this.changeSelectedRow}
          onRowClick={this.selectRow}
          dataSource={this.state.data}
          scroll={{x: 1500, y: '100%'}}
        />
        <CSSTransition
        in={this.state.openCard}
        timeout={300}
        classNames="right card"
        unmountOnExit
        >
          <SiderCard
          closer={<Button type='danger' className='right' onClick={() => this.setState({openCard: false})}
                          shape="circle" icon="arrow-right"/>}
          >
              {this.getRespCard(this.props.invType, this.props.docType)}
          </SiderCard>
        </CSSTransition>
        <AntModal
          visible={this.state.modal.visible}
          title={t('INDICATE_NUMBER_TITLE')}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <label>{t('INDICATE_NUMBER_LABEL')}</label>
          <Input type="number" value={this.state.modal.inputValue} onChange={this.onInputChange}/>
        </AntModal>
      </div>
    )
  }
}

export default ArchiveFundWorksExpertize;