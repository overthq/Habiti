import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '../components/global/Button';
import { logOut } from '../redux/auth/actions';
import { useAppSelector } from '../redux/store';
import { useCurrentUserQuery } from '../types/api';

const Profile = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const dispatch = useDispatch();

	const [{ data, fetching }] = useCurrentUserQuery({ variables: { userId } });

	return (
		<SafeAreaView style={styles.container}>
			{/* <View>
				<Text style={styles.heading}>Profile</Text>
			</View> */}
			{fetching ? (
				<Text>Fetching...</Text>
			) : (
				<Text>{data?.users_by_pk?.name}</Text>
			)}
			<Button text='Log Out' onPress={() => dispatch(logOut())} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	heading: {
		fontWeight: 'bold',
		fontSize: 32
	}
});

export default Profile;
