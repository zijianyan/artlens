
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import rgbHex from 'rgb-hex';

export default class Color extends React.Component {
  state = {

  };

  getRGB(colorObj) {
    const { color } = colorObj;
    const { red, green, blue } = color;
    return `rgb(${red}, ${green}, ${blue})`
    // console.log(`getRGB: rgb(${red}, ${green}, ${blue})`)

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




const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

