import React from "react";
import {Button, Tree, Icon, Popconfirm, Input, message} from "antd";
import {CSSTransition} from "react-transition-group";
import {isEmpty, map, uniq} from "lodash";
import {connect} from "react-redux";
import moment from "moment";
import uuid from 'uuid/v4';

import {SYSTEM_LANG_ARRAY} from "../../../../constants/constants";
import { createObj, dObj, getCube, getObjFromProp, getPropVal, updateCubeData } from "../../../../actions/actions";
import {getPropMeta, onSaveCubeData, parseCube_new} from "../../../../utils/cubeParser";
import {
  CUBE_FOR_AF_CASE,
  CUBE_FOR_AF_INV, DO_FOR_CASE, DO_FOR_INV, DP_FOR_CASE, DP_FOR_INV
} from "../../../../constants/tofiConstants";
import LegalEntitiesInventoryProps from "./LegalEntitiesInventoryProps";
import Form_invTypePerm_uprDoc from "./forms/Form_invTypePerm_uprDoc";
import Form_invTypeLS_LSDoc from "./forms/Form_invTypeLS_LSDoc";
import Form_invTypeDigital_uprDoc from "./forms/Form_invTypeDigital_uprDoc";
import Form_invTypePhoto_photoDoc from "./forms/Form_invTypePhoto_photoDoc";
import Form_invTypeAlbum from "./forms/Form_invTypeAlbum_photoDoc";
import Form_invTypePhonoMag_phonoDoc from "./forms/Form_invTypePhonoMag_phonoDoc";
import Form_invTypePhonoGram_phonoDoc from "./forms/Form_invTypePhonoGram_phonoDoc";
import Form_invTypeMovie_movieDoc from "./forms/Form_invTypeMovie_movieDoc";
import Form_invTypeVideo_videoDoc from "./forms/Form_invTypeVideo_videoDoc";
import Form_invTypePerm_uprNTD from "./forms/Form_invTypePerm_uprNTD";
import {getObject, removeObject} from "../../../../utils";
import SiderCardLegalEntities_inv from "./SiderCardLegalEntities_inv";

/*eslint eqeqeq:0*/

const TreeNode = Tree.TreeNode;

class LegalEntitiesInventoriesMain_new extends React.Component {
  //=============================================================forms===================================================
  getRespForm = (invType, documentType) => {
    const { selectedNode, data } = this.state;
    if (selectedNode.objClass !== 'caseList') return null;
    const target = getObject(data, selectedNode.key);
    const {
      getPropVal,
      tofiConstants,
      t,
      uprDocTypeOptions,
      inaccurateDateFeatureOptions,
      typeOfPaperCarrierOptions,
      lsDocTypeOptions
    } = this.props;
    const {
      invTypePerm,
      uprDoc,
      uprNTD,
      invTypeVideo,
      videoDoc,
      invTypeDigital,
      invTypeLS,
      invTypeAlbum,
      LSDoc,
      invTypePhoto,
      photoDoc,
      invTypePhonoGram,
      phonoDoc,
      invTypeMovie,
      movieDoc,
      invTypePhonoMag
    } = tofiConstants;
    switch (true) {
      case invType == invTypePerm.id && documentType == uprDoc.id:
        return (
          <Form_invTypePerm_uprDoc
            uprDocTypeOptions={uprDocTypeOptions}
            inaccurateDateFeatureOptions={inaccurateDateFeatureOptions}
            typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
            getPropVal={getPropVal}
            tofiConstants={tofiConstants}
            t={t}
            initialValues={target}
            saveCase={this.saveCase}
            saveCaseProps={this.saveCaseProps}
          />
        );
      case invType == invTypePerm.id && documentType == uprNTD.id:
        return (
          <Form_invTypePerm_uprNTD
            uprDocTypeOptions={uprDocTypeOptions}
            inaccurateDateFeatureOptions={inaccurateDateFeatureOptions}
            typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
            getPropVal={getPropVal}
            tofiConstants={tofiConstants}
            t={t}
            initialValues={target}
            saveCase={this.saveCase}
            saveCaseProps={this.saveCaseProps}
          />
        );
      case invType == invTypeVideo.id && documentType == videoDoc.id:
        return <Form_invTypeVideo_videoDoc
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypeMovie.id && documentType == movieDoc.id:
        return <Form_invTypeMovie_movieDoc
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypePhonoGram.id && documentType == phonoDoc.id:
        return <Form_invTypePhonoGram_phonoDoc
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypePhonoMag.id && documentType == phonoDoc.id:
        return <Form_invTypePhonoMag_phonoDoc
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypeAlbum.id:
        return <Form_invTypeAlbum
          uprDocTypeOptions={uprDocTypeOptions}
          inaccurateDateFeatureOptions={inaccurateDateFeatureOptions}
          typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypePhoto.id && documentType == photoDoc.id:
        return <Form_invTypePhoto_photoDoc
          uprDocTypeOptions={uprDocTypeOptions}
          inaccurateDateFeatureOptions={inaccurateDateFeatureOptions}
          typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypeDigital.id && documentType == uprDoc.id:
        return <Form_invTypeDigital_uprDoc
          uprDocTypeOptions={uprDocTypeOptions}
          inaccurateDateFeatureOptions={inaccurateDateFeatureOptions}
          typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      case invType == invTypeLS.id && documentType == LSDoc.id:
        return <Form_invTypeLS_LSDoc
          typeOfPaperCarrierOptions={typeOfPaperCarrierOptions}
          lsDocTypeOptions={lsDocTypeOptions}
          getPropVal={getPropVal}
          tofiConstants={tofiConstants}
          t={t}
          initialValues={target}
          saveCase={this.saveCase}
          saveCaseProps={this.saveCaseProps}
        />;
      default:
        return <h1>no form specified</h1>;
    }
  };

  //=============================================================forms===================================================

  state = {
    data: [],
    loading: false,
    openCard: false,
    openPropsForm: true,
    lInv: {},
    formData: {},
    hierarchyCheckedKeys: [],
    selectedNode: {},
    expandedKeys: [],
    nomenOptions: [],
    e: {
      value: '',
      name: ''
    }
  };

  onEInputChange = e => {
    this.setState({
      e: {value: e.target.value, name: e.target.name}
    })
  };
  /*editable = key => {
    const newData = this.state.data.slice();
    const target = getObject(newData,key);
    if(target) {
      target.title = <Input
        onChange={this.onEInputChange}
        autoFocus
        name={`newData_${this.state.data.length}`}
        onPressEnter={this.saveHierarchy}
        addonAfter={<Icon type='check' onClick={this.saveHierarchy}/>}
      />
    }
    this.setState({ data: newData });
    console.log(key, target);
  };*/

  addNew = () => {
    this.setState({
      data: [
        ...this.state.data,
        {
          key: `newData_${this.state.data.length}`,
          parent: this.state.lInv.id,
          objClass: "structuralSubdivisionList",
          title: (
            <Input
              onChange={this.onEInputChange}
              autoFocus
              name={`newData_${this.state.data.length}`}
              onPressEnter={this.saveHierarchy}
              addonAfter={<Icon type='check' onClick={this.saveHierarchy}/>}
            />
          )
        }
      ]
    });
  };
  addNewChild = () => {
    const newData = this.state.data.slice();
    const key = this.state.selectedNode.key;
    const row = getObject(newData, key);

    if (row) {
      if (!row.children) row.children = [];
      row.children.push({
        key: `newData_${row.key}_${row.children.length}`,
        parent: key,
        objClass: "structuralSubdivisionList",
        title: (
          <Input
            onChange={this.onEInputChange}
            autoFocus
            name={`newData_${row.key}_${row.children.length}`}
            onPressEnter={this.saveHierarchy}
            addonAfter={<Icon type='check' onClick={this.saveHierarchy}/>}
          />
        )
      });
    }

    this.setState({
      data: newData,
      openCard: false,
      expandedKeys: uniq([...this.state.expandedKeys, key])
    });
  };
  addNewCase = newData => {
    const key = this.state.selectedNode.key;
    this.setState({
      data: newData,
      openCard: false,
      expandedKeys: uniq([...this.state.expandedKeys, key])
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys
    })
  };
  onSelect = (selectedKeys, info) => {
    this.setState({selectedNode: info.node.props.dataRef});
  };
  saveHierarchy = () => {
    const newData = this.state.data.slice();
    const [key, value] = [this.state.e.name, this.state.e.value];
    const target = getObject(newData, key);

    if (target) {
      const {parent, objClass} = target;
      const name = {};
      SYSTEM_LANG_ARRAY.forEach(lang => {
        name[lang] = value;
      });
      const cube = {
        cubeSConst: "CubeForAF_Inv",
        doConst: "doForInv",
        dpConst: "dpForInv"
      };
      const obj = {
        name,
        fullName: name,
        clsConst: objClass,
        parent: parent.split("_")[1]
      };
      const hideCreateObj = message.loading(this.props.t("CREATING_NEW_OBJECT"), 100);
      createObj(cube, obj)
        .then(res => {
          hideCreateObj();
          if (res.success) {
            target.key = res.data.idItemDO;
            message.success(this.props.t("OBJECT_CREATED_SUCCESSFULLY"));
            target.title = (
              <span>
                {value}
                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                  const fd = new FormData();
                  fd.append("cubeSConst", CUBE_FOR_AF_INV);
                  fd.append("dimObjConst", DO_FOR_INV);
                  fd.append("objId", res.data.idItemDO.split('_')[1]);
                  const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                  dObj(fd)
                    .then(resp => {
                      hideLoading();
                      if(resp.success) {
                        message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                        this.remove(res.data.idItemDO)
                      } else {
                        throw resp
                      }
                    }).catch(err => {
                    console.error(err);
                    message.error(this.props.t('REMOVING_ERROR'))
                  })
                }}>
                  <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                </Popconfirm>
              </span>);
            this.setState({data: newData});
          }
        })
        .catch(err => {
          hideCreateObj();
          console.error(err);
        });
    }
    this.setState({ e: { value: '', name: '' } })
  };
  renderTreeNodes = data => {
    return data.map(item => {
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

  saveCase = ({objData, props}) => {
    const name = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = objData.caseTitle
    });
    const cube = {
      cubeSConst: CUBE_FOR_AF_CASE,
      doConst: DO_FOR_CASE,
      dpConst: DP_FOR_CASE
    };
    const obj = {
      name,
      fullName: name,
      clsConst: 'caseList',
    };
    const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
    return createObj(cube, obj)
      .then(async res => {
        hideCreateObj();
        if (res.success) {
          message.success(this.props.t('OBJECT_CREATED_SUCCESSFULLY'));
          const filters = {
            filterDOAnd: [
              {
                dimConst: DO_FOR_CASE,
                concatType: "and",
                conds: [
                  {
                    ids: res.data.idItemDO
                  }
                ]
              }
            ]
          };
          await this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters));
          return {success: true, data: res.data}
        }
      })
      .then(res => {
        obj.doItem = res.data.idItemDO;
        cube.data = this.props.CubeForAF_Case;
        return this.saveProps({cube, obj}, {values: props}, this.props.tofiConstants)
          .then(() => ({success: true, key: res.data.idItemDO}))
      })
      .then(res => {
        if (res.success) {
          const newData = this.state.data.slice();
          const target = getObject(newData, this.state.selectedNode.key);
          Object.assign(target,
            {
              caseKey: res.key,
              ...objData,
              ...props,
              title: (
                <span>
                  {target.caseTitle}
                  <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                    const fd = new FormData();
                    fd.append("cubeSConst", CUBE_FOR_AF_CASE);
                    fd.append("dimObjConst", DO_FOR_CASE);
                    fd.append("objId", res.key);
                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                    dObj(fd)
                      .then(resp => {
                        hideLoading();
                        if(resp.success) {
                          message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                          this.remove(target.key)
                        } else {
                          throw resp
                        }
                      }).catch(err => {
                      console.error(err);
                      message.error(this.props.t('REMOVING_ERROR'))
                    })
                  }}>
                      <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                    </Popconfirm>
                  </span>)
            });
          this.setState({
            data: newData
          })
        } else {
          throw res
        }
      })
      .catch(err => {
        hideCreateObj();
        console.error(err);
      })
  };
  saveCaseProps = ({cube, obj}, props, doItemProp, objData) => {
    obj.doItem = doItemProp;
    return this.saveProps({cube, obj}, {values: props}, this.props.tofiConstants, objData)
      .then(res => {
        if (res.success) {
          const newData = this.state.data.slice();
          const target = getObject(newData, this.state.selectedNode.key);
          Object.assign(target, {...props, caseTitle: objData.name && objData.name[this.lng]});
          this.setState({
            data: newData
          })
        } else { throw res }
      })
      .catch(err => { console.error(err); });
  }

  remove = key => {
    const newData = this.state.data.slice();
    removeObject(newData, key);
    this.setState({data: newData, selectedNode: {}});
  };

  loadOptions = c => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.props.getPropVal(c);
      }
    };
  };

  createNewObj = async ({cube, obj}, v) => {
    const hideCreateObj = message.loading(this.props.t("CREATING_NEW_OBJECT"), 100);
    try {
      const createdObj = await createObj(cube, obj);
      hideCreateObj();
      if (createdObj.success) {
        const filters = {
          filterDOAnd: [
            {
              dimConst: cube.doConst,
              concatType: "and",
              conds: [
                {
                  ids: createdObj.data.idItemDO
                }
              ]
            }
          ]
        };
        await this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters));
        obj.doItem = createdObj.data.idItemDO;
        const savedCubeData = await this.saveProps(
          {cube, obj},
          v,
          this.props.tofiConstants
        );
        if (savedCubeData.success) {
          const {doForInv, dpForInv} = this.props.tofiConstants;
          this.setState({
            loading: false,
            formData: {key: createdObj.data.idItemDO, name: obj.name[this.lng], ...v.values, ...v.oFiles},
            openPropsForm: false,
            lInv: parseCube_new(
              this.props.CubeForAF_Inv["cube"],
              [],
              "dp",
              "do",
              this.props.CubeForAF_Inv[`do_${doForInv.id}`],
              this.props.CubeForAF_Inv[`dp_${dpForInv.id}`],
              `do_${doForInv.id}`,
              `dp_${dpForInv.id}`
            )[0]
          });
        }
        return Promise.resolve();
      }
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };
  saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
    let hideLoading;
    try {
      if (!c.cube) c.cube = {
        cubeSConst: CUBE_FOR_AF_INV,
        doConst: DO_FOR_INV,
        dpConst: DP_FOR_INV,
      };
      if (!c.cube.data) c.cube.data = this.props.CubeForAF_Inv;
      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSave = await onSaveCubeData(c, v, t, objData);
      hideLoading();
      if (!resSave.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSave.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSave);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
      return resSave;
    }
    catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({loading: false});
      console.warn(e);
    }
  };

  componentDidMount() {
    if(this.props.location && this.props.location.state && this.props.location.state.fromTable) {
      const { data, ...rest } = this.props.location.state.fromTable;
      const newData = data.slice();
      this.setState({
        ...rest,
        data: newData,
        openPropsForm: false
      })
    }
  }

  render() {
    if (isEmpty(this.props.tofiConstants)) return null;
    const {openCard, openPropsForm, lInv, formData} = this.state;
    const {t, invTypeOptions, invCaseSystemOptions, documentTypeOptions, tofiConstants } = this.props;
    const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === 1);

    this.lng = localStorage.getItem("i18nextLng");
    return (
      <div className="LegalEntitiesInventoriesMain">
        <CSSTransition
          in={openPropsForm}
          timeout={300}
          classNames="card"
          unmountOnExit={false}
        >
          <div className="LegalEntitiesInventoriesMain__property">
            <LegalEntitiesInventoryProps
              tofiConstants={tofiConstants}
              lng={this.lng}
              user={this.props.user}
              createNewObj={this.createNewObj}
              saveProps={this.saveProps}
              t={t}
              initialValues={{
                accessLevel: {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
                ...formData
              }}
              getNomenOptions={() => {
                const fd = new FormData();
                fd.append(
                  "objId",
                  this.props.location.state.record.key.split("_")[1]
                );
                fd.append("propConst", "nomen");
                getObjFromProp(fd).then(res => {
                  if (res.success) {
                    this.setState({
                      nomenOptions:
                        res.data.length !== 0
                          ? res.data.map(option => ({
                            value: option.id,
                            label: option.name[this.lng]
                          }))
                          : []
                    });
                  }
                });
              }}
              record={
                this.props.location &&
                this.props.location.state &&
                this.props.location.state.record
              }
              nomenOptions={this.state.nomenOptions}
              invTypeOptions={invTypeOptions}
              documentTypeOptions={documentTypeOptions}
              invCaseSystemOptions={invCaseSystemOptions}
              loadOptions={this.loadOptions}
            />
          </div>
        </CSSTransition>
        <div className="LegalEntitiesInventoriesMain__table">
          <Button
            id="trigger"
            size="small"
            shape="circle"
            icon={openPropsForm ? "arrow-left" : "arrow-right"}
            onClick={() =>
              this.setState({openPropsForm: !this.state.openPropsForm})
            }
          />
          <div className="LegalEntitiesInventoriesMain__table__heading">
            <div className="table-header">
              <Button onClick={this.addNew} disabled={!lInv.id}>{t("ADD")}</Button>
              <Button
                onClick={() => this.addNewChild("structuralSubdivisionList")}
                disabled={this.state.selectedNode.objClass !== 'structuralSubdivisionList'}
              >
                {t("ADD_FIRST_LEVEL_CHILD")}
              </Button>
              <Button
                onClick={() => this.setState({ openCard: true })}
                disabled={this.state.selectedNode.objClass !== 'structuralSubdivisionList'}
              >
                {t("ADD_SECOND_LEVEL_CHILD")}
              </Button>
              {lInv.name && (
                <h3
                  style={{
                    textAlign: "right",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    paddingRight: "10px"
                  }}
                >
                  {lInv.name.kz}
                </h3>
              )}
            </div>
          </div>
          <div className="LegalEntitiesInventoriesMain__table__body">
            <div className="LegalEntitiesInventoriesMain__table__body-tree">
              <Tree
                expandedKeys={this.state.expandedKeys}
                onExpand={this.onExpand}
                autoExpandParent
                defaultExpandAll
                onSelect={this.onSelect}
                showLine
              >
                {this.renderTreeNodes(this.state.data)}
              </Tree>
            </div>
            <div className="LegalEntitiesInventoriesMain__table__body-form">
              {this.getRespForm(
                formData.invType && formData.invType.value,
                formData.documentType && formData.documentType.value
              )}
            </div>
            <CSSTransition
              in={openCard}
              timeout={300}
              classNames="card"
              unmountOnExit
            >
              <SiderCardLegalEntities_inv
                addNewCase={this.addNewCase}  //Maybe get the button out of the component? 🤔
                remove={this.remove}
                formData={this.state.formData}
                data={this.state.data}
                selectedNode={this.state.selectedNode}
                lInv={this.state.lInv}
                t={t}
                closer={
                  <Button
                    type="danger"
                    onClick={() => this.setState({ openCard: false })}
                    shape="circle"
                    icon="arrow-right"
                  />
                }
              />
            </CSSTransition>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
    CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],

    invTypeOptions: state.generalData.invType,
    invCaseSystemOptions: state.generalData.invCaseSystem,
    documentTypeOptions: state.generalData.documentType,
    typeOfPaperCarrierOptions: state.generalData.typeOfPaperCarrier,
    inaccurateDateFeatureOptions: state.generalData.inaccurateDateFeature,
    uprDocTypeOptions: state.generalData.uprDocType,
    lsDocTypeOptions: state.generalData.lsDocType,
    accessLevelOptions: state.generalData.accessLevel
  };
}

export default connect(
  mapStateToProps,
  {getPropVal, getCube}
)(LegalEntitiesInventoriesMain_new);
