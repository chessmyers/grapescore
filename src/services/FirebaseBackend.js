import firebase from 'react-native-firebase';

class Firebase {

  // Auth API

  static userID = () => firebase.auth().currentUser.uid;

  static checkUserNew = (phone: number) => firebase.firestore().collection("users").where("phone", "==", phone).get();

  static addNewUser = (firstName: string, lastName: string, phone: number) => firebase.firestore().collection("users").doc(Firebase.userID()).set({
    firstName,
    lastName,
    phone,
    ratings: {
      looks: 0,
      smart: 0,
      style: 0,
      humor: 0,
      charisma: 0
    }
  });

  // User Data API

  static loadUserData = () => firebase.firestore().collection("users").doc(Firebase.userID()).get();



  // Create Game Api

  static getGameCodes = (code: string) => firebase.firestore().collection("games").where("code", "==", code).get();

  static createGame = (options: {}) => firebase.firestore().collection("games").add({
    code: options.code,
    name: options.name,
    players: [Firebase.userID()],
    maxPlayers: options.maxPlayers,
    state: 'accepting',
    gameOver: false
  });




  // Join Game API

  static checkJoinGame = (code: string) => firebase.firestore().collection("games").where("code", "==", code).get();

  static joinTheGame = (id: string) => firebase.firestore().collection("games").doc(id).update({
    players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
  });


  // Play Game API


  // Add one user's results to server
  static addResult = (results: Object, gameId: string) =>
    firebase.firestore().collection("games").doc(gameId).collection("results").add(results)

  static getGameResults = (gameId: string) => firebase.firestore().collection("games").doc(gameId)
    .collection("results").get();

  static getGame = (gameId: string) => firebase.firestore().collection("games").doc(gameId).get();

  static endGame = (gameId: string) => firebase.firestore().collection("games").doc(gameId).update({
    gameOver: true
  })


}

export default Firebase;
