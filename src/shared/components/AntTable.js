import { Table, LocaleProvider } from 'antd';
import ru from 'antd/lib/locale-provider/ru_RU'
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AntTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pagination: { pageSize: 20, showQuickJumper:true, showSizeChanger: true },
      loading: false,
      selectedKey: '',
      hideOnSinglePage: true
    };
  }

 /* componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp, false);
  }*/

  onSelect = record => {
    switch (this.props.openedBy) {
      case 'Funds':
      case 'Cases':
      case 'Inventories':
      case 'ArchiveFundList':
      case 'ArchiveFundInvList':
      case 'ArchiveFundCaseList':
      case 'Classifier':
      case 'LegalEntities':
      case 'CreateDocument':
      case 'Works':
      case 'Checking':
      case 'FundMaker':
      case 'Guides':
      case 'FMIndividuals':
      case 'ClassificationHierarchy':
        this.setState({ selectedKey: record.key });
        this.props.changeSelectedRow(record);
        break;
      default: return false;
    }
  };
  /*handleKeyUp = e => {
    const { selectedKey } = this.state;
    const { dataSource } = this.props;
    if(selectedKey) {
      const index = dataSource.findIndex(el => el.key === selectedKey);

      switch (e.keyCode) {
        case 38:
          if(index > 0) this.setState({ selectedKey: dataSource[index-1].key });
          break;
        case 40:
          if(index < dataSource.length-1) this.setState({ selectedKey: dataSource[index+1].key });
          break;
        case 13:
          this.props.nextState(selectedKey, this.props.openedBy);
          break;
        default: break;
      }
    }
  };*/

  render() {
    const { selectedKey } = this.state;
    return (
      <LocaleProvider locale={ru}>
        <Table
          scroll={{y: '100%'}}
          onRowClick={this.onSelect}
          pagination={!this.props.hidePagination && this.state.pagination}
          rowClassName={(record) => selectedKey === record.key || record.key === this.props.newObj ? 'row-selected' : ''}
          bordered
          {...this.props}
        />
      </LocaleProvider>
    );
  }
}

AntTable.propTypes = {
  nextState: PropTypes.func,
  newObj: PropTypes.string,
  openedBy: PropTypes.string,
  changeSelectedRow: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      width: PropTypes.string
    })
  ).isRequired,
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired
    })
  ),
  hidePagination: PropTypes.bool
};

export default AntTable;
