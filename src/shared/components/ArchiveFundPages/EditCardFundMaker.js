import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import AntTable from '../AntTable';

class EditCardFundMaker extends Component {

  renderTableHeader = (headerText) => {
    return (
      <div className="table-header">
        <h3>{ headerText }</h3>
        <div className="table-header__btns">
          <Button>Добавить</Button>
          <Button>Изменить</Button>
          <Button type='danger'>Удалить</Button>
        </div>
      </div>
    )
  };

  renderVerTableData = (ver) => {
    const lng = localStorage.getItem('i18nextLng');
    return {
      key: ver.id,
      dbeg: ver.dbeg,
      dend: ver.dend,
      shortName: ver.name[lng],
      fullName: ver.fullName[lng]
    }
  };

  render() {
    const { fundMakerConst, fundMakerData } = this.props;
    const lng = localStorage.getItem('i18nextLng');
    let fundMakerDataSource, fundMakerVerSource = [];

    try {
      fundMakerDataSource = [
        {
          key: `${fundMakerData.idRef}`,
          shortName: fundMakerData.name[lng],
          fullName: fundMakerData.fullName[lng],
          dbeg: fundMakerData.dbeg,
          dend: fundMakerData.dend
        }
      ];
    } catch (err){
      console.log(err);
      fundMakerDataSource = [];
    }
    if(this.props.fundMakerVer) fundMakerVerSource = this.props.fundMakerVer;

    return(
      <div className="EditCardFundMaker">
        <div className="EditCardFundMaker__list">
          <AntTable
            loading={false}
            columns={
              [
                {
                  key: 'shortName',
                  title: 'Краткое наименование',
                  dataIndex: 'shortName',
                  width: '25%'
                },
                {
                  key: 'fullName',
                  title: 'Полное наименование',
                  dataIndex: 'fullName',
                  width: '25%'
                },
                {
                  key: 'dbeg',
                  title: 'Дата образования',
                  dataIndex: 'dbeg',
                  width: '25%'
                },
                {
                  key: 'dend',
                  title: 'Дата ликвидации',
                  dataIndex: 'dend',
                  width: '25%'
                }
              ]
            }
            title={()=> <h3>{fundMakerConst.name[lng]}</h3>}
            dataSource={ fundMakerDataSource }
            hidePagination
          />
        </div>
        <div className="EditCardFundMaker__versions">
          <AntTable
            loading={false}
            columns={
              [
                {
                  key: 'dbeg',
                  title: 'Начальная дата',
                  dataIndex: 'dbeg',
                  width: '15%'
                },
                {
                  key: 'dend',
                  title: 'Конечная дата',
                  dataIndex: 'dend',
                  width: '15%'
                },
                {
                  key: 'shortName',
                  title: 'Краткое наименование',
                  dataIndex: 'shortName',
                  width: '30%'
                },
                {
                  key: 'fullName',
                  title: 'Полное наименование',
                  dataIndex: 'fullName',
                  width: '40%'
                }
              ]}
            title={ () => this.renderTableHeader('Версии фондообразователя') }
            dataSource={fundMakerVerSource.map(this.renderVerTableData)}
            hidePagination
          />
        </div>
      </div>
    )
  }
}

EditCardFundMaker.propTypes = {
  fundMakerData: PropTypes.shape({
    idRef: PropTypes.number,
    name: PropTypes.shape(),
    fullName: PropTypes.shape(),
    dbeg: PropTypes.string,
    dend: PropTypes.string
  }),
  t: PropTypes.func.isRequired,
  fundMakerVer: PropTypes.arrayOf(PropTypes.shape())
};


export default EditCardFundMaker;
