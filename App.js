import React, { Component } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Video } from 'expo';

// set path to local video
const videoSource = require('./assets/video/lights.mp4');

export default class App extends Component {
  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      backgroundOpacity: new Animated.Value(0),
      loaded: false,
      videoHeight: Dimensions.get('window').height,
      videoWidth: Dimensions.get('window').width,
    };
  }

  async componentWillMount() {
    // wait for video to download
    await Asset.fromModule(videoSource).downloadAsync();

    // once loaded, update state
    this.setState({
      loaded: true
    });
  }

  // this is called from the video::onLoad()
  fadeInVideo = () => {
    setTimeout(() => {
      // animate spring :: https://facebook.github.io/react-native/docs/animated#spring
      Animated.spring(
        this.state.backgroundOpacity,
        {
          toValue: 1
        }
      ).start();
    }, 400);
  }

  render() {
    // if application is not yet loaded
    if (!this.state.loaded) {
      return (
        <AppLoading />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <Animated.View style={[styles.backgroundViewWrapper, {opacity: this.state.backgroundOpacity}]}>
            <Video
              isLooping
              isMuted={false}
              onLoad={() => this.fadeInVideo()}
              resizeMode="cover"
              shouldPlay
              source={videoSource}
              style={{
                height: this.state.videoHeight,
                width: this.state.videoWidth
              }}
            />
          </Animated.View>
        </View>
        <View style={styles.overlay}>
          <Text style={styles.title}>
            This is where you might put a button or some other text on top of the video
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backgroundViewWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 90,
  },
});
