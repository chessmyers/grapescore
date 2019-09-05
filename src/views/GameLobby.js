import React, {Component} from 'react';
import {Text, View, ActivityIndicator} from 'react-native'
import { Overlay } from "react-native-elements";

import firebase from 'react-native-firebase';

import componentStyle from '../style/componentStyle';
import GameButtonPrimary from "../components/GameButtonPrimary";

// View where players wait for game to start and see other players
class GameLobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: '',
      gameCode: '',
      players: [],
      admin: true,
      showConfirmCancel: false,
      maxPlayers: 0
    };
    this.unsubscribe = null;

    this.startGame = this.startGame.bind(this);
    this.cancelGame = this.cancelGame.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
    this.goToGame = this.goToGame.bind(this);
  }


  componentDidMount(): void {
    const gameId = this.props.navigation.getParam('gameId', null);
    const admin = this.props.navigation.getParam('admin', false);
    const gameCode = this.props.navigation.getParam('code', '');
    const maxPlayers = this.props.navigation.getParam('maxPlayers', 0);
    this.setState({
      gameId,
      admin,
      gameCode,
      maxPlayers
    });

    this.unsubscribe = firebase.firestore().collection("games")
      .doc(gameId).onSnapshot((doc) => {
        if (!doc.exists) {
          // game has been cancelled
          this.props.navigation.navigate("Home");
        } else if (doc.data().state === 'started') {
          // game is now starting
          this.goToGame();
        } else {
          // just update the player list
          this.setState({
            players: doc.data().players
          })
        }
    })
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  // allows the admin to start the game
  startGame() {
    if (this.state.players.length < 2 || this.state.players.length > this.state.maxPlayers) {
      // not enough or too many players
      console.warn("Cannot start game");
    } else {
      // game is good to start
      firebase.firestore().collection("games").doc(this.state.gameId).update({
        state: 'started'
      }).then(res => {
        this.goToGame();
      }).catch(err => {
        console.warn(err);
      })
    }

  }

  goToGame() {
    this.props.navigation.navigate('Questions', {
      players: this.state.players,
      gameId: this.state.gameId,

    });

  }

  // After confirmation, erase this game from firebase, go back to main menu, removes all players from it
  cancelGame() {
    firebase.firestore().collection("games").doc(this.state.gameId).delete()
      .then(() => {
        this.props.navigation.navigate("Home");
      })
      .catch(err => console.warn(err));
  }

  // allows non-admins to leave the game and return to main menu
  leaveGame() {
    firebase.firestore().collection("games").doc(this.state.gameId).update({
      players: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
    }).then(res => {
      this.props.navigation.navigate("Home");
    }).catch(err => {
      console.warn(err)
    })
  }


  render() {
    const { admin } = this.state;
    return (
      <View style={componentStyle.container}>
        <Text>Code:  {this.state.gameCode}</Text>
        {admin ?
          <View>
            <GameButtonPrimary text="Start Game!" onPress={this.startGame}/>
            <GameButtonPrimary text="Cancel Game" onPress={() => this.setState({showConfirmCancel: true})}/>
          </View>
          :
          <View>
            <GameButtonPrimary text="Leave Game" onPress={this.leaveGame}/>
          </View>
        }

        <Text>Waiting for players...</Text>
        <ActivityIndicator size="large" color="#800080" />
        <Text>Players:</Text>
        {this.state.players.map((player) => (
          <PlayerEntry key={player} id={player} />
        ))}

        <Overlay isVisible={this.state.showConfirmCancel} onBackdropPress={() => this.setState({showConfirmCancel: false})}>
          <View>
            <Text>Cancel Game?</Text>
            <GameButtonPrimary text="Yes" onPress={this.cancelGame} />
            <GameButtonPrimary text="No" onPress={() => this.setState({showConfirmCancel: false})}/>
          </View>
        </Overlay>
      </View>
    );
  }

}

class PlayerEntry extends Component {
  static defaultProps = {
    id: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      name: ""
    }
  }

  componentDidMount(): void {
    firebase.firestore().collection("users").doc(this.props.id).get()
      .then(res => {
        const name = res.data().firstName.concat(" ").concat(res.data().lastName);
        this.setState({
          name
        })
      })
      .catch(err => {
        console.warn(err);
      })
  }

  render() {
    const { name } = this.state;
    return (
      <View>
        {name}
      </View>
    );
  }

}

export default GameLobby;
