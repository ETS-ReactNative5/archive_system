import React from 'react';
import {connect} from 'react-redux';
import Select from '../../Select';
import AntTable from '../../AntTable';
import {Checkbox, DatePicker} from 'antd';
import moment from 'moment';
import {getPropVal} from '../../../actions/actions';

class Schedule extends React.PureComponent {

  state = {
    data: [
      {
        numb: '1',
        key: '1',
        sourcing: 'Учреждение 1',
        invNumb: '2',
        dbeg: '1997',
        dend: '2004',
        caseQuantity: '105',
        "1-quarter": true,
        "2-quarter": false,
        "3-quarter": false,
        "4-quarter": false
      },
      {
        numb: '2',
        key: '2',
        sourcing: 'Учреждение 2',
        invNumb: '3',
        dbeg: '1997',
        dend: '2004',
        caseQuantity: '105',
        "1-quarter": false,
        "2-quarter": true,
        "3-quarter": false,
        "4-quarter": false
      },
      {
        numb: '3',
        key: '3',
        sourcing: 'Учреждение 3',
        invNumb: '5',
        dbeg: '1997',
        dend: '2004',
        caseQuantity: '105',
        "1-quarter": false,
        "2-quarter": false,
        "3-quarter": true,
        "4-quarter": false
      },
      {
        numb: '4',
        key: '4',
        sourcing: 'Учреждение 4',
        invNumb: '6',
        dbeg: '1997',
        dend: '2004',
        caseQuantity: '105',
        "1-quarter": false,
        "2-quarter": false,
        "3-quarter": false,
        "4-quarter": true
      }
    ],
    filter: {
      quarters: [],
      sourcing: []
    }
  };

  /*loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({filter: {...this.state.filter, [c+'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({filter: {...this.state.filter, [c+'Loading']: false}}));
      }
    }
  };*/

  onQuartersChange = s => {this.setState({filter: {...this.state.filter, quarters: s}})};
  onSourcingChange = s => {this.setState({filter: {...this.state.filter, sourcing: s}})};

  renderTableHeader = () => {
    const { t } = this.props;
    const { filter } = this.state;
    return (
      <div className="table-header">
        {/*<div className="label-select">
          <SelectVirt
            name="IKArchive"
            isMulti
            isSearchable
            optionHeight={45}
            className="long-selected-menu"
            isLoading={filter.orgLocationLoading}
            onMenuOpen={this.loadOptions(IK_ARCHIVE)}
            value={filter.IKArchive}
            onChange={this.onOrgLocationChange}
            options={orgLocationOptions ? orgLocationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            placeholder={IKArchive.name[this.lng]}
          />
        </div>*/}
        <div className="label-select">
          <Select
            name="quarters"
            isMulti
            isSearchable={false}
            value={filter.quarters}
            onChange={this.onQuartersChange}
            menuStyle={{minWidth: 200}}
            menuContainerStyle={{minWidth: 202}}
            options={[
              {
                value: '1-quarter',
                label: '1-квартал'
              },
              {
                value: '2-quarter',
                label: '2-квартал'
              },
              {
                value: '3-quarter',
                label: '3-квартал'
              },
              {
                value: '4-quarter',
                label: '4-квартал'
              }
            ]}
            placeholder={t('QUARTERS')}
          />
        </div>
        <div className="label-select">
          <Select
            name="sourcing"
            isMulti
            isSearchable={false}
            value={filter.sourcing}
            onChange={this.onSourcingChange}
            menuStyle={{minWidth: 200}}
            menuContainerStyle={{minWidth: 202}}
            options={[
              {
                value: '1',
                label: 'Учреждение 1'
              },
              {
                value: '2',
                label: 'Учреждение 2'
              },
              {
                value: '3',
                label: 'Учреждение 3'
              },
              {
                value: '4',
                label: 'Учреждение 4'
              }
            ]}
            placeholder={t('SOURCING')}
          />
        </div>
      </div>
    )
  };

  render() {
    const { t } = this.props;
    const { data, filter } = this.state;
    this.filteredData = data.filter(item => {
      return (
        ( filter.quarters.length === 0  || filter.quarters.some(p => item[p.value]) ) &&
        ( filter.sourcing.length === 0  || filter.sourcing.some(p => p.label == item.sourcing) ) //eslint-disable-line eqeqeq
      )
    });
    return (
      <div className="Schedule">
        <div className="title">
          <h2>График приема архивных документов</h2>
          <DatePicker defaultValue={moment()} />
        </div>
        <AntTable
          loading={false}
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '5%'
            },
            {
              key: 'sourcing',
              title: t('SOURCING'),
              dataIndex: 'sourcing',
              width: '15%'
            },
            {
              key: 'invNumb',
              title: t('INV_NUMB'),
              dataIndex: 'invNumb',
              width: '10%'
            },
            {
              key: 'dbeg',
              title: t('DBEG'),
              dataIndex: 'dbeg',
              width: '10%'
            },
            {
              key: 'dend',
              title: t('DEND'),
              dataIndex: 'dend',
              width: '10%'
            },
            {
              key: 'caseQuantity',
              title: t('CASE_QUANTITY'),
              dataIndex: 'caseQuantity',
              width: '10%'
            },
            {
              key: '1-quarter',
              title: '1-квартал',
              dataIndex: '1-quarter',
              width: '10%',
              render: (value, record) => (
                <Checkbox checked={value} readOnly/>
              )
            },
            {
              key: '2-quarter',
              title: '2-квартал',
              dataIndex: '2-quarter',
              width: '10%',
              render: (value, record) => (
                <Checkbox checked={value} readOnly/>
              )
            },
            {
              key: '3-quarter',
              title: '3-квартал',
              dataIndex: '3-quarter',
              width: '10%',
              render: (value, record) => (
                <Checkbox checked={value} readOnly/>
              )
            },
            {
              key: '4-quarter',
              title: '4-квартал',
              dataIndex: '4-quarter',
              width: '10%',
              render: (value, record) => (
                <Checkbox checked={value} readOnly/>
              )
            }
          ]}
          scroll={{x: 1200, y: '100%'}}
          dataSource={this.filteredData}
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

/*function mapStateToProps(state) {

}*/

export default connect(null, { getPropVal })(Schedule);