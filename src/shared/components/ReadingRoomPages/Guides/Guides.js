import React from "react";
import {Input, DatePicker, Icon, Modal} from "antd";
import {isEmpty, isEqual} from "lodash";

import AntTable from "../../AntTable";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {
  CUBE_FOR_FUND_AND_IK,
  DO_FOR_FUND_AND_IK,
  DP_FOR_FUND_AND_IK,
  DT_FOR_FUND_AND_IK
} from "../../../constants/tofiConstants";
import moment from "moment";

const GuideInfoModal = ({
  modalShow,
  width,
  data,
  onCancel,
  tofiConstants,
  lng
}) => (
  <Modal
    title={data.name[lng]}
    visible={modalShow}
    width={width}
    onCancel={onCancel}
    footer={null}
  >
    <div className="Guides__info-modal">
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.vidGuidebook.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            type="text"
            value={data.vidGuidebook ? data.vidGuidebook.label : ''}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.oblastPutev.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            value={data.oblastPutev ? data.oblastPutev.label : ''}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.rubrikPutev.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            value={data.rubrikPutev ? data.rubrikPutev.label : ''}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.theme.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            value={data.theme}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.goalSprav.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <Input.TextArea
            value={data.goalSprav}
            disabled
            autosize={{ minRows: 2 }}
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.lastChangeDateScheme.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <DatePicker value={data.lastChangeDateScheme} disabled/>
        </div>
      </div>
    </div>
  </Modal>
);

class Guides extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      errors: {},
      selectedRow: null,
      selectedGuide: null,
      selectedFund: null,
      selectedInventory: null,
      activePart: '',
      breadcurmbItems: [],
      modalShow: false
    };
  }

  componentDidMount() {
    if(!this.state.data.length && this.props.csClassificationShem_Guides) {
      this.populate();
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.csClassificationShem_Guides !== this.props.csClassificationShem_Guides) {
      this.populate();
    }
  }
  populate = () => {
    if(isEmpty(this.props.tofiConstants)) return;
    const { doForSchemClas, dpForSchemClas } = this.props.tofiConstants;
    this.parsedCube = parseCube_new(
      this.props.csClassificationShem_Guides['cube'],
      [],
      'dp',
      'do',
      this.props.csClassificationShem_Guides[`do_${doForSchemClas.id}`],
      this.props.csClassificationShem_Guides[`dp_${dpForSchemClas.id}`],
      `do_${doForSchemClas.id}`,
      `dp_${dpForSchemClas.id}`
    );
    this.setState({
      data: this.parsedCube
        .filter(o => !parseFloat(o.parent)) // get first level objects only (parent equals to "0")
        .map(this.initChildren) });
  };
  initChildren = el => {
    const constArr = ['vidGuidebook','oblastPutev','rubrikPutev','theme','goalSprav','method','lastChangeDateScheme'];
    const result = {
      key: el.id,
      parent: el.parent,
      name: el.name ? el.name : {kz: '', ru: '', en: ''},
    };
    parseForTable(el.props, this.props.tofiConstants, result, constArr);
    if(el.hasChild) {
      result.children = this.parsedCube
        .filter(elem => elem.parent == el.id)
        .map(this.initChildren);
    }
    return result
  };

  onGuideSelect = rec => {
    if(isEqual(rec, this.state.selectedRow)) return;
    if (!rec.children) {
      const filters = {
        filterDOAnd: [{
          dimConst: DO_FOR_FUND_AND_IK,
          concatType: "and",
          conds: [{
            data: {
              dimPropConst: 'dpForFundAndIK',
              propConst: 'fundToGuidbook',
              valueRef: { id: rec.key },
              condType: '='
            }
          }]
        }],
        filterDPAnd: [
          {
            dimConst: DP_FOR_FUND_AND_IK,
            concatType: "and",
            conds: [
              {
                consts: "fundDbeg,fundDend,fundNumber,fundIndex,fundCategory,fundNumberOfCases,fundArchive," +
                  "locationOfSupplementaryMaterials,accessDocument"
              }
            ]
          }
        ],
        filterDTOr: [{
          dimConst: DT_FOR_FUND_AND_IK,
          concatType: 'and',
          conds: [{
            ids: moment().startOf('year').format('YYYYMMDD') + moment().endOf('year').format('YYYYMMDD')
          }]
        }]
      };
      this.props.changeSelectedRowChild({type: 'guides', rec}, [CUBE_FOR_FUND_AND_IK, JSON.stringify(filters)]);
    }
    this.setState({ selectedRow: rec });
  };

  showGuideInfo = () => {
    this.setState({
      modalShow: true
    });
  };

  hideGuideInfo = () => {
    this.setState({
      modalShow: false
    });
  };

  render() {
    const {data, modalShow, selectedRow} = this.state;
    const { t } = this.props;
    this.lng = localStorage.getItem('i18nextLng');

    // const {fundNumber} = this.props.tofiConstants

    // this.filteredData = data.filter(item => {
    //   return (
    //     item.fundTitle.toLowerCase().includes(search.toLowerCase()) ||
    //     item.fundNumb.includes(search.toLowerCase()) ||
    //     item.fundAnnotation.toLowerCase().includes(search.toLowerCase()) ||
    //     item.deadline.toLowerCase().includes(search.toLowerCase()) ||
    //     item.amount.toLowerCase().includes(search.toLowerCase())
    //   )
    // });
    return (
      <div className="Guides">
        <div className="Guides__body">
          <AntTable

            openedBy="Guides"
            loading={this.props.loading}
            hidePagination={true}
            columns={[
              {
                key: "name",
                title: t("GUIDE"),
                dataIndex: "name",
                width: "100%",
                render: (obj, rec) => {
                  if(parseFloat(rec.parent) === 0) return (
                    <span>
                      {obj && obj[this.lng]}
                      <Icon type="question-circle" style={{color: '#009688', float: 'right', cursor: 'pointer'}} onClick={this.showGuideInfo}/>
                    </span>
                  );
                  return obj && obj[this.lng];
                }
              }
            ]}
            dataSource={data || []}
            changeSelectedRow={this.onGuideSelect}
          />
          {modalShow && (
            <GuideInfoModal
              modalShow={modalShow}
              data={selectedRow}
              onCancel={this.hideGuideInfo}
              tofiConstants={this.props.tofiConstants}
              lng={this.lng}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Guides;
