import { Icon, IconType } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';

const useGoBack = (icon?: IconType, margin?: number) => {
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<Pressable style={{ marginRight: 4 }} onPress={navigation.goBack}>
					<Icon
						name={icon ?? 'chevron-left'}
						size={28}
						style={{ marginLeft: margin ?? -8 }}
					/>
				</Pressable>
			)
		});
	}, [navigation, icon]);
};

export default useGoBack;
