import React from 'react';
import {Table, Popconfirm, Button, Icon, message} from 'antd';
import {isEmpty} from 'lodash';
import {Link} from 'react-router-dom';
import {actIK, dObj, getObjByProp, listObjByProp} from '../../../../actions/actions';
import {CUBE_FOR_AF_INV, DO_FOR_INV} from '../../../../constants/tofiConstants';
import {parseCube_new} from '../../../../utils/cubeParser';

class LegalEntitiesInventoriesSmall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedRow: null
    };
  }

  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
  };

  stopPropagation = e => {
    e.stopPropagation();
  };
  handleRowClick = rec => {
    this.setState({
      selectedRow: rec
    });
  };
  passToStorage = async () => {
    try {
      const fd = new FormData();
      fd.append('clsConsts', 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP');
      fd.append('propConst', 'fundmakerOfIK');
      fd.append('value', this.props.record.fmId.split('_')[1]);
      const fundData = await getObjByProp(fd);
      if(!fundData.success) {
        fundData.errors.forEach(err => {
          message.error(err.text, 8);
        });
        return;
      }
      if(!fundData.data.length) {
        message.error(this.props.t('NO_FUND_OF_IK'), 8);
        return;
      }
      const idFund = String(fundData.data[0].id);
      const idInv = this.state.selectedRow.key.split('_')[1];
      const idIK = this.props.record.key.split('_')[1];
      const hideLoading = message.loading(this.props.t('PASSING_TO_STORAGE'));
      const res = await actIK(idFund, idInv, idIK);
      hideLoading();
      if(!res.success) {
        res.errors.forEach(err => {
          message.error(err.text);
        });
        return;
      }
      message.success(this.props.t('SUCCESS'));
    } catch(e) {
      console.warn(e);
    }
  };

  renderInvTableHeader = () => {
    return (
      <div className="flex">
        <Link
          to={{
            pathname: `/sourcing/sourcesMaintenance/legalEntities/${this.props.record.key}/inventories`,
            state: {record: this.props.record}
          }}
        >
        <Button
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
            type="primary"
          >{this.props.t('ADD')}</Button>
        </Link>
        {/*<Button disabled={!this.state.selectedRow}>{this.props.t('APPROVE')}</Button>*/}
        <Button disabled={!this.state.selectedRow} onClick={this.passToStorage}>{this.props.t('PASS_TO_STORAGE')}</Button>
      </div>
    )
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants)) return;
    if(this.props.CubeForAF_Inv) {
      const { doForInv, dpForInv } = this.props.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            this.props.CubeForAF_Inv['cube'],
            [],
            'dp',
            'do',
            this.props.CubeForAF_Inv[`do_${doForInv.id}`],
            this.props.CubeForAF_Inv[`dp_${dpForInv.id}`],
            `do_${doForInv.id}`,
            `dp_${dpForInv.id}`).map(this.renderTableData)
        }
      );
    } else {
      this.setState({ data: [] });
    }
  }

  componentDidUpdate(prevProps) {
    if(!this.props.CubeForAF_Inv && prevProps.CubeForAF_Inv) {
      this.setState({ data: [] })
    }
  }
  renderTableData = item => {
    const { invNumber, invType, fundNumberOfCases, invDates, invAgreement2Date, invApprovalDate2 } = this.props.tofiConstants;

    const invNumberObj = item.props.find(element => element.prop == invNumber.id),
      invAgreement2DateObj = item.props.find(element => element.prop == invAgreement2Date.id),
      fundNumberOfCasesObj = item.props.find(element => element.prop == fundNumberOfCases.id),
      invApprovalDate2Obj = item.props.find(element => element.prop == invApprovalDate2.id),
      invDatesObj = item.props.find(element => element.prop == invDates.id),
      invTypeObj = item.props.find(element => element.prop == invType.id);
              debugger;
    return {
      key: item.id,
      invList: item.name[this.lng],
      invNumber: invNumberObj ? invNumberObj.value || '' : '',
      fundNumberOfCases: fundNumberOfCasesObj && fundNumberOfCasesObj.value ? fundNumberOfCasesObj.value : '',
      invAgreement2Date: invAgreement2DateObj && invAgreement2DateObj.value ? invAgreement2DateObj.value : '',
      invDates: invDatesObj && invDatesObj.values ? invDatesObj.values : [],
      invApprovalDate2: invApprovalDate2Obj && invApprovalDate2Obj.value ? invApprovalDate2Obj.value : '',
      invType: invTypeObj && invTypeObj.refId ? { value: invTypeObj.refId, label: invTypeObj.value } : null
    }
  };
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, tofiConstants: {invNumber, invType, fundNumberOfCases, invDates, invApprovalDate2, invAgreement2Date} } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    return <div className="LegalEntitiesInventoriesSmall">
      <h3 style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', margin: '5px 0'}}>{t('INVENTORIES')}</h3>
      <Table
        bordered
        columns={[
          {
            key: 'invNumber',
            title: '№',
            dataIndex: 'invNumber',
            width: '5%',
          },
          {
            key: 'invList',
            title: t('NAME'),
            dataIndex: 'invList',
            width: '20%',
          },
          {
            key: 'invType',
            title: invType.name[this.lng],
            dataIndex: 'invType',
            width: '15%',
            render: obj => obj && obj.label
          },
          {
            key: 'fundNumberOfCases',
            title: fundNumberOfCases.name[this.lng],
            dataIndex: 'fundNumberOfCases',
            width: '13%',
          },
          {
            key: 'invDates',
            title: invDates.name[this.lng],
            dataIndex: 'invDates',
            width: '13%',
            render: arr => arr.length > 0 && arr.join(', ')
          },
          {
            key: 'invAgreement2Date',
            title: invAgreement2Date.name[this.lng],
            dataIndex: 'invAgreement2Date',
            width: '13%',
          },
          {
            key: 'invApprovalDate2',
            title: invApprovalDate2.name[this.lng],
            dataIndex: 'invApprovalDate2',
            width: '13%',
          },
          {
            key: 'action',
            title: '',
            dataIndex: '',
            width: '8%',
            render: (text, record) => {
              return (
                <div className="editable-row-operations">
                  <Link to={{
                    pathname: `/sourcing/sourcesMaintenance/legalEntities/${this.props.record.key}/inventories/${record.key}`,
                    state: {record: this.props.record}
                  }}>
                    <Icon type="edit" style={{fontSize: '14px'}}/>
                  </Link>
                  <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                    const fd = new FormData();
                    fd.append("cubeSConst", CUBE_FOR_AF_INV);
                    fd.append("dimObjConst", DO_FOR_INV);
                    fd.append("objId", record.key.split('_')[1]);
                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                    dObj(fd)
                      .then(res => {
                        hideLoading();
                        if(res.success) {
                          message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                          this.remove(record.key, record.table)
                        } else {
                          throw res
                        }
                      }).catch(err => {
                      console.error(err);
                      message.error(this.props.t('REMOVING_ERROR'))
                    })
                  }}>
                    <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                  </Popconfirm>
                </div>
              );
            },
          }
        ]}
        dataSource={this.state.data}
        size='small'
        title={this.renderInvTableHeader}
        pagination={{pageSize: 20}}
        scroll={{y: '100%'}}
        onRowClick={this.handleRowClick}
        rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
        style={{minHeight: 'unset', marginLeft: '5px', paddingBottom: '30px'}}
      />
    </div>
  }
}

export default LegalEntitiesInventoriesSmall;