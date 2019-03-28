import React from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Icon} from 'antd';
import AntTable from '../AntTable';
import {isEmpty, isEqual} from 'lodash';
import CSSTransition from 'react-transition-group/CSSTransition'

const Search = Input.Search;

class Classifier extends React.Component {

  state = {
    refs: [
      {
        name: 'Сфера деятельности'
      },
      {
        name: 'Предметный указатель'
      },
      {
        name: 'Географический указатель'
      }
    ],
    activeRef: {
      name: 'Сфера деятельности'
    },
    tableData: [
      {
        key: '1',
        name: 'Промышленность',
        fullName: 'Промышленность',
        children: [
          {
            key: '11',
            name: 'Стандартизация',
            fullName: 'Стандартизация',
            children: [
              {
                key: '111',
                name: 'Ассоциации институты центры',
                fullName: 'Ассоциации институты центры'
              }
            ]
          },
          {
            key: '12',
            name: 'Электроэнергетика',
            fullName: 'Электроэнергетика'
          },
          {
            key: '13',
            name: 'Нефтяная промышленность',
            fullName: 'Нефтяная промышленность'
          }
        ]
      }
    ],
    search: '',
    openNewTable: false,
    selectedRow: {}
  };

  renderRefs = item => {
    return (
      <li key={item.name}>
        <span onClick={() =>
          this.setState({ activeRef: {name: item.name} })}>{item.name}</span>
      </li>
    )
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec });
    } else {
      this.setState({openNewTable: true, selectedRow: {}});
    }
  };

  onSearch = e => {
    this.setState({ search: e.target.value });
  };

  goBack = () => {
    this.setState({ openNewTable: false });
  };

  render() {
    const { search, refs, tableData, openNewTable } = this.state;
    const { t } = this.props;
    const filteredRefs = refs.filter(item => item.name.toLowerCase().includes(search.toLocaleLowerCase())).map(this.renderRefs);

    return (
      <section style={{height: '100%'}}>
        <CSSTransition
          in={!openNewTable}
          timeout={200}
          classNames="classifier-list"
          unmountOnExit
        >
          <div className="Classifier">
            <div className="NSA__list">
              <Search
                placeholder="search"
                onChange={this.onSearch}
                value={search}
              />
              <ul>
                { filteredRefs }
              </ul>
            </div>
            <div className="NSA__content">
              <div className="objectView">
                <div className="objectView__body">
                  <AntTable
                    loading={false}
                    columns={[
                      {
                        key: 'name',
                        title: t('SHORT_NAME'),
                        dataIndex: 'name',
                        width: '50%'
                      },
                      {
                        key: 'fullName',
                        title: t('FULL_NAME'),
                        dataIndex: 'fullName',
                        width: '50%'
                      }
                    ]}
                    dataSource={ tableData }
                    hidePagination
                    bordered
                    size='small'
                    openedBy="Classifier"
                    changeSelectedRow={this.changeSelectedRow}
                  />
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={openNewTable}
          timeout={200}
          classNames="newTable"
          unmountOnExit
        >
          <div className="newTable">
            <div className="newTable__header">
              <Button onClick={this.goBack} type='primary'><Icon type={'arrow-left'} style={{fontSize: '16px'}}/></Button>
            </div>
            <AntTable
              loading={true}
              columns={[
                {
                  key: 'numb',
                  title: '№',
                  dataIndex: 'numb',
                  width: '5%'
                },
                {
                  key: 'fundNumb',
                  title: t('FUND_NUMB'),
                  dataIndex: 'fundNumb',
                  width: '10%'
                },
                {
                  key: 'fundIndex',
                  title: t('FUND_INDEX'),
                  dataIndex: 'fundIndex',
                  width: '10%'
                },
                {
                  key: 'fundName',
                  title: t('FUND_NAME'),
                  dataIndex: 'fundName',
                  width: '20%'
                },
                {
                  key: 'fundSgortName',
                  title: t('FUND_SHORT_NAME'),
                  dataIndex: 'fundSgortName',
                  width: '20%'
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
                  key: 'fundType',
                  title: t('FUND_TYPE'),
                  dataIndex: 'fundType',
                  width: '15%'
                }
              ]}
              dataSource={[]}
            />
          </div>
        </CSSTransition>
      </section>
    )
  }
}

Classifier.propTypes = {
  t: PropTypes.func.isRequired
};

export default Classifier;