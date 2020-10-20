import React, { CSSProperties, FC } from "react";
import { m } from "styles";

interface Props {
  className?: string;
  style?: CSSProperties;
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
}

export const Image: FC<Props> = ({
  className,
  style,
  src,
  width,
  height,
  alt,
}) => {
  return (
    <img
      className={className}
      style={m(
        style,
        width !== undefined ? { width } : undefined,
        height !== undefined ? { height } : undefined
      )}
      src={src}
      alt={alt}
    />
  );
};
