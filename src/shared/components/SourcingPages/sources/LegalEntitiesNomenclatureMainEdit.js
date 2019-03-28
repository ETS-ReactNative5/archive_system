import React from 'react';
import {Button, Table, Form, Tree, Input, Popconfirm, Icon, message} from 'antd';
import {connect} from 'react-redux';
import { Field, reduxForm} from 'redux-form';
import {isEmpty, isEqual, map, pickBy} from 'lodash';
import {CSSTransition} from 'react-transition-group';
import moment from 'moment';

import {renderDatePicker, renderInput, renderSelect} from '../../../utils/form_components';
import SiderCardLegalEntities from './SiderCardLegalEntities';
import {required, requiredLabel} from '../../../utils/form_validations';
import {getAllObjOfCls, createObj, updateCubeData, getCube, getObjList, dObj} from '../../../actions/actions';
import {getPropMeta, parseCube_new} from '../../../utils/cubeParser';
import {SYSTEM_LANG_ARRAY} from '../../../constants/constants';
import {CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK, DP_FOR_FUND_AND_IK} from '../../../constants/tofiConstants';

const LegalEntitiesNomenclaturePropsEdit = (
  {tofiConstants, loadClsObj, perechenListOptions, submitting, error, reset, t, handleSubmit, dirty, saveProps, initialValues}
  ) => {

  const handleFormSubmit = values => {
    const cube = {
      cubeSConst: 'cubeSNomen',
      doConst: 'dimObjNomen',
      dpConst: 'dimPropNomen'
    };
    if(initialValues.key) {
      return saveProps(
        {cube},
        {...pickBy(values, (val, key) => !isEqual(val, initialValues[key])), nomenLastChangeDate: moment()},
        initialValues.key,
        {}
      )
    }

  };

  const lng = localStorage.getItem('i18nextLng');
  const { nomenCreateDate , nomenNumber, nomenApprovalDate, nomenAgreementDate, nomenPerechen, nomenLastChangeDate } = tofiConstants;

  return (
    <Form className="antForm-spaceBetween" onSubmit={handleSubmit(handleFormSubmit)}>
      {nomenNumber && <Field
        name='nomenNumber'
        colon
        component={ renderInput }
        label={nomenNumber.name[lng]}
        formItemLayout={
          {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
          }
        }
        validate={required}
      />}
      {nomenPerechen && <Field
        name='nomenPerechen'
        colon
        component={ renderSelect }
        label={nomenPerechen.name[lng]}
        data={perechenListOptions ? perechenListOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
        formItemLayout={
          {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
          }
        }
        validate={requiredLabel}
        onMenuOpen={loadClsObj(['perechenList'])}
      /> }
      {nomenCreateDate && <Field
        name='nomenCreateDate'
        component={ renderDatePicker }
        format={null}
        disabled
        label={nomenCreateDate.name[lng]}
        formItemLayout={
          {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
          }
        }
      />}
      {nomenAgreementDate && <Field
        name='nomenAgreementDate'
        component={ renderDatePicker }
        format={null}
        label={nomenAgreementDate.name[lng]}
        formItemLayout={
          {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
          }
        }
      /> }
      {nomenApprovalDate && <Field
        name='nomenApprovalDate'
        component={ renderDatePicker }
        format={null}
        label={nomenApprovalDate.name[lng]}
        formItemLayout={
          {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
          }
        }
      /> }
      {nomenLastChangeDate && <Field
        name='nomenLastChangeDate'
        component={ renderDatePicker }
        format={null}
        disabled
        label={ nomenLastChangeDate.name[lng] }
        formItemLayout={
          {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
          }
        }
      /> }
      {dirty && <Form.Item className="ant-form-btns">
        <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
          {submitting ? t('LOADING...') : t('SAVE') }
        </Button>
        <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
          {submitting ? t('LOADING...') : t('CANCEL') }
        </Button>
        {error && <span className="message-error"><i className="icon-error" />{error}</span>}
      </Form.Item> }
    </Form>
  );
};

const LegalEntitiesNomenclaturePropsEditForm = reduxForm(
  { form: 'LegalEntitiesNomenclaturePropsEditForm', enableReinitialize: true }
  )(LegalEntitiesNomenclaturePropsEdit);

const EditableCell = ({ editable, value, onChange }) => (
  <span className="editable-cell">
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </span>
);
const EditableTextArea = ({ editable, value, onChange }) => (
  <span className="editable-cell">
    {editable
      ? <Input.TextArea autosize style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </span>
);
const EditableCellNumber = ({ editable, value, onChange }) => (
  <span className="editable-cell">
    {editable
      ? <Input style={{ margin: '-5px 0' }} type='number' value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </span>
);

const TreeNode = Tree.TreeNode;

/*eslint eqeqeq:0*/
class LegalEntitiesNomenclatureMainEdit extends React.Component {

  state = {
    data: [],
    loading: false,
    formData: {},
    selectedRow: {},
    openCard: false,
    cardLoading: false,
    checkedKeys: {},
    ln: {},
    treeData: []
  };

  onCheck = (checkedKeys, e) => {
    const lastCheckedKeys = checkedKeys.filter(key => e.checkedNodes.find(o => o.key === key).props.isLeaf);
    this.setState({ checkedKeys: {...this.state.checkedKeys, [this.state.selectedRow.key]: lastCheckedKeys} });
  };

  addNew = () => {
    this.setState({
      data: [
        ...this.state.data,
        {
          key: `newData_${this.state.data.length}`,
          parent: this.state.ln.id,
          objClass: 'nomenNodeList',
          editable: true,
          nomenIndex: '',
          perechenNodeList: '',
        }
      ]
    })
  };

  addNewChild = type => {
    const newData = this.state.data.slice();
    const key = this.state.selectedRow.key;

    const row = this.getObject(newData, key);

    if(row) {
      switch (type) {
        case 'nomenNodeList':
          if(!row.children) row.children = [];
          row.children.push({
            key: `newData_${row.key}_${row.children.length}`,
            parent: key,
            objClass: 'nomenNodeList',
            editable: true,
            nomenIndex: '',
            perechenNodeList: ''
          });
          break;
        case 'nomenItemList':
          if(!row.children) row.children = [];
          this.state.checkedKeys[row.key].forEach(key => {
            const branch = this.getObject(this.state.treeData, key);
            if(branch) {
              if(branch.shelfLifeOfPerechen && !branch.shelfLifeOfPerechen.idRef) {
                message.error(this.props.t('NO_SHELF_LIFE') + ': ' + branch.title, 7);
                return;
              }
              !row.children.some(obj => obj.nomenPerechenNode && obj.nomenPerechenNode.value == key) && row.children.push({
                key: `newData_${key}`,
                parent: row.key,
                objClass: 'nomenItemList',
                editable: true,
                nomenIndex: branch.perechenNodeNumber ? branch.perechenNodeNumber[this.lng] : '',
                numberOfNomenCases: '',
                shelfLifeOfPerechen: branch.shelfLifeOfPerechen && branch.shelfLifeOfPerechen.idRef ?
                  {value: branch.shelfLifeOfPerechen.idRef, label: branch.shelfLifeOfPerechen.name[this.lng]} : {},
                shelfLifeOfNomenCases: branch.shelfLifeOfPerechen && branch.shelfLifeOfPerechen.idRef ?
                  {value: branch.shelfLifeOfPerechen.idRef, label: branch.shelfLifeOfPerechen.name[this.lng]} : {},
                nomenCasesNote: branch.perechenNote ? branch.perechenNote[this.lng] : '',
                perechenNodeList: branch.title,
                nomenPerechenNode: {label: branch.title, value: key},
              });

              row.children = row.children.sort((a, b) => (a.objClass > b.objClass));
            }
          });
          break;
        default: break;
      }

      this.setState({
        data: newData,
        openCard: false
      })
    }
  };

  getObject = (theObject, key) => {
    let result = null;
    if(theObject instanceof Array) {
      for(let i = 0; i < theObject.length; i++) {
        result = this.getObject(theObject[i], key);
        if(result) return result;
      }
    }
    else if(theObject instanceof Object) {
      if(theObject.key == key) {
        return theObject;
      }
      result = this.getObject(theObject.children, key);
    } else return null;
    return result;
  };
  removeObject = (theObject, key) => {
    let result = null;
    if(theObject instanceof Array) {
      for(let i = 0; i < theObject.length; i++) {
        result = this.removeObject(theObject[i], key);
        if(result) {
          theObject.forEach((item, idx) => { // eslint-disable-line
            if(item.key === result.key) {
              theObject.splice(idx, 1);
              return;
            }
          });
        }
      }
    }
    else if(theObject instanceof Object) {
      if(theObject.key === key) {
        return theObject;
      }
      result = this.removeObject(theObject.children, key);
    } else return null;
    return result;
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}/>;
    });
  };
  closeCard = () => {
    this.setState({ openCard: false })
  };
  renderColumns(text, record, column, textArea) {
    if(textArea) return (
      <EditableTextArea
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  renderColumnsNumber(text, record, column) {
    return (
      <EditableCellNumber
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = this.state.data.slice();
    const target = this.getObject(newData, key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }

  stopPropagation = e => {
    e.stopPropagation();
  };
  save = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        const { perechenNodeList, parent, children, editable, key, objClass, ...rest } = target;
        const name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
          name[lang] = perechenNodeList
        });
        const cube = {
          cubeSConst: 'cubeSNomen',
          doConst: 'dimObjNomen',
          dpConst: 'dimPropNomen'
        };
        const obj = {
          name,
          fullName: name,
          clsConst: objClass,
          parent: parent.split('_')[1]
        };
        if(target.key.startsWith('newData')) {
          const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
          createObj(cube, obj)
            .then(res => {
              hideCreateObj();
              if(res.success) {
                target.key = res.data.idItemDO;
                this.filters = null;
                this.onSaveCubeData({cube, obj}, rest, res.data.idItemDO, {})
                  .then(resp => {
                    if(resp.success) {
                      delete target.editable;
                      this.setState({ data: newData });
                    }
                  })
              }
            });
        } else {
          this.onSaveCubeData({cube, obj}, rest, target.key, obj)
            .then(resp => {
              if(resp.success) {
                delete target.editable;
                this.setState({ data: newData });
              }
            })
        }
      }
    }
  };
  remove = key => {
    const newData = this.state.data.slice();
    this.removeObject(newData, key);
    this.setState({ data: newData });
  };
  cancel = key => {
    const newData = this.state.data.slice();
    if(key.includes('newData')) {
      this.removeObject(newData, key);
      this.setState({data: newData, selectedRow: {} });
      return;
    }
    const target = this.getObject(newData, key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData, selectedRow: {} });
    }
  };
  edit = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        target.editable = true;
        this.setState({ data: newData });
      }
    }
  };

  onRowClick = record => {
    this.setState({ selectedRow: record });
  };

  openArticles = () => {
    const fd = new FormData();
    const nomenPerechenValue = this.state.formData.nomenPerechen.value;
    // fd.append('clsConst', 'nomenNodeList');
    fd.append('parent', nomenPerechenValue);
    getObjList(fd)
      .then(res => {
        if(res.success) {
          this.setState({ loading: false, treeData: res.data.map(o => ({
            key: o.id,
            title: o.name[this.lng],
            isLeaf: !o.hasChild
          })) })
        } else {
          this.setState({ loading: false, openCard: false })
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, openCard: false })
      });
    this.setState({ openCard: true, cardLoading: true, checkedKeys: {[this.state.selectedRow.key]: [] ,...this.state.checkedKeys} })
  };
  onLoadData = (treeNode) => {
    if(treeNode.props.dataRef.children) {
      return Promise.resolve({success: true})
    }
    const fd = new FormData();
    // fd.append('clsConst', 'nomenNodeList');
    fd.append('parent', treeNode.props.dataRef.key);
    return getObjList(fd)
      .then(res => {
        if(res.success) {
          treeNode.props.dataRef.children = res.data.map(o => ({
            key: o.id,
            title: o.name[this.lng],
            isLeaf: !o.hasChild,
            perechenNodeNumber: o.perechenNodeNumber,
            perechenNote: o.perechenNote,
            shelfLifeOfPerechen: o.shelfLifeOfPerechen
          }));
          this.setState({
            treeData: [...this.state.treeData],
          });
          return {success: true}
        }
      })
      .catch(err => {
        console.error(err);
      })
  };

  // TODO Should've load from propVal
  loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.props.getAllObjOfCls(c, dte)
        }
      })
    }
  };

  saveProps = (objVerData, values, doItemProp, objDataProp) =>
    this.onSaveCubeData(objVerData, values, doItemProp, objDataProp)
      .then(() => {
        this.setState({
          formData: {...this.state.formData, ...values}
        })
      })
      .catch(err => {
        message.error(this.props.t('PROPS_UPDATING_ERROR'), 2);
        message.error(JSON.stringify(err, null, 2), 5)
      });
  onSaveCubeData = (objVerData, values, doItemProp, objDataProp) => {
    let datas = [];
    try {
      datas = [{
        own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp }],
        props: map(values, (val, key) => {
          const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
          let value = val;
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
          if(val && typeof val === 'object' && val.value) value = String(val.value);
          if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode }
        }),
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
    } catch(err) {
      console.error(err);
      return Promise.reject(err);
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

  componentDidMount() {
    const filters = {
      filterDOAnd: [
        {
          dimConst: 'dimObjNomen',
          concatType: "and",
          conds: [
            {
              ids: this.props.match.params.key
            }
          ]
        }
      ]
    };
    this.props.getCube('cubeSNomen', JSON.stringify(filters), {nodeWithChilds: 1});
  }
  componentDidUpdate(prevProps) {
    if(prevProps.cubeSNomen !== this.props.cubeSNomen) {
      const { tofiConstants: { dimObjNomen, dimPropNomen } } = this.props;
      const parsedCube = parseCube_new(
        this.props.cubeSNomen['cube'],
        [],
        'dp',
        'do',
        this.props.cubeSNomen[`do_${dimObjNomen.id}`],
        this.props.cubeSNomen[`dp_${dimPropNomen.id}`],
        `do_${dimObjNomen.id}`,
        `dp_${dimPropNomen.id}`
      );
      const ln = parsedCube.find(el => !Number(el.parent));
      let data = [];
      let initialValues = {};
      let checkedKeys = [];
      const initChildren = el => {
        if(el.hasChild) {
          return {
            key: el.id,
            parent: el.parent,
            objClass: 'nomenNodeList',
            editable: false,
            nomenIndex: el.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenIndex.id).value || '',
            perechenNodeList: el.name[this.lng] || '',
            nomenNodeNote: el.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenNodeNote.id).value || '',
            children: parsedCube.filter(elem => elem.parent == el.id).map(initChildren).sort((a, b) => (a.objClass > b.objClass))
          }
        } else {
          const shelfLifeOfPerechenObj = el.props.find(doProp => doProp.prop == this.props.tofiConstants.shelfLifeOfPerechen.id);
          const nomenPerechenNodeObj = el.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenPerechenNode.id);
          nomenPerechenNodeObj && nomenPerechenNodeObj.cube && nomenPerechenNodeObj.cube.idRef && checkedKeys.push(String(nomenPerechenNodeObj.cube.idRef));
          return {
            key: el.id,
            parent: el.parent,
            objClass: 'nomenItemList',
            editable: false,
            nomenIndex: el.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenIndex.id).value || '',
            perechenNodeList: el.name[this.lng] || '',
            numberOfNomenCases: el.props.find(doProp => doProp.prop == this.props.tofiConstants.numberOfNomenCases.id).value || '',
            nomenCasesNote: el.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenCasesNote.id).value || '',
            shelfLifeOfPerechen: shelfLifeOfPerechenObj && shelfLifeOfPerechenObj.refId ? {value: shelfLifeOfPerechenObj.refId, label: shelfLifeOfPerechenObj.value} : {},
            nomenNodeNote: el.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenNodeNote.id).value || '',
            nomenPerechenNode: nomenPerechenNodeObj && nomenPerechenNodeObj.cube && nomenPerechenNodeObj.cube.idRef ? {value: nomenPerechenNodeObj.cube.idRef, label: nomenPerechenNodeObj.value} : {}
          }
        }
      };
      if(ln && parsedCube.length >= 1) {
        data = parsedCube
          .filter(el => el.parent == ln.id)
          .map(initChildren).sort((a, b) => (a.objClass > b.objClass));
        const nomenNumberObj = ln.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenNumber.id);
        const nomenPerechenObj = ln.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenPerechen.id);
        const nomenCreateDateObj = ln.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenCreateDate.id);
        const nomenApprovalDateObj = ln.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenApprovalDate.id);
        const nomenAgreementDateObj = ln.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenAgreementDate.id);
        const nomenLastChangeDateObj = ln.props.find(doProp => doProp.prop == this.props.tofiConstants.nomenLastChangeDate.id);

        initialValues = {
          key: ln.id,
          nomenNumber: nomenNumberObj ? nomenNumberObj.value : '',
          nomenPerechen: nomenPerechenObj && nomenPerechenObj.cube && nomenPerechenObj.cube.idRef ? {value: nomenPerechenObj.cube.idRef, label: nomenPerechenObj.value} : {},
          nomenCreateDate: nomenCreateDateObj && nomenCreateDateObj.value ? moment(nomenCreateDateObj.value, "DD-MM-YYYY") : null,
          nomenApprovalDate: nomenApprovalDateObj && nomenApprovalDateObj.value ? moment(nomenApprovalDateObj.value, "DD-MM-YYYY") : null,
          nomenAgreementDate: nomenAgreementDateObj && nomenAgreementDateObj.value ? moment(nomenAgreementDateObj.value, "DD-MM-YYYY") : null,
          nomenLastChangeDate: nomenLastChangeDateObj && nomenLastChangeDateObj.value ? moment(nomenLastChangeDateObj.value, "DD-MM-YYYY") : null
        }
      }
      this.setState({
        ln,
        data,
        formData: initialValues,
        checkedKeys
      });
    }
  }

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { openCard, data, ln, selectedRow, loading, treeData, formData } = this.state;
    const { t, tofiConstants, tofiConstants: {nomenIndex, nomenNodeNote, numberOfNomenCases,
      shelfLifeOfPerechen, nomenCasesNote, nomenPerechenNode}, perechenListOptions } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="LegalEntitiesInventoriesMain">
        <div className="LegalEntitiesInventoriesMain__property">
          <LegalEntitiesNomenclaturePropsEditForm
            saveProps={this.saveProps}
            loadClsObj={this.loadClsObj}
            perechenListOptions={perechenListOptions}
            tofiConstants={tofiConstants}
            t={t}
            initialValues={formData}
          />
        </div>
        <div className="LegalEntitiesInventoriesMain__table">
          <div className="LegalEntitiesInventoriesMain__table__heading">
            <div className="table-header">
              <Button onClick={this.addNew} disabled={ln && !ln.id}>{t('ADD')}</Button>
              <Button onClick={() => this.addNewChild('nomenNodeList')} disabled={isEmpty(selectedRow) || selectedRow.key.startsWith('newData') || selectedRow.objClass === 'nomenItemList'}>{t('ADD_FIRST_LEVEL_CHILD')}</Button>
              <Button onClick={this.openArticles} disabled={isEmpty(selectedRow) || selectedRow.key.startsWith('newData') || selectedRow.objClass === 'nomenItemList'}>{t('ADD_SECOND_LEVEL_CHILD')}</Button>
              {ln.name && <h3 style={{textAlign: 'right', textTransform: 'uppercase', fontWeight: 'bold', paddingRight: '10px'}}>{ln.name.kz}</h3>}
            </div>
          </div>
          <div className="LegalEntitiesInventoriesMain__table__body">
            <Table
              columns={[
                {
                  key: 'nomenIndex',
                  title: nomenIndex.name[this.lng],
                  dataIndex: 'nomenIndex',
                  width: '15%',
                  render: (value, record) => this.renderColumns(value, record, 'nomenIndex')
                },
                {
                  key: 'perechenNodeList',
                  title: t('CASE_TITLE'),
                  dataIndex: 'perechenNodeList',
                  width: '25%',
                  render: (value, rec) => {
                    const obj = {
                      children: this.renderColumns(rec.perechenNodeList, rec, 'perechenNodeList', 'textArea'),
                      props: {}
                    };
                    if(rec.objClass === 'nomenNodeList') {
                      obj.props.colSpan = 5;
                    }
                    return obj;
                  }
                },
                {
                  key: 'numberOfNomenCases',
                  title: numberOfNomenCases.name[this.lng],
                  dataIndex: 'numberOfNomenCases',
                  width: '10%',
                  render: (value, rec) => {
                    const obj = {
                      children: this.renderColumnsNumber(value, rec, 'numberOfNomenCases'),
                      props: {}
                    };
                    if(rec.objClass === 'nomenNodeList') {
                      obj.props.colSpan = 0;
                    }
                    return obj;
                  }
                },
                {
                  key: 'shelfLifeOfPerechen',
                  title: shelfLifeOfPerechen.name[this.lng],
                  dataIndex: 'shelfLifeOfPerechen',
                  width: '10%',
                  render: (value, rec) => {
                    const obj = {
                      children: value && value.label ? value.label : '',
                      props: {}
                    };
                    if(rec.objClass === 'nomenNodeList') {
                      obj.props.colSpan = 0;
                    }
                    return obj;
                  }
                },
                {
                  key: 'nomenCasesNote',
                  title: nomenCasesNote.name[this.lng],
                  dataIndex: 'nomenCasesNote',
                  width: '10%',
                  render: (value, rec) => {
                    const obj = {
                      children: this.renderColumns(value, rec, 'nomenCasesNote', 'textArea'),
                      props: {}
                    };
                    if(rec.objClass === 'nomenNodeList') {
                      obj.props.colSpan = 0;
                    }
                    return obj;
                  }
                },
                {
                  key: 'nomenPerechenNode',
                  title: nomenPerechenNode.name[this.lng],
                  dataIndex: 'nomenPerechenNode',
                  width: '15%',
                  render: (value, rec) => {
                    const obj = {
                      children: value && value.label ? value.label : '',
                      props: {}
                    };
                    if(rec.objClass === 'nomenNodeList') {
                      obj.props.colSpan = 0;
                    }
                    return obj;
                  }
                },
                {
                  key: 'nomenNodeNote',
                  title: nomenNodeNote.name[this.lng],
                  dataIndex: 'nomenNodeNote',
                  width: '10%',
                  render: (value, rec) => {
                    const obj = {
                      children: value,
                      props: {}
                    };
                    if(rec.objClass === 'nomenNodeList') {
                      obj.children = this.renderColumns(value, rec, 'nomenNodeNote', 'textArea');
                      obj.props.colSpan = 1;
                    }
                    return obj;
                  }
                },
                {
                  key: 'action',
                  title: '',
                  dataIndex: '',
                  width: '5%',
                  render: (text, record) => {
                    const { editable } = record;
                    const disable = false;
                    return (
                      <div className="editable-row-operations">
                        {
                          editable ?
                            <span>
                              <a onClick={this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                              <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                                <a style={{marginLeft: '5px'}} onClick={this.stopPropagation}><Icon type="close"/></a>
                              </Popconfirm>
                            </span>
                            : <span>
                              <a><Icon type="edit" style={{fontSize: '14px'}} onClick={this.edit(record.key)}/></a>
                              <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                const fd = new FormData();
                                fd.append("cubeSConst", 'cubeSNomen');
                                fd.append("dimObjConst", 'dimObjNomen');
                                fd.append("objId", record.key.split('_')[1]);
                                const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                dObj(fd)
                                  .then(res => {
                                    hideLoading();
                                    if(res.success) {
                                      message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                      this.remove(record.key)
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
                            </span>
                        }
                      </div>
                    );
                  },
                },
              ]}
              loading={loading}
              size="small"
              bordered
              dataSource={data}
              onRowClick={this.onRowClick}
              scroll={{y: '100%'}}
              rowClassName={record => this.state.selectedRow.key === record.key ? 'row-selected' : ''}
            />
            <CSSTransition
              in={openCard}
              timeout={300}
              classNames="card"
              unmountOnExit
            >
              <SiderCardLegalEntities closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="close"/>} >
                <Tree
                  checkable
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  checkedKeys={this.state.checkedKeys[this.state.selectedRow.key] || []}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
                <div className="ant-form-btns">
                  <Button onClick={() => this.addNewChild('nomenItemList')}>Сформировать</Button>
                </div>
              </SiderCardLegalEntities>
            </CSSTransition>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    perechenListOptions: state.generalData.perechenList,
    cubeSNomen: state.cubes.cubeSNomen,
    cubeForFundAndIK: state.cubes[CUBE_FOR_FUND_AND_IK]
  }
}

export default connect(mapStateToProps, {getAllObjOfCls, getCube})(LegalEntitiesNomenclatureMainEdit);
