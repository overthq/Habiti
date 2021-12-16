import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '../components/global/Button';
import { logOut } from '../redux/auth/actions';
import { useCurrentUserQuery } from '../types/api';

const Profile: React.FC = () => {
	const dispatch = useDispatch();

	const [{ data, fetching }] = useCurrentUserQuery();

	return (
		<SafeAreaView style={styles.container}>
			{fetching ? (
				<ActivityIndicator />
			) : (
				<View>
					<Text style={styles.name}>{data?.currentUser?.name}</Text>
				</View>
			)}
			<Button text='Log Out' onPress={() => dispatch(logOut())} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	name: {
		fontWeight: 'bold',
		fontSize: 28,
		marginBottom: 16
	}
});

export default Profile;
