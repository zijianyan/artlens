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
    
    const hex = colors.map( colorObj => {
      const { color } = colorObj;
      console.log('color:', color);
      const { red, green, blue } = color;
      return rgbHex(red, green, blue);
    })

    const urlStart = 'https://artsexperiments.withgoogle.com/artpalette/colors/'

    const colorUrl = hex.join('-');

    return urlStart + colorUrl;

    // https://artsexperiments.withgoogle.com/artpalette/colors/a43977-f0bcc6-aabd2f-569a45-e2e0d3

  }

  render() {
    const { colors } = this.props;


    const colorUrl = this.createUrl(colors);


    return (
      <Fragment>
        <WebView
          source={{uri: colorUrl}}
          style={{marginTop: 20}}
        />
      </Fragment>
    )
  }

}