import React, {Component} from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import firebase from 'react-native-firebase';

import componentStyle from '../style/componentStyle';

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }


  componentDidMount(): void {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'App' : 'Auth')
    })
  }

  render() {
    return (
      <View style={componentStyle.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" color="#800080" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default Loading;
