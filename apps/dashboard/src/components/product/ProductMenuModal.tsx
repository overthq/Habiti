import {
	Icon,
	IconType,
	Row,
	SheetView,
	Typography,
	useTheme
} from '@habiti/components';
import { View, StyleSheet } from 'react-native';

import { useSheet, useSheetParams } from '../../navigation/Sheets';

interface ProductMenuRowProps {
	title: string;
	onPress(): void;
	icon: IconType;
	destructive?: boolean;
}

const ProductMenuRow: React.FC<ProductMenuRowProps> = ({
	icon,
	title,
	onPress,
	destructive
}) => {
	const { theme } = useTheme();

	return (
		<Row onPress={onPress} style={styles.menuButton}>
			<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
				<Icon
					name={icon}
					color={destructive ? theme.text.error : theme.text.secondary}
					size={16}
				/>
				<Typography variant={destructive ? 'error' : 'primary'}>
					{title}
				</Typography>
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	menuButton: {
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 16,
		paddingRight: 12,
		paddingVertical: 12
	}
});

const ProductMenuModal = () => {
	const { onEditProduct, onDeleteProduct, onShareProduct, onViewInBrowser } =
		useSheetParams<'productMenu'>();
	const { closeSheet } = useSheet();

	const handle = (action: () => void) => () => {
		closeSheet();
		action();
	};

	return (
		<SheetView>
			<ProductMenuRow
				title='Edit'
				icon='pencil'
				onPress={handle(onEditProduct)}
			/>
			<ProductMenuRow
				title='View in browser'
				icon='arrow-up-right'
				onPress={handle(onViewInBrowser)}
			/>
			<ProductMenuRow
				title='Share'
				icon='upload'
				onPress={handle(onShareProduct)}
			/>
			<ProductMenuRow
				title='Delete product'
				icon='trash'
				destructive
				onPress={handle(onDeleteProduct)}
			/>
		</SheetView>
	);
};

export default ProductMenuModal;
