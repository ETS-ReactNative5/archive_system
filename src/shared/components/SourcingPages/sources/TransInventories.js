import React from 'react';
import {Table, Input, Popconfirm, Button, Icon} from 'antd';
import uuid from 'uuid';
import {isEmpty} from 'lodash';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class TransInventories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: 'asdas',
          invClass: 'ads',
          invReceiptDate: 'asdas',
          numberOfPaperDocs: 'asdas',
          numberOfPosPhotos: 'asdas',
          numberOfNegPhotos: '1',
          numberOfAlbumPhotos: '2',
        }
      ]
    };
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.key = uuid();
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
  };
  cancel = key => {
    const newData = [...this.state.data];
    if(key.includes('newData')) {
      this.setState({ data: newData.filter(item => item.key !== key) });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };
  renderTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() =>
            this.setState({
              data: [
                ...this.state.data,
                {
                  key: `newData_${this.state.data.length}`,
                  editable: true,
                  invReceiptDate: '',
                  numberOfPaperDocs: '',
                  numberOfPosPhotos: '',
                  numberOfNegPhotos: '',
                  numberOfAlbumPhotos: ''
                }]
            })}/>
        <Button type='primary' icon={'upload'}>{this.props.t('ATTACH_FILE')}</Button>
      </div>
    )
  };
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, tofiConstants: {invReceiptDate, numberOfPaperDocs, numberOfPosPhotos, numberOfNegPhotos, numberOfAlbumPhotos,
      numberOfAudioDocs, numberOfVideoDocs, numberOfOtherDocs, numberOfDigitalDocs, numberOfDigitalFiles, volumeOfdigitalFiles, invNotes} } = this.props;
    const lng = localStorage.getItem('i18nextLng');
    return <Table
      bordered
      columns={[
        {
          key: 'invClass',
          title: t('INV_CLASS'),
          dataIndex: 'invClass',
          width: '10%',
          render: (obj, record) => this.renderColumns(obj, record, 'invClass'),
        }, {
          key: 'invReceiptDate',
          title: invReceiptDate ? invReceiptDate.name[lng] : '',
          dataIndex: 'invReceiptDate',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'invReceiptDate'),
        }, {
          key: 'numberOfPaperDocs',
          title: numberOfPaperDocs ? numberOfPaperDocs.name[lng]:'',
          dataIndex: 'numberOfPaperDocs',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfPaperDocs'),
        }, {
          key: 'numberOfPosPhotos',
          title: numberOfPosPhotos ? numberOfPosPhotos.name[lng] :'',
          dataIndex: 'numberOfPosPhotos',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfPosPhotos'),
        }, {
          key: 'numberOfNegPhotos',
          title: numberOfNegPhotos ? numberOfNegPhotos.name[lng] : '',
          dataIndex: 'numberOfNegPhotos',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfNegPhotos'),
        }, {
          key: 'numberOfAlbumPhotos',
          title: numberOfAlbumPhotos ? numberOfAlbumPhotos.name[lng] : '',
          dataIndex: 'numberOfAlbumPhotos',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfAlbumPhotos'),
        }, {
          key: 'numberOfAudioDocs',
          title: numberOfAudioDocs ? numberOfAudioDocs.name[lng] :'',
          dataIndex: 'numberOfAudioDocs',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfAudioDocs'),
        }, {
          key: 'numberOfVideoDocs',
          title: numberOfVideoDocs.name[lng],
          dataIndex: 'numberOfVideoDocs',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfVideoDocs'),
        }, {
          key: 'numberOfOtherDocs',
          title: numberOfOtherDocs.name[lng],
          dataIndex: 'numberOfOtherDocs',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfOtherDocs'),
        }, {
          key: 'numberOfDigitalDocs',
          title: numberOfDigitalDocs.name[lng],
          dataIndex: 'numberOfDigitalDocs',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfDigitalDocs'),
        }, {
          key: 'numberOfDigitalFiles',
          title: numberOfDigitalFiles.name[lng],
          dataIndex: 'numberOfDigitalFiles',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfDigitalFiles'),
        }, {
          key: 'volumeOfdigitalFiles',
          title: volumeOfdigitalFiles.name[lng],
          dataIndex: 'volumeOfdigitalFiles',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'volumeOfdigitalFiles'),
        }, {
          key: 'invNotes',
          title: invNotes.name[lng],
          dataIndex: 'invNotes',
          width: '7%',
          render: (text, record) => this.renderColumns(text, record, 'invNotes'),
        }, {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '6%',
          render: (text, record) => {
            const { editable, invReceiptDate, numberOfPaperDocs, numberOfPosPhotos, numberOfNegPhotos, numberOfAlbumPhotos, invClass } = record;
            const disable = !invClass || !invReceiptDate || !numberOfPaperDocs || !numberOfPosPhotos || !numberOfNegPhotos || !numberOfAlbumPhotos;
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                    : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                }
              </div>
            );
          },
        }
      ]}
      dataSource={this.state.data}
      size='small'
      title={this.renderTableHeader}
      pagination={false}
      scroll={{x: 1200}}
      style={{height: 'auto', minHeight: 'unset', marginLeft: '5px'}}
    />;
  }
}

export default TransInventories;