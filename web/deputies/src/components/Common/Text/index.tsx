import { isArray, isNumber } from "lodash";
import React, { PureComponent, ReactNode } from "react";
import { IStyle, m, MergeStyleVal, px } from "styles";

interface Props {
  className?: string;
  style?: IStyle | MergeStyleVal[];
  children?: ReactNode;
  block?: boolean;
  size?: number | string;
  bold?: boolean;
  color?: string;
  content?: string;
}

export class Text extends PureComponent<Props> {
  private getSizeStyle(): IStyle | undefined {
    const { size } = this.props;
    if (!size) {
      return undefined;
    }
    if (isNumber(size)) {
      return { fontSize: px(size) };
    }
    return { fontSize: size };
  }

  render() {
    const {
      className,
      style,
      block,
      children,
      color,
      bold,
      content,
    } = this.props;
    const finalStyle = m(
      block && { display: "block " },
      this.getSizeStyle(),
      color ? { color } : null,
      bold ? { fontWeight: "bold" } : null,
      isArray(style) ? m(...style) : style
    );
    return (
      <span className={className} style={finalStyle}>
        {content || children}
      </span>
    );
  }
}
