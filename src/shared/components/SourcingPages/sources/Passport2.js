import React from 'react';
import {Icon, Input, Table} from 'antd';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      console.log(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class Passport2 extends React.Component {

  state = {
    data: [],
    initialValues: {}
  };

  columnsSaTDocs = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      width: '5%'
    },
    {
      key: 'indicators',
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators',
      width: '25%'
    },
    {
      title: this.props.t('UNITS_QUANTITY'),
      children: [
        {
          key: 'total',
          title: this.props.t('TOTAL'),
          dataIndex: 'total',
          width: '20%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        },
        {
          title: this.props.t('DEADLINES'),
          children: [
            {
              key: 'dbeg',
              title: this.props.t('DBEG_APPROVED'),
              dataIndex: 'dbeg',
              width: '20%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'dend',
              title: this.props.t('DEND_APPROVED'),
              dataIndex: 'dend',
              width: '20%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            }
          ]
        },
        {
          key: 'storedCases',
          title: this.props.t('STORED_CASES'),
          className: 'no-hover-tr',
          dataIndex: 'storedCases',
          width: '10%',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if(index === 0) {
              obj.props.rowSpan = 6;
            } else {
              obj.props.rowSpan = 0;
            }
            return obj;
          }
        }
      ],
    }
  ];
  columnsAttributed = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      width: '5%',
    },
    {
      key: 'indicators',
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators',
      width: '15%'
    },
    {
      key: 'quantityEPK',
      title: this.props.t('QUANTITY_EPK'),
      dataIndex: 'quantityEPK',
      width: '10%',
      render: (text, record) => (
        <EditableCell
          value={text}
        />
      )
    },
    {
      title: this.props.t('DEADLINES'),
      children: [
        {
          key: 'dbeg',
          title: this.props.t('DBEG_APPROVED'),
          dataIndex: 'dbeg',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        },
        {
          key: 'dend',
          title: this.props.t('DEND_APPROVED'),
          dataIndex: 'dend',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        }
      ]
    },
    {
      title: this.props.t('UNITS_QUANTITY'),
      children: [
        {
          key: 'approved',
          title: this.props.t('APPROVED'),
          dataIndex: 'approved',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        },
        {
          title: this.props.t('DEADLINES'),
          children: [
            {
              key: 'dbegApproved',
              title: this.props.t('DBEG_APPROVED'),
              dataIndex: 'dbegApproved',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'dendApproved',
              title: this.props.t('DEND_APPROVED'),
              dataIndex: 'dendApproved',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            }
          ]
        },
        {
          key: 'storedCases',
          className: 'rotate-90',
          title: this.props.t('STORED_CASES'),
          dataIndex: 'storedCases',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        }
      ],
    }
  ];
  columnsDocsDB = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      className: 'no-hover-tr',
      width: '5%',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (index === 0) {
          obj.props.rowSpan = 14;
        }
        else {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      key: 'indicators',
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators',
      width: '15%'
    },
    {
      key: 'quantityDB',
      title: this.props.t('QUANTITY_DB'),
      dataIndex: 'quantityDB',
      width: '15%',
      render: (text, record) => (
        <EditableCell
          value={text}
        />
      )
    },
    {
      key: 'recordedInfoSizeMB',
      title: this.props.t('RECORDED_INFO_SIZE_MB'),
      dataIndex: 'recordedInfoSizeMB',
      width: '15%',
      render: (text, record) => (
        <EditableCell
          value={text}
        />
      )
    },
    {
      title: this.props.t('DOCS_INFO_ON_DB'),
      children: [
        {
          key: 'docsQuantityOnDB',
          title: this.props.t('DOCS_QUANTITY_ON_DB'),
          dataIndex: 'docsQuantityOnDB',
          width: '10%',
          render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
        },
        {
          key: 'recordedInfoSize',
          title: this.props.t('RECORDED_INFO_SIZE'),
          dataIndex: 'recordedInfoSize',
          width: '10%',
          render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
        },
        {
          title: this.props.t('DEADLINES'),
          children: [
            {
              key: 'dbeg',
              title: this.props.t('DBEG_APPROVED'),
              dataIndex: 'dbeg',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'dend',
              title: this.props.t('DEND_APPROVED'),
              dataIndex: 'dend',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            }
          ]
        }
      ]
    }
  ];
  columnsDocsManaging = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      width: '5%',
    },
    {
      key: 'indicators',
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators',
      width: '25%'
    },
    {
      title: this.props.t('TOTAL'),
      children: [
        {
          key: 'total',
          title: this.props.t('TOTAL'),
          dataIndex: 'total',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        },
        {
          title: this.props.t('DEADLINES'),
          children: [
            {
              key: 'dbeg',
              title: this.props.t('DBEG_APPROVED'),
              dataIndex: 'dbeg',
              width: '10%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'dend',
              title: this.props.t('DEND_APPROVED'),
              dataIndex: 'dend',
              width: '10%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            }
          ]
        },
        {
          title: this.props.t('APPROVED'),
          children: [
            {
              key: 'approvedTotal',
              title: this.props.t('TOTAL'),
              dataIndex: 'approvedTotal',
              width: '10%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              title: this.props.t('DEADLINES'),
              children: [
                {
                  key: 'dbegApproved',
                  title: this.props.t('DBEG_APPROVED'),
                  dataIndex: 'dbegApproved',
                  width: '10%',
                  render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
                },
                {
                  key: 'dendApproved',
                  title: this.props.t('DEND_APPROVED'),
                  dataIndex: 'dendApproved',
                  width: '10%',
                  render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
                }
              ]
            }
          ]
        },
        {
          key: 'storedCases',
          title: this.props.t('STORED_CASES'),
          dataIndex: 'storedCases',
          width: '10%',
          render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
        }
      ],
    }
  ];

  renderTableHeader = (name) => {
    return function a() {
     return <h3 style={{ fontWeight: 'bold' }}>{name}</h3>
    }
  };

  render() {
    return (
      <div style={{ height: '100%', overflow: 'auto' }} className="passport">
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columnsSaTDocs}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'Научно-исследовательская',
              storedCases: this.props.t('NOT_FOR_FILL')
            },
            {
              key: '2',
              pp: '2',
              indicators: 'Конструкторская'
            },
            {
              key: '3',
              pp: '3',
              indicators: 'Технологическая'
            },
            {
              key: '4',
              pp: '4',
              indicators: 'Проектная'
            },
            {
              key: '5',
              pp: '5',
              indicators: 'Прочие виды:1) патентно-лицензионная'
            },
            {
              key: '6',
              pp: '6',
              indicators: 'Всего:'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('SCIENTIFIC_AND_TECHNICAL_DOCUMENTATION'))}
          pagination={false}
        />
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columnsAttributed}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'Научно-исследовательская'
            },
            {
              key: '2',
              pp: '2',
              indicators: 'Конструкторская'
            },
            {
              key: '3',
              pp: '3',
              indicators: 'Технологическая'
            },
            {
              key: '4',
              pp: '4',
              indicators: 'Проектная'
            },
            {
              key: '5',
              pp: '5',
              indicators: 'Прочие виды:1) патентно-лицензионная'
            },
            {
              key: '6',
              pp: '6',
              indicators: 'Всего:'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('SCIENTIFIC_AND_TECHNICAL_DOCUMENTATION_NRK'))}
          pagination={false}
        />
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columnsDocsDB}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'Документы на машинных носителях:'
            },
            {
              key: '2',
              indicators: '1. Управленческая документация постоянного хранения'
            },
            {
              key: '3',
              indicators: '2. Документы по личному составу'
            },
            {
              key: '4',
              indicators: '3. Научно-техническая документация:'
            },
            {
              key: '5',
              indicators: '1) Научно-исследовательская'
            },
            {
              key: '6',
              indicators: '2) Конструкторская'
            },
            {
              key: '7',
              indicators: '3) Технологическая'
            },
            {
              key: '8',
              indicators: '4) Проектная'
            },
            {
              key: '9',
              indicators: '5) Прочие виды'
            },
            {
              key: '10',
              indicators: '4. Кинофотофонодокументы:'
            },
            {
              key: '11',
              indicators: '1) кинодокументы'
            },
            {
              key: '12',
              indicators: '2) фотодокументы'
            },
            {
              key: '13',
              indicators: '3) фонодокументы'
            },
            {
              key: '14',
              indicators: '4) видеодокументы'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('DOCS_ON_DB'))}
          pagination={false}
        />
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columnsDocsManaging}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'Постоянного хранения'
            },
            {
              key: '2',
              pp: '2',
              indicators: 'По личному составу'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('DOCS_MANAGING'))}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport2;