import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, IconType } from '../components/Icon';

const useGoBack = (icon?: IconType) => {
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<Pressable onPress={navigation.goBack} style={styles.back}>
					<Icon name={icon ?? 'chevron-left'} size={32} />
				</Pressable>
			)
		});
	}, [navigation, icon]);
};

const styles = StyleSheet.create({
	back: {
		paddingLeft: 8
	}
});

export default useGoBack;
