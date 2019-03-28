import React from 'react';
import {Button, DatePicker, Icon, Input, Popconfirm, Table, message} from 'antd';
import {isEmpty, map} from 'lodash';
import { connect } from 'react-redux';
import Select from '../../Select';
import SelectVirt from '../../SelectVirt';
import { CUBE_FOR_ORG_CHECK } from '../../../constants/tofiConstants';
import { SYSTEM_LANG_ARRAY } from '../../../constants/constants';
import {createObj, getCube, getObjByObjVal, updateCubeData} from '../../../actions/actions';
import {getPropMeta, parseCube_new} from '../../../utils/cubeParser';
import moment from 'moment';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);
const EditableDatePicker = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <DatePicker style={{ margin: '-5px 0' }} format="DD-MM-YYYY" value={value ? moment(value, 'DD-MM-YYYY') : null} onChange={e => onChange(e)} />
      : value
    }
  </div>
);
const EditableSelect = ({ editable, value, onChange, getObjByObjVal, idRef, options }) => (
  <div>
    {editable
      ? <SelectVirt
        style={{ margin: '-5px 0' }}
        value={value}
        onChange={e => onChange(e)}
        options={options}
        optionHeight={40}
        onMenuOpen={() => {
          if(options.length === 0) {
            const fd = new FormData();
            fd.append('clsConst', 'sourceOrgList');
            fd.append('propConst', 'fundmakerOfIK');
            fd.append('propConstOfVal', 'isActive');
            fd.append('idRef', idRef);
            fd.append('valueType', 'factorVal');
            getObjByObjVal(fd, 'IK_FUNDMAKER_ACTIVE')
          }
        }}
      />
      : value ? value.label : ''
    }
  </div>
);

/*eslint eqeqeq:0*/
class CheckingPlan extends React.Component {

  state = {
    data: [],
    filter: {
      sourcing: []
    },
    loading: true
  };

  onSourcingChange = s => {this.setState({filter: {...this.state.filter, sourcing: s}})};

  renderTableHeader = () => {
    return (
      <div className="table-header">
        <div className="table-header-btns">
          <Button
            icon='plus'
            shape='circle'
            type='primary'
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            onClick={this.addNew}
          />
        </div>
        <div className="label-select">
          <Select
            name="sourcing"
            isMulti
            isSearchable={false}
            value={this.state.filter.sourcing}
            onChange={this.onSourcingChange}
            options={this.props.IK_FUNDMAKER_ACTIVE ? this.props.IK_FUNDMAKER_ACTIVE.map(o => ({value: o.id, label: o.name[this.lng]})) : []}
            placeholder={this.props.t('SOURCING')}
            onMenuOpen={() => {
              if(!this.props.IK_FUNDMAKER_ACTIVE) {
                const fd = new FormData();
                fd.append('clsConst', 'sourceOrgList');
                fd.append('propConst', 'fundmakerOfIK');
                fd.append('propConstOfVal', 'isActive');
                fd.append('idRef', this.props.tofiConstants.isActiveTrue.id);
                fd.append('valueType', 'factorVal');
                this.props.getObjByObjVal(fd, 'IK_FUNDMAKER_ACTIVE')
              }
            }}
          />
        </div>
      </div>
    )
  };

  componentDidMount() {
    this.props.getCube(CUBE_FOR_ORG_CHECK)
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.cubeForOrgCheck) && !isEmpty(nextProps.tofiConstants) && this.props.cubeForOrgCheck !== nextProps.cubeForOrgCheck) {
      const { doForOrgCheck, dpForOrgCheck } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            nextProps.cubeForOrgCheck['cube'],
            [],
            'dp',
            'do',
            nextProps.cubeForOrgCheck[`do_${doForOrgCheck.id}`],
            nextProps.cubeForOrgCheck[`dp_${dpForOrgCheck.id}`],
            `do_${doForOrgCheck.id}`,
            `dp_${dpForOrgCheck.id}`).map(this.renderTableData)
        }
      );
    } else if(nextProps.cubeForOrgCheck && typeof nextProps.cubeForOrgCheck === 'object') {
      this.setState({
        loading: false
      })
    }
  }

  renderTableData = (item, idx) => {
    const { orgCheckDate, orgCheckNote, orgForCheck } = this.props.tofiConstants;
    const orgCheckDateObj = item.props.find(element => element.prop == orgCheckDate.id),
      orgCheckNoteObj = item.props.find(element => element.prop == orgCheckNote.id),
      orgForCheckObj = item.props.find(element => element.prop == orgForCheck.id);
    return {
      key: item.id,
      numb: idx + 1,
      orgForCheck: !!orgForCheckObj && orgForCheckObj.cube && orgForCheckObj.cube.idRef ? {value: orgForCheckObj.cube.idRef, label: orgForCheckObj.cube.name[this.lng]} : null,
      orgCheckNote: !!orgCheckNoteObj ? orgCheckNoteObj.value || '' : '',
      orgCheckDate: !!orgCheckDateObj ? orgCheckDateObj.value || '' : ''
    }
  };

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  renderDateColumns = (text, record, column) => {
    return (
      <EditableDatePicker
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value ? value.format('DD-MM-YYYY') : '', record.key, column)}
      />
    )
  };
  renderSelectColumns(text, record, column) {
    return (
      <EditableSelect
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
        idRef={this.props.tofiConstants.isActiveTrue.id}
        getObjByObjVal={this.props.getObjByObjVal}
        options={this.props.IK_FUNDMAKER_ACTIVE ? this.props.IK_FUNDMAKER_ACTIVE.map(o => ({value: o.id, label: o.name[this.lng]})) : []}
      />
    );
  };

  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit = key => {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      target.valOld = {...target};
      this.setState({ data: newData });
    }
  };
  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      const { editable, key, numb, valOld, ...rest } = target;
      const cube = {
        cubeSConst: CUBE_FOR_ORG_CHECK,
        doConst: 'doForOrgCheck',
        dpConst: 'dpForOrgCheck'
      };
      if(target.key.startsWith('newData')) {
        const name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
          name[lang] = String(rest.orgForCheck.value)
        });
        const obj = {
          name,
          fullName: name,
          clsConst: 'checkingPlanList'
        };
        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        createObj(cube, obj)
          .then(res => {
            hideCreateObj();
            if(res.success) {
              target.key = res.data.idItemDO;
              this.onSaveCubeData({cube, obj}, rest, res.data.idItemDO, {}, {})
                .then(resp => {
                  if(resp.success) {
                    console.log('success');
                    delete target.editable;
                    this.setState({ data: newData });
                  }
                }).catch(err => console.log(err));
            }
          }).catch(err => {
          hideCreateObj();
          console.log(err);
        });
      } else {
        this.onSaveCubeData({cube}, rest, target.key, {}, valOld)
          .then(resp => {
            if(resp.success) {
              delete target.editable;
              this.setState({ data: newData });
            }
          })
      }
    }
  }

  onSaveCubeData = (objVerData, values, doItemProp, objDataProp, valOld) => {
    let datas = [];
    console.log(valOld);
    try {
      datas = [{
        own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp }],
        props: map(values, (val, key) => {
          const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
          console.log(val, valOld, valOld[key], key);
          let value = val;
          let oldValue = valOld[key];
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string'){
            value = {kz: val, ru: val, en: val};
            oldValue = oldValue && {kz: valOld[key], ru: valOld[key], en: valOld[key]};
          }
          if(propMetaData.typeProp === 312 && typeof value === 'string') {
            value = value.split('-').reverse().join('-');
            oldValue = oldValue && oldValue.split('-').reverse().join('-');
          }
          if(val && typeof val === 'object' && val.value) {
            value = String(val.value);
            oldValue = oldValue && String(valOld[key].value);
          }
          if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
            oldValue = oldValue && valOld[key].map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, oldValue, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode }
        }),
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
    } catch(err) {
      console.log(err);
      return err;
    }
    const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
    return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
          if(this.filters) {
            this.setState({loading: true});
            return this.props.getCube(objVerData.cube.cubeSConst, JSON.stringify(this.filters))
              .then(() => {
                this.setState({loading: false});
                return {success: true}
              })
          } else {
            return {success: true}
          }
        } else {
          message.error(this.props.t('PROPS_UPDATING_ERROR'));
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return {success: false}
          }
        }
      })
  };

  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
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
  addNew = () => {
    this.setState({
      data: [
        ...this.state.data,
        {
          key: `newData_${this.state.data.length}`,
          editable: true,
          numb: this.state.data.length + 1,
          orgForCheck: '',
          orgCheckDate: '',
          orgCheckNote: ''
        }]
    })
  };

  render() {
    const { tofiConstants } = this.props;
    if(isEmpty(tofiConstants)) return null;

    this.lng = localStorage.getItem('i18nextLng');

    const { orgForCheck, orgCheckDate, orgCheckNote } = tofiConstants;

    this.filteredData = this.state.data.filter(item => {
      return (
        ( this.state.filter.sourcing.length === 0  || this.state.filter.sourcing.some(p => p.value == item.orgForCheck.value) )
      )
    });

    return (
      <div className="CheckingPlan">
        <div className="title">
          <h2>План проверки источников комплектования</h2>
        </div>
        <Table
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '5%'
            },
            {
              key: 'orgForCheck',
              title: orgForCheck.name[this.lng],
              dataIndex: 'orgForCheck',
              widht: '40%',
              render: (obj, record) => this.renderSelectColumns(obj, record, 'orgForCheck'),
            },
            {
              key: 'orgCheckDate',
              title: orgCheckDate.name[this.lng],
              dataIndex: 'orgCheckDate',
              width: '20%',
              render: (obj, record) => this.renderDateColumns(obj, record, 'orgCheckDate'),
            },
            {
              key: 'orgCheckNote',
              title: orgCheckNote.name[this.lng],
              dataIndex: 'orgCheckNote',
              width: '25%',
              render: (obj, record) => this.renderColumns(obj, record, 'orgCheckNote'),
            },
            {
              key: 'action',
              title: '',
              dataIndex: '',
              width: '10%',
              render: (text, record) => {
                const { editable } = record;
                const disable = false;
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
          title={this.renderTableHeader}
          pagination={{pageSize: 20}}
          bordered
          size="small"
          dataSource={this.filteredData}
          loading={this.state.loading}
          scroll={{y: '100%'}}
        />

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cubeForOrgCheck: state.cubes[CUBE_FOR_ORG_CHECK],
    IK_FUNDMAKER_ACTIVE: state.generalData.IK_FUNDMAKER_ACTIVE
  }
}

export default connect(mapStateToProps, { getCube, getObjByObjVal })(CheckingPlan)