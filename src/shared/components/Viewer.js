import React from 'react';
import { Button, Spin, Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import { getFile } from "../actions/actions";

class Viewer extends React.Component {

  state = {
    windowFile: <div className='placeholder'>{this.props.t('CHOICE_FILE')}</div>
  };

  brokenImgHandle = blob => {
    const url = URL.createObjectURL(new Blob([blob], {type: 'application/pdf'}));
    this.setState({
      windowFile: <iframe src={`${url}#toolbar=0`} frameBorder="0" />
    })
  };

  handleAddFile = e => {
    console.log(e.target.files)
  };

  renderViewerList = (file, idx) =>{
      let item = file

      if (item.value === undefined){
          item={
              value:file
          }
      }
      return <li tabIndex={0} key={item.value.name+idx} onClick={() => {
          this.setState({ windowFile: <Spin size='large' style={{ position: 'relative', top: '50%' }}/> });
          if(item.value.type) {
              const url = URL.createObjectURL(item.value);
              this.setState({
                  windowFile: <img onError={() => this.brokenImgHandle(item.value)} src={url} alt={item.value}/>
              })
          } else {
              getFile(item.value.name, item.value.fileType)
                  .then(res => {
                      const url = URL.createObjectURL(res.data);
                      this.setState({
                          windowFile: <img onError={() => this.brokenImgHandle(res.data)} src={url} alt={item.value}/>
                      })
                  })
                  .catch(err => console.warn(err))
          }
      }}>
          {item.value.title || item.value.name}
          {this.props.editable && <Popconfirm title='Подтвердите удаление' onConfirm={() => {
              console.log(item.value.name);
          }}>
              <span onClick={e => e.stopPropagation()}><Icon type='close'/></span>
          </Popconfirm>}
      </li>;


  }

      componentDidMount() {
        this.setState(
          {windowFile: <div className='placeholder'>{this.props.t('CHOICE_FILE')}</div>}
        )
      }

  render() {
    return (
      <div className='Viewer'>
        <div className="Viewer-list">
          {this.props.editable && <div className="Viewer-list-header">
            <label>
              <input type="file" multiple style={{ display: 'none' }} onChange={this.handleAddFile}/>
              <span className='ant-btn ant-btn-primary'><Icon type='upload'/> <span>Добавить</span></span>
            </label>
          </div>}
          <ul>
           {this.props.viewerList.map(this.renderViewerList)}
          </ul>
        </div>
        <div className="Viewer-window">
          {this.state.windowFile}
        </div>
      </div>
    )
  }
}

Viewer.propTypes = {
  viewerList: PropTypes.array.isRequired
};

export default Viewer;