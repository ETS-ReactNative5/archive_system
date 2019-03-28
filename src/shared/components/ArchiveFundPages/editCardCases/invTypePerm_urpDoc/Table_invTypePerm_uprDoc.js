import React from 'react';

import AntTable from '../../../AntTable';
import {CUBE_FOR_AF_INV, DO_FOR_INV} from "../../../../constants/tofiConstants";
import {message} from "antd/lib/index";
import {dObj} from "../../../../actions/actions";
import {Button, Icon, Input, Popconfirm} from "antd";
import {isEmpty, isEqual} from "lodash";
import {CSSTransition} from "react-transition-group";
import SiderCard from "../../../SiderCard";
import CardCase from "./CardCase";
import CardDoc from "./CardDoc";

class Table_invTypePerm_uprDoc extends React.Component {

  state = {
    selectedRowCase: {},
    selectedRowDoc: {},
    openCardCase: false,
    openCardDoc: false,
    filter: {
      name: '',
      caseDbeg: '',
      caseDend: ''
    }
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRowCase) || !isEqual(this.state.selectedRowCase, rec)){
      this.setState({ selectedRowCase: rec, openCardCase: false, openCardDoc: false });
      this.props.getDocData(rec.key);
    } else {
      this.setState({
        openCardCase: true,
        caseInitialValues: rec
      })
    }
  };

  changeSelectedRowDoc = rec => {
    if(isEmpty(this.state.selectedRowDoc) || !isEqual(this.state.selectedRowDoc, rec)){
      this.setState({ selectedRowDoc: rec });
    } else {
      this.setState({
        openCardDoc: true,
        selectedRowDoc: rec,
        docInitialValues: rec
      })
    }
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

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { filter } = this.state;
    const { t, lng, onSaveCubeData, tofiConstants, tofiConstants: {fundNumber, fundIndex, caseDbeg, caseDend, caseNotes, caseStructuralSubdivision,
      pageNumberStart, turnoverSheetStart, pageNumberEnd, turnoverSheetEnd, documentPapers }
    } = this.props;

    this.filteredData = this.props.caseData.filter(item => {
      return (
        item.name[lng].toLowerCase().includes(filter.name.toLowerCase()) &&
        ( !filter.caseDbeg || item.caseDbeg && item.caseDbeg.format('DD-MM-YYYY').includes(filter.caseDbeg) ) &&
        ( !filter.caseDend || item.caseDend && item.caseDend.format('DD-MM-YYYY').includes(filter.caseDend) )
      )
    });

    return (
      <div className='double-table'>
        <CSSTransition
          in={this.state.openCardDoc}
          timeout={300}
          classNames="left card"
          unmountOnExit
        >
          <SiderCard
            closer={<Button type='danger' className='left' onClick={() => this.setState({ openCardDoc: false })} shape="circle" icon="arrow-left"/>}
          >
            <CardDoc
              onSaveCubeData={onSaveCubeData}
              initialValues={this.state.docInitialValues}
              tofiConstants={tofiConstants}
              t={t}
            />
          </SiderCard>
        </CSSTransition>
        <AntTable
          columns={[
            {
              key: 'fundNumber',
              title: fundNumber.name[lng],
              dataIndex: 'fundNumber',
              width: '10%'
            },
            {
              key: 'fundIndex',
              title: fundIndex.name[lng],
              dataIndex: 'fundIndex',
              width: '10%'
            },
            {
              key: 'name',
              title: t('CASE_NAME'),
              dataIndex: 'name',
              width: '25%',
              filterDropdown: (
                <div className="custom-filter-dropdown">
                  <Input
                    name="name"
                    suffix={filter.name ? <Icon type="close-circle" data-name="name" onClick={this.emitEmpty} /> : null}
                    ref={ele => this.name = ele}
                    placeholder="Поиск"
                    value={filter.name}
                    onChange={this.onInputChange}
                  />
                </div>
              ),
              filterIcon: <Icon type="filter" style={{ color: filter.name ? '#ff9800' : '#aaa' }} />,
              onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                  filterDropdownVisible: visible,
                }, () => this.name.focus());
              },
              render: obj => obj && obj[lng]
            },
            {
              key: 'caseDbeg',
              title: caseDbeg.name[lng],
              dataIndex: 'caseDbeg',
              width: '10%',
              filterDropdown: (
                <div className="custom-filter-dropdown">
                  <Input
                    name="caseDbeg"
                    suffix={filter.caseDbeg ? <Icon type="close-circle" data-name="caseDbeg" onClick={this.emitEmpty} /> : null}
                    ref={ele => this.caseDbeg = ele}
                    placeholder="Поиск"
                    value={filter.caseDbeg}
                    onChange={this.onInputChange}
                  />
                </div>
              ),
              filterIcon: <Icon type="filter" style={{ color: filter.caseDbeg ? '#ff9800' : '#aaa' }} />,
              onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                  filterDropdownVisible: visible,
                }, () => this.caseDbeg.focus());
              },
              render: obj => obj && obj.format('DD-MM-YYYY')
            },
            {
              key: 'caseDend',
              title: caseDend.name[lng],
              dataIndex: 'caseDend',
              width: '10%',
              filterDropdown: (
                <div className="custom-filter-dropdown">
                  <Input
                    name="caseDend"
                    suffix={filter.caseDend ? <Icon type="close-circle" data-name="caseDend" onClick={this.emitEmpty} /> : null}
                    ref={ele => this.caseDend = ele}
                    placeholder="Поиск"
                    value={filter.caseDend}
                    onChange={this.onInputChange}
                  />
                </div>
              ),
              filterIcon: <Icon type="filter" style={{ color: filter.caseDend ? '#ff9800' : '#aaa' }} />,
              onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                  filterDropdownVisible: visible,
                }, () => this.caseDend.focus());
              },
              render: obj => obj && obj.format('DD-MM-YYYY')
            },
            {
              key: 'caseStructuralSubdivision',
              title: caseStructuralSubdivision.name[lng],
              dataIndex: 'caseStructuralSubdivision',
              width: '15%',
            },
            {
              key: 'caseNotes',
              title: caseNotes.name[lng],
              dataIndex: 'caseNotes',
              width: '20%',
              render: obj => obj && obj.label
            }
          ]}
          openedBy="Cases"
          changeSelectedRow={ this.changeSelectedRow }
          loading={ this.props.caseLoading }
          dataSource={ this.filteredData }
          title={() => <h3>{t('CASES')}</h3>}
        />
        <AntTable
          columns={[
            {
              key: 'fundNumber',
              title: fundNumber.name[lng],
              dataIndex: 'fundNumber',
              width: '10%'
            },
            {
              key: 'pageNumberStart',
              title: pageNumberStart.name[lng],
              dataIndex: 'pageNumberStart',
              width: '10%'
            },
            {
              key: 'turnoverSheetStart',
              title: turnoverSheetStart.name[lng],
              dataIndex: 'turnoverSheetStart',
              width: '10%'
            },
            {
              key: 'pageNumberEnd',
              title: pageNumberEnd.name[lng],
              dataIndex: 'pageNumberEnd',
              width: '10%'
            },
            {
              key: 'turnoverSheetEnd',
              title: turnoverSheetEnd.name[lng],
              dataIndex: 'turnoverSheetEnd',
              width: '10%'
            },
            {
              key: 'documentPapers',
              title: documentPapers.name[lng],
              dataIndex: 'documentPapers',
              width: '10%',
              render: obj => obj && obj.label
            },
            {
              key: 'caseDbeg',
              title: caseDbeg.name[lng],
              dataIndex: 'caseDbeg',
              width: '10%',
              render: obj => obj && obj.label
            },
            {
              key: 'caseDend',
              title: caseDend.name[lng],
              dataIndex: 'caseDend',
              width: '10%',
              render: obj => obj && obj.label
            }
          ]}
          loading={ this.props.docLoading }
          dataSource={ this.props.docData }
          openedBy='Cases'
          changeSelectedRow={this.changeSelectedRowDoc}
          title={() => <h3>{t('DOCUMENTS')}</h3>}
        />
        <CSSTransition
          in={this.state.openCardCase}
          timeout={300}
          classNames="right card"
          unmountOnExit
        >
          <SiderCard
            closer={<Button type='danger' className='right' onClick={() => this.setState({ openCardCase: false })} shape="circle" icon="arrow-right"/>}
          >
            <CardCase
              onSaveCubeData={onSaveCubeData}
              initialValues={this.state.caseInitialValues}
              tofiConstants={tofiConstants}
              t={t}
            />
          </SiderCard>
        </CSSTransition>
      </div>
    )
  }
}

export default Table_invTypePerm_uprDoc;