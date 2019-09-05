import React, {Component} from 'react';
import {Text, TouchableOpacity, View, TextInput, StyleSheet, Button, Image} from "react-native";
//import InstagramLogin from "react-native-instagram-login";
import FirebaseBackend from '../services/FirebaseBackend';

import componentStyle from '../style/componentStyle';

import firebase from 'react-native-firebase';

const INITIAL_STATE = {
  user: null,
  message: '',
  codeInput: '',
  phoneNumber: '+1',
  confirmResult: null,
  error: null,
  newPlayerFirstName: '',
  newPlayerLastName: ''
};

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = INITIAL_STATE
  }

  componentDidMount(): void {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user.toJSON()})
      } else {
        // User has been signed out, reset the state
        this.setState(INITIAL_STATE);
      }
    })
  }

  componentWillUnmount(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Takes inputted phone number from state and sends code to it for signin
  signIn = () => {
    const {phoneNumber} = this.state;
    this.setState({message: 'Sending code...'});

    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => {
        this.setState({
          confirmResult,
          message: 'Code has been sent!'
        })
      })
      .catch(error => this.setState({message: `Sign In With Phone Error: ${error.message}`}));
  };

  // takes inputted code from state and checks it against confirmResult from state; if code is one sent, logs user in
  confirmCode = () => {
    const {codeInput, confirmResult} = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then(user => {
          FirebaseBackend.checkUserNew(this.state.phoneNumber)
            .then((res) => {
              if (res.empty) {
                // new user
                this.setState({
                  user
                });
              } else {
                // returning user, just sign them in
                this.props.navigation.navigate('App');
              }
            })
            .catch(err => console.warn(err))
        })
        .catch(error => this.setState({message: `Code confirm error: ${error.message}`}))
    }
  };

  addNewUser = () => {
    const { newPlayerFirstName, newPlayerLastName, phoneNumber } = this.state;
    if (newPlayerFirstName !== '' && newPlayerLastName !== '') {
      FirebaseBackend.addNewUser(newPlayerFirstName, newPlayerLastName, phoneNumber)
        .then(res => {
          this.props.navigation.navigate('App');
        })
        .catch(err => console.warn(err))
    } else {
      this.setState({
        message: 'Please enter both a first and last name'
      })
    }
  };

  renderPhoneNumberInput() {
    const {phoneNumber} = this.state;

    return (
      <View style={{padding: 25}}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{height: 40, marginTop: 15, marginBottom: 15}}
          onChangeText={value => this.setState({phoneNumber: value})}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn}/>
      </View>
    );
  }

  renderMessage() {
    const {message} = this.state;

    if (!message.length) return null;

    return (
      <Text style={{padding: 5, backgroundColor: '#000', color: '#fff'}}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const {codeInput} = this.state;

    return (
      <View style={{marginTop: 25, padding: 25}}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{height: 40, marginTop: 15, marginBottom: 15}}
          onChangeText={value => this.setState({codeInput: value})}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode}/>
      </View>
    );
  }

  render() {
    const {user, confirmResult} = this.state;
    return (
      <View style={{flex: 1}}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {/*User Signup Screen: */}
        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#77dd77',
              flex: 1,
            }}
          >
            <Image source={require('../assets/grapesLogo.png')} style={{width: 100, height: 100, marginBottom: 25}}/>
            <Text>{JSON.stringify(user)}</Text>
            <Text>First Name:</Text>
            <TextInput
              style={componentStyle.inputBox}
              value={this.state.newPlayerFirstName}
              onChangeText={(text) => this.setState({newPlayerFirstName: text})}
              maxLength={20}
              multiLine={false}
              placeholder={"First name..."}
              autoCapitalize={"words"}
            />
            <Text>Last Name: </Text>
            <TextInput
              style={componentStyle.inputBox}
              value={this.state.newPlayerLastName}
              onChangeText={(text) => this.setState({newPlayerLastName: text})}
              maxLength={20}
              multiLine={false}
              placeholder={"Last name..."}
              autoCapitalize={"words"}
            />
            <Button title="Join GrapeScore!" onPress={this.addNewUser}/>
          </View>
        )}
      </View>
    );
  }
}

//   render() {
//     const disabled = parseInt(this.state.phoneNumber, 10).toString().length < 7;
//     return (
//       <View>
//         <LinearGradient
//           style={styles.header}
//           colors={['#6F86D6', '#48C6EF']}
//           start={{ x: 0.0, y: 0.25 }}
//           end={{ x: 0.5, y: 1.0 }}
//         >
//           <View style={styles.titleContainer}>
//             <Image source={require('../assets/grapesLogo.png')} />
//           </View>
//         </LinearGradient>
//         <View style={styles.marginTopValue}>
//           <View style={styles.recentlyPlayed}>
//             <Text style={styles.titleText}>Login</Text>
//             <View>
//               <TouchableOpacity onPress={()=> this.instagramLogin.show()}>
//                 <Text style={{color: 'black'}}>Login</Text>
//               </TouchableOpacity>
//               <InstagramLogin
//                 ref= {ref => this.instagramLogin= ref}
//                 clientId='1468665cb9f84b28ad5713109be40880'
//                 redirectUrl='https://www.google.com'
//                 scopes={['public_content', 'follower_list']}
//                 onLoginSuccess={(token) => console.warn( token )}
//                 onLoginFailure={(data) => console.warn(data)}
//               />
//             </View>
//             <View style={styles.container}>
//               <TextInput
//                 style={styles.textInput}
//                 autoCapitalize="none"
//                 placeholder="Phone Number"
//                 onChangeText={phoneNumber => this.setState({ phoneNumber })}
//                 value={this.state.email}
//               />
//               <Button disabled={disabled} title="Login" onPress={this.handleLogin} />
//               <Button
//                 title="Don't have an account? Sign Up"
//                 onPress={() => this.props.navigation.navigate('SignUp')}
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    height: 155,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  marginTopValue: {
    marginTop: 80
  },
  recentlyPlayed: {
    margin: 10,
    borderRadius: 10,
    shadowColor: '#444',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    paddingLeft: 10,
    paddingTop: 10,
    padding: 5,
    backgroundColor: 'white',
    height: 150,
  },
  titleText: {
    color: 'dodgerblue',
    fontSize: 17,
    textAlign: 'left',
    justifyContent: 'center',
    paddingLeft: 10
  }

});

export default SignIn;
