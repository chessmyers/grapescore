import React from 'react';
import { Text, TextInput, View, Image } from 'react-native';
import GameButtonPrimary from '../components/GameButtonPrimary';
import GameButtonSecondary from '../components/GameButtonSecondary';

import componentStyle from '../style/componentStyle';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null
    }
  }

  handleSignUp = () => {
    // TODO: Firebase stuff...
    console.log('handleSignUp')
  }

  render() {
    return (
      <View style={componentStyle.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
        <Text style={{ color: 'red' }}>
          {this.state.errorMessage}
        </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={componentStyle.inputBox}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={componentStyle.inputBox}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <GameButtonPrimary text="Sign Up" onPress={this.handleSignUp} />
        <GameButtonSecondary
          text="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('SignIn')}
        />
      </View>
    )
  }
}

export default SignUp;
