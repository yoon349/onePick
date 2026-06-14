import React, { forwardRef } from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

export const SIGNATURE_WEB_STYLE = `
  .m-signature-pad { border: none; box-shadow: none; margin: 0; width: 100%; height: 100%; }
  .m-signature-pad--body { border: none; width: 100%; height: 100%; }
  .m-signature-pad--body canvas {
    touch-action: none;
    width: 100% !important;
    height: 100% !important;
  }
  .m-signature-pad--footer { display: none; margin: 0; }
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    background: #ffffff;
  }
`;

type Props = {
  onOK: (signature: string) => void;
  onBegin?: () => void;
  onEnd?: () => void;
  onEmpty?: () => void;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
};

const SignaturePad = forwardRef<any, Props>(function SignaturePad(
  { onOK, onBegin, onEnd, onEmpty, style, width, height },
  ref,
) {
  const hasExplicitSize = typeof width === 'number' && typeof height === 'number';
  const canvasStyle = hasExplicitSize
    ? { width, height }
    : { flex: 1 as const };

  return (
    <View
      style={[hasExplicitSize ? { width, height } : { flex: 1 }, style]}
      collapsable={false}
      pointerEvents="auto"
    >
      <SignatureCanvas
        ref={ref}
        onOK={onOK}
        onBegin={onBegin}
        onEnd={onEnd}
        onEmpty={onEmpty}
        webStyle={SIGNATURE_WEB_STYLE}
        backgroundColor="white"
        penColor="black"
        dotSize={3}
        minWidth={2}
        maxWidth={4}
        autoClear={false}
        imageType="image/png"
        descriptionText=""
        clearText=""
        confirmText=""
        nestedScrollEnabled
        androidLayerType={Platform.OS === 'android' ? 'software' : 'hardware'}
        androidHardwareAccelerationDisabled={Platform.OS === 'android'}
        webviewProps={{
          nestedScrollEnabled: true,
          overScrollMode: 'never',
          setBuiltInZoomControls: false,
          displaysZoomControls: false,
          scrollEnabled: false,
          domStorageEnabled: true,
          androidLayerType: Platform.OS === 'android' ? 'software' : 'hardware',
          androidHardwareAccelerationDisabled: Platform.OS === 'android',
          ...(Platform.OS === 'android' ? { textZoom: 100 } : {}),
        }}
        style={canvasStyle}
      />
    </View>
  );
});

export default SignaturePad;
