import React from 'react';
import { Button } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import WebRTC from './webrtc-utils';

export default class WebRTCMobile extends React.Component {
  state = {
    remoteStreamURL: null,
  }

  onConnect = () => {
    this.webrtc = new WebRTC();
    this.webrtc.onRemoteStreamObtained = (stream) => {
      this.setState({remoteStreamURL: stream.toURL()});
    }
    this.webrtc.connect();
  }

  render() {
    return (
      <>
        <RTCView
          streamURL={this.state.remoteStreamURL}
          style={{width: 300, height: 300, alignSelf: 'center'}} />
        <Button onPress={this.onConnect} title='Connect' />
      </>
    );
  }
};
