
import React, { Fragment } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import rgbHex from 'rgb-hex';

export default class Color extends React.Component {

  getRGB(colorObj) {
    const { color } = colorObj;
    const { red, green, blue } = color;
    return `rgb(${red}, ${green}, ${blue})`
  }

  render() {
    const { getRGB } = this;
    const { colors } = this.props;
    return (
      <Fragment>
        <View>
          {
            colors.map( color => {
              return (
                <View style ={{ height: '30px', backgroundColor: 'rgba(200, 200, 0)', padding: '5px' }}>
                <Text>Color Here</Text>
                </View>
                
              )
            })
          }
        </View>
      </Fragment>
    )
  }
  
}

