import React, { FC } from 'react';
import { m, ViewStyleProps } from 'styles';

interface Props extends ViewStyleProps {
  className?: string;
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
}

export const Image: FC<Props> = ({ className, style, src, width, height, alt }) => {
  return (
    <img
      className={className}
      style={m(style, width !== undefined ? { width } : undefined, height !== undefined ? { height } : undefined)}
      src={src}
      alt={alt}
    />
  );
};
