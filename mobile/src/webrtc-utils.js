import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';

import socketIO from 'socket.io-client';

// Config variables: change them to point to your own servers
const SIGNALING_SERVER_URL = 'http://192.168.0.1:9999';
const TURN_SERVER_URL = '192.168.0.1:3478';
const TURN_SERVER_USERNAME = 'username';
const TURN_SERVER_CREDENTIAL = 'credential';
// WebRTC config: you don't have to change this for the example to work
// If you are testing in local network, you can just use PC_CONFIG = {iceServers: []}
const PC_CONFIG = {
  iceServers: [
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    },
    {
      urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL
    }
  ]
};

export default class WebRTC {
  socket;
  pc;
  localStream;

  constructor() {
    this.getLocalStream();
  }

  connect = () => {
    this.socket = socketIO(SIGNALING_SERVER_URL, {
      autoConnect: false,
      jsonp: false,
      transports: ['websocket'],
    });
    // Signaling callbacks
    this.socket.on('data', this.onData);
    this.socket.on('ready', this.onReady);
    this.socket.connect();
  }

  // Signaling methods
  onData = (data) => {
    console.log('Data received: ', data);
    this.handleSignalingData(data);
  }

  onReady = () => {
    console.log('Ready');
    // Connection with signaling server is ready, and so is local stream
    this.createPeerConnection();
    this.sendOffer();
  }

  sendData = (data) => {
    this.socket.emit('data', data);
  };

  // WebRTC methods
  getLocalStream = () => {
    mediaDevices.getUserMedia({
      audio: true, video: {facingMode: 'user'},
    }).then((stream) => {
      console.log('Stream found');
      this.localStream = stream;
      this.onLocalStreamObtained(stream);
      // Connect after making sure that local stream is availble
    }).catch(error => {
      console.error('Stream not found: ', error);
    });
  }

  createPeerConnection = () => {
    try {
      this.pc = new RTCPeerConnection(PC_CONFIG);
      this.pc.onicecandidate = this.onIceCandidate;
      // In web version, this was replaced by ontrack.
      // However, react-native-webrtc doesn't support it yet
      this.pc.onaddstream = this.onAddStream;
      this.pc.addStream(this.localStream);
      console.log('PeerConnection created');
    } catch (error) {
      console.error('PeerConnection failed: ', error);
    }
  };

  sendOffer = () => {
    console.log('Send offer');
    this.pc.createOffer({}).then(
      this.setAndSendLocalDescription,
      (error) => { console.error('Send offer failed: ', error); }
    );
  };

  sendAnswer = () => {
    console.log('Send answer');
    this.pc.createAnswer().then(
      this.setAndSendLocalDescription,
      (error) => { console.error('Send answer failed: ', error); }
    );
  };

  setAndSendLocalDescription = (sessionDescription) => {
    this.pc.setLocalDescription(sessionDescription);
    console.log('Local description set');
    this.sendData(sessionDescription);
  };

  onIceCandidate = (event) => {
    if (event.candidate) {
      console.log('ICE candidate');
      this.sendData({
        type: 'candidate',
        candidate: event.candidate
      });
    }
  };

  onAddStream = (event) => {
    console.log('Add stream');
    this.onRemoteStreamObtained(event.stream);
  };

  handleSignalingData = (data) => {
    switch (data.type) {
      case 'offer':
        this.createPeerConnection();
        this.pc.setRemoteDescription(new RTCSessionDescription(data));
        this.sendAnswer();
        break;
      case 'answer':
        this.pc.setRemoteDescription(new RTCSessionDescription(data));
        break;
      case 'candidate':
        this.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;
    }
  };
};
