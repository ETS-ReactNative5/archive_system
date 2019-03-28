import { Upload, Icon, Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {dFile, getFile} from "../actions/actions";
import {message} from "antd/lib/index";

class PicturesWall extends React.Component {
  state = {
    modal: {
      visible: false,
      result: ''
    },
    previewImage: ''
  };

  onClose = () => {
    this.setState({modal: {...this.state.modal, visible: false}})
  };

  onRemove = async file => {
    if(file.type === '') {
      // remove file from server and go on
      const res = await dFile(file.name, "cubeUsers");
      if(!res.success) {
        //  on fail stop here with message;
        res.errors.forEach(err => {
          message.error(err.text);
        });
        return;
      }
    }
    this.props.onChange(null);
  };

  handlePreview = (file) => {
    this.setState({previewImage: file.url, modal: {...this.state.modal, visible: true}})
  };

  beforeUpload = (file) => {
    file.url = URL.createObjectURL(file);
    this.props.onChange(file);
    return false;
  };

  uploadButton = text => (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">{text || 'Upload'}</div>
    </div>
  );

  render() {
    let value = this.props.value;
    if(value && value.constructor === Array && value.length) {
      value = value[0];
    }

    //from cube parser makes it File but empty
    //check value.url for falsy because new File also has not type
    if(value && value.constructor === File && value.type === '' && !value.url) {
      value.status = 'uploading';
      value.uid = 'uploading';
      getFile(value.name)
        .then(res => {
          const f = new File([value.name], value.name);
          f.uid = value.name;
          f.url = URL.createObjectURL(res.data);
          this.props.onChange(f);
        })
        .catch(err => console.error(err))
    }

    if(value && +value !== 0 && typeof value !== 'object') {
      value = new File([value], value);
      value.status = 'uploading';
      value.uid = 'uploading';
      getFile(this.props.value)
        .then(res => {
          const f = new File([this.props.value], this.props.value);
          f.uid = this.props.value;
          f.url = URL.createObjectURL(res.data);
          this.props.onChange(f);
        })
        .catch(err => console.error(err))
    }
    /*if(value.constructor === Array) {
      value.forEach(file => {
        if(file instanceof File && !file.url) {
          file.status = 'uploading';
          file.uid = 'uploading';
          getFile(file.name)
            .then(res => {
              const f = new File([file.name], file.name);
              f.uid = file.name;
              f.url = URL.createObjectURL(res.data);
              this.props.onChange(f);
            })
            .catch(err => console.error(err))
        }
      })
    }*/

    return (
      <div className={`clearfix ${this.props.className}`}>
        <Upload
          action="/file/set"
          onRemove={this.onRemove}
          listType="picture-card"
          onPreview={this.handlePreview}
          accept=".jpeg, .png, .jpg"
          beforeUpload={this.beforeUpload}
          fileList={value && value.constructor === File ? [value] : []}
          disabled={this.props.disabled}
          // showUploadList={{showRemoveIcon: !!(value && typeof value === 'object' && value.type)}}
          showUploadList={{showRemoveIcon: this.props.hideRemoveIcon || true}}
        >
          {value && value.constructor === File ? null : this.uploadButton(this.props.uploadText)}
        </Upload>
        <Modal
          visible={this.state.modal.visible}
          footer={null}
          onCancel={this.onClose}
          width="60%"
        >
          <img src={this.state.previewImage} width='100%' alt="res"/>
        </Modal>
      </div>
    );
  }
}

PicturesWall.propTypes = {
  getFile: PropTypes.func,
  uploadText: PropTypes.string,
};

export default PicturesWall;
