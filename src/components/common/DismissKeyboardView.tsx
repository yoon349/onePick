import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function DismissKeyboardView({ children, style, ...rest }: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
}
