import axios from 'axios';

import googleAPIKey from './cloudVision';


import rgbHex from 'rgb-hex';

import React, { Fragment } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Button, WebView } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
import styles from './Lens.styles';

import Colors from './Colors';

import GoogleArtPalette from './GoogleArtPalette';



export default class CameraExample extends React.Component {
  constructor() {
    super();
    this.state = {
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
    // console.log(`getRGB: rgb(${red}, ${green}, ${blue})`)

  }

  toggleWebView() {
    if (this.state.webView) {
      this.setState({ colors: [] })
    }
    this.setState({ webView: !this.state.webView })
  }

  async requestAnalysis(base64) {
   try { 
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
              // { "type": "LABEL_DETECTION", "maxResults": 5 },
              // { "type": "LOGO_DETECTION", "maxResults": 3 },
              // { "type": "WEB_DETECTION", "maxResults": 1 }
            ]
          },
        ],
      };

    console.log('fetching...');
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleAPIKey}` , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    console.log('fetched!');

    const cloudVisionData = await response.json();
    const cloudVisionColors = cloudVisionData.responses[0].imagePropertiesAnnotation.dominantColors.colors;
    // const cloudLogoDescription = cloudVisionData.responses[0].logoAnnotations[0].description;
    // const cloudWebLabel = cloudVisionData.responses[0].webDetection.bestGuessLabels[0].label;

    // console.log('logoDescription:', cloudLogoDescription);
    // console.log('cloudWebLabel:', cloudWebLabel);

    // console.log('cloudVisonColors:', cloudVisionColors);
    this.setState({ colors: cloudVisionColors });
    // console.log('this.state.colors:', this.state.colors);

   }
   catch(ex) {
     console.log(ex);
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

  logPress() {
    console.log('button pressed');
  }

  returnToCamera() {
    this.setState({ colors: [] })
  }

  render() {
    const { colors, webView } = this.state;
    const { takePicture, logPress, getRGB, returnToCamera, toggleWebView } = this;



    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {


      // if (this.state.description) {
      //   return (
      //     <View>
      //       <Text>
      //         {this.state.description}
      //       </Text>
      //     </View>
      //   )
      // } 

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
                  console.log('textColor:', textColor);

                  return (
                    <View key={index} style={{ elevation: 8, borderRadius: 15, marginTop: 15, marginRight: 30, marginBottom: 15, marginLeft: 30, height: 200, backgroundColor: getRGB(color) }}>
                      <Text style={{ color: textColor }}>{rgb}</Text>
                      <Text style={{ color: textColor }}>{hex}</Text>
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

                <View style={{ elevation: 9, padding: 30, backgroundColor: '#404040' }}>  
                  <Button
                    title='CREATE PALETTE'
                    onPress={takePicture}
                  />
                </View>
            </View>
          </Fragment>
        );
      }

      
    }
  }
}




// Animatable.Text animation="zoomInUp"

                  // <TouchableOpacity
                  //   style={{
                  //     flex: 0.3,
                  //     alignSelf: 'flex-end',
                  //     alignItems: 'center',
                  //   }}
                  //   onPress={takePicture}>
                  //   <Text
                  //     style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  //     {' '}Button take picture{' '}
                  //   </Text>
                  // </TouchableOpacity>


              // <TouchableOpacity
              //   style={{
              //     flex: 0.1,
              //     alignSelf: 'flex-end',
              //     alignItems: 'center',
              //   }}
              //   onPress={() => {
              //     this.setState({
              //       type: this.state.type === Camera.Constants.Type.back
              //         ? Camera.Constants.Type.front
              //         : Camera.Constants.Type.back,
              //     });
              //   }}>
              //   <Text
              //     style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              //     {' '}Flip{' '}
              //   </Text>
              // </TouchableOpacity>

              

            //               ref={ref => {
            //   this.camera = ref;
            // }}




              //             <TouchableOpacity
              //   style={{
              //     flex: 0.1,
              //     alignSelf: 'flex-end',
              //     alignItems: 'center',
              //   }}
              //   onPress={takePicture}>
              //   <Text
              //     style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              //     {' '}Take Picture{' '}
              //   </Text>
              // </TouchableOpacity>



/****met info */

// axios.get('https://metmuseum.org/api/collection/collectionlisting?q=john%20singer%20sargent&perPage=20&searchField=All&sortBy=relevance&offset=0&pageSize=0')
//   .then( res => res.data )
//   .then( data => data.results )
//   .then( results => {
//     const painting = results[0];
//   })

// const sampleResult =
// {
//   title: 'Madame X (Madame Pierre Gautreau)',
//   description: 'John Singer Sargent (American, Florence 1856–1925 London)',
//   artist: '  ',
//   culture: 'American',
//   teaserText: '<p>John Singer Sargent (American, Florence 1856–1925 London) </p><p>Date: 1883–84<br/>Accession Number: 16.53</p>',
//   url: '/art/collection/search/12127?searchField=All&amp;sortBy=relevance&amp;ft=john+singer+sargent&amp;offset=0&amp;rpp=20&amp;pos=1',
//   image: 'https://images.metmuseum.org/CRDImages/ad/mobile-large/DT91.jpg',
//   regularImage: 'ad/web-additional/DT91.jpg',
//   largeImage: 'ad/web-large/DT91.jpg',
//   date: '1883–84',
//   medium: 'Oil on canvas',
//   accessionNumber: '16.53',
//   galleryInformation: 'On view at The Met Fifth Avenue in <a href=\'http://maps.metmuseum.org/galleries/fifth-ave/2/771\' target=\'_blank\'>Gallery 771</a>'
// }





/**** example cloudVision response below */


// cloudVisionData: Object {
// [14:13:29]   "responses": Array [
// [14:13:29]     Object {
// [14:13:29]       "logoAnnotations": Array [
// [14:13:29]         Object {
// [14:13:29]           "boundingPoly": Object {
// [14:13:29]             "vertices": Array [
// [14:13:29]               Object {
// [14:13:29]                 "x": 73,
// [14:13:29]                 "y": 71,
// [14:13:29]               },
// [14:13:29]               Object {
// [14:13:29]                 "x": 158,
// [14:13:29]                 "y": 71,
// [14:13:29]               },
// [14:13:29]               Object {
// [14:13:29]                 "x": 158,
// [14:13:29]                 "y": 116,
// [14:13:29]               },
// [14:13:29]               Object {
// [14:13:29]                 "x": 73,
// [14:13:29]                 "y": 116,
// [14:13:29]               },
// [14:13:29]             ],
// [14:13:29]           },
// [14:13:29]           "description": "Vase with Irises",
// [14:13:29]           "score": 0.37161863,
// [14:13:29]         },
// [14:13:29]       ],
// [14:13:29]       "webDetection": Object {
// [14:13:29]         "bestGuessLabels": Array [
// [14:13:29]           Object {
// [14:13:29]             "label": "metropolitan museum of art",
// [14:13:29]           },
// [14:13:29]         ],
// [14:13:29]         "pagesWithMatchingImages": Array [
// [14:13:29]           Object {
// [14:13:29]             "pageTitle": "Beautiful Vincent van Gogh Metal Prints artwork for sale ... - <b>Art</b>.com",
// [14:13:29]             "partialMatchingImages": Array [
// [14:13:29]               Object {
// [14:13:29]                 "url": "https://imgc.artprintimages.com/img/print/vincent-van-gogh-irises_u-l-pnxjyf0.jpg?src=gp&w=300&h=300",
// [14:13:29]               },
// [14:13:29]             ],
// [14:13:29]             "url": "https://www.art.com/gallery/id--a84-d779949/vincent-van-gogh-metal-prints.htm",
// [14:13:29]           },
// [14:13:29]         ],
// [14:13:29]         "partialMatchingImages": Array [
// [14:13:29]           Object {
// [14:13:29]             "url": "https://item-shopping.c.yimg.jp/i/j/primavera-cards_ns45rcf0bk",
// [14:13:29]           },
// [14:13:29]         ],
// [14:13:29]         "visuallySimilarImages": Array [
// [14:13:29]           Object {
// [14:13:29]             "url": "http://www.celebrityartbypam.com/uploads/2/1/4/4/21443894/hockneyswimmingpoolwithshoes_orig.jpg",
// [14:13:29]           },
// [14:13:29]         ],
// [14:13:29]         "webEntities": Array [
// [14:13:29]           Object {
// [14:13:29]             "description": "Irises",
// [14:13:29]             "entityId": "/m/037t7s",
// [14:13:29]             "score": 1.3225499,
// [14:13:29]           },
// [14:13:29]         ],
// [14:13:29]       },
// [14:13:29]     },
// [14:13:29]   ],
// [14:13:29] }