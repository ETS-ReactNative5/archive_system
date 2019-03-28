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

class Passport3 extends React.Component {

  state = {
    data: [],
    initialValues: {}
  };

  columnsKinoDocs = [
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
      title: this.props.t('UNITS_QUANTITY'),
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
  columnsPhotoDocs = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      width: '5%',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if(index === 0 || index === 2 || index === 5) {
          obj.props.rowSpan = 2;
        } else if(index === 4) {
          obj.props.rowSpan = 1;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      key: 'indicators1',
      colSpan: 2,
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators1',
      width: '13%',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if(index === 0 || index === 2 || index === 5) {
          obj.props.rowSpan = 2;
        } else if(index === 4) {
          obj.props.rowSpan = 1;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      key: 'indicators2',
      colSpan: 0,
      title: '',
      dataIndex: 'indicators2',
      width: '13%'
    },
    {
      title: this.props.t('UNITS_QUANTITY'),
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
  columnsPhonoDocs = [
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
      title: this.props.t('UNITS_QUANTITY'),
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
      title: this.props.t('UNITS_QUANTITY'),
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
          columns={this.columnsKinoDocs}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'На 35 мм пленке',
            },
            {
              key: '2',
              pp: '2',
              indicators: 'На 16 мм планке'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('KINO_DOCUMENTS'))}
          pagination={false}
        />
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columnsPhotoDocs}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators1: 'Научно-Негативы',
              indicators2: 'черно-белые'
            },
            {
              key: '2',
              indicators2: 'цветные'
            },
            {
              key: '3',
              pp: '2',
              indicators1: 'Позитивы на пленке,диапозитивы (слайды)',
              indicators2: 'черно-белые'
            },
            {
              key: '4',
              indicators2: 'цветные'
            },
            {
              key: '5',
              pp: '3',
              indicators1: 'Фотоотпечатки '
            },
            {
              key: '6',
              pp: '4',
              indicators1: 'Фотоальбомы',
              indicators2: 'Количество альбомов'
            },
            {
              key: '7',
              indicators2: 'количество снимков'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('PHOTO_DOCUMENTS'))}
          pagination={false}
        />
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columnsPhonoDocs}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'Магнитные записи'
            },
            {
              key: '2',
              pp: '2',
              indicators: 'Граммофонные записи'
            },
            {
              key: '3',
              pp: '3',
              indicators: 'Записи на других носителях'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('PHONO_DOCUMENTS'))}
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
              indicators: 'Видеодокументы'
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('VIDEO_DOCUMENTS'))}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport3;