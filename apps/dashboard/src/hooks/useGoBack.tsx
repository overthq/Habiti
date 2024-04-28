import { Icon, IconType } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';

const useGoBack = (icon?: IconType, margin?: number) => {
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitleVisible: false,
			headerBackImage: () => (
				<Pressable onPress={navigation.goBack}>
					<Icon
						name={icon ?? 'chevron-left'}
						size={28}
						style={{ marginLeft: icon === 'x' ? 12 : margin ?? 8 }}
					/>
				</Pressable>
			)
		});
	}, [navigation, icon]);
};

export default useGoBack;
