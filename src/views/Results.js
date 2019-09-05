import React, {Component} from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import componentStyle from '../style/componentStyle';
import FirebaseBackend from '../services/FirebaseBackend';
import firebase from 'react-native-firebase';



class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameOver: false,
      myResults: {}
    }
    this.getMyResults = this.getMyResults.bind(this);
  }

  componentDidMount(): void {
    const gameId: string = this.props.navigation.getParam('gameId', null);
    FirebaseBackend.getGameResults(gameId)
      .then(results => {
        FirebaseBackend.getGame(gameId)
          .then(game => {
            if (game.data().players.length === results.size) {
              // all players have finished voting
              // end game so players see results
              FirebaseBackend.endGame()
                .then(res => {
                  console.warn("game has ended")
                })
                .catch(err => console.warn(err))
            }
          })
      })
      .catch(err => console.warn(err))


    this.unsubscribe = firebase.firestore().collection("games").doc(gameId)
      .onSnapshot((doc) => {
        if (doc.data().gameOver === true) {
          // all players have finished game
          this.getMyResults(gameId);
        }
      })
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  getMyResults(gameId: string) {
    const myId = FirebaseBackend.userID();
    const myResults = [];
    FirebaseBackend.getGameResults(gameId)
      .then(results => {
        results.forEach((entry) => {
          if (entry.data()[myId] !== undefined) {
            // rating not made by self
            myResults.push(entry.data()[myId])
          }
        })
      })
      .then(() => {
        // myResults now holds array of objects holding ratings about this user
        // get list of traits to look at; these may change in future
        let traits = [];
        let myAvgRatings = {};
        for (let key in myResults[0]) {
          traits.push(key.toString());
        }
        traits.forEach(trait => {
          let total = 0;
          for (let res in myResults) {
            total += res[trait];
          }
          total /= myResults.length;
          myAvgRatings[trait] = total;
        });

        this.setState({
          myResults: myAvgRatings,
          gameOver: true
        })

      })
      .catch(err => console.warn(err))
  }

  render() {
    const { gameOver } = this.state;
    return (
      <View style={componentStyle.container}>
        {gameOver ? <Text>{JSON.stringify(this.state.myResults)}</Text> : <ActivityIndicator/>}
      </View>
    );
  }
}

export default Results;
