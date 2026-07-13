import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
	Button,
	ScrollableScreen,
	Icon,
	Typography,
	useTheme
} from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useShallow } from 'zustand/react/shallow';
import useStore from '../state';
import { useLogoutMutation } from '../hooks/mutations';
import { ThemeMap } from '../utils/theme';

const Settings: React.FC = () => {
	const theme = useStore(useShallow(state => state.theme));
	const logoutMutation = useLogoutMutation();
	const { navigate } = useNavigation<StackNavigationProp<any>>();

	const handleRowNavigate = React.useCallback(
		(screen: string) => () => {
			navigate(screen);
		},
		[navigate]
	);

	return (
		<ScrollableScreen>
			<SettingRow
				name='Theme'
				onPress={handleRowNavigate('SettingsTheme')}
				displayValue={ThemeMap[theme]}
			/>

			<Button
				text='Log Out'
				onPress={() => logoutMutation.mutate()}
				loading={logoutMutation.isPending}
				style={styles.logOut}
			/>
		</ScrollableScreen>
	);
};

interface SettingRowProps {
	name: string;
	onPress(): void;
	displayValue?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
	name,
	onPress,
	displayValue
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[styles.container, { borderBottomColor: theme.border.color }]}
			onPress={onPress}
		>
			<Typography>{name}</Typography>
			<View style={styles.right}>
				{displayValue ? (
					<Typography variant='secondary'>{displayValue}</Typography>
				) : null}
				<Icon
					name='chevron-right'
					color={theme.text.secondary}
					size={24}
					style={styles.icon}
				/>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	logOut: {
		margin: 8
	},
	container: {
		width: '100%',
		height: 45,
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginLeft: 8
	}
});

export default Settings;
