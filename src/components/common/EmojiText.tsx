import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

const EMOJI_SEGMENT =
  /\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F|\u200D\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F)*)*|\p{Regional_Indicator}{2}|[✓✕✏⭐☆○⏳←→]/gu;

export type TextSegment = { type: 'text' | 'emoji'; value: string };

export function splitTextWithEmoji(text: string): TextSegment[] {
  if (!text) {
    return [];
  }

  const segments: TextSegment[] = [];
  const regex = new RegExp(EMOJI_SEGMENT.source, 'gu');
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'emoji', value: match[0] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', value: text });
  }

  return segments;
}

function containsEmoji(text: string): boolean {
  return new RegExp(EMOJI_SEGMENT.source, 'u').test(text);
}

function flattenChildrenToString(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      return '';
    })
    .join('');
}

function emojiSegmentStyle(baseStyle?: StyleProp<TextStyle>): TextStyle {
  const flat = StyleSheet.flatten(baseStyle) ?? {};
  const { fontWeight: _fontWeight, fontFamily: _fontFamily, ...rest } = flat;
  return {
    ...rest,
    fontFamily: 'Apple Color Emoji',
  };
}

type Props = Omit<TextProps, 'children'> & {
  children: React.ReactNode;
};

export default function EmojiText({ children, style, ...rest }: Props) {
  const text = flattenChildrenToString(children);

  if (Platform.OS !== 'ios' || !containsEmoji(text)) {
    return (
      <Text style={style} {...rest}>
        {children}
      </Text>
    );
  }

  const segments = splitTextWithEmoji(text);

  if (segments.length === 1 && segments[0].type === 'emoji') {
    return (
      <Text style={emojiSegmentStyle(style)} {...rest}>
        {text}
      </Text>
    );
  }

  return (
    <Text style={style} {...rest}>
      {segments.map((segment, index) =>
        segment.type === 'emoji' ? (
          <Text key={index} style={emojiSegmentStyle(style)}>
            {segment.value}
          </Text>
        ) : (
          segment.value
        ),
      )}
    </Text>
  );
}
