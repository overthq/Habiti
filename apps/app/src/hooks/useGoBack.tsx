import { Icon, IconType } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

const useGoBack = (icon?: IconType, margin?: number) => {
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitleVisible: false,
			headerBackImage: () => (
				<Icon
					name={icon ?? 'chevron-left'}
					size={28}
					style={{ marginLeft: margin ?? 8 }}
				/>
			)
		});
	}, [navigation, icon]);
};

export default useGoBack;
