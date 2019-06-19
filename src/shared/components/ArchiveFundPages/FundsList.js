import React, { Component } from "react";
import {
  Button,
  Icon,
  Input,
  Modal,
  message,
  Popconfirm,
  Cascader,
  Spin
} from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEmpty, isEqual, forEach, map } from "lodash";
import axios from "axios";
import moment from "moment/moment";

import AntTable from "../AntTable";
import {
  getCube,
  getFundCountData,
  getPropValWithChilds,
  getPropVal,
  createObj,
  updateCubeData,
  dObj,
  getObjListNew
} from "../../actions/actions";
import {
  getPropMeta,
  onSaveCubeData,
  parseCube_new,
  parseForTable
} from "../../utils/cubeParser";
import {
  CUBE_FOR_FUND_AND_IK,
  CUBE_FOR_WORKS,
  DO_FOR_FUND_AND_IK,
  DO_FOR_WORKS,
  DP_FOR_FUND_AND_IK,
  DT_FOR_FUND_AND_IK
} from "../../constants/tofiConstants";
import { Link } from "react-router-dom";
import Select from "../Select";
import SiderCard from "../SiderCard";
import { CSSTransition } from "react-transition-group";
import FundsListCard from "./FundsListCard";

const confirm = Modal.confirm;

/* eslint eqeqeq:0 */
class FundsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      iconLoading: false,
      data: [],
      selectedRow: {},
      siderCardChild: null,
      search: "",
      idFundLisrIk:"",
      idFundLisrKey:"",
      loading: true,
      errors: {},
      openCard: false,
      modal: {
        visible: false,
        type: "",
        loading: false
      },
      countData: {
        countFund: 0,
        countInv: 0,
        countDelo: 0,
        countDeloFile: 0
      },
      fundIndustryOptions: [],
      filter: {
        name: "",
        nameResearchers: "",
        fundList: "",
        fundNumber: "",
        fundIndex: "",
        fundDbeg: "",
        fundDend: "",
        fundIndustryObj: [],
        fundIndustryObjLoading: false,
        fundCategory: [],
        fundCategoryLoading: false,
        fundArchive: [],
        fundArchiveLoading: false,
        fundType: [],
        fundTypeLoading: false,
        fundFeature: [],
        fundFeatureLoading: false
      }
    };
  }

  getCubeAct = async ids => {
    const doKey = ids ? "ids" : "clss";
    const filters = {
      filterDPAnd: [
        {
          dimConst: DP_FOR_FUND_AND_IK,
          concatType: "and",
          conds: [
            {
              consts:
                "fundArchive,fundNumber,fundIndex,fundDbeg,fundDend,fundCategory,fundType,fundFeature,isActive,fundmakerOfIK"
            }
          ]
        }
      ],
      filterDOAnd: [
        {
          dimConst: DO_FOR_FUND_AND_IK,
          concatType: "and",
          conds: [
            {
              //Reducing amount of dimObj for developing purpose
              [doKey]:
                ids ||
                "fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP"
              //ids: '1008_23142,1008_23143,1008_23144'
            }
          ]
        }
      ],
      filterDTOr: [
        {
          dimConst: DT_FOR_FUND_AND_IK,
          concatType: "and",
          conds: [
            {
              ids:
                this.props.globalDate.startOf("year").format("YYYYMMDD") +
                this.props.globalDate.endOf("year").format("YYYYMMDD")
            }
          ]
        }
      ]
    };
    if (ids) delete filters.filterDPAnd;
    ids
      ? this.setState({ siderCardChild: <Spin /> })
      : this.setState({ loading: true });
    await this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters), {
      customKey: ids ? "singleCube" : CUBE_FOR_FUND_AND_IK
    });
    this.setState({ loading: false });
  };

  componentDidMount() {
    if (isEmpty(this.props.tofiConstants)) return;
    if (!!this.props.location.state){
      this.setState({
          idFundLisrIk:this.props.location.state.data,
          idFundLisrKey:this.props.location.state.key
      })
    }
    this.setState({
      filter: {
        ...this.state.filter,
        fundFeature: [
          {
            value: this.props.tofiConstants.included.id,
            label: this.props.tofiConstants.included.name[this.lng]
          }
        ]
      }
    });
    this.props.cubeForFundAndIK && this.populate();
    !this.props.cubeForFundAndIK && this.getCubeAct();
    getFundCountData().then(data => {
      this.setState({ countData: { ...data } });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fundIndustryOptions !== this.props.fundIndustryOptions) {
      this.setState({
        fundIndustryOptions: this.props.fundIndustryOptions
          ? this.props.fundIndustryOptions.map(o => ({
              value: o.id,
              label: o.name[this.lng],
              isLeaf: !o.hasChild
            }))
          : []
      });
    }
    if (prevProps.singleCube !== this.props.singleCube) {
      const { doForFundAndIK, dpForFundAndIK } = this.props.tofiConstants;
      const parsedCube = parseCube_new(
        this.props.singleCube["cube"],
        [],
        "dp",
        "do",
        this.props.singleCube[`do_${doForFundAndIK.id}`],
        this.props.singleCube[`dp_${dpForFundAndIK.id}`],
        `do_${doForFundAndIK.id}`,
        `dp_${dpForFundAndIK.id}`
      ).map(this.renderTableData);
      this.setState({
        siderCardChild: (
          <FundsListCard
            t={this.props.t}
            tofiConstants={this.props.tofiConstants}
            initialValues={parsedCube[0]}
            onCreateObj={this.onCreateObj}
          />
        )
      });
    }

    if (
      !isEmpty(this.props.cubeForFundAndIK) &&
      !isEmpty(this.props.tofiConstants) &&
      this.props.cubeForFundAndIK !== prevProps.cubeForFundAndIK
    ) {
      this.populate();
    }
  }

  populate = () => {
    const { doForFundAndIK, dpForFundAndIK } = this.props.tofiConstants;
    this.setState({
      loading: false,
      data: parseCube_new(
        this.props.cubeForFundAndIK["cube"],
        [],
        "dp",
        "do",
        this.props.cubeForFundAndIK[`do_${doForFundAndIK.id}`],
        this.props.cubeForFundAndIK[`dp_${dpForFundAndIK.id}`],
        `do_${doForFundAndIK.id}`,
        `dp_${dpForFundAndIK.id}`
      )
    });
  };

  loadChilds = (c, props) => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          filter: { ...this.state.filter, [c + "Loading"]: true }
        });
        this.props
          .getPropValWithChilds(c, props)
          .then(() =>
            this.setState({
              filter: {
                ...this.state.filter,
                [c + "Loading"]: false
              }
            })
          )
          .catch(err => console.error(err));
      }
    };
  };
  loadOptions = c => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          filter: { ...this.state.filter, [c + "Loading"]: true }
        });
        this.props.getPropVal(c).then(() =>
          this.setState({
            filter: {
              ...this.state.filter,
              [c + "Loading"]: false
            }
          })
        );
      }
    };
  };

  onCreateObj = async (
    { fundType, shortName, name, accessLevel, ...values },
    id,
    objData
  ) => {
    let hideLoading;
    try {
      const cube = {
        cubeSConst: CUBE_FOR_FUND_AND_IK,
        doConst: DO_FOR_FUND_AND_IK,
        dpConst: DP_FOR_FUND_AND_IK,
        data: this.props.singleCube
      };
      const obj = {
        name: shortName,
        fullName: name,
        clsConst: fundType && fundType.fundTypeClass,
        accessLevel,
          doItem: id

      };

      // если создается новый фонд (нет id)
      if (!id) {
        const hideCreateObj = message.loading(
          this.props.t("CREATING_NEW_OBJECT"),
          40
        );
        await createObj(cube, obj).then(res => {
          hideCreateObj();
          if (res.success) {
            obj.doItem = res.data.idItemDO;
            this.newObj = res.data.idItemDO;
          } else {
            res.errors.forEach(err => {
              message.error(err.text);
            });
            throw res;
          }
        });
      }
      // если куб singleCube пустой, то делаем запрос к кубу фондов и источников комплектования для получения всех свойств в кубе
      if (!cube.data) {
        await this.getCubeAct(obj.doItem);
        cube.data = this.props.singleCube;
      }
      hideLoading = message.loading(this.props.t("UPDATING_PROPS"), 40);
      const res = await onSaveCubeData(
        {
          cube,
          obj
        },
        { values },
        this.props.tofiConstants,
        objData
      );
      hideLoading();
      if (res.success) {
        message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));
        this.setState({ loading: true });
        await this.getCubeAct();
        this.setState({ loading: false, openCard: false });
        return { success: true };
      } else {
        message.error(this.props.t("PROPS_UPDATING_ERROR"));
        res.errors.forEach(err => {
          message.error(err.text);
        });
      }
    } catch (err) {
      typeof hideLoading === "function" && hideLoading();
      this.setState({ loading: false });
      console.warn(err);
      message.error(this.props.t("PROPS_UPDATING_ERROR"));
    }
  };

  onInputChange = e => {
    console.log(e.target);
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    });
  };
  emitEmpty = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.dataset.name]: ""
      }
    });
  };

  onFundCategoryChange = s => {
    this.setState({ filter: { ...this.state.filter, fundCategory: s } });
  };
  onFundArchiveChange = s => {
    this.setState({ filter: { ...this.state.filter, fundArchive: s } });
  };
  onFundTypeChange = s => {
    this.setState({ filter: { ...this.state.filter, fundType: s } });
  };
  onFundFeatureChange = s => {
    this.setState({ filter: { ...this.state.filter, fundFeature: s } });
  };
  onFundIndustryObjChange = (v, selOpts) => {
    /*const getLastChildren = (dataArr, itemArr) => {
         const result = [];
         itemArr.forEach(it => {
         if(it.hasChild) {
         result.push(it);
         result.push(...getLastChildren(dataArr, getChildren(dataArr, it)))
         } else {
         result.push(it);
         }
         });
         return result;
         };
         const getChildren = (dataArr, item) => {
         if(item.hasChild) return dataArr.filter(o => o.parent == item.value)
         };
         this.setState({filter: {...this.state.filter, fundIndustryObj: s, fundIndustryObjChildren: getLastChildren(this.props.fundIndustryOptions, s)}})*/
    // this.setState({ filter: {...this.state.filter, fundIndustryObj: s} })
    this.setState(state => ({
      filter: { ...state.filter, fundIndustryObj: selOpts }
    }));
  };

  remove = id => {
    const newData = this.state.data.filter(item => item.id !== id);
    this.setState({ data: newData });
  };

  changeSelectedRow = async rec => {
    this.newObjIdx = -1;
    this.newObj = undefined;
    if (
      isEmpty(this.state.selectedRow) ||
      !isEqual(this.state.selectedRow, rec)
    ) {
      this.state.openCard && this.getCubeAct(rec.key);
      this.setState({ selectedRow: rec });
    } else {
      this.getCubeAct(rec.key);
      this.setState({ openCard: true, siderCardChild: <Spin /> });
    }
  };

  getFilteredFundsInfo = ids => {
    this.setState({
      iconLoading: true
    });
    var FundsIdFiltered = this.filteredData
      .map(e => e.key.split("_")[1])
      .join(",");
    var fundsList = new FormData();
    fundsList.append("fundsList", FundsIdFiltered);
    axios
      .post(
        `/${localStorage.getItem("i18nextLng")}/entity/getFilteredFundsInfo`,
        fundsList
      )
      .then(response => {
        var data = response.data.data;
        this.setState({
          countData: {
            countInv: data.cntInv,
            countDelo: data.cntCase,
            countDeloFile: data.cntCaseWithFile
          },
          iconLoading: false
        });
      });
  };

  renderTableFooter = () => {
    const {
      countFund,
      countInv,
      countDelo,
      countDeloFile
    } = this.state.countData;
    const { t } = this.props;
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label">
            <label htmlFor="">{t("COUNT_FUNDS")}</label>
            <Input
              size="small"
              type="text"
              readOnly
              value={this.filteredData.length}
            />
          </div>
          <div className="label">
            <label htmlFor="">{t("COUNT_INVENT")}</label>
            <Input size="small" type="text" readOnly value={countInv} />
          </div>
          <div className="label">
            <label htmlFor="">{t("COUNT_CASES")}</label>
            <Input size="small" type="text" readOnly value={countDelo} />
          </div>
          <div className="label">
            <label htmlFor="">{t("COUNT_CASES_WITH_ELECTR")}</label>
            <Input size="small" type="text" readOnly value={countDeloFile} />
          </div>
          <Button
            type="primary"
            icon="reload"
            loading={this.state.iconLoading}
            onClick={this.getFilteredFundsInfo}
          />
        </div>
        <div className="data-length">
          <div className="label">
            <label htmlFor="">{t("COUNT_ITOG")}</label>
            <Input
              size="small"
              type="text"
              readOnly
              value={this.filteredData.length + " / " + this.state.data.length}
            />
          </div>
        </div>
      </div>
    );
  };

  renderTableData = item => {
    const constArr = [
      "fundDbeg",
      "fundDend",
      "fundNumber",
      "fundIndex",
      "fundCategory",
      "fundFeature",
      "locationOfSupplementaryMaterials",
      "fundIndustry",
      "fundmakerOfIK",
      "fundmakerMulti",
      "fundExitDate",
      "fundExitReason",
      "fundToGuidbook",
      "lastReceivedYear",
      "fundArchive",
      "fundFirstDocFlow",
      "fundDateOfLastCheck",
      "collectionCreateDate",
      "creationConds",
      "fundHistoricalNote",
      "caseStorageMulti",
      "rackMulti",
      "sectionMulti",
      "shelfMulti",
      "creationReason",
      "creationPrinciple",
      "collectionLocation",
      "fundAnnotationFile",
      "invFile",
      "accessDocument",
      "affiliation"
    ];

    const fundTypeObj = this.props.tofiConstants[
      [
        "fundOrg",
        "fundLP",
        "collectionOrg",
        "collectionLP",
        "jointOrg",
        "jointLP"
      ].find(c => this.props.tofiConstants[c].id == item.clsORtr)
    ];

    const accessLevelObj = this.props.accessLevelOptions.find(
      al => al.id === item.accessLevel
    );
    const result = {
      key: item.id,
      fundList: item.name ? item.name[this.lng] : "",
      shortName: item.name,
      name: item.fullName,
      accessLevel: accessLevelObj && {
        value: accessLevelObj.id,
        label: accessLevelObj.name[this.lng]
      },
      fundType: fundTypeObj
        ? {
            value: fundTypeObj.id,
            label: fundTypeObj.name[this.lng],
            fundTypeClass: fundTypeObj.constName
          }
        : null
    };

    this.withIdDPV = parseForTable(
      item.props,
      this.props.tofiConstants,
      result,
      constArr
    );
    return result;
  };

  render() {
    if (isEmpty(this.props.tofiConstants)) return null;
    const { loading, selectedRow, data, filter, siderCardChild } = this.state;
    const {
      t,
      tofiConstants,
      tofiConstants: {
        fundNumber,
        fundDbeg,
        fundDend,
        fundIndex,
        fundCategory,
        fundFeature,
        fundIndustry,
        fundArchive,
        affiliation
      }
    } = this.props;

    if (!!this.state.idFundLisrIk ){

        this.filteredData = data.map(this.renderTableData).filter(item => {

            return (
                (!filter.fundNumber ||!item.fundNumber ||item.fundNumber.value == filter.fundNumber) &&
                item.fundmakerOfIK&& String( item.fundmakerOfIK.value).toLowerCase().includes(String(this.props.location.state.data).toLowerCase()) &&
                (item.fundIndex ? item.fundIndex.value.toLowerCase().includes(filter.fundIndex.toLowerCase()) : filter.fundIndex === "") &&
                (!item.key|| item.key ? item.key.toLowerCase().includes(filter.nameResearchers.toLowerCase()) : filter.nameResearchers === "") &&
                item.fundList.toLowerCase().includes(filter.fundList.toLowerCase()) &&
                ( item.fundDbeg ? item.fundDbeg.value.toLowerCase().includes(filter.fundDbeg.toLowerCase()) : true) &&
                ( item.fundDend ? item.fundDend.value.toLowerCase().includes(filter.fundDend.toLowerCase()) : true) &&
                (filter.fundCategory.length === 0 || filter.fundCategory.some(p => item.fundCategory && p.value == item.fundCategory.value)) &&
                (filter.fundArchive.length === 0 || filter.fundArchive.some( p => item.fundArchive && p.value == item.fundArchive.value )) &&
                (filter.fundFeature.length === 0 ||filter.fundFeature.some(p => item.fundFeature && p.value == item.fundFeature.value)) &&
                (filter.fundType.length === 0 ||filter.fundType.some(p => item.fundType && p.value == item.fundType.value)) &&
                (filter.fundIndustryObj.length === 0 || filter.fundIndustryObj.some(p => p.value == item.fundIndustry.value))
            );
        });

    }
    if (!!this.state.idFundLisrKey ){

      this.filteredData = data.map(this.renderTableData).filter(item => {
        return (
            (!filter.fundNumber ||!item.fundNumber ||item.fundNumber.value == filter.fundNumber) &&
            item.fundmakerOfIK&& String( item.fundmakerOfIK.value).toLowerCase().includes(String(this.props.location.state.key).toLowerCase()) &&
            (item.fundIndex ? item.fundIndex.value.toLowerCase().includes(filter.fundIndex.toLowerCase()) : filter.fundIndex === "") &&
            (!item.key|| item.key ? item.key.toLowerCase().includes(filter.nameResearchers.toLowerCase()) : filter.nameResearchers === "") &&
            item.fundList.toLowerCase().includes(filter.fundList.toLowerCase()) &&
            ( item.fundDbeg ? item.fundDbeg.value.toLowerCase().includes(filter.fundDbeg.toLowerCase()) : true) &&
            ( item.fundDend ? item.fundDend.value.toLowerCase().includes(filter.fundDend.toLowerCase()) : true) &&
            (filter.fundCategory.length === 0 || filter.fundCategory.some(p => item.fundCategory && p.value == item.fundCategory.value)) &&
            (filter.fundArchive.length === 0 || filter.fundArchive.some( p => item.fundArchive && p.value == item.fundArchive.value )) &&
            (filter.fundFeature.length === 0 ||filter.fundFeature.some(p => item.fundFeature && p.value == item.fundFeature.value)) &&
            (filter.fundType.length === 0 ||filter.fundType.some(p => item.fundType && p.value == item.fundType.value)) &&
            (filter.fundIndustryObj.length === 0 || filter.fundIndustryObj.some(p => p.value == item.fundIndustry.value))
        );
      });

    }
    else {
        this.filteredData = data.map(this.renderTableData).filter(item => {
            return (
                (!filter.fundNumber ||!item.fundNumber ||item.fundNumber.value == filter.fundNumber) &&
                (item.fundIndex ? item.fundIndex.value.toLowerCase().includes(filter.fundIndex.toLowerCase()) : filter.fundIndex === "") &&
                (!item.key|| item.key ? item.key.toLowerCase().includes(filter.nameResearchers.toLowerCase()) : filter.nameResearchers === "") &&
                item.fundList.toLowerCase().includes(filter.fundList.toLowerCase()) &&
                ( item.fundDbeg ? item.fundDbeg.value.toLowerCase().includes(filter.fundDbeg.toLowerCase()) : true) &&
                ( item.fundDend ? item.fundDend.value.toLowerCase().includes(filter.fundDend.toLowerCase()) : true) &&
                (filter.fundCategory.length === 0 || filter.fundCategory.some(p => item.fundCategory && p.value == item.fundCategory.value)) &&
                (filter.fundArchive.length === 0 || filter.fundArchive.some( p => item.fundArchive && p.value == item.fundArchive.value )) &&
                (filter.fundFeature.length === 0 ||filter.fundFeature.some(p => item.fundFeature && p.value == item.fundFeature.value)) &&
                (filter.fundType.length === 0 ||filter.fundType.some(p => item.fundType && p.value == item.fundType.value)) &&
                (filter.fundIndustryObj.length === 0 || filter.fundIndustryObj.some(p => p.value == item.fundIndustry.value))
            );
        });

    }


    if (this.newObj) {
      this.newObjIdx = this.filteredData.findIndex(
        obj => obj.key === this.newObj
      );
    }
    this.lng = localStorage.getItem("i18nextLng");

    return (
      <div className="fundsList" ref={node => (this.fundList = node)}>
        <div className="fundsList__heading">
          <div className="fundsList__heading-buttons">
            <Button
              onClick={() => {
                const accessLevelObj = this.props.accessLevelOptions.find(
                  al => al.id === 1
                );
                this.setState({
                  openCard: true,
                  siderCardChild: (
                    <FundsListCard
                      t={this.props.t}
                      tofiConstants={this.props.tofiConstants}
                      initialValues={{
                        accessLevel: {
                          value: accessLevelObj.id,
                          label: accessLevelObj.name[this.lng]
                        },
                        fundFeature: {
                          value: this.props.tofiConstants.included.id,
                          label: this.props.tofiConstants.included.name[
                            this.lng
                          ]
                        }
                      }}
                      onCreateObj={this.onCreateObj}
                    />
                  )
                });
              }}
            >
              {t("ADD")}
            </Button>
            <Link
              to={{
                pathname: `/archiveFund/editFundCard/${selectedRow.key}`,
                state: {
                  fund: {
                    key: selectedRow.key,
                    name: selectedRow.name
                  },
                  title: t("INVENTORY")
                }
              }}
            >
              <Button disabled={isEmpty(selectedRow) || !selectedRow.key}>
                {t("VIEW_INVENTORIES")}
              </Button>
            </Link>
                    {/*<Button icon='printer'>{t('REPORTS')}</Button>*/}
          </div>
          <div className="label-select">
            <Select
              name="fundArchive"
              isMulti
              isSearchable={false}
              value={filter.fundArchive}
              onChange={this.onFundArchiveChange}
              isLoading={filter.fundArchiveLoading}
              options={
                this.props.fundArchiveOptions
                  ? this.props.fundArchiveOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              placeholder={fundArchive.name[this.lng]}
              onMenuOpen={this.loadOptions("fundArchive")}
            />
          </div>
          <div className="label-select">
            <Select
              name="fundCategory"
              isMulti
              isSearchable={false}
              value={filter.fundCategory}
              onChange={this.onFundCategoryChange}
              isLoading={filter.fundCategoryLoading}
              options={
                this.props.fundCategoryOptions
                  ? this.props.fundCategoryOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              placeholder={fundCategory.name[this.lng]}
              onMenuOpen={this.loadOptions("fundCategory")}
            />
          </div>
          <div className="label-select">
            <Select
              name="fundType"
              isMulti
              isSearchable={false}
              value={filter.fundType}
              onChange={this.onFundTypeChange}
              options={[
                "fundOrg",
                "fundLP",
                "collectionOrg",
                "collectionLP",
                "jointOrg",
                "jointLP"
              ].map(c => ({
                value: this.props.tofiConstants[c].id,
                label: this.props.tofiConstants[c].name[this.lng]
              }))}
              placeholder={t("FUND_TYPE")}
            />
          </div>
          <div className="label-select">
            <Select
              name="fundFeature"
              isMulti
              isSearchable={false}
              value={filter.fundFeature}
              onChange={this.onFundFeatureChange}
              isLoading={filter.fundFeatureLoading}
              options={
                this.props.fundFeatureOptions
                  ? this.props.fundFeatureOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              placeholder={fundFeature.name[this.lng]}
              onMenuOpen={this.loadOptions("fundFeature")}
            />
          </div>
          {/*  <div className="label-select">
                    <Cascader
                    name='fundIndustry'
                    displayRender={labels => labels.map(label => label.slice(0, 10) + '.../ ')}
                    options={this.state.fundIndustryOptions}
                    placeholder={fundIndustry.name[this.lng]}
                    changeOnSelect
                    onPopupVisibleChange={this.loadChilds('fundIndustry')}
                    loadData={selOpts => {
                        const target = selOpts[selOpts.length - 1];
                        target.loading = true;

                        const fd = new FormData();
                        fd.append("parent", String(target.value));
                        getObjListNew(fd)
                        .then(res => {
                            if (res.success) {
                                target.loading = false;
                                target.children = res.data.map(o => ({
                                    value: o.id,
                                    label: o.name[this.lng],
                                    isLeaf: !o.hasChild
                                }));

                                this.setState({fundIndustryOptions: [...this.state.fundIndustryOptions]})
                            }
                        })
                    }}
                    onChange={this.onFundIndustryObjChange}
                    />
                </div>*/}
        </div>
        <div className="fundsList__body">
          <AntTable
            key={this.state.data.length || "t"}
            columns={[
              {
                key: "fundNumber",
                title: t("FUND_NUMB"),
                dataIndex: "fundNumber",
                width: "8%",
                render: obj => obj && obj.value,
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="fundNumber"
                      suffix={
                        filter.fundNumber ? (
                          <Icon
                            type="close-circle"
                            data-name="fundNumber"
                            onClick={this.emitEmpty}
                          />
                        ) : null
                      }
                      ref={ele => (this.fundNumber = ele)}
                      placeholder="Поиск"
                      value={filter.fundNumber}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: (
                  <Icon
                    type="filter"
                    style={{ color: filter.fundNumber ? "#ff9800" : "#aaa" }}
                  />
                ),
                onFilterDropdownVisibleChange: visible => {
                  this.setState(
                    {
                      filterDropdownVisible: visible
                    },
                    () => this.fundNumber.focus()
                  );
                },
                sortBy: "ascend",
                sorter: (a, b) =>
                  a.fundNumber.value.replace(/[^0-9]/g, "") -
                  b.fundNumber.value.replace(/[^0-9]/g, "")
              },
              {
                key: "fundIndex",
                title: fundIndex.name[this.lng] || "",
                dataIndex: "fundIndex",
                width: "8%",
                render: obj => obj && obj.value,
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="fundIndex"
                      suffix={
                        filter.fundIndex ? (
                          <Icon
                            type="close-circle"
                            data-name="fundIndex"
                            onClick={this.emitEmpty}
                          />
                        ) : null
                      }
                      ref={ele => (this.fundIndex = ele)}
                      placeholder="Поиск"
                      value={filter.fundIndex}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: (
                  <Icon
                    type="filter"
                    style={{ color: filter.fundIndex ? "#ff9800" : "#aaa" }}
                  />
                ),
                onFilterDropdownVisibleChange: visible => {
                  this.setState(
                    {
                      filterDropdownVisible: visible
                    },
                    () => this.fundIndex.focus()
                  );
                }
              },
              {
                key: "fundList",
                title: t("FUND_NAME"),
                dataIndex: "fundList",
                width: "25%",
                sorter: (a, b) => b.fundList.localeCompare(a.fundList),
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="fundList"
                      suffix={
                        filter.fundList ? (
                          <Icon
                            type="close-circle"
                            data-name="fundList"
                            onClick={this.emitEmpty}
                          />
                        ) : null
                      }
                      ref={ele => (this.fundList = ele)}
                      placeholder="Поиск"
                      value={filter.fundList}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: (
                  <Icon
                    type="filter"
                    style={{ color: filter.fundList ? "#ff9800" : "#aaa" }}
                  />
                ),
                onFilterDropdownVisibleChange: visible => {
                  this.setState(
                    {
                      filterDropdownVisible: visible
                    },
                    () => this.fundList.focus()
                  );
                }
              },
              {
                key: "fundDbeg",
                title: fundDbeg.name[this.lng] || "",
                dataIndex: "fundDbeg",
                width: "10%",
                render: obj => obj && obj.value,
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="fundDbeg"
                      suffix={
                        filter.fundDbeg ? (
                          <Icon
                            type="close-circle"
                            data-name="fundDbeg"
                            onClick={this.emitEmpty}
                          />
                        ) : null
                      }
                      ref={ele => (this.fundDbeg = ele)}
                      placeholder="Поиск"
                      value={filter.fundDbeg}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: (
                  <Icon
                    type="filter"
                    style={{ color: filter.fundDbeg ? "#ff9800" : "#aaa" }}
                  />
                ),
                onFilterDropdownVisibleChange: visible => {
                  this.setState(
                    {
                      filterDropdownVisible: visible
                    },
                    () => this.fundDbeg.focus()
                  );
                }
              },
              {
                key: "fundDend",
                title: fundDend.name[this.lng] || "",
                dataIndex: "fundDend",
                width: "10%",
                render: obj => obj && obj.value,

                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="fundDend"
                      suffix={
                        filter.fundDend ? (
                          <Icon
                            type="close-circle"
                            data-name="fundDend"
                            onClick={this.emitEmpty}
                          />
                        ) : null
                      }
                      ref={ele => (this.fundDend = ele)}
                      placeholder="Поиск"
                      value={filter.fundDend}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: (
                  <Icon
                    type="filter"
                    style={{ color: filter.fundDend ? "#ff9800" : "#aaa" }}
                  />
                ),
                onFilterDropdownVisibleChange: visible => {
                  this.setState(
                    {
                      filterDropdownVisible: visible
                    },
                    () => this.fundDend.focus()
                  );
                }
              },
              {
                key: "fundCategory",
                title: fundCategory.name[this.lng] || "",
                dataIndex: "fundCategory",
                width: "10%",
                render: obj => obj && obj.label
              },
              {
                key: "fundType",
                title: t("FUND_TYPE"),
                dataIndex: "fundType",
                width: "13%",
                render: obj => obj && obj.label
              },
              {
                key: "action",
                title: "",
                dataIndex: "",
                width: "9%",
                render: (text, record) => {
                  return (
                    <div
                      className="editable-row-operations"
                      style={{ display: "flex" }}
                    >
                      <Button
                        icon="edit"
                        className="green-btn"
                        style={{ marginRight: "5px" }}
                        disabled={selectedRow.key !== record.key}
                      />
                      <Popconfirm
                        title={this.props.t("CONFIRM_REMOVE")}
                        onConfirm={() => {
                          const fd = new FormData();
                          fd.append("cubeSConst", CUBE_FOR_FUND_AND_IK);
                          fd.append("dimObjConst", DO_FOR_FUND_AND_IK);
                          fd.append("objId", record.key.split("_")[1]);
                          const hideLoading = message.loading(
                            this.props.t("REMOVING"),
                            30
                          );
                          dObj(fd)
                            .then(res => {
                              hideLoading();
                              if (res.success) {
                                message.success(
                                  this.props.t("SUCCESSFULLY_REMOVED")
                                );
                                this.setState({ loading: true });
                                this.remove(record.key);
                              } else {
                                throw res;
                              }
                            })
                            .then(() =>
                              this.setState({
                                loading: false,
                                openCard: false
                              })
                            )
                            .catch(err => {
                              console.log(err);
                              message.error(this.props.t("REMOVING_ERROR"));
                            });
                        }}
                      >
                        <Button
                          title="Удалить"
                          icon="delete"
                          onClick={e => e.stopPropagation()}
                          className="green-btn yellow-bg"
                          disabled={selectedRow.key !== record.key}
                        />
                      </Popconfirm>
                    </div>
                  );
                }
              }
            ]}
            scroll={{ y: "100%" }}
            loading={loading}
            openedBy="ArchiveFundList"
            changeSelectedRow={this.changeSelectedRow}
            dataSource={this.filteredData}
            footer={this.renderTableFooter}
            newObj={this.newObj}
            pagination={{
              pageSize: 20,
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent:
                this.newObjIdx &&
                ~this.newObjIdx &&
                Math.ceil(Number(this.newObjIdx) / 20)
            }}
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard
              closer={
                <Button
                  type="danger"
                  onClick={() => this.setState({ openCard: false })}
                  shape="circle"
                  icon="arrow-right"
                />
              }
            >
              {siderCardChild}
            </SiderCard>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

FundsList.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  tofiConstants: PropTypes.shape()
};

function mapStateToProps(state) {
  return {
    cubeForFundAndIK: state.cubes.cubeForFundAndIK,
    tofiConstants: state.generalData.tofiConstants,
    fundCategoryOptions: state.generalData.fundCategory,
    fundFeatureOptions: state.generalData.fundFeature,
    fundIndustryOptions: state.generalData.fundIndustry,
    accessLevelOptions: state.generalData.accessLevel,
    fundArchiveOptions: state.generalData.fundArchive,
    singleCube: state.cubes.singleCube
  };
}

export default connect(
  mapStateToProps,
  {
    getCube,
    getPropVal,
    getPropValWithChilds
  }
)(FundsList);
