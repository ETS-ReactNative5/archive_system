const webSocket = new WebSocket('wss://127.0.0.1:13579/');
const heartbeat_msg = '--heartbeat--';
let heartbeat_interval = null;
let missed_heartbeats = 0;
const missed_heartbeats_limit_min = 3;
const missed_heartbeats_limit_max = 50;
let missed_heartbeats_limit = missed_heartbeats_limit_min;
let callback = null;


function setMissedHeartbeatsLimitToMax() {
  missed_heartbeats_limit = missed_heartbeats_limit_max;
}

function setMissedHeartbeatsLimitToMin() {
  missed_heartbeats_limit = missed_heartbeats_limit_min;
}

function openDialog() {
  if (window.confirm("Ошибка при подключений к прослойке. Убедитесь что программа запущена и нажмите ОК") === true) {
    window.location.reload();
  }
}

webSocket.onopen = function (event) {
  if (heartbeat_interval === null) {
    missed_heartbeats = 0;
    heartbeat_interval = setInterval(pingLayer, 2000);
  }
  console.log("Connection opened");
};

webSocket.onclose = function (event) {
  if (event.wasClean) {
    console.log('connection has been closed');
  } else {
    console.log('Connection error');
    openDialog();
  }
  console.log('Code: ' + event.code + ' Reason: ' + event.reason);
};

webSocket.onmessage = function (event) {
  if (event.data === heartbeat_msg) {
    missed_heartbeats = 0;
    return;
  }

  const result = JSON.parse(event.data);

  if (result != null) {
    const rw = {
      code: result['code'],
      message: result['message'],
      responseObject: result['responseObject'],
      getResult: function () {
        return this.result;
      },
      getMessage: function () {
        return this.message;
      },
      getResponseObject: function () {
        return this.responseObject;
      },
      getCode: function () {
        return this.code;
      }
    };
    typeof window[callback] === 'function' && window[callback](rw);
  }
  console.log(event);
  setMissedHeartbeatsLimitToMin();
};

function pingLayer() {
  console.log("pinging...");
  try {
    missed_heartbeats++;
    if (missed_heartbeats >= missed_heartbeats_limit)
      throw new Error("Too many missed heartbeats.");
    webSocket.send(heartbeat_msg);
  } catch (e) {
    clearInterval(heartbeat_interval);
    heartbeat_interval = null;
    console.warn("Closing connection. Reason: " + e.message);
    webSocket.close();
  }
}

function getActiveTokens(callBack) {
  const getActiveTokens = {
    "module": "kz.gov.pki.knca.commonUtils",
    "method": "getActiveTokens"
  };
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(getActiveTokens));
}

function getKeyInfo(storageName, callBack) {
  const getKeyInfo = {
    "module": "kz.gov.pki.knca.commonUtils",
    "method": "getKeyInfo",
    "args": [storageName]
  };
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(getKeyInfo));
}

export function signXml(storageName, keyType, xmlToSign, callBack) {
  console.log([...arguments]);
  const signXml = {
    "module": "kz.gov.pki.knca.commonUtils",
    "method": "signXml",
    "args": [storageName, keyType, xmlToSign, "", ""]
  };
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(signXml));
}

function createCMSSignatureFromFile(storageName, keyType, filePath, flag, callBack) {
  const createCMSSignatureFromFile = {
    "module": "kz.gov.pki.knca.commonUtils",
    "method": "createCMSSignatureFromFile",
    "args": [storageName, keyType, filePath, flag]
  };
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(createCMSSignatureFromFile));
}

export function showFileChooser(fileExtension, currentDirectory, callBack) {
  const showFileChooser = {
    "module": "kz.gov.pki.knca.commonUtils",
    "method": "showFileChooser",
    "args": [fileExtension, currentDirectory]
  };
  callback = callBack;
  setMissedHeartbeatsLimitToMax();
  webSocket.send(JSON.stringify(showFileChooser));
}
