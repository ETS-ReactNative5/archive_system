import React from 'react';
import {Table, Input, Popconfirm, Button, Icon, Badge} from 'antd';
import {message} from "antd/lib/index";
import moment from "moment/moment";
import uuid from 'uuid';
import {isEmpty, map} from 'lodash';
import { connect } from 'react-redux';

import Select from '../../Select';
import {
  CUBE_FOR_FUND_AND_IK,
  DO_FOR_FUND_AND_IK,
  DP_FOR_FUND_AND_IK,
  DP_FOR_WORKS
} from "../../../constants/tofiConstants";
import {getPropMeta, parseCube_new} from "../../../utils/cubeParser";
import {getPropVal, updateCubeData,updateCubeData2} from "../../../actions/actions";

const EditableCell = ({ editable, value, onChange }) => (
  <div style={{ flex: 1 }}>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

const EditableUpload = ({ editable, value, onChange, openViewer }) => (
  <span style={{ flex: '0 0 20px', textAlign: 'center' }}>
    {editable ?
      <label style={{ cursor: 'pointer' }}>
        <input
          type="file"
          multiple
          style={{ display: 'none' }}
          accept='image/*, application/pdf'
          onChange={e => {
            onChange(Array.from(e.target.files))
          }}
        />
        <Badge count={value && value.length} showZero={false}>
          <Icon type='upload' />
        </Badge>
      </label> :
      value && value.length > 0 && (
        <Badge count={value.length} onClick={() => openViewer(value)}>
          <Icon type='paper-clip' />
        </Badge>
      )
    }
  </span>
)

class NMDocsSmall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  renderSelectColumns(text, record, column) {
    return (
      record.editable ?
        <Select
          value={text || null}
          options={this.props.normativeDocTypeOptions ? this.props.normativeDocTypeOptions.map(o => ({value: o.id, label: o.name[this.lng]})) : []}
          onMenuOpen={() => this.props.getPropVal(column)}
          onChange={value => this.handleChange(value, record.key, column)}
        />
        :
        text && text.label
    )
  }

  renderColumns(text, record, column, file) {
    return (
      <div className='flex'>
        <EditableCell
          editable={record.editable}
          value={text}
          onChange={value => this.handleChange(value, record.key, column)}
        />
        <EditableUpload
          editable={record.editable}
          value={record[file]}
          onChange={value => this.handleChange(value, record.key, file)}
          openViewer={values => this.props.openViewer(values)}
        />
      </div>
    );
  }
  onRowClick = record => { this.setState({ selectedRow: record }) };
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }

  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      const {key, editable, archiveInfoDate1IdDataPropVal, archiveInfoDate2IdDataPropVal, archiveInfoDate3IdDataPropVal, normativeDocTypeIdDataPropVal, file1IdDataPropVal, file2IdDataPropVal, file3IdDataPropVal, docFileIdDataPropVal, ...rest} = target;
      var datas = [];
      if (String(key).includes('newData')) { // Добавляем новую запись
        datas = [{
          own: [{doConst: DO_FOR_FUND_AND_IK, doItem: this.record.id, isRel: "0", objData: {}}],
          props: [
            {
              propConst: 'normMethDocs',
              val: {
                kz: `${this.record.id}_${uuid()}`,
                ru: `${this.record.id}_${uuid()}`,
                en: `${this.record.id}_${uuid()}`
              },
              typeProp: '71',
              periodDepend: "2",
              isUniq: '2',
              mode: 'ins',
              child: map(rest, (val, key) => {
                const propMetaData = getPropMeta(this.props.cubeForFundAndIK["dp_" + this.props.tofiConstants[DP_FOR_FUND_AND_IK].id], this.props.tofiConstants[key]);
                let value = val;
                if (propMetaData.typeProp === 317) return {
                  propConst: key,
                  isUniq: String(propMetaData.isUniq),
                  typeProp: String(propMetaData.typeProp),
                  periodDepend: String(propMetaData.periodDepend)
                };
                if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string')
                  value = {
                    kz: val,
                    ru: val,
                    en: val
                  };
                if (val && typeof val === 'object' && val.value) value = String(val.value);
                if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
                  value = val.map(v => String(v.value)).join(",");
                }
                return {
                  propConst: key,
                  val: value,
                  typeProp: String(propMetaData.typeProp),
                  periodDepend: String(propMetaData.periodDepend),
                  isUniq: String(propMetaData.isUniq)
                }
              })
            },
          ],
          periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
        }]
      } else { // Редактируем существующую запись
        datas = [{
          own: [{doConst: DO_FOR_FUND_AND_IK, doItem: this.record.id, isRel: "0", objData: {}}],
          props: [
            {
              propConst: 'normMethDocs',
              idDataPropVal: target.key,
              val: {
                kz: `${this.record.id}_${uuid()}`,
                ru: `${this.record.id}_${uuid()}`,
                en: `${this.record.id}_${uuid()}`
              },
              typeProp: '71',
              periodDepend: "2",
              isUniq: '2',
              mode: 'upd',
              child: map(rest, (val, key) => {
                const propMetaData = getPropMeta(this.props.cubeForFundAndIK["dp_" + this.props.tofiConstants[DP_FOR_FUND_AND_IK].id], this.props.tofiConstants[key]);
                if (val.length === 0) { return {} };
                let value = val;
                if (propMetaData.typeProp === 317) return {
                  propConst: key,
                  isUniq: String(propMetaData.isUniq),
                  typeProp: String(propMetaData.typeProp),
                  periodDepend: String(propMetaData.periodDepend),
                  idDataPropVal: target[key + 'IdDataPropVal']
                };
                if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string')
                  value = {
                    kz: val,
                    ru: val,
                    en: val
                  };
                if (val && typeof val === 'object' && val.value) value = String(val.value);
                if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
                  value = val.map(v => String(v.value)).join(",");
                }
                return {
                  propConst: key,
                  val: value,
                  typeProp: String(propMetaData.typeProp),
                  periodDepend: String(propMetaData.periodDepend),
                  isUniq: String(propMetaData.isUniq),
                  idDataPropVal: target[key + 'IdDataPropVal']
                };
              })
            },
          ],
          periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
        }];
      };
      const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      return updateCubeData2(
        CUBE_FOR_FUND_AND_IK,
        moment().format('YYYY-MM-DD'),
        JSON.stringify(datas),
        {},
        {['__Q__file1']: rest.file1, ['__Q__file2']: rest.file2, ['__Q__file3']: rest.file3, ['__Q__docFile']: rest.docFile})
        .then(res => {
          hideLoading();
          if (res.success) {
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            delete target.editable;
            this.setState({data: newData});
          } else {
            message.error(this.props.t('PROPS_UPDATING_ERROR'));
            if (res.errors) {
              res.errors.forEach(err => {
                message.error(err.text);
              });
              return {success: false}
            }
          }
        })
        .catch(err => {
          console.warn(err);
        })
    }
  }
  remove = key => {
    let newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      const {key, editable, ...rest} = target;
      const datas = [{
        own: [{doConst: DO_FOR_FUND_AND_IK, doItem: this.record.id, isRel: "0", objData: {}}],
        props: [
          {
            propConst: 'normMethDocs',
            idDataPropVal: target.key,
            val: {
              kz: `${this.record.id}_${uuid()}`,
              ru: `${this.record.id}_${uuid()}`,
              en: `${this.record.id}_${uuid()}`
            },
            typeProp: '71',
            periodDepend: "2",
            isUniq: '2',
            mode: 'del',
          },
        ],
        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
      }];
      const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      return updateCubeData2(
        CUBE_FOR_FUND_AND_IK,
        moment().format('YYYY-MM-DD'),
        JSON.stringify(datas),
        {},
        {
          ['__Q__file1']: rest.file1,
          ['__Q__file2']: rest.file2,
          ['__Q__file3']: rest.file3,
          ['__Q__docFile']: rest.docFile
        })
        .then(res => {
          hideLoading();
          if (res.success) {
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            newData = newData.filter(item => key !== item.key);
            this.setState({data: newData});
          } else {
            message.error(this.props.t('PROPS_UPDATING_ERROR'));
            if (res.errors) {
              res.errors.forEach(err => {
                message.error(err.text);
              });
              return {success: false}
            }
          }
        })
        .catch(err => {
          console.warn(err);
        })
    }
  };

  cancel = key => {
    const newData = [...this.state.data];
    if (String(key).includes('newData')) {
      this.setState({ data: newData.filter(item => item.key !== key) });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants)) return;
    const { doForFundAndIK, dpForFundAndIK, normMethDocs} = this.props.tofiConstants;
    this.record = parseCube_new(
      this.props.cubeForFundAndIK['cube'],
      [],
      'dp',
      'do',
      this.props.cubeForFundAndIK[`do_${doForFundAndIK.id}`],
      this.props.cubeForFundAndIK[`dp_${dpForFundAndIK.id}`],
      `do_${doForFundAndIK.id}`,
      `dp_${dpForFundAndIK.id}`)[0];
    const normMethDocsObj = this.record.props.find(el => el.prop == normMethDocs.id);
    if(normMethDocsObj && normMethDocsObj.values) {
      this.setState({
        data: normMethDocsObj.values.map(this.renderTableData)
      })
    }
  }

  renderTableHeader = () => {
    const { t } = this.props;
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() =>
            this.setState({
              data: [
                ...this.state.data,
                {
                  key: `newData_${this.state.data.length}`,
                  editable: true,
                  archiveInfoDate1: '',
                  archiveInfoDate2: '',
                  archiveInfoDate3: '',
                }]
            })}/>
        {
          !this.state.selectedRow || (this.state.selectedRow && isEmpty(this.state.selectedRow.docFile)) ?
          <label className={!this.state.selectedRow ? 'disabled' : ''}>
            <input
              disabled={!this.state.selectedRow}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={e => this.handleChange(Array.from(e.target.files), this.state.selectedRow.key, 'docFile')}/>
            <span className='ant-btn ant-btn-primary'><Icon type='upload'/> <span>{this.props.t('UPLOAD_FILE')}</span></span>
          </label> :
          <Button type='primary' icon='eye' onClick={() => this.props.openViewer(this.state.selectedRow.docFile)}>
            <Badge
              count={this.state.selectedRow.docFile.length}
            >
              {this.props.t('VIEW_FILES')}
             </Badge>
          </Button>
        }
      </div>
    )
  };
  renderTableData = ({id}) => {
    const { archiveInfoDate1, archiveInfoDate2, archiveInfoDate3, normativeDocType, file1, file2, file3, docFile } = this.props.tofiConstants;
    const archiveInfoDate1Obj = this.record.props.find(element => element.prop == archiveInfoDate1.id),
      archiveInfoDate2Obj = this.record.props.find(element => element.prop == archiveInfoDate2.id),
      archiveInfoDate3Obj = this.record.props.find(element => element.prop == archiveInfoDate3.id),
      normativeDocTypeObj = this.record.props.find(element => element.prop == normativeDocType.id),
      file1Obj = this.record.props.find(element => element.prop == file1.id),
      file2Obj = this.record.props.find(element => element.prop == file2.id),
      file3Obj = this.record.props.find(element => element.prop == file3.id),
      docFileObj = this.record.props.find(element => element.prop == docFile.id);

    const temp = {
      archiveInfoDate1: archiveInfoDate1Obj && archiveInfoDate1Obj.complexChildValues ? archiveInfoDate1Obj.complexChildValues : {},
      archiveInfoDate2: archiveInfoDate2Obj && archiveInfoDate2Obj.complexChildValues ? archiveInfoDate2Obj.complexChildValues : {},
      archiveInfoDate3: archiveInfoDate3Obj && archiveInfoDate3Obj.complexChildValues ? archiveInfoDate3Obj.complexChildValues : {},
      normativeDocType: normativeDocTypeObj && normativeDocTypeObj.complexChildValues ? normativeDocTypeObj.complexChildValues : {},
      file1: file1Obj && file1Obj.complexChildValues ? file1Obj.complexChildValues : {},
      file2: file2Obj && file2Obj.complexChildValues ? file2Obj.complexChildValues : {},
      file3: file3Obj && file3Obj.complexChildValues ? file3Obj.complexChildValues : {},
      docFile: docFileObj && docFileObj.complexChildValues ? docFileObj.complexChildValues : {},
      archiveInfoDate1IdDataPropVal: archiveInfoDate1Obj && archiveInfoDate1Obj.idDataPropVal ? archiveInfoDate1Obj.idDataPropVal : '',
      archiveInfoDate2IdDataPropVal: archiveInfoDate2Obj && archiveInfoDate2Obj.idDataPropVal ? archiveInfoDate2Obj.idDataPropVal : '',
      archiveInfoDate3IdDataPropVal: archiveInfoDate3Obj && archiveInfoDate3Obj.idDataPropVal ? archiveInfoDate3Obj.idDataPropVal : '',
      normativeDocTypeIdDataPropVal: normativeDocTypeObj && normativeDocTypeObj.idDataPropVal ? normativeDocTypeObj.idDataPropVal : '',
      file1IdDataPropVal: file1Obj && file1Obj.idDataPropVal ? file1Obj.idDataPropVal : '',
      file2IdDataPropVal: file2Obj && file2Obj.idDataPropVal ? file2Obj.idDataPropVal : '',
      file3IdDataPropVal: file3Obj && file3Obj.idDataPropVal ? file3Obj.idDataPropVal : '',
      docFileIdDataPropVal: docFileObj && docFileObj.idDataPropVal ? docFileObj.idDataPropVal : ''
    };
    return {
      key: id,
      archiveInfoDate1: temp.archiveInfoDate1[id] ? temp.archiveInfoDate1[id].value[this.lng] : '',
      archiveInfoDate2: temp.archiveInfoDate2[id] ? temp.archiveInfoDate2[id].value[this.lng] : '',
      archiveInfoDate3: temp.archiveInfoDate3[id] ? temp.archiveInfoDate3[id].value[this.lng] : '',
      normativeDocType: temp.normativeDocType[id] ? {value: temp.normativeDocType[id].refId, label: temp.normativeDocType[id].value} : {},
      file1: temp.file1[id] ? temp.file1[id].values : [],
      file2: temp.file2[id] ? temp.file2[id].values : [],
      file3: temp.file3[id] ? temp.file3[id].values : [],
      docFile: temp.docFile[id] ? temp.docFile[id].values : [],
      archiveInfoDate1IdDataPropVal: temp.archiveInfoDate1IdDataPropVal ? temp.archiveInfoDate1IdDataPropVal : '',
      archiveInfoDate2IdDataPropVal: temp.archiveInfoDate2IdDataPropVal ? temp.archiveInfoDate2IdDataPropVal : '',
      archiveInfoDate3IdDataPropVal: temp.archiveInfoDate3IdDataPropVal ? temp.archiveInfoDate3IdDataPropVal : '',
      normativeDocTypeIdDataPropVal: temp.normativeDocTypeIdDataPropVal ? temp.normativeDocTypeIdDataPropVal : '',
      file1IdDataPropVal: temp.file1IdDataPropVal ? temp.file1IdDataPropVal : '',
      file2IdDataPropVal: temp.file2IdDataPropVal ? temp.file2IdDataPropVal : '',
      file3IdDataPropVal: temp.file3IdDataPropVal ? temp.file3IdDataPropVal : '',
      docFileIdDataPropVal: temp.docFileIdDataPropVal ? temp.docFileIdDataPropVal : ''
    }
  };
  render() {

    if(isEmpty(this.props.tofiConstants)) return null;
    const { tofiConstants: {archiveInfoDate1, archiveInfoDate2, archiveInfoDate3, normativeDocType} } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    return <Table
      bordered
      columns={[
        {
          key: 'normativeDocType',
          title: normativeDocType.name[this.lng],
          dataIndex: 'normativeDocType',
          width: '15%',
          render: (obj, record) => this.renderSelectColumns(obj, record, 'normativeDocType'),
        },
        {
          key: 'archiveInfoDate1',
          title: archiveInfoDate1.name[this.lng],
          dataIndex: 'archiveInfoDate1',
          width: '15%',
          render: (text, record) => this.renderColumns(text, record, 'archiveInfoDate1', 'file1'),
        },
        {
          key: 'archiveInfoDate2',
          title: archiveInfoDate2.name[this.lng],
          dataIndex: 'archiveInfoDate2',
          width: '15%',
          render: (text, record) => this.renderColumns(text, record, 'archiveInfoDate2', 'file2'),
        }, {
          key: 'archiveInfoDate3',
          title: archiveInfoDate3.name[this.lng],
          dataIndex: 'archiveInfoDate3',
          width: '15%',
          render: (text, record) => this.renderColumns(text, record, 'archiveInfoDate3', 'file3'),
        },
        /*{
          key: 'dbeg',
          title: t('DBEG'),
          dataIndex: 'dbeg',
          width: '16%',
          render: (text, record) => this.renderColumns(text, record, 'dbeg'),
        }, {
          key: 'dend',
          title: t('DEND'),
          dataIndex: 'dend',
          width: '16%',
          render: (text, record) => this.renderColumns(text, record, 'dend'),
        }, */
        {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '8%',
          render: (text, record) => {
            const { editable, archiveInfoDate1, archiveInfoDate2, archiveInfoDate3 } = record;
            const disable = !archiveInfoDate1 || !archiveInfoDate2 || !archiveInfoDate3;
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
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
          },
        }
      ]}
      dataSource={this.state.data}
      size='small'
      title={this.renderTableHeader}
      pagination={false}
      scroll={{y: '100%'}}
      onRowClick={this.onRowClick}
      rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
      style={{ marginLeft: '5px'}}
    />;
  }
}

function mapStateToProps(state) {
  return {
    cubeForFundAndIK: state.cubes.orgSourceCubeSingle,
    normativeDocTypeOptions: state.generalData.normativeDocType
  }
}

export default connect(mapStateToProps, {getPropVal})(NMDocsSmall);