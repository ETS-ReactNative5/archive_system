import React from 'react';
import {Upload, Button, Icon, Modal, message} from 'antd';
import axios from 'axios';
import {dFile, getFile} from "../actions/actions";

class UploadButton extends React.Component {

  state = {
    modal: {
      visible: false,
      result: '',
        newFile:[]
    }
  };

  onClose = () => {
    this.setState({modal: {...this.state.modal, visible: false}})
  };

  selectFile = {
    en: 'Select file',
    ru: 'Выберите файл',
    kz: 'Файлды таңдаңыз'
  };
  editStateNewgFile=()=>{
      this.setState({newFile:[]})
      let newFile =[]
      if (this.props.value.length){
          for(let i = 0; i<this.props.value.length; i++){
              newFile.push(this.props.value[i].value)
          }
          this.setState({
              newFile:newFile
          })
      }
  }
    componentDidMount(){
      this.editStateNewgFile()
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props !== prevProps) {
            this.editStateNewgFile()
        }
    }
  handleImgError = () => {
    this.onClose();
    const instance = axios.create({baseURL: ''});
    instance.get(this.state.result, { responseType: 'blob' })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res.data], {type: 'application/pdf'}));
        const newWindow = window.open();
        newWindow.document.head.innerHTML += "<style> body {margin:0}</style>";
        newWindow.document.body.innerHTML = `<iframe style="box-sizing: border-box" src=${url} width="100%" height="100%" />`;
      })
      .catch(err => {
        console.error(err);
      })
  };

  render() {

    const props = {
      action: '//file/set',
      accept: 'image/*, application/pdf',
      onRemove: async (file) => {
        if(file.type === '') {
          // remove file from server and go on
          const res = await dFile(file.name, this.props.cubeSConst);
          if(!res.success) {
          //  on fail stop here with message;
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return;
          }
        }
      

        const index = this.props.value.indexOf(file);
        const newFileList = this.props.value.slice();
        newFileList.splice(index, 1);
         this.setState({
             newFile:[]
         });
        this.props.onChange(newFileList);
      },
      onPreview: (file) => {
        if(file.type === 'application/pdf') {
          const newWindow = window.open();
          const url = URL.createObjectURL(file);
          newWindow.document.head.innerHTML += "<style> body {margin:0}</style>";
          newWindow.document.body.innerHTML = `<iframe style="box-sizing: border-box" src=${url} width="100%" height="100%" />`;
        }
        else if(file.type === '') {
          // TODO change to actions
          getFile(file.name)
            .then(resp => {
              const url = URL.createObjectURL(resp.data);
              this.setState({result: url, modal: {...this.state.modal, visible: true}})
            })
            .catch(err => {
              console.error(err);
              message.error('Ошибка загрузки файла');
            })
        }
        else {
          const fr = new FileReader();
          fr.onload = res => {
            this.setState({result: res.target.result, modal: {...this.state.modal, visible: true}})
          };
          fr.readAsDataURL(file)
        }

      },
      beforeUpload: (file, fileList) => {
        this.props.onChange([...this.props.value, ...fileList]);
        return false;
      },
      fileList:this.state.newFile ,
          multiple: true
    };

    return (
      <div>
        <Upload {...props}>
          {!this.props.disabled && <Button disabled={this.props.disabled}>
            <Icon type="upload"/> {this.selectFile[localStorage.getItem('i18nextLng')]}
          </Button>}
        </Upload>
        <Modal
          visible={this.state.modal.visible}
          footer={null}
          onCancel={this.onClose}
          width="60%"
        >
          <img onError={this.handleImgError} src={this.state.result} width='100%' alt="res" />
        </Modal>
      </div>
    );
  }
}

export default UploadButton;