import { Text } from 'components/Common';
import React, { FC, MouseEventHandler, TouchEventHandler } from 'react';
import { Suggestion } from 'react-places-autocomplete';
import { m, Styles, ViewStyleProps } from 'styles';

interface Props extends ViewStyleProps {
  item: Suggestion;
  id: string | undefined;
  role: 'option';
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onTouchStart: TouchEventHandler;
  onTouchEnd: TouchEventHandler;
  onClick: MouseEventHandler;
}

export const PlaceSearchSuggestion: FC<Props> = ({ style, item, ...props }) => {
  const activeStyle = item.active
    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
    : { backgroundColor: '#ffffff', cursor: 'pointer' };
  return (
    <div style={m(styles.container, activeStyle, style)} {...props}>
      <Text>{item.description}</Text>
    </div>
  );
};

const styles: Styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '8px',
    color: '#333',
    cursor: 'pointer',
    fontSize: '13px',
    borderTop: '1px solid #ddd',
  },
};
