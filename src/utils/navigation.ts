import { NavigationProp, ParamListBase } from '@react-navigation/native';

export function goToPreviousPage(navigation: NavigationProp<ParamListBase>) {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
}
