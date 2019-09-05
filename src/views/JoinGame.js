import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native'
import GameButtonPrimary from '../components/GameButtonPrimary';
import FirebaseBackend from '../services/FirebaseBackend';

import componentStyle from '../style/componentStyle';

class JoinGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      error: null,
    };
    this.checkJoinGame = this.checkJoinGame.bind(this);
    this.joinTheGame = this.joinTheGame.bind(this);
  }

  checkJoinGame() {
    FirebaseBackend.checkJoinGame(this.state.code)
      .then(res => {
        if (res.empty) {
          // wrong code or game not created yet
          this.setState({error: "No game with that code"})
        } else {
          const game = res.docs[0].data();
          const id: string = res.docs[0].id;
          if (game.state === 'started') {
            // game has already started
            this.setState({error: "This game has already started"})
          } else if (game.state === 'accepting' && game.players.length >= game.maxPlayers) {
            this.setState({error: "This game is already full"})
          } else if (game.state === 'accepting' && game.players.length < game.maxPlayers) {
            console.warn("Game joined!");
            this.joinTheGame(id);
          } else {
            this.setState({error: 'Error joining game'});
          }
        }
      })
      .catch(err => {
        console.warn(err.message);
        this.setState({error: "We had trouble joining this game...Are you connected to the internet?"})
      })
  }

  joinTheGame(id: string) {
    FirebaseBackend.joinTheGame(id)
      .then(res => {
        console.warn(res);
        this.props.navigation.navigate("GameLobby", {
          gameId: id,
          admin: false,
          code: this.state.code,
          maxPlayers: 0
        })
      })
      .catch(err => {
        console.warn(err)
        this.setState({error: "Failed to join game"})
      })
  }

  render() {
    const buttonDisabled: boolean = this.state.code.length < 6;
    return (
      <View style={componentStyle.container}>
        <Text>Join A Game</Text>
        <TextInput
          style={componentStyle.inputBox}
          onChangeText={(text) => this.setState({code: text})}
          value={this.state.code}
          multiline={false}
          editable={true}
          maxLength={6}
          autoCapitalize={"none"}
          autoCompleteType={'off'}
          autoCorrect={false}
          autoFocus={true}
        />
        <GameButtonPrimary text="Submit Code" onPress={this.checkJoinGame} disabled={buttonDisabled}/>
        <Text>{this.state.error && this.state.error}</Text>
      </View>
    );
  }
}

export default JoinGame;
