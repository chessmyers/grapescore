import React, {Component} from 'react';
import { View, Text } from 'react-native';
import GameButtonPrimary from '../components/GameButtonPrimary';
import { AirbnbRating } from 'react-native-elements';
import Traits from '../constants/Traits';
import FirebaseBackend from '../services/FirebaseBackend';
import componentStyle from '../style/componentStyle';

// View that presents questions to the players
class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionNum: 0,
      questions: [],
      results: {},
      gameId: ''
    };
    this.onQuestionAnswered = this.onQuestionAnswered.bind(this);
  }

  componentDidMount(): void {
    const gameId: string = this.props.navigation.getParam('gameId', null);
    const players: string[] = this.props.navigation.getParam('players', null);
    const questions = [];
    players.forEach((player) => {
      if (player !== FirebaseBackend.userID()) {
        Traits.forEach((trait) => {
          questions.push(<Question trait={trait} player={player} onQuestionAnswered={this.onQuestionAnswered}/>)
        })
      }
    });
    this.setState({
      questions,
      gameId
    })
  }

// {
//   player1: {
//     happy: 1,
//     sad: 5,
//   },
//   player2: {
//     smart: 5,
//     funny: 3
//   }
// }


  // triggers when player submits rating for given player
  onQuestionAnswered(player, trait, rating) {
    this.setState((prevState) => {
      // deep copy previous results to make changes
      const newResults = JSON.parse(JSON.stringify(prevState.results));
      const newPersonData = Object.assign({}, newResults[player]);
      newPersonData[trait] = rating;
      newResults[player] = newPersonData;
      const nextQuestion = prevState.questionNum + 1;
      return {
        results: newResults,
        questionNum: nextQuestion
      }
  }, () => {
      // check if there are any questions remaining
      if (this.state.questionNum === this.state.questions.length) {
        // no more questions
        const results = this.state.results;
        FirebaseBackend.addResult(results, this.state.gameId)
          .then((res) => {
            this.props.navigation.navigate("Results", {
              gameId: this.state.gameId
            })
          })
          .catch(err => console.warn(err))

      }
    })
  }

  render() {
    return (
      <View style={componentStyle.container}>
        {this.state.questions[this.state.questionNum]}
      </View>
    );
  }
}

class Question extends Component {
  static defaultProps = {
    player: '',
    trait: '',
    onQuestionAnswered() {}
  };
  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      answerChosen: false
    };
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  submitAnswer() {
    this.props.onQuestionAnswered(this.props.player, this.props.trait, this.state.rating);
  }

  render() {
    const disabled = this.state.answerChosen;
    return (
      <View style={componentStyle.container}>
        <Text>Rate {this.props.player} on their</Text>
        <Text>{this.props.trait}</Text>

        <AirbnbRating showRating count={10} defaultRating={5} onFinishRating={(rating) => {
            this.setState({
              rating,
              answerChosen: true
            })
        }} />

        <GameButtonPrimary disabled={disabled} text={"Choose!"} onPress={this.submitAnswer} />
      </View>
    );
  }


}

export default Questions;
