import React from "react";
import { Button, Spin, Table } from "antd";
import { isEmpty } from "lodash";
import { calcCountDocsOfFund } from "../../actions/actions";

class Size extends React.Component {
  state = {
    data: [],
    dataSize: {},
    loading: false
  };

  componentDidMount() {
    if (isEmpty(this.props.tofiConstants)) return;
    this.updateSize();
  }
  updateSize = () => {
    if (!this.props.keyFund) return
    this.setState({ loading: true });
    calcCountDocsOfFund(this.props.keyFund.split("_")[1]).then(res =>
      this.setState({ dataSize: res.data }, () => this.renderColun())
    );
  };
  renderColun = () => {
    const {
      initialValues,
      tofiConstants: {
        fundNumberOfCases,
        fundNumberOfUpr,
        fundNumberOfNTD,
        fundNumberOfLS,
        fundNumberOfKino,
        fundNumberOfPhoto,
        fundNumberOfPhono,
        fundNumberOfVideo,
        fundNumberOfMCHD,
        fundNumberOfMicroforms,
        fundNumberOfLP,
        fundNumberOfRegis,
        fundNumberOfKinoReg,
        fundNumberOfPhonoReg,
        fundNumberOfVideoReg,
        fundNumberOfMCHDReg,
        fundNumberOfPhotoReg,
        fundNumberOfCasesWithFiles,
        fundNumberOfSecretCases,
        fundCasesInKazakhLang,
        fundNumberOfOCD,
        fundNumberOfInsurance,
        fundNumberOfInsuranceCadre,
        fundNumberOfInsuranceCases,
        fundNumberOfCasesInFundOfUse
      }
    } = this.props;
    let data = this.state.dataSize;

    this.setState({
      data: [
        {
          key: "fundNumberOfCases",
          docsType: fundNumberOfCases.name[this.lng],
          archiveFundSize: data ? data.fundNumberOfCases : "",
          children: [
            {
              key: "fundNumberOfUpr",
              docsType: fundNumberOfUpr.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfUpr : ""
            },
            {
              key: "fundNumberOfLP",
              docsType: fundNumberOfLP.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfLP : ""
            },
            {
              key: "fundNumberOfNTD",
              docsType: fundNumberOfNTD.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfNTD : ""
            },
            {
              key: "fundNumberOfLS",
              docsType: fundNumberOfLS.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfLS : ""
            },
            {
              key: "fundNumberOfKino",
              docsType: fundNumberOfKino.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfKino : ""
            },
            {
              key: "fundNumberOfPhoto",
              docsType: fundNumberOfPhoto.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfPhoto : ""
            },
            {
              key: "fundNumberOfPhono",
              docsType: fundNumberOfPhono.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfPhono : ""
            },
            {
              key: "fundNumberOfVideo",
              docsType: fundNumberOfVideo.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfVideo : ""
            },
            {
              key: "fundNumberOfMCHD",
              docsType: fundNumberOfMCHD.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfMCHD : ""
            },
            {
              key: "fundNumberOfMicroforms",
              docsType: fundNumberOfMicroforms.name[this.lng],
              archiveFundSize: data ? data.fundNumberOfMicroforms : ""
            }
          ]
        },
        {
          key: "fundNumberOfRegis",
          docsType: fundNumberOfRegis.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfRegis,
          children: [
            {
              key: "fundNumberOfKinoReg",
              docsType: fundNumberOfKinoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfKinoReg
            },
            {
              key: "fundNumberOfPhonoReg",
              docsType: fundNumberOfPhonoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfPhonoReg
            },
            {
              key: "fundNumberOfVideoReg",
              docsType: fundNumberOfVideoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfVideoReg
            },
            {
              key: "fundNumberOfMCHDReg",
              docsType: fundNumberOfMCHDReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfMCHDReg
            },
            {
              key: "fundNumberOfPhotoReg",
              docsType: fundNumberOfPhotoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfPhotoReg
            }
          ]
        },
        {
          key: "fundNumberOfCasesWithFiles",
          docsType: fundNumberOfCasesWithFiles.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfCasesWithFiles
        },
        {
          key: "fundNumberOfSecretCases",
          docsType: fundNumberOfSecretCases.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfSecretCases
        },
        {
          key: "fundCasesInKazakhLang",
          docsType: fundCasesInKazakhLang.name[this.lng],
          archiveFundSize: initialValues.fundCasesInKazakhLang
        },
        {
          key: "fundNumberOfOCD",
          docsType: fundNumberOfOCD.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfOCD
        },
        {
          key: "fundNumberOfInsurance",
          docsType: fundNumberOfInsurance.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfInsurance
        },
        {
          key: "fundNumberOfInsuranceCadre",
          docsType: fundNumberOfInsuranceCadre.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfInsuranceCadre
        },
        {
          key: "fundNumberOfInsuranceCases",
          docsType: fundNumberOfInsuranceCases.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfInsuranceCases
        },
        {
          key: "fundNumberOfCasesInFundOfUse",
          docsType: fundNumberOfCasesInFundOfUse.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfCasesInFundOfUse
        }
      ],
      loading: false
    });
  };

  renderTableHeader = () => {
    return (
      <div>
        <Button onClick={this.updateSize}>{this.props.t("UPDATE")}</Button>
      </div>
    );
  };

  render() {
    this.lng = localStorage.getItem("i18nextLng");
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <Table
            title={this.renderTableHeader}
            dataSource={this.state.data}
            pagination={false}
            columns={[
              {
                key: "docsType",
                title: this.props.t("DOCUMENTATION_TYPE"),
                dataIndex: "docsType",
                width: "70%"
              },
              {
                key: "archiveFundSize",
                title: this.props.t("ARCHIVE_FUND_SIZE"),
                dataIndex: "archiveFundSize",
                width: "30%"
              }
            ]}
            size="small"
            scroll={{ y: "100%" }}
            bordered
          />
        </Spin>
      </div>
    );
  }
}

export default Size;
