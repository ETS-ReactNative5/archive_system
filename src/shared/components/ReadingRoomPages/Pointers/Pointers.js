import React from "react";
import AntTable from "../../AntTable";
import {isEmpty, isEqual} from "lodash";

import {DatePicker, Icon, Modal} from "antd";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DO_FOR_DOCS} from "../../../constants/tofiConstants";

const PointersInfoModal = ({
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
          {tofiConstants.vidUkaz.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            type="text"
            value={data.vidUkaz ? data.vidUkaz.label : ''}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.oblastUkaz.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            type="text"
            value={data.oblastUkaz ? data.oblastUkaz.label : ''}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.rubrikUkaz.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            type="text"
            value={data.rubrikUkaz ? data.rubrikUkaz.label : ''}
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
            type="text"
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
          <textarea
            value={data.goalSprav}
            disabled
            className="ant-input"
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

class Pointerss extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      errors: {},
      selectedPointers: null,
      selectedRow: null,
      showCases: false,
      modalShow: false,
    };
  }

  componentDidMount() {
    if(!this.state.data.length && this.props.csClassificationShem_Pointers) {
      this.populate();
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.csClassificationShem_Pointers !== this.props.csClassificationShem_Pointers) {
      this.populate();
    }
  }
  populate = () => {
    if(isEmpty(this.props.tofiConstants)) return;
    const { doForSchemClas, dpForSchemClas } = this.props.tofiConstants;
    this.parsedCube = parseCube_new(
      this.props.csClassificationShem_Pointers['cube'],
      [],
      'dp',
      'do',
      this.props.csClassificationShem_Pointers[`do_${doForSchemClas.id}`],
      this.props.csClassificationShem_Pointers[`dp_${dpForSchemClas.id}`],
      `do_${doForSchemClas.id}`,
      `dp_${dpForSchemClas.id}`
    );
    this.setState({
      data: this.parsedCube
        .filter(o => !parseFloat(o.parent)) // get first level objects only (parent equals to "0")
        .map(this.initChildren) });
  };
  initChildren = el => {
    const constArr = ['vidUkaz','oblastUkaz','rubrikUkaz','theme','goalSprav','method','lastChangeDateScheme'];
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

  onPointersSelect = rec => {
    if(isEqual(rec, this.state.selectedRow)) return;
    if (!rec.children) {
      const caseFilters = {
        filterDOAnd: [{
          dimConst: DO_FOR_CASE,
          concatType: "and",
          conds: [{
            data: {
              valueRef: {
                id: rec.key
              }
            }
          }]
        }]
      };
      const docFilters = {
        filterDOAnd: [{
          dimConst: DO_FOR_DOCS,
          concatType: "and",
          conds: [{
            data: {
              valueRef: {
                id: rec.key
              }
            }
          }]
        }]
      };
      this.props.changeSelectedRowChild({type: 'pointers', rec}, [CUBE_FOR_AF_CASE, JSON.stringify(caseFilters)]);
      this.props.changeSelectedRowChild({type: ''}, ['cubeDocuments', JSON.stringify(docFilters)]);
    }
    this.setState({ selectedRow: rec });
  };
  
  showPointersInfo = () => {
    if (this.state.selectedRow) {
      this.setState({
        modalShow: true
      });
    }
  };

  hidePointersInfo = () => {
    this.setState({
      modalShow: false
    });
  };

  render() {
    const { data, modalShow, selectedRow } = this.state;
    
    this.lng = localStorage.getItem("i18nextLng");
    const { t} = this.props;
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
                title: t("POINTERS"),
                dataIndex: "name",
                width: "100%",
                render: (obj, rec) => {
                  if(parseFloat(rec.parent) === 0) return (
                    <span>
                      {obj && obj[this.lng]}
                      <Icon type="question-circle" style={{color: '#009688', float: 'right', cursor: 'pointer'}} onClick={this.showPointersInfo}/>
                    </span>
                  );
                  return obj && obj[this.lng];
                }
              }
            ]}
            dataSource={data || []}
            changeSelectedRow={this.onPointersSelect}
          />
            {modalShow && (
              <PointersInfoModal
                modalShow={modalShow}
                data={selectedRow}
                onCancel={this.hidePointersInfo}
                tofiConstants={this.props.tofiConstants}
                lng={this.lng}
              />
            )}
        </div>
      </div>
    );
  }
}

export default Pointerss;
