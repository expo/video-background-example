import Expo from 'expo';
import React from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const videoSource = require('./assets/video/lights.mp4');

class App extends React.Component {
  state = {
    loaded: false,
    backgroundOpacity: new Animated.Value(0),
  }

  async componentWillMount() {
    await Expo.Asset.fromModule(videoSource).downloadAsync();
    this.setState({loaded: true});
  }

  render() {
    if (!this.state.loaded) {
      return <Expo.AppLoading />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <Animated.View style={[styles.backgroundViewWrapper, {opacity: this.state.backgroundOpacity}]}>
            <Expo.Video
              style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
              resizeMode="cover"
              ref={this._handleVideoRef}
              onLoad={this._fadeInVideo}
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

  _handleVideoRef(videoRef) {
    videoRef.loadAsync(videoSource, {
      shouldPlay: true,
      isLooping: true,
    });

    this.videoRef = videoRef;
  }

  _fadeInVideo = () => {
    setTimeout(() => {
      Animated.spring(this.state.backgroundOpacity, {toValue: 1}).start()
    }, 500);
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
    fontSize: 50,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});

Expo.registerRootComponent(App);
