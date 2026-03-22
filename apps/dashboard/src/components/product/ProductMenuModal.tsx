import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import {
	BottomModal,
	Icon,
	IconType,
	Row,
	Typography,
	useTheme
} from '@habiti/components';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductMenuRowProps {
	title: string;
	onPress(): void;
	icon?: IconType;
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

interface ProductMenuModalProps {
	modalRef: React.RefObject<BottomSheetModal>;
	onEditProduct(): void;
	onDeleteProduct(): void;
	onViewInBrowser(): void;
	onShareProduct(): void;
}

const ProductMenuModal: React.FC<ProductMenuModalProps> = ({
	modalRef,
	onEditProduct,
	onDeleteProduct,
	onShareProduct,
	onViewInBrowser
}) => {
	const { bottom } = useSafeAreaInsets();

	const handleRowPress = () => {
		modalRef.current?.close();
	};

	return (
		<BottomModal modalRef={modalRef} enableDynamicSizing>
			<BottomSheetView style={{ paddingBottom: bottom }}>
				<ProductMenuRow
					title='Edit'
					icon='pencil'
					onPress={() => {
						handleRowPress();
						onEditProduct();
					}}
				/>
				<ProductMenuRow
					title='View in browser'
					icon='arrow-up-right'
					onPress={() => {
						handleRowPress();
						onViewInBrowser();
					}}
				/>
				<ProductMenuRow
					title='Share'
					icon='upload'
					onPress={() => {
						handleRowPress();
						onShareProduct();
					}}
				/>
				<ProductMenuRow
					title='Delete product'
					icon='trash'
					destructive
					onPress={() => {
						handleRowPress();
						onDeleteProduct();
					}}
				/>
			</BottomSheetView>
		</BottomModal>
	);
};

export default ProductMenuModal;
