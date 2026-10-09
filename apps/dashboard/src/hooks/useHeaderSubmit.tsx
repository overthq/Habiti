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

const useHeaderSubmit = ({
	onSubmit,
	label = 'Save',
	disabled = false,
	loading = false
}: UseHeaderSubmitOptions) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<AppStackParamList>>();

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
