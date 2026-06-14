import { StyleSheet } from 'react-native';
import { brand } from '../../public/style/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brand.white,
  },
  topAccent: {
    height: 6,
    backgroundColor: brand.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  slogan: {
    fontSize: 22,
    fontWeight: '700',
    color: brand.ibkDeepBlue,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 48,
    letterSpacing: -0.3,
  },
  logoWrap: {
    marginBottom: 56,
    alignItems: 'center',
  },
  logoImage: {
    width: 240,
    height: 240,
  },
  footer: {
    position: 'absolute',
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  subText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A6478',
    textAlign: 'center',
    lineHeight: 22,
  },
});
