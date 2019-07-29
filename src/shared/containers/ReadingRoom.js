import React from "react";
import {Button, Input, Select as AntSelect} from "antd";
import { connect } from "react-redux";
import { ReadingRoom as RR } from '../utils/axios_config';

import AntTabs from "../components/AntTabs";
import { Guides } from "../components/ReadingRoomPages/Guides";
import { Catalogs } from "../components/ReadingRoomPages/Catalogs";
import { Pointers } from "../components/ReadingRoomPages/Pointers";
import { Overviews } from "../components/ReadingRoomPages/Overviews";
import { isEmpty } from "lodash";
import {getCube} from "../actions/actions";
import {CSSTransition} from "react-transition-group";
import FundsInGuide from "../components/ReadingRoomPages/Guides/FundsInGuide";
import InventoriesInFund from "../components/ReadingRoomPages/Guides/InventoriesInFund";
import CasesInInventory from "../components/ReadingRoomPages/Guides/CasesInInventory";
import StorageUnits from "../components/ReadingRoomPages/Catalogs/StorageUnits";
import Documents from "../components/ReadingRoomPages/Catalogs/Documents";
import AntModal from "../components/AntModal";
import GlobalSearch from "../components/ReadingRoomPages/globalSearch/GlobalSearch";

const Search = Input.Search;

class ReadingRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searchType: 'searchFund',
      openCard: true,
      openModal: false,
      loading: false,
      loadingTable: false,
      activePart: '',
      selectedGuide: null,
      selectedFund: null,
      selectedInventory: null
    };
  }

  // Заполняет правую часть интерфейса: фондами (case = 'guides'), описями (case='funds'), делами (case='inventories') и т.д.
  changeSelectedRowChild = async ({type, rec}, getCubeSpreadIt) => {
    try {
      switch (type) {
        case 'guides':
          this.setState({ activePart: 'funds', selectedGuide: rec });
          break;
        case 'funds':
          this.setState({ activePart: 'inventories', selectedFund: rec });
          break;
        case 'inventories':
          this.setState({ activePart: 'cases', selectedInventory: rec });
          break;
        case 'catalogs':
          this.setState({ activePart: 'catalogs' });
          break;
        case 'pointers':
          this.setState({ activePart: 'pointers' });
          break;
        case 'overviews':
          this.setState({ activePart: 'overviews' });
          break;
        default: break;
      }
      if(
        this.state.selectedGuide && this.state.selectedGuide.key === rec.key ||
        this.state.selectedFund && this.state.selectedFund.key === rec.key
      ) return;
      this.setState({ loadingTable: true });
      await this.props.getCube(...getCubeSpreadIt);
      this.setState({ loadingTable: false });
    } catch(e) {
      console.error(e);
    }
  };

  getRespTable = () => {
    const {activePart, selectedGuide, selectedFund, selectedInventory, loadingTable} = this.state;
    switch (activePart) {
      case 'funds':
        return (
          <FundsInGuide
            loadingTable={loadingTable}
            changeSelectedRowChild={this.changeSelectedRowChild}
            initialValues={this.props.initialValues}
            t={this.props.t}
          />
        );
      case 'inventories':
        return (
          <InventoriesInFund
            selectedGuide={selectedGuide}
            selectedFund={selectedFund}
            loadingTable={loadingTable}
            changeSelectedRowChild={this.changeSelectedRowChild}
            t={this.props.t}
          />
        );
      case 'cases':
        return (
          <CasesInInventory
            selectedGuide={selectedGuide}
            selectedFund={selectedFund}
            selectedInventory={selectedInventory}
            loadingTable={loadingTable}
            changeSelectedRowChild={this.changeSelectedRowChild}
            t={this.props.t}
          />
        );
      case 'pointers':
      case 'catalogs':
      case 'overviews':
        return (
          <AntTabs
            tabs={[
              {
                tabName: this.props.t('STORAGEUNIT'),
                tabKey: 'requests',
                tabContent: <StorageUnits
                  loadingTable={loadingTable}
                  t={this.props.t}
                />
              },
              {
                tabName: this.props.t('DOCUMENTS'),
                tabKey: 'reports',
                tabContent: <Documents
                  loadingTable={loadingTable}
                  t={this.props.t}
                />
              }
            ]}
          />
        );
      default:
        return <h4>{this.props.t('HELP')}</h4>;
    }
  };

  searchUpdate = e => {
    this.setState({ search: e.target.value });
  };
  handleTabChange = key => {
    switch (key) {
      case 'catalogs':
        this.getCubeAct('clsKatalog,nodeKatalog', 'csClassificationShem_Catalogs');
        break;
      case 'pointers':
        this.getCubeAct('clsUkaz,nodeUkaz', 'csClassificationShem_Pointers');
        break;
      case 'overviews':
        this.getCubeAct('clsObzor,nodeObzor', 'csClassificationShem_Overviews');
        break;
      default: break;
    }
  };
  handleSearchTypeChange = searchType => {
    this.setState({ searchType })
  }
  selectBefore = () => (
    <AntSelect value={this.state.searchType} onChange={this.handleSearchTypeChange} style={{ width: 80 }}>
      <AntSelect.Option value="searchFund">{this.props.t('FUNDS')}</AntSelect.Option>
      <AntSelect.Option value="searchInventory">{this.props.t('INVENTORIES')}</AntSelect.Option>
      <AntSelect.Option value="searchCase">{this.props.t('CASES')}</AntSelect.Option>
      <AntSelect.Option value="searchDocument">{this.props.t('DOCUMENTS')}</AntSelect.Option>
    </AntSelect>
  );

  componentDidMount() {
    this.getCubeAct('clsPutev,nodeGuidebook', 'csClassificationShem_Guides');
  }
  getCubeAct = async (cls, customKey) => {
    try {
      if(isEmpty(this.props[customKey])) {
        this.setState({ loading: true });
        await this.props.getCube('csClassificationShem', JSON.stringify(this.getFilter(cls)), { customKey });
        this.setState({ loading: false });
      }
    } catch (e) {
      console.warn(e);
    }
  };
  getFilter = clss => ({
    filterDOAnd: [
      {
        dimConst: 'doForSchemClas',
        concatType: "and",
        conds: [
          {
            clss
          }
        ]
      }
    ]
  });

  onSearch = () => {
    this.setState({ openModal: true });
    RR.globalSearch(this.state.searchType, this.state.search)
      .then(res => console.log(res))
      .catch(err => {
        this.setState({ openModal: true });
        console.warn(err)
      })
  };

  render() {
    const { search, openCard, openModal } = this.state;
    const { t, csClassificationShem_Guides, csClassificationShem_Catalogs,
      csClassificationShem_Pointers, csClassificationShem_Overviews } = this.props;
    return (
      <div className="readingRoom">
        <div className="title">
          <h2>{t("READING_ROOM")}</h2>
          <div className="readingRoom__globalSearch">
            <Search onChange={this.searchUpdate} addonBefore={this.selectBefore()} onSearch={this.onSearch}/>
          </div>
        </div>
        <div className="readingRoom__content">
          <CSSTransition
            in={openCard}
            timeout={300}
            classNames="card"
            unmountOnExit={false}
          >
            <div className="readingRoom__content_card">
              <AntTabs
              onChange={this.handleTabChange}
              tabs={[
                {
                  tabKey: "guides",
                  tabName: t("GUIDES"),
                  tabContent: (
                    <Guides
                      csClassificationShem_Guides={csClassificationShem_Guides}
                      changeSelectedRowChild={this.changeSelectedRowChild}
                      search={search}
                      t={t}
                      tofiConstants={this.props.tofiConstants}
                      loading={this.state.loading}
                    />
                  )
                },
                {
                  tabKey: "catalogs",
                  tabName: t("CATALOGS"),
                  tabContent: (
                    <Catalogs
                      csClassificationShem_Catalogs={csClassificationShem_Catalogs}
                      changeSelectedRowChild={this.changeSelectedRowChild}
                      search={search}
                      t={t}
                      tofiConstants={this.props.tofiConstants}
                      loading={this.state.loading}
                    />
                  )
                },
                {
                  tabKey: "pointers",
                  tabName: t("POINTERS"),
                  tabContent: (
                    <Pointers
                      csClassificationShem_Pointers={csClassificationShem_Pointers}
                      changeSelectedRowChild={this.changeSelectedRowChild}
                      search={search}
                      t={t}
                      tofiConstants={this.props.tofiConstants}
                      loading={this.state.loading}
                    />
                  )
                },
                {
                  tabKey: "overviews",
                  tabName: t("OVERVIEWS"),
                  tabContent: (
                    <Overviews
                      csClassificationShem_Overviews={csClassificationShem_Overviews}
                      changeSelectedRowChild={this.changeSelectedRowChild}
                      search={search}
                      t={t}
                      tofiConstants={this.props.tofiConstants}
                      loading={this.state.loading}
                    />
                  )
                }
              ]}
            />
            </div>
          </CSSTransition>
          <div  className={openCard ? "readingRoom__content_table active": "readingRoom__content_table"}>

            <Button
              id="trigger"
              size="small"
              shape="circle"
              icon={openCard ? "arrow-left" : "arrow-right"}
              onClick={() =>
                this.setState({openCard: !this.state.openCard})
              }
            />
            {this.getRespTable()}
          </div>
        </div>
        <AntModal
          visible={openModal}
          footer={null}
          width={'80%'}
          title={t('GLOBAL_SEARCH')}
          onCancel={() => this.setState({ openModal: false })}
          maskClosable={false}
        >
          <GlobalSearch/>
        </AntModal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    csClassificationShem_Guides: state.cubes.csClassificationShem_Guides,
    csClassificationShem_Catalogs: state.cubes.csClassificationShem_Catalogs,
    csClassificationShem_Pointers: state.cubes.csClassificationShem_Pointers,
    csClassificationShem_Overviews: state.cubes.csClassificationShem_Overviews,
    tofiConstants: state.generalData.tofiConstants
  };
}

export default connect(mapStateToProps, { getCube })(ReadingRoom);
