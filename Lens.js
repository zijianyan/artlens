import axios from 'axios';
import rgbHex from 'rgb-hex';
import React, { Fragment } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Button, WebView, ActivityIndicator } from 'react-native';
import { Camera, Permissions, FileSystem, ImagePicker } from 'expo';
import styles from './Lens.styles';
import Colors from './Colors';
import GoogleArtPalette from './GoogleArtPalette';

export default class CameraExample extends React.Component {
  constructor() {
    super();
    this.state = {
      image: null,
      loading: false,
      webView: false,
      colors: [],
      description: '',
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      ratios: [],
      barcodeScanning: false,
      faceDetecting: false,
      faces: [],
      newPhotos: false,
      permissionsGranted: false,
      pictureSize: '320x180', //1920x1080 
      pictureSizes: [],
      pictureSizeId: 0,
      showGallery: false,
      showMoreOptions: false,
    }
    this.takePicture = this.takePicture.bind(this);
    this.requestAnalysis = this.requestAnalysis.bind(this);
    this.returnToCamera = this.returnToCamera.bind(this);
    this.toggleWebView = this.toggleWebView.bind(this);
  }

  pickImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
      base64: true
    });
    const { base64 } = image;
    await this.requestAnalysis(base64);
    if (!image.cancelled) {
      this.setState({ image: image.uri });
    }
  };

  idealTextColor(bgColor) {
    var nThreshold = 150;
    var components = this.getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";   
  }

  getRGBComponents(color) {       
      var r = color.substring(1, 3);
      var g = color.substring(3, 5);
      var b = color.substring(5, 7);
      return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
      };
  }

  getRGB(colorObj) {
    const { color } = colorObj;
    const { red, green, blue } = color;
    return `rgb(${red}, ${green}, ${blue})`
  }

  toggleWebView() {
    if (this.state.webView) {
      this.setState({ colors: [] })
    }
    this.setState({ webView: !this.state.webView })
  }
  
  async requestAnalysis(base64) {
   try { 
    this.setState({ loading: true })
    const body = {
        requests:[
          {
            image:{
              content: base64,
            },
            features:[
              {
                "type": "IMAGE_PROPERTIES"
              },
            ]
          },
        ],
      };
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleAPIKey}` , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const cloudVisionData = await response.json();
    const cloudVisionColors = cloudVisionData.responses[0].imagePropertiesAnnotation.dominantColors.colors;
    this.setState({ colors: cloudVisionColors, loading: false });      
   }
   catch(ex) {
   }
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
    //   console.log(e, 'Directory existssss');
    // });
  }

  async takePicture() {
    if (this.camera) {
      console.log('takePicture, taking picture');
      const picture = await this.camera.takePictureAsync({ base64: true })
      const { base64 } = picture;
      await this.requestAnalysis(base64);
    }
  };

  // async onPictureSaved (photo) {
  //   await FileSystem.moveAsync({
  //     from: photo.uri,
  //     to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`,
  //   });
  //   this.setState({ newPhotos: true });
  // }

  returnToCamera() {
    this.setState({ colors: [] })
  }

  render() {
    if(this.state.loading) {
      return (
        <View style={{ flex: 1,  justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818'}}>
          <ActivityIndicator size={100} style={{}}/>
          <Text style={{ color: '#ffffff'}} >Creating Palette...</Text>
        </View>
      )
    }
    const { colors, webView } = this.state;
    const { takePicture, getRGB, returnToCamera, toggleWebView } = this;
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      if (webView) {
        return (
          <Fragment>
            <GoogleArtPalette colors={colors}/>
            <View style={{ padding: 30, backgroundColor: '#181818' }}>  
              <Button
                title='Return To Camera'
                onPress={toggleWebView}
              />
            </View>
          </Fragment>
        )
      } 
      if (colors.length) {
        return ( 
          <Fragment> 
            <ScrollView style={{ backgroundColor: '#404040', paddingTop: 40 }}>
              {
                colors.map( (color, index) => {
                  const rgb = getRGB(color);
                  const hex = rgbHex(rgb);
                  const textColor = this.idealTextColor(hex);
                  return (
                    <View key={index} style={{ elevation: 8, borderRadius: 15, marginTop: 15, marginRight: 30, marginBottom: 15, marginLeft: 30, height: 200, backgroundColor: getRGB(color), padding: 15 }}>
                      <Text style={{ color: textColor }}>{rgb}</Text>
                      <Text style={{ color: textColor }}>#{hex}</Text>
                    </View>
                  )
                })
              }
            </ScrollView>
              <View style={{ elevation: 9, padding: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#404040'}}>  
                  <Button
                    title='Return to Camera'
                    onPress={returnToCamera}
                    style={{ flex: 1}}
                  />
                  <Button
                    title='Google Art'
                    onPress={toggleWebView}
                    style={{ flex: 1}}
                  />
            </View>
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            <View style={{ flex: 1 }}>
              <Camera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.camera}
              onCameraReady={this.collectPictureSizes}
              type={this.state.type}
              flashMode={this.state.flash}
              autoFocus={this.state.autoFocus}
              zoom={this.state.zoom}
              whiteBalance={this.state.whiteBalance}
              ratio={this.state.ratio}
              pictureSize={this.state.pictureSize}
              onMountError={this.handleMountError}
              >
              </Camera>
              <View style={{ elevation: 9, padding: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#404040' }}>  
                <Button
                  title='Take Photo'
                  onPress={takePicture}
                  style={{ flex: 1 }}
                />
                <Button
                  title='Pick Image'
                  onPress={this.pickImage}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </Fragment>
        );
      }
    }
  }
}


