import React, { Component } from 'react';
import { Button } from "react-native-elements";


class MenuButton extends Component {
  static defaultProps = {
    text: '',
    onPress() {},
    disabled: false
  };

  render() {
    const { text, disabled } = this.props;
    return (
      <Button raised title={text} disabled={disabled} onPress={() => this.props.onPress()} />
    );
  }

}

export default MenuButton;
