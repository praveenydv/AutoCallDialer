let DEBUG = true;
let HOST_URL = "https://chatveen.herokuapp.com";
let SOCKET_URL = "wss://chatveen.herokuapp.com";
if (DEBUG) {
  HOST_URL = "http://localhost:8000";
  SOCKET_URL = "ws://localhost:8000";
}

export { HOST_URL, SOCKET_URL };
