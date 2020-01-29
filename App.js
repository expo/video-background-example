import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Video } from 'expo';

// set path to local video
const videoSource = require('./assets/video/lights.mp4');

const { height, width } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      backgroundOpacity: new Animated.Value(0),
      loaded: false,
      videoHeight: height,
      videoWidth: width
    };
  }

  async _cacheVideoAsync() {
    // wait for video to download
    await Asset.fromModule(videoSource).downloadAsync();
  }

  // this is called from the video::onLoad()
  fadeInVideo = () => {
    const { backgroundOpacity } = this.state;
    setTimeout(() => {
      // animate spring
      // https://facebook.github.io/react-native/docs/animated#spring
      Animated.spring(backgroundOpacity, {
        toValue: 1
      }).start();
    }, 400);
  };

  render() {
    const { backgroundOpacity, loaded, videoHeight, videoWidth } = this.state;

    // if application is not yet loaded
    if (!loaded) {
      return <AppLoading 
        startAsync={this._cacheVideoAsync}
        // once loaded, update state
        onFinish={() => this.setState({ loaded: true })}
        onError={console.warn}
      />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <Animated.View
            style={[
              styles.backgroundViewWrapper,
              { opacity: backgroundOpacity }
            ]}
          >
            <Video
              isLooping
              isMuted={false}
              onLoad={() => this.fadeInVideo()}
              resizeMode="cover"
              shouldPlay
              source={videoSource}
              style={{ height: videoHeight, width: videoWidth }}
            />
          </Animated.View>
        </View>
        <View style={styles.overlay}>
          <Text style={styles.title}>
            This is where you might put a button or some other text on top of
            the video
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center'
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000'
  },
  backgroundViewWrapper: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginTop: 90,
    paddingHorizontal: 20,
    textAlign: 'center'
  }
});
