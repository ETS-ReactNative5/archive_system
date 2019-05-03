  import React from "react";
import AntTable from "../../AntTable";
import {isEmpty, isEqual} from "lodash";

import {DatePicker, Icon, Modal} from "antd";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DO_FOR_DOCS} from "../../../constants/tofiConstants";

const CatalogInfoModal = ({
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
          {tofiConstants.vidKatalog.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            type="text"
            value={data.vidKatalog ? data.vidKatalog.label : ''}
            disabled
          />
        </div>
      </div>
      <div className="info-modal-row">
        <div className="info-modal-row-label">
          {tofiConstants.oblastKatalog.name[lng]}
        </div>
        <div className="info-modal-row-value">
          <input
            className="ant-input"
            type="text"
            value={data.oblastKatalog ? data.oblastKatalog.label: ''}
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

class Catalogs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      selectedCatalog: null,
      selectedRow: null,
      showCases: false,
      modalShow: false,
    };
  }

  componentDidMount() {
    if(!this.state.data.length && this.props.csClassificationShem_Catalogs) {
      this.populate();
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.csClassificationShem_Catalogs !== this.props.csClassificationShem_Catalogs) {
      this.populate();
    }
  }
  populate = () => {
    if(isEmpty(this.props.tofiConstants)) return;
    const { doForSchemClas, dpForSchemClas } = this.props.tofiConstants;
    this.parsedCube = parseCube_new(
      this.props.csClassificationShem_Catalogs['cube'],
      [],
      'dp',
      'do',
      this.props.csClassificationShem_Catalogs[`do_${doForSchemClas.id}`],
      this.props.csClassificationShem_Catalogs[`dp_${dpForSchemClas.id}`],
      `do_${doForSchemClas.id}`,
      `dp_${dpForSchemClas.id}`
    );
    this.setState({
      data: this.parsedCube
        .filter(o => !parseFloat(o.parent)) // get first level objects only (parent equals to "0")
        .map(this.initChildren) });
  };
  initChildren = el => {
    const constArr = ['vidKatalog','oblastKatalog','theme','goalSprav','method','lastChangeDateScheme'];
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

  onCatalogSelect = rec => {
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
      this.props.changeSelectedRowChild({type: 'catalogs', rec}, [CUBE_FOR_AF_CASE, JSON.stringify(caseFilters)]);
      this.props.changeSelectedRowChild({type: ''}, ['cubeDocuments', JSON.stringify(docFilters)]);
    }
    this.setState({ selectedRow: rec });
  };
  
  showCatalogInfo = () => {
    if (this.state.selectedRow) {
      this.setState({
        modalShow: true
      });
    }
  };

  hideCatalogInfo = () => {
    this.setState({
      modalShow: false
    });
  };

  render() {
    const { data, modalShow, selectedRow } = this.state;
    this.lng = localStorage.getItem("i18nextLng");

    const { t } = this.props;
    return (
      <div className="Guides">
        <div className="Guides__body">
          <AntTable
            openedBy="ArchiveFundList"
            loading={this.props.loading}
            hidePagination={true}
            columns={[
              {
                key: "name",
                title: t("CATALOGS"),
                dataIndex: "name",
                width: "100%",
                render: (obj, rec) => {
                  if(parseFloat(rec.parent) === 0) return (
                    <span>
                      {obj && obj[this.lng]}
                      <Icon type="question-circle" style={{color: '#009990', float: 'right', cursor: 'pointer'}} onClick={this.showCatalogInfo}/>
                    </span>
                  );
                  return obj && obj[this.lng];
                }
              }
            ]}
            dataSource={data || []}
            changeSelectedRow={this.onCatalogSelect}
          />
          {modalShow && (
            <CatalogInfoModal
              modalShow={modalShow}
              data={selectedRow}
              onCancel={this.hideCatalogInfo}
              tofiConstants={this.props.tofiConstants}
              lng={this.lng}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Catalogs;
