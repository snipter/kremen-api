import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Checkbox from './index';

storiesOf('Checkbox', module)
  .add('Checked', () => <Checkbox checked={true} onChange={action('onChange')} />)
  .add('Not checked', () => <Checkbox onChange={action('onChange')} />);
