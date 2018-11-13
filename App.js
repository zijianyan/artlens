
import React, { Fragment } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import Lens from './Lens';



export default class App extends React.Component {
  state = {

  };

  render() {
    return (
      <Fragment>
        <Lens />
      </Fragment>
    )
    
  }
}




/**default create react native app code below */

// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

