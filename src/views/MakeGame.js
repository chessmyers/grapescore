import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import FirebaseBackend from '../services/FirebaseBackend';
import GameButtonPrimary from '../components/GameButtonPrimary';
import GameButtonSecondary from '../components/GameButtonSecondary';

import componentStyle from '../style/componentStyle';



class MakeGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // questionsVisible: false,
      code: '',
      maxPlayers: '',
      gameName: '',
      status: 'making'
    };

    this.generateCode = this.generateCode.bind(this);
    this.startGame = this.startGame.bind(this);
    //this.chooseQuestions = this.chooseQuestions.bind(this);
  }


  componentDidMount(): void {
    this.generateCode(6);
  }

  // setQuestionsVisible(show) {
  //   this.setState({
  //     questionsVisible: show
  //   })
  // }

  generateCode(len: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    FirebaseBackend.getGameCodes(result)
      .then(res => {
        if (res.empty) {
          // original code
          this.setState({code: result})
        } else {
          // code in use
          this.generateCode(len);
        }
      })
      .catch(err => console.warn(err))
  }

  // chooseQuestions() {
  //   this.setQuestionsVisible(true);
  // }

  startGame() {
    const maxP = parseInt(this.state.maxPlayers);
    FirebaseBackend.createGame({
      code: this.state.code,
      maxPlayers: maxP,
      name: this.state.gameName
    }).then((res) => {
      console.warn(res);
      this.props.navigation.navigate('GameLobby', {
        admin: true,
        gameId: res.id,
        code: this.state.code,
        maxPlayers: maxP
      });
    })
      .catch((err) => {
        console.warn(err)
      })
  }


  render() {
    const buttonDisabled: boolean = this.state.gameName === '' ||
      this.state.maxPlayers === '' || parseInt(this.state.maxPlayers) > 16 || parseInt(this.state.maxPlayers) < 2;
    return (
      <View style={componentStyle.container}>
        <Text>Make A Game</Text>
        <View style={componentStyle.codeBox}>
          <Text>Code: {this.state.code}</Text>
        </View>
        <View style={styles.options}>
          <View style={styles.optionBox}>
            <Text style={componentStyle.textLabel}>Game Name</Text>
            <TextInput
              style={componentStyle.inputBox}
              value={this.state.gameName}
              onChangeText={(text) => this.setState({gameName: text})}
              blurOnSubmit={true}
              maxLength={20}
              multiLine={false}
              placeholder={"20 characters or less..."}
              autoCapitalize={"words"}
            />
          </View>
          <View style={styles.optionBox}>
            <Text style={componentStyle.textLabel}>Max Players</Text>
            <TextInput
              style={componentStyle.inputBox}
              value={this.state.maxPlayers}
              onChangeText={(text) => this.setState({maxPlayers: text})}
              blurOnSubmit={true}
              maxLength={2}
              multiLine={false}
              placeholder={"16 or fewer..."}
              keyboardType={"numeric"}
            />
          </View>
          {/*<View style={styles.optionBox}>*/}
            {/*<GameButtonSecondary text="Questions..." onPress={this.chooseQuestions}/>*/}
          {/*</View>*/}
          <GameButtonPrimary text="Create Game!" onPress={this.startGame} disabled={buttonDisabled}/>
        </View>


        {/*<Modal isVisible={this.state.questionsVisible}>*/}
          {/*<View style={componentStyle.container}>*/}
            {/*<View>*/}
              {/*<Text>Modal text here</Text>*/}
              {/*<GameButtonSecondary text="Close modal" onPress={() => this.setQuestionsVisible(false)}/>*/}
            {/*</View>*/}
          {/*</View>*/}
        {/*</Modal>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  codeBox: {},
  options: {},
  optionBox: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#000000'
  },
});

export default MakeGame;
