import React, { Component } from 'react';
import { Text, TouchableOpacity, View} from "react-native";
import { Button } from 'react-native-elements';

import componentStyle from '../style/componentStyle';

class GameButtonSecondary extends Component {
  static defaultProps = {
    text: '',
    onPress() {},
    disabled: false
  };


  render() {
    const { text, disabled } = this.props;
    return (
      <Button type="outline" title={text} disabled={disabled} onPress={() => this.props.onPress()} />
    );
  }

}

export default GameButtonSecondary;
