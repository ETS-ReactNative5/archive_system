import React, { Component } from 'react';
import {Button, Icon, Input, Modal} from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AntTable from '../AntTable';
import {CUBE_FOR_AF_CASE} from '../../constants/tofiConstants';
import {isEmpty, isEqual} from 'lodash';
import {parseCube_new} from '../../utils/cubeParser';
import {redirectWithPush} from '../../actions/actions';

const confirm = Modal.confirm;

/*eslint eqeqeq:0*/
class ViewInventCardCases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      errors: {},
      search: '',
      selectedRow: {},
      modal: {
        visible: false,
        type: ''
      },
      filter: {
        caseList: ''
      }
    }
  }

  showModal = modalType => {
    this.setState({
      modal: {
        visible: true,
        type: modalType
      }
    });
  };

  handleModalOk = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  onInputChange = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  };
  emitEmpty = e => {
    this.setState({filter: {
      ...this.state.filter,
      [e.target.dataset.name]: ''
    }})
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.props.redirectWithPush(`/archiveFund/editFundCard/${this.props.idFundCard}/${this.props.idInventCard}/${this.state.selectedRow.key}`);
    }
  };

  renderTableData = item => {
    const { fundNumber, caseDbeg, caseDend, caseNumberOfPages } = this.props.tofiConstants;
    const caseNumbObj = item.props.find(element =>  element.prop == fundNumber.id),
      dendObj = item.props.find(element => element.prop == caseDbeg.id),
      dbegObj = item.props.find(element => element.prop == caseDend.id),
      caseNumberOfPagesObj = item.props.find(element => element.prop == caseNumberOfPages.id);
    return {
      key: item.id,
      caseList: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
      fundNumber: !!caseNumbObj ? caseNumbObj.value || '' : '',
      caseDbeg: !!dbegObj ? dbegObj.value || '' : '',
      caseDend: !!dendObj ? dendObj.value || '' : '',
      caseNumberOfPages: !!caseNumberOfPagesObj ? caseNumberOfPagesObj.value || '' : ''
    }
  };
  renderTableFooter = () => {
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">{t('COUNT_FUNDS')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{t('COUNT_INVENT')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{t('COUNT_CASES')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small' type="text" readOnly/></div>
        </div>
        <div className="data-length">
          <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input size='small' type="text" readOnly value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>
    )
  };

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.caseCube) && !isEmpty(nextProps.caseCube['cube']) && !isEmpty(nextProps.tofiConstants)) {
      const { doForCase, dpForCase} = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.caseCube['cube'], [], 'dp', 'do', nextProps.caseCube[`do_${doForCase.id}`], nextProps.caseCube[`dp_${dpForCase.id}`], `do_${doForCase.id}`, `dp_${dpForCase.id}`)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  remove = e => {
    e.stopPropagation();
    confirm({
      title: this.props.t('REMOVE_CONFIRMATION_TITLE'),
      content: this.props.t('REMOVE_CONFIRMATION_MESSAGE'),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        console.log(this.state.selectedRow);
      },
      onCancel() {
        console.log('that was close one');
      },
    });
  };

  render() {
    const { loading, data, selectedRow, filter } = this.state;
    const { tofiConstants: {fundNumber, caseList, caseDbeg, caseDend, caseNumberOfPages} } = this.props;
    const lng = localStorage.getItem('i18nextLng');

    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.caseList.toLowerCase().includes(filter.caseList.toLowerCase())
      )
    });

    return (
      <div className="ViewInventCardCases">
        {/*<div className="table-header">
          <Button onClick={() => this.showModal('addForm')}>{ t('ADD') }</Button>
          <Link to={`/archiveFund/editFundCard/${idFundCard}/${idInventCard}/${this.state.selectedRow.key}`}><Button disabled={isEmpty(selectedRow)}>{ t('EDIT_CARD') }</Button></Link>
          <Button type="danger" disabled={isEmpty(selectedRow)}>{ t('REMOVE') }</Button>
        </div>*/}
        <div className="ViewInventCardCases__body">
          <AntTable
            columns={
              [
                {
                  key: 'fundNumber',
                  title: fundNumber.name[lng],
                  dataIndex: 'fundNumber',
                  width: '8%'
                },
                {
                  key: 'caseList',
                  title: caseList.name[lng],
                  dataIndex: 'caseList',
                  width: '22%',
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="caseList"
                        suffix={filter.caseList ? <Icon type="close-circle" data-name="caseList" onClick={this.emitEmpty} /> : null}
                        ref={ele => this.caseList = ele}
                        placeholder="Поиск"
                        value={filter.caseList}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: filter.caseList ? '#ff9800' : '#aaa' }} />,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.caseList.focus());
                  }
                },
                {
                  key: 'caseDbeg',
                  title: caseDbeg.name[lng],
                  dataIndex: 'caseDbeg',
                  width: '15%'
                },
                {
                  key: 'caseDend',
                  title: caseDend.name[lng],
                  dataIndex: 'caseDend',
                  width: '15%'
                },
                {
                  key: 'caseNumberOfPages',
                  title: caseNumberOfPages.name[lng],
                  dataIndex: 'caseNumberOfPages',
                  width: '15%'
                },
                {
                  key: 'elecViewQuantity',
                  title: 'Имеет электронный вариант',
                  dataIndex: 'elecViewQuantity',
                  width: '15%'
                },
                {
                  key: 'action',
                  title: '',
                  dataIndex: '',
                  width: '8%',
                  render: (text, record) => {
                    return (
                      <div className="editable-row-operations" style={{ display: 'flex' }}>
                        <Button icon="edit" className="green-btn" style={{marginRight: '5px'}} disabled={selectedRow.key !== record.key}/>
                        <Button icon="delete" className="green-btn yellow-bg" onClick={this.remove} disabled={selectedRow.key !== record.key}/>
                      </div>
                    );
                  },
                }
              ]
            }
            loading={loading}
            scroll={{x: 1200, y: '100%'}}
            dataSource={ this.filteredData }
            openedBy="ArchiveFundCaseList"
            changeSelectedRow={ this.changeSelectedRow }
            footer={ this.renderTableFooter }
          />
        </div>
      </div>
    )
  }
}

ViewInventCardCases.propTypes = {
  tofiConstants: PropTypes.shape().isRequired,
  idFundCard: PropTypes.string.isRequired,
  idInventCard: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    caseCube: state.cubes[CUBE_FOR_AF_CASE]
  }
}

export default connect(mapStateToProps, { redirectWithPush })(ViewInventCardCases);
