import React from 'react';
import { Icon, IconType } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton, HeaderButton } from '@react-navigation/elements';

const useGoBack = (icon?: IconType) => {
	const navigation = useNavigation();

	// React.useLayoutEffect(() => {
	// 	navigation.setOptions({
	// 		headerLeft: () => (
	// 			// <HeaderBackButton />
	// 			// <HeaderButton onPress={navigation.goBack} accessibilityLabel='Back'>
	// 			// 	<Icon name={icon ?? 'chevron-left'} size={28} />
	// 			// </HeaderButton>
	// 		)
	// 	});
	// }, [navigation, icon]);
};

export default useGoBack;
