import React, { Fragment } from 'react';
import { View, WebView } from 'react-native';
import rgbHex from 'rgb-hex';

export default class GoogleArtPalette extends React.Component {
  
  // getRGB(colorObj) {
  //   const { color } = colorObj;
  //   const { red, green, blue } = color;
  //   return `rgb(${red}, ${green}, ${blue})`
  // }

  createUrl(_colors) {
    const colors = _colors.slice(0, 5);
    const hex = colors.map( color => {
      const { rgb } = color;
      const { red, green, blue } = rgb;
      return rgbHex(red, green, blue);
    })

    const urlStart = ''

  }

  render() {
    const { colors } = this.props;


    // https://artsexperiments.withgoogle.com/artpalette/colors/a43977-f0bcc6-aabd2f-569a45-e2e0d3



    return (
      <Fragment>
        <WebView
          source={{uri: 'https://artsexperiments.withgoogle.com/artpalette/colors/a43977-f0bcc6-aabd2f-569a45-e2e0d3'}}
          style={{marginTop: 20}}
        />
      </Fragment>
    )
  }

}