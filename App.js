import React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import SignInScreen from './src/views/SignIn';
import SignUpScreen from './src/views/SignUp';
import MenuScreen from './src/views/Menu';
import LoadingScreen from './src/views/Loading';
import MakeGameScreen from './src/views/MakeGame';
import JoinGameScreen from './src/views/JoinGame';
import GameLobbyScreen from './src/views/GameLobby';
import ProfileScreen from './src/views/Profile';
import QuestionsScreen from './src/views/Questions';
import ResultsScreen from './src/views/Results';

const AppStack = createStackNavigator({Home: MenuScreen, MakeGame: MakeGameScreen,
  JoinGame: JoinGameScreen, GameLobby: GameLobbyScreen, Profile: ProfileScreen, Questions: QuestionsScreen, Results: ResultsScreen});
const AuthStack = createStackNavigator({ SignIn: SignInScreen, SignUp: SignUpScreen });

const App = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: LoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
));

export default App;
