import { View, Pressable, StyleSheet } from 'react-native';
import {
	Avatar,
	Typography,
	Icon,
	IconButton,
	Spacer,
	useTheme
} from '@habiti/components';
import { Store } from '../../data/types';

interface StoreHeaderProps {
	store: Store;
	onSwitchStore: () => void;
	onOpenWebPage: () => void;
	onOpenSettings: () => void;
}

const StoreHeader = ({
	store,
	onSwitchStore,
	onOpenWebPage,
	onOpenSettings
}: StoreHeaderProps) => {
	const { theme } = useTheme();

	return (
		<View style={[styles.header, { borderBottomColor: theme.border.color }]}>
			<Pressable
				onPress={onSwitchStore}
				style={{ flexDirection: 'row', alignItems: 'center' }}
			>
				<Avatar
					uri={store.image?.path}
					fallbackText={store.name}
					size={32}
					circle
				/>
				<Spacer x={10} />
				<Typography size='xxlarge' weight='bold'>
					{store.name}
				</Typography>
				<Spacer x={4} />
				<Icon name='chevron-down' size={20} />
			</Pressable>

			<View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
				<IconButton name='globe' size={22} onPress={onOpenWebPage} inset />
				<IconButton name='menu' size={22} onPress={onOpenSettings} inset />
			</View>
		</View>
	);
};

export default StoreHeader;

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: -16,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth
	}
});
