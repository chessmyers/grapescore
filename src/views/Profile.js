import React, {Component} from 'react';
import { View, Text } from 'react-native';

import FirebaseBackend from '../services/FirebaseBackend';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      ratings: {}
    }
  }


  componentDidMount(): void {
    FirebaseBackend.loadUserData()
      .then(doc => {
        this.setState({
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          ratings: doc.data().ratings
        })
      })
      .catch(err => console.warn(err))
  }

  render() {
    return (
      <View>
        <Text>Profile Screen</Text>
        <Text>Name: </Text>
        <Text>{this.state.firstName} {this.state.lastName}</Text>
        <Text>Ratings:</Text>
        <Text>{JSON.stringify(this.state.ratings)}</Text>
      </View>
    );
  }
}

export default Profile;
