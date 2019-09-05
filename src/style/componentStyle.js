import { StyleSheet, Dimensions } from 'react-native';

function vw(percentageWidth) {
  return Dimensions.get('window').width * (percentageWidth / 100);
}

const MARGIN = vw(1);
const backgroundColorPrimary = '#F2F6FE';
const colorPrimary = '#6545a8';
const colorSecondary = '#605faa';
const textColorPrimary = '#444444';
const textColorSecondary = '#B2C3DB';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColorPrimary
  },
  buttonPrimary: {
    width: 270,
    height: 50,
    backgroundColor: '#6545a8',
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#605faa',
    borderRadius: 30,
    padding: 10,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    width: 100
  },
  buttonTextPrimary: {
    color: '#fafafa',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 15,
    paddingTop: 5,
  },
  buttonTextSecondary: {
    color: 'white',
    fontSize: 12,
    alignSelf: 'center'
  },
  inputBox: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  },
  textLabel: {
    textAlign: 'center',
    color: '#000000',
    alignSelf: 'center',
    fontSize: 20
  }




})
