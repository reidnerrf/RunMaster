import React from 'react';
import { Image, ImageProps, View } from 'react-native';

export default function GeneratedImage({ text, aspect = '16:9', style, ...rest }: { text: string; aspect?: '1:1' | '16:9' | '4:3'; style?: ImageProps['style'] } & Omit<ImageProps, 'source'>) {
  const uri = `https://api.a0.dev/assets/image?text=${encodeURIComponent(text)}&aspect=${encodeURIComponent(aspect)}`;
  return (
    <View>
      <Image source={{ uri }} style={style} {...rest} />
    </View>
  );
}