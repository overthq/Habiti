import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Icon, IconType } from '../components/Icon';

const useGoBack = (icon?: IconType) => {
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitleVisible: false,
			headerBackImage: () => <Icon name={icon ?? 'chevron-left'} size={32} />
		});
	}, [navigation, icon]);
};

export default useGoBack;
