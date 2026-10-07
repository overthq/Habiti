import React from 'react';
import {
	KeyboardToolbar,
	type KeyboardToolbarProps
} from 'react-native-keyboard-controller';

import { themes } from './styles/theme';

export const KEYBOARD_TOOLBAR_HEIGHT = 42;

const toolbarTheme = {
	light: {
		primary: themes.light.text.primary,
		disabled: themes.light.text.disabled,
		background: themes.light.modal.background,
		ripple: themes.light.row.focus
	},
	dark: {
		primary: themes.dark.text.primary,
		disabled: themes.dark.text.disabled,
		background: themes.dark.modal.background,
		ripple: themes.dark.row.focus
	}
};

const FormToolbar: React.FC<KeyboardToolbarProps> = props => (
	<KeyboardToolbar theme={toolbarTheme} {...props} />
);

export default FormToolbar;
