import React from 'react';
import { Platform } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import { Icon, IconType } from '../components/icons';

export const getIcon = (routeName: string): IconType => {
	switch (routeName) {
		case 'For You':
			return 'home';
		case 'Explore':
			return 'search';
		case 'Carts':
			return 'shoppingBag';
		case 'Profile':
			return 'user';
	}
	throw new Error('Specified route does not exist.');
};

export const modalOptions = {
	headerShown: false,
	gestureEnabled: true,
	cardOverlayEnabled: true,
	...(Platform.OS === 'ios'
		? TransitionPresets.ModalPresentationIOS
		: TransitionPresets.RevealFromBottomAndroid)
};

export const tabBarOptions = {
	activeTintColor: 'black',
	inactiveTintColor: 'gray',
	showLabel: false
};

export const tabScreenOptions = ({ route }: any): any => ({
	tabBarIcon: ({ color }: any) => (
		<Icon name={getIcon(route.name)} color={color} size={28} />
	)
});
