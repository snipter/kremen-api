import { isArray } from "lodash";
import React, {
  LegacyRef,
  MouseEvent,
  PureComponent,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import { IStyle, IStyles, m, MergeStyleVal } from "styles";

interface Props {
  divRef?:
    | Ref<HTMLDivElement>
    | RefObject<HTMLDivElement>
    | LegacyRef<HTMLDivElement>;
  style?: IStyle | MergeStyleVal[];
  children?: ReactNode;
  className?: string;
  row?: boolean;
  flex?: string;
  column?: boolean;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "flex-end";
  alignItems?:
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "self-start"
    | "self-end";
  cursor?: "pointer";
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
  onMouseMove?: (e: MouseEvent<HTMLElement>) => void;
}

export class View extends PureComponent<Props> {
  render() {
    const {
      className,
      style,
      children,
      row,
      column,
      flex,
      direction,
      justifyContent,
      alignItems,
      cursor,
      onClick,
      divRef,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
    } = this.props;
    const cStyle = m(
      styles.container,
      flex ? { flex } : null,
      row ? { flexDirection: "row" } : null,
      column ? { flexDirection: "column" } : null,
      direction ? { flexDirection: direction } : null,
      justifyContent ? { justifyContent } : null,
      alignItems ? { alignItems } : null,
      cursor ? { cursor } : null,
      isArray(style) ? m(...style) : style
    );
    return (
      <div
        ref={divRef}
        className={className}
        style={cStyle}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {children}
      </div>
    );
  }
}

const styles: IStyles = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
};
