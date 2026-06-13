import React from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Props = ScrollViewProps & {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function FormScrollView({
  children,
  contentContainerStyle,
  ...rest
}: Props) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      {...rest}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flexGrow: 1 }}>
        {children}
      </Pressable>
    </ScrollView>
  );
}
