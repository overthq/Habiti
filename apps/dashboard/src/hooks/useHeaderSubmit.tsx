import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Typography } from '@habiti/components';
import { HeaderButton } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AppStackParamList } from '../navigation/types';

interface UseHeaderSubmitOptions {
	onSubmit(): void;
	label?: string;
	disabled?: boolean;
	loading?: boolean;
}

// Places a form's submit action in the header, on the right.
// `headerRight` covers Android (via CustomHeader) and older iOS, while
// `unstable_headerRightItems` renders natively on iOS 26.
const useHeaderSubmit = ({
	onSubmit,
	label = 'Save',
	disabled = false,
	loading = false
}: UseHeaderSubmitOptions) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<AppStackParamList>>();

	// `handleSubmit` returns a fresh callback on every render, so we read it
	// through a ref to keep `setOptions` from running on each one.
	const submitRef = React.useRef(onSubmit);

	React.useLayoutEffect(() => {
		submitRef.current = onSubmit;
	});

	const handlePress = React.useCallback(() => submitRef.current(), []);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderButton disabled={disabled || loading} onPress={handlePress}>
					{loading ? <ActivityIndicator /> : <Typography>{label}</Typography>}
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label,
					onPress: handlePress,
					disabled: disabled || loading
				}
			]
		});
	}, [navigation, handlePress, label, disabled, loading]);
};

export default useHeaderSubmit;
