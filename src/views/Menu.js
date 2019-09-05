import React, {Component} from 'react';
import { View, Button } from 'react-native';
import firebase from 'react-native-firebase';
import MenuButton from '../components/MenuButton';

class Menu extends Component {
  componentDidMount(): void {
    console.warn("Mounted")
  }

  signOut() {
    firebase.auth().signOut()
      .then(() => {
        this.props.navigation.navigate("Auth");
      })
      .catch(err => {
        console.warn(err);
      })
  }

  render() {
    return (
      <View>
        <MenuButton title="Profile" onPress={() => this.props.navigation.navigate("Profile")} />
        <MenuButton title="Create Game" onPress={() => this.props.navigation.navigate("MakeGame")} />
        <MenuButton title="Join Game" onPress={() => this.props.navigation.navigate("JoinGame")} />
        <MenuButton title="Sign Out" onPress={() => this.signOut()} />
      </View>
    );
  }
}

export default Menu;
