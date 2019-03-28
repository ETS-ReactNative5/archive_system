import {General} from "./axios_config";
import {message} from "antd";
import { Base64 } from 'js-base64';
import { remove } from 'lodash';

export function getParents(dataArr, itemObj) {
  const result = [];
  if(itemObj.parent) {
    result.push(itemObj);
    result.push(...getParents(dataArr, findParent(dataArr, itemObj)))
  } else {
    result.push(itemObj);
  }
  return result;
}
function findParent(dataArr, item) {
  if(item.parent) return dataArr.find(o => o.value == item.parent);
}

export function getObject(theObject, key) {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i], key);
      if (result) return result;
    }
  } else if (theObject instanceof Object) {
    if (theObject.key == key) {   //eslint-disable-line
      return theObject;
    }
    result = getObject(theObject.children, key);
  } else return null;
  return result;
};
export function removeObject (theObject, key) {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = removeObject(theObject[i], key);
      if (result) {
        // eslint-disable-next-line
        theObject.forEach((item, idx) => {
          if (item.key === result.key) {
            theObject.splice(idx, 1);
            return;
          }
        });
      }
    }
  } else if (theObject instanceof Object) {
    if (theObject.key === key) {
      return theObject;
    }
    result = removeObject(theObject.children, key);
  } else return null;
  return result;
};

/*
* data: {}
* files: [name: String]
* callBack: "signXmlBackVS | "signXmlBackVS2"
* */
export const sign = async (callBack, data={}, files) => {
  let hashedFiles;
  if (files) {
    hashedFiles = await General.getFilesHashes(files);
  }
  const {showFileChooser, signXml} = await import('./ncaLayers');
  window.showFileChooserCall = function showFileChooserCall() {
    showFileChooser("ALL", "", "showFileChooserBack");
  };
  const toSend = {hashedFiles, ...data};
  const xmlToSign = "<xml><values>" + JSON.stringify(toSend) + "</values></xml>";
  console.log({toSend});
  // give some time ncaLayer to establish connection
  // const hideLoading = message.loading(this.props.t('OPENING_NCA_LAYER'), 60);
  setTimeout(() => {
    // hideLoading();
    signXml("PKCS12", "SIGNATURE", xmlToSign, callBack);
  }, 2000);
};

// Удаляет из списка файлов те файлы, которые имеют idDPV (на сохранение серверу передаются только файлы новые, не имеющие idDPV).
export function removeFilesWithIdDPV(files) {
  files.forEach(fileProp => {
    if (!fileProp || fileProp.constructor !== Array) {
      console.warn(fileProp, 'is not an array');
      return;
    }
    remove(fileProp, file => file.idDPV)
  })
}

window.signXmlBackVS = function signXmlBack(result) {
  if (result['code'] === "500") {
    alert(result['message']);
  } else if (result['code'] === "200") {
    // const headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Content-Type', 'text/xml');
    // headers.append('Accept', 'text/xml');
    //
    // const catResp = result.responseObject.substring(result.responseObject.indexOf('<xml><values>'));
    //
    // let dataPrefix = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:VerifyXMLDSign2>';
    // let dataSuffix = '</tem:VerifyXMLDSign2></soapenv:Body></soapenv:Envelope>';
    //
    // const data = dataPrefix + Base64.encode(catResp) + dataSuffix;
    // console.log({ data, catResp });
    // // const hideLoading = message.loading(self.props.t('VERIFYING'), 60);
    // fetch('http://89.218.223.78:8846/VerificationService.asmx', {body: data, method: 'POST', headers})
    //   .then(res => res.json())
    //   .then(json => console.log(json))
    //   .catch(err => console.warn(err));
  }
};
window.signXmlBackVS2 = function signXmlBack(result) {
  if (result['code'] === "500") {
    alert(result['message']);
  } else if (result['code'] === "200") {
    // const headers = new Headers();
    // // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Content-Type', 'text/xml');
    // headers.append('Accept', 'text/xml');
    //
    // const catResp = result.responseObject.substring(result.responseObject.indexOf('<xml><values>'));
    //
    // let dataPrefix = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:VerifyXMLDSign>';
    // let dataSuffix = '</tem:VerifyXMLDSign></soapenv:Body></soapenv:Envelope>';
    //
    // const data = dataPrefix + Base64.encode(catResp) + dataSuffix;
    // console.log({ data, catResp, b: Base64.encode(catResp) });
    //
    // // const hideLoading = message.loading(self.props.t('VERIFYING'), 60);
    // fetch('http://89.218.223.78:8846/VerificationService.asmx', {body: data, method: 'POST', headers})
    //   .then(res => res.text())
    //   .then(str => {
    //     console.log({ str });
    //     return ((new window.DOMParser())).parseFromString(str, 'text/xml')
    //   })
    //   .then(console.log)
    //   .catch(err => console.warn(err));
  }
};