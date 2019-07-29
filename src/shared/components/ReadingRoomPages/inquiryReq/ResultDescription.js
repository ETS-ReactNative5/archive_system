import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button, Form, message} from "antd";
import {renderFileUploadBtn, renderTextareaLang} from "../../../utils/form_components";
import {isEqual, pickBy} from "lodash";
import {makeUrlForDownloadByRequestId, getCube, getWorkIdByRequestId, getValuesOfObjsWithProps2} from "../../../actions/actions";
import {CUBE_FOR_WORKS, DO_FOR_WORKS, DP_FOR_WORKS} from '../../../constants/tofiConstants';
import { parseCube_new, parseForTable } from '../../../utils/cubeParser';
import { getObjByProp, getFile, dFile } from '../../../actions/actions.js';

import {
  Input,
  Radio,
  Checkbox,
  DatePicker,
  Select as AntSelect,
  Tooltip
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ResultDescription extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        resultDescription: localStorage.getItem("i18nextLng")
      },
      loading: false,
      data: [],
      workResult: {
        lang: localStorage.getItem("i18nextLng"),
        resultResearchStatus: {
          kz: "-",
          ru: "-",
          en: "-"
        },
        resultDescription: {
          kz: "",
          ru: "",
          en: ""
        },
        files: [
        ]
      }
    }

    this.requestWorkResultProps();
    // this.requestWorkResultProps();
  }

  // keyValue = {...this.props.initialValues.key};

  requestWorkResultProps = async () => {
    /*let key = this.props.initialValues.key;
    let tmp = (key+"").split("_");
    key =tmp.length > 1?tmp[1]:tmp[0];
    getWorkResultByRequestId(key)
      .then ()
      .catch();*/
    let key = this.props.initialValues.key;
    let tmp = (key+"").split("_");
    key =tmp.length > 1?tmp[1]:tmp[0];

    key = await getWorkIdByRequestId(key);

    let formData = new FormData();
    formData.append("objId", key);
    formData.append("propConsts", "resultDescription, resultResearch, resultResearchStatus");
    let result = await getValuesOfObjsWithProps2(formData);
    if (!result.success) {
      console.error("Данные о результатах работы не найдены");
      return;
    }
    console.log(result.data);
    if (result.data.resultDescription.length != 0) {
      this.state.workResult.resultDescription.kz = result.data.resultDescription[0].val.kz;
      this.state.workResult.resultDescription.ru = result.data.resultDescription[0].val.ru;
      this.state.workResult.resultDescription.en = result.data.resultDescription[0].val.en;
    }
    if (result.data.resultResearchStatus.length != 0) {
      this.state.workResult.resultResearchStatus.kz = result.data.resultResearchStatus[0].name.kz;
      this.state.workResult.resultResearchStatus.ru = result.data.resultResearchStatus[0].name.ru;
      this.state.workResult.resultResearchStatus.en = result.data.resultResearchStatus[0].name.en;
    }

    let i;
    this.state.workResult.files = [];
    for (i = 0; i < result.data.resultResearch.length; i++) {
      let fileId = result.data.resultResearch[i].val.ru;
      let fileName = result.data.resultResearch[i].fileName.ru;
      fileName = decodeURI(fileName);
      this.state.workResult.files.push({
        id: fileId,
        name: fileName
      })
    }

    let wr = {...this.state.workResult}
    this.setState({workResult: wr})
  }

  componentDidMount() {
    console.log(">>>>>>>>>>>>>>>>> componentDidMount");
  }

  componentDidUpdate(prevProps) {
    console.log(">>>>>>>>>>>>>>>>> componentDidUpdate");
    if(prevProps.initialValues !== this.props.initialValues) {

      this.requestWorkResultProps();
    }
  }

  componentWillUpdate() {
    console.log(">>>>>>>>>>>>>>>>> componentWillUpdate");
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  onSubmit = values => {
    const { resultResearch ,...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeStudy',
      doConst: 'doCubeStudy',
      dpConst: 'dpCubeStudy'
    };
    const obj = {
      doItem: this.props.initialValues.key,
    };
    return this.props.saveProps({cube, obj}, {values: rest, oFiles: {resultResearch}}, this.props.tofiConstants);
  };

  downloadSignedArchive = async() => {
    debugger;
    let surl = await makeUrlForDownloadByRequestId(this.props.initialValues.key);
    window.open(`${process.env.PUBLIC_URL}/${surl}`);
  };


  fileToRedux = (val, prevVal, file, str) => {
    let newFile = val.filter(el => el instanceof File);
    if (newFile.length > 0) {
      var copyVal = prevVal ? [...prevVal] : [];
      newFile.map(el => {
        copyVal.push({
          value: el
        });
      });
      return copyVal;
    } else {
      return val.length == 0 ? [] : val;
    }
  };

  renderTableData = (item, idx) => {
    console.log('item------', item);
    const workTypeClasses = ['caseDeliveryToRR', 'responseToRequest', 'performPaidReq', 'conductResearch', 'orderCopyDoc', 'userRegistration'];
    const workTypeClass = workTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);
    const result = {
      key: item.id,
      numb: idx + 1,
      workType: workTypeClass ? {
        value: this.props.tofiConstants[workTypeClass].id,
        label: this.props.tofiConstants[workTypeClass].name[this.lng],
        workTypeClass
      } : null,
    };

    const constArr = ['propResearcheRequests','resultDescription','resultResearch', 'resultResearchStatus'];

    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result;
  };

  showFile = fileId => {
    let i;
    var __filename__ = "";
    for (i = 0; i < this.state.workResult.files.length; i++) {
      if (this.state.workResult.files[i].id == fileId) {
        if (!!this.state.workResult.files[i].file) {

        }
        else {
          __filename__ = this.state.workResult.files[i].name;
          getFile(fileId)
            .then(resp => {
              const fr = new FileReader();
              fr.onload = res => {
                const newWindow = window.open();
                var url = res.target.result;
                if (__filename__.endsWith(".pdf")) {
                  url = url.replace('application/x-www-form-urlencoded', 'application/pdf');
                }
                newWindow.document.head.innerHTML += "<style> body {margin:0}</style>";
                newWindow.document.body.innerHTML = `<iframe style="box-sizing: border-box" src=${url} width="100%" height="100%" download="{__filename__}" />`;
              };
              fr.readAsDataURL(resp.data);
            })
            .catch(err => {
              console.error(err);
              message.error('Ошибка загрузки файла');
            })
        }
      }
    }
  }

  render() {
    const { lang, data } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    const {  t, handleSubmit, reset, dirty, error, submitting,
      tofiConstants: {resultDescription, resultResearch, resultResearchStatus} } = this.props;
    // --- текст для подписей
    // --- данные куба для resultDescription, resultResearch, resultResearchStatus будут храниться в поле состояния workResult
    let signStatusText = 'Не подписан';
    let resultStatusCaption = resultResearchStatus.name[this.lng];
    if (!!this.state.workResult) {
      signStatusText = this.state.workResult.resultResearchStatus[this.lng];
    }

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
        <p style={{color: 'rgba(0, 0, 0, 0.85)', paddingTop: '8px', paddingBottom:'13px', whiteSpace: 'nowrap'}}>{resultStatusCaption}:
          &nbsp;<font style={{cursor: 'default', userSelect: 'none', color:'red'}}>{signStatusText}
          </font>
        </p>
        {resultDescription && (
        <FormItem
          className="with-lang--column"
          label={resultDescription.name[this.lng]}>
          <Input.TextArea
            autosize={{minRows: 5}}
            value = {this.state.workResult.resultDescription[this.state.workResult.lang]}
          />
          <RadioGroup defaultValue={localStorage.getItem('i18nextLng')} onChange={(e)=>{
            var wr = JSON.parse(JSON.stringify(this.state.workResult));
            wr.lang = e.target.value;
            this.setState({
              workResult: wr
            })
          }} >
            <RadioButton value="kz">kz</RadioButton>
            <RadioButton value="ru">ru</RadioButton>
            <RadioButton value="en">en</RadioButton>
          </RadioGroup>
        </FormItem>
        )}
        {/*{resultResearch && <Field*/}
          {/*name="resultResearch"*/}
          {/*component={ renderFileUploadBtn }*/}
          {/*cubeSConst="cubeStudy"*/}

          {/*label={resultResearch.name[this.lng]}*/}
          {/*formItemLayout={*/}
            {/*{*/}
              {/*labelCol: { span: 10 },*/}
              {/*wrapperCol: { span: 14 }*/}
            {/*}*/}
          {/*}*/}
          {/*normalize={this.fileToRedux}*/}

        {/*/>}*/}
        <ul style={{paddingTop: "5px"}}>
          {
            this.state.workResult.files.map(
              (it)=> <li style={{paddingBottom: "5px"}} onClick={() => this.showFile(it.id)}>{it.name}</li>)
          }
        </ul>

        <Form.Item className="ant-form-btns absolute-bottom">
          <Button className="signup-form__btn" type="primary" title="Скачать подписанные результаты исследования" onClick={this.downloadSignedArchive}>
            Скачать исследование
          </Button>
          {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
        </Form.Item>
      </Form>
    )
  }
}

export default reduxForm({ form: 'ResultDescription', enableReinitialize: true })(ResultDescription);