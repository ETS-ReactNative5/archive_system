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
        <AntTabs
          tabs={[
            {
              tabKey: "fundAbout",
              tabName: t("TITLE"),
              // tabContent: (
              //   {}
              // )
            },
            {
              tabKey: "fundMakerAbout",
              tabName: t("TITLE"),
              // tabContent: (
              //   {}
              // )
            },
            {
              tabKey: "compositionContent",
              tabName: t("ORG_HISTORY"),
              // tabContent: (
              //   {}
              // )
            },
            {
              tabKey: "bibliography",
              tabName: t("BIBLIOGRAPHY"),
              // tabContent: (
              //   {}
              // )
            }
          ]}
        />
      </Modal>
      );
  }
}

export default StorageUnitInfoModal;
