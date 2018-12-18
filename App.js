
import React, { Fragment } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import Lens from './Lens';



export default class App extends React.Component {
  render() {
    return (
      <Fragment>
        <Lens />
      </Fragment>
    )
  }
}
