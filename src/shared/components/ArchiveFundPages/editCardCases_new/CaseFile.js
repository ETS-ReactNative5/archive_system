import React from 'react';
import {Button, Icon, Input, Modal, Popconfirm, Table} from "antd";
import { General } from "../../../utils/axios_config";
import {UploadWithButton} from "../../UploadWithButton";
import Viewer from "../../Viewer";
import {sortBy} from "lodash";

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class CaseFile extends React.Component {

  state = {
    data: [],
    loading: false,
    editable: false,
    openModal: false,
    viewerList: []
  };

  componentDidMount() {
    this.setState({ loading: true })
    this.ownId = this.props.initialValues.key
      .split('_')[1];
    General.getFileList(this.ownId, 'documentFile')
      .then(this.populateFromPromise)
  }

  populateFromPromise = res => {
    this.setState(state => ({
      loading: false,
      data: sortBy([
        ...state.data,
        ...res.data.map((obj, idx) => ({
          key: obj.id,
          name: obj.name,
          numb: state.data.length + idx + 1,
          fileOrder: obj.ord,
        }))
      ], o => o.fileOrder) // set sorted data
    }))
  };

  handleFileChange = e => {
    const documentFile = Array.from(e.target.files);
    const obj = {doItem: this.props.initialValues.key};
    return this.props.saveProps({obj}, {oFiles: {documentFile}})
      .then(() => {
        General.getFileList(this.ownId, 'documentFile')
          .then(this.populateFromPromise)
      })
  };

  renderColumns(text, rec, column) {
    return (
      <EditableCell
        editable={this.state.editable}
        value={text}
        onChange={value => this.handleChange(value, rec.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    debugger;
    if (target) {
      if(column === 'fileOrder') {
        let i = 0;
        newData.forEach((obj, idx) => {
          const fileOrd = Number(obj.fileOrder);
          if(i) {
            if(fileOrd !== Number(value) + idx - i) {
              return;
            }
            obj.fileOrder = fileOrd + 1;
          }
          if(fileOrd == value) {
            obj.fileOrder = fileOrd + 1;
            i = idx;
          }
        })
      }
      target[column] = value;
      this.setState({ data: sortBy(newData, o => o.fileOrder) });
    }
  }
  remove = key => {
    General.dFile(key, this.props.cubeSConst || 'CubeForAF_Case')
      .then(() => {
        const newData = this.state.data.filter(item => item.key !== key);
        this.setState({data: newData});
      })
  };

  renderTableHeader = () => {
    return (
      <div className='table-header' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <UploadWithButton
          text={this.props.t('ADD_FILES')}
          multiple
          onChange={this.handleFileChange}
          accept='.pdf,.jpeg,.png'
        />
        { !this.state.editable
          ? <Button onClick={() => this.setState({ editable: true })}>{this.props.t('EDIT')}</Button>
          : <div>
            <Button
              style={{ marginRight: '5px' }}
              onClick={() => {
                const files = this.state.data
                  .filter(obj => !String(obj.key).startsWith('newFile'))
                  .map(obj => ({
                    id: obj.key,
                    ord: String(obj.fileOrder),
                    name: {ru: obj.name, kz: obj.name, en: obj.name}
                  }));
                General.saveOrderFiles(this.ownId, JSON.stringify(files))
                  .then(() => this.setState({ editable: false }));
            }}>{this.props.t('SAVE_ORDER')}</Button>
            <Button onClick={() => this.setState({ editable: false })}>{this.props.t('CANCEL')}</Button>
          </div>
        }
      </div>
    )
  };

  render() {
    const { t } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div style={{ height: '100%' }}>
        <Table
          loading={this.state.loading}
          title={this.renderTableHeader}
          scroll={{ y: '100%' }}
          dataSource={ this.state.data }
          pagination={false}
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '10%'
            },
            {
              key: 'name',
              title: t('NAME'),
              dataIndex: 'name',
              width: '50%',
              render: (val, rec) => this.renderColumns(val, rec, 'name')
            },
            {
              key: 'fileOrder',
              title: t('FileOrder'),
              dataIndex: 'fileOrder',
              width: '20%',
              render: (val, rec) => this.renderColumns(val, rec, 'fileOrder'),
            },
            {
              key: 'actions',
              title: '',
              dataIndex: '',
              width: '20%',
              render: (obj, rec) => {
                return <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button icon="paper-clip" onClick={() =>
                    this.setState({openModal: true, viewerList: [{name: rec.key, title: rec.name}]})}/>
                  <Button icon="delete" onClick={() => this.remove(rec.key)}/>
                </div>
              }
            }
          ]}
        />
        {<Modal
          visible={this.state.openModal}
          footer={null}
          title={t('VIEWER')}
          wrapClassName={'full-screen'}
          onCancel={() => this.setState({ openModal: false })}
        >
          <Viewer key={this.state.viewerList.toString()} t={t} viewerList={this.state.viewerList}/>
        </Modal>}
      </div>
    )
  }
};

export default CaseFile;