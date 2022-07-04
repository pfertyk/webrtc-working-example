import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import WebRTC from './webrtc-utils';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class WebRTCMobile extends React.Component {
  state = {
    remoteStreamURL: null,
    localStreamURL: null,
  }

  constructor(props) {
    super(props);
    this.webrtc = new WebRTC();
    this.webrtc.onRemoteStreamObtained = (stream) => {
      this.setState({remoteStreamURL: stream.toURL()});
    }
    this.webrtc.onLocalStreamObtained = (stream) => {
      this.setState({localStreamURL: stream.toURL()});
    }
  }

  render() {
    return (
      <>
        <RTCView
          streamURL={this.state.remoteStreamURL}
          style={styles.remoteStream} />
        <RTCView
          zOrder={1}
          streamURL={this.state.localStreamURL}
          style={styles.localStream} />
        <TouchableOpacity
          onPress={this.webrtc.connect}
          style={styles.connectButton} >
          <Text>Connect</Text>
        </TouchableOpacity>
      </>
    );
  }
};

const styles = StyleSheet.create({
  remoteStream: {
    width: width,
    height: height,
  },
  localStream: {
    position: 'absolute',
    width: Math.min(width, height) * 0.25,
    height: Math.min(width, height) * 0.25,
    margin: 20,
    bottom: 0,
    right: 0,
  },
  connectButton: {
    position: 'absolute',
    width: 100,
    height: 50,
    margin: 20,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
});
