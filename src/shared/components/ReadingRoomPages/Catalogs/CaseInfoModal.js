import React from "react";
import { Modal } from "antd";

class CaseInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  lng = "ru";

  componentDidMount() {
    this.lng = localStorage.getItem("i18nextLng");
  }

  render() {
    return (
      <Modal
        title={data.title[this.lng] || ""}
        visible={modalShow}
        width={width}
        onCancel={onCancel}
        footer={[]}
      >
        <div className="Guides__info-modal">
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants
                ? tofiConstants.vidGuidebook.name[this.lng]
                : "Вид документа"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              <input
                className="ant-input"
                type="text"
                value={data.vidGuidebook.value}
                disabled={true}
                title={data.vidGuidebook.value}
              />
            </div>
          </div>
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants
                ? tofiConstants.oblastPutev.name[this.lng]
                : "Область описания путеводителя"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              <input
                className="ant-input"
                type="text"
                value={data.oblastPutev.value}
                disabled={true}
                title={data.oblastPutev.value}
              />
            </div>
          </div>
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants
                ? tofiConstants.rubrikPutev.name[this.lng]
                : "Структура рубрик путеводителя"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              <input
                className="ant-input"
                type="text"
                value={data.rubrikPutev.value}
                disabled={true}
                title={data.rubrikPutev.value}
              />
            </div>
          </div>
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants ? tofiConstants.theme.name[this.lng] : "Тема"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              <input
                className="ant-input"
                type="text"
                value={data.theme.value}
                disabled={true}
                title={data.theme.value}
              />
            </div>
          </div>
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants
                ? tofiConstants.goalSprav.name[this.lng]
                : "Цель справочника"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              <textarea
                value={data.goalSprav.value}
                disabled={true}
                className="ant-input"
                title={data.goalSprav.value}
              />
            </div>
          </div>
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants ? tofiConstants.method.name[this.lng] : "Методика"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              {data.method.value}
            </div>
          </div>
          <div className="info-modal-row">
            <div className="info-modal-row-label">
              {tofiConstants
                ? tofiConstants.lastChangeDateScheme.name[this.lng]
                : "Дата последнего изменения схемы"}
            </div>
            <div disabled={true} className="info-modal-row-value">
              <input
                className="ant-input"
                type="text"
                value={data.lastChangeDateScheme.value}
                title={data.lastChangeDateScheme.value}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CaseInfoModal;
