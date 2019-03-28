import React from "react";

import { Modal } from "antd";

import AntTabs from "../../../components/AntTabs";

class StorageUnitInfoModal extends React.Component {
  
  render() {
    const { t, lng, width, tofiConstants, data, modalShow, onCancel } = this.props;
    
    //console.log(data);

    return (
      <Modal
        title={data.title[lng] || ""}
        visible={modalShow}
        width={'750px'}
        onCancel={onCancel}
        footer={[]}
      >
        {/* <AntTabs
          tabs={[
            {
              tabKey: "fundAbout",
              tabName: t("FUND_ABOUT"),
              tabContent: (
                <div className="Guides__info-modal">
                  <br/>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {tofiConstants.fundArchive.name[lng]}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <input
                        className="ant-input"
                        type="text"
                        value={data.fundArchive}
                        disabled={true}
                        title={data.fundArchive}
                      />
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('NAME')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <textarea
                        className="ant-input"
                        rows="auto"
                        type="text"
                        value={data.title}
                        readOnly={true}
                        title={data.title}
                      />
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('ARCHIVE_ADRESS_DATA')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <input
                        className="ant-input"
                        rows="auto"
                        type="text"
                        value={''}
                        readOnly={true}
                        title={''}
                      />
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('FUND_ALL_RENAMES')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('FUND_SIZE_DESCRIPTION')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('FUND_OTHER_PLACE')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <textarea
                        className="ant-input"
                        rows="auto"
                        type="text"
                        value={data.locationOfSupplementaryMaterials}
                        readOnly={true}
                        title={data.locationOfSupplementaryMaterials}
                      />
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('ACCESS_TO_DOCUMENTS')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <input
                        className="ant-input"
                        type="text"
                        value={data.accessDocument}
                        disabled={true}
                        title={data.accessDocument}
                      />
                    </div>
                  </div>
                </div>
              )
            },
            {
              tabKey: "fundMakerAbout",
              tabName: t("FUND_MAKER_ABOUT"),
              tabContent: (
                <div className="Guides__info-modal">
                  <br/>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('FUND_MAKER_HISTORY')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <textarea
                        className="ant-input"
                        rows="auto"
                        type="text"
                        value={''}
                        readOnly={true}
                        title={''}
                      />
                    </div>
                  </div>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('FUND_MAKER_DEADLINES')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <input
                        className="ant-input"
                        rows="auto"
                        type="text"
                        value={''}
                        readOnly={true}
                        title={''}
                      />
                    </div>
                  </div>
                </div>
              )
            },
            {
              tabKey: "compositionContent",
              tabName: t("COMPOSOTION_CONTENT"),
              tabContent: (
                <div className="Guides__info-modal">
                  <br/>
                  <div className="info-modal-row">
                    <div className="info-modal-row-label">
                      {t('ANNOTATION_VALUE')}
                    </div>
                    <div disabled={true} className="info-modal-row-value">
                      <textarea
                        className="ant-input"
                        rows="10"
                        type="text"
                        value={''}
                        readOnly={true}
                        title={''}
                      />
                    </div>
                  </div>
                </div>
              )
            },
            {
              tabKey: "bibliography",
              tabName: t("BIBLIOGRAPHY"),
              // tabContent: (
              //   <Overviews
              //     overviewsData={overviewsData}
              //     search={search}
              //     t={t}
              //     tofiConstants={this.props.tofiConstants}
              //   />
              // )
            }
          ]}
        /> */}
      </Modal>
      );
  }
}

export default StorageUnitInfoModal;
