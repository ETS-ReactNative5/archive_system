import React from 'react';
import {isEmpty} from 'lodash';
import {Button, Icon, Input, Popconfirm, Table, message} from 'antd';
import moment from 'moment';
import {addObjVer, getObjVer_new, updObjVer, dObjVer} from '../../../actions/actions';
//import {Cube} from '../../../utils/axios_config';
import {DO_FOR_ORG_FUNDMAKER} from '../../../constants/tofiConstants';
import DPickerTOFI, {acceptedTOFIDate} from '../../DPickerTOFI';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input.TextArea autosize style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);
const EditableDatePicker = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <DPickerTOFI style={{ margin: '-5px 0' }} format="DD-MM-YYYY" value={value} onChange={e => onChange(e)} />
      : value && acceptedTOFIDate(value) && value.format('DD-MM-YYYY')
    }
  </div>
);

class FundMakerContent extends React.Component {

  state = {
    data: []
  };

  renderTableHeader = () => {
    return (
      <div className="table-header">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() => {
            this.setState({
              data: [
                ...this.state.data,
                {
                  key: `newData_${this.state.data.length}`,
                  editable: true,
                  dbeg: null,
                  dend: null,
                  name: '',
                  fullName: '',
                  base: ''
                }
              ]
            })
          }}
        />
      </div>
    )
  };

  renderDateColumns = (text, record, column) => {
    return (
      <EditableDatePicker
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    )
  };

  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  };

  edit(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  };

  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      if (key.includes('newData')) { // adding new version
        //TODO cmtVer является основанием (поле base на интерфейсе)
        const hideLoading = message.loading(this.props.t('ADDING_NEW_VERSION'), 0);
        const fd = new FormData();
        fd.append('obj', this.props.id.split('_')[1]);
        fd.append('dimObjsConst', DO_FOR_ORG_FUNDMAKER);
        target.dbeg && fd.append('dbeg', target.dbeg.format('YYYY-MM-DD'));
        target.dend && fd.append('dend', target.dend.format('YYYY-MM-DD'));
        fd.append('name', JSON.stringify({kz: target.name, ru: target.name, en: target.name}));
        fd.append('fullName', JSON.stringify({kz: target.fullName, ru: target.fullName, en: target.fullName}));
        fd.append('cmtVer', JSON.stringify({kz: target.base, ru: target.base, en: target.base}));
        fd.append('parent', null)

        addObjVer(fd)
          .then(res => {
            hideLoading();
            if (res.success) {
              getObjVer_new(this.props.id.split('_')[1])
                .then(res => {
                  if(res.success) {
                    this.setState({ data: res.data.map(this.renderVerTableData) })
                  }
                });
              message.success(this.props.t('OBJ_VER_ADDED'));
              // this.setState({ data: res.data.map(this.renderVerTableData) })
            }
            else {
              res.errors.forEach(err => {
                message.error(err.text, 5)
              })
            }
          }).catch(err => {
          console.log(err);
          hideLoading();
        });
      } else { // updating existing version
        //TODO cmtVer является основанием (поле base на интерфейсе)
        const hideLoading = message.loading(this.props.t('UPDATING_VERSION'), 0);
        const fd = new FormData();
        fd.append('objVerId', String(key));
        fd.append('dimObjsConst', DO_FOR_ORG_FUNDMAKER);
        target.dbeg && fd.append('dbeg', target.dbeg.format('YYYY-MM-DD'));
        target.dend && fd.append('dend', target.dend.format('YYYY-MM-DD'));
        fd.append('name', JSON.stringify({kz: target.name, ru: target.name, en: target.name}));
        fd.append('fullName', JSON.stringify({kz: target.fullName, ru: target.fullName, en: target.fullName}));
        fd.append('cmtVer', JSON.stringify({kz: target.base, ru: target.base, en: target.base}));
        fd.append('parent', null)

        updObjVer(fd)
          .then(res => {
            hideLoading();
            if (res.success) {
              getObjVer_new(this.props.id.split('_')[1])
                .then(res => {
                  if(res.success) {
                    this.setState({ data: res.data.map(this.renderVerTableData) })
                  }
                });
              message.success(this.props.t('OBJ_VER_UPDATED'));
              // this.setState({ data: res.data.map(this.renderVerTableData) })
            } else {
              res.errors.forEach(err => {
                message.error(err.text, 5)
              })
            }
          }).catch(err => {
          console.log(err);
          hideLoading();
        });
      }
    }
  };

  remove = key => {
    const fd = new FormData();
    fd.append('objVerId', String(key));
    fd.append('dimObjsConst', 'doForOrgFundmakers');
    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
    dObjVer(fd)
      .then(res => {
        hideLoading();
        if (res.success) {
          message.success(this.props.t('SUCCESSFULLY_REMOVED'))
          const newData = this.state.data.filter(item => item.key !== key);
          this.setState({data: newData});
        } else {
          throw res
        }
      }).catch(err => {
      hideLoading();
      console.error(err);
      message.error(this.props.t('REMOVING_ERROR'))
    })

  };

  cancel = key => {
    const newData = [...this.state.data];
    if(key.includes('newData')) {
      this.setState({ data: newData.filter(item => item.key !== key) });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };

  renderVerTableData = (ver) => {
    const lng = localStorage.getItem('i18nextLng');
    return {
      key: String(ver.id),
      editable: ver.editable,
      dbeg: ver.dbeg ? moment(ver.dbeg, 'YYYY-MM-DD') : null,
      dend: ver.dend ? moment(ver.dend, 'YYYY-MM-DD') : null,
      name: ver.name[lng],
      fullName: ver.fullName[lng],
      base: ver.cmtVer[lng]
    }
  };

  componentDidMount() {
    if(this.props.id)
      getObjVer_new(this.props.id.split('_')[1])
        .then(res => {
          if(res.success) {
            this.setState({ data: res.data.map(this.renderVerTableData) })
          } else {
            message.error('Ошибка загрузки версий объекта')
          }
        });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.id !== this.props.id) {
      getObjVer_new(this.props.id.split('_')[1])
        .then(res => {
          if(res.success) {
            this.setState({ data: res.data.map(this.renderVerTableData) })
          } else {
            message.error('Ошибка загрузки версий объекта')
          }
        });
    }
  }
  render() {
    const { tofiConstants, t } = this.props;
    if(isEmpty(tofiConstants)) return null;

    return (
      <div className="FundMakerContent" style={{height: '100%'}}>
        <Table
          columns={[
            {
              key: 'dbeg',
              title: t('DBEG'),
              dataIndex: 'dbeg',
              width: '15%',
              render: (text, record) => this.renderDateColumns(text, record, 'dbeg')
            },
            {
              key: 'dend',
              title: t('DEND'),
              dataIndex: 'dend',
              width: '15%',
              render: (text, record) => this.renderDateColumns(text, record, 'dend')
            },
            {
              key: 'name',
              title: t('SHORT_NAME'),
              dataIndex: 'name',
              width: '20%',
              render: (text, record) => this.renderColumns(text, record, 'name'),
            },
            {
              key: 'fullName',
              title: t('NAME'),
              dataIndex: 'fullName',
              width: '25%',
              render: (text, record) => this.renderColumns(text, record, 'fullName'),
            },
            {
              key: 'base',
              title: t('BASE'),
              dataIndex: 'base',
              width: '15%',
              render: (text, record) => this.renderColumns(text, record, 'base'),
            },
            {
              key: 'action',
              title: '',
              dataIndex: '',
              width: '10%',
              render: (text, record) => {
                const { editable } = record;
                return (
                  <div className="editable-row-operations">
                    {
                      editable ?
                        <span>
                          <a onClick={() => this.save(record.key)} disabled={false}><Icon type="check"/></a>
                          <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                            <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                          </Popconfirm>
                        </span>
                        : <span>
                          <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                          <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                            <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                          </Popconfirm>
                        </span>
                    }
                  </div>
                );
              }
            }
          ]}
          dataSource={this.state.data || []}
          pagination={false}
          bordered
          size='small'
          scroll={{y: '100%'}}
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

export default FundMakerContent;