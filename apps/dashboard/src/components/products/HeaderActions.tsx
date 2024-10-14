import { Icon } from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, StyleSheet, Pressable } from 'react-native';

import {
	AppStackParamList,
	ProductsStackParamList
} from '../../types/navigation';

const HeaderActions = () => {
	const { navigate } =
		useNavigation<NavigationProp<AppStackParamList & ProductsStackParamList>>();

	return (
		<View style={styles.container}>
			<Pressable onPress={() => navigate('Products.Search')}>
				<Icon name='search' size={22} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12
	}
});

export default HeaderActions;
