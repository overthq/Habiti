import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '../components/global/Button';
import { logOut } from '../redux/auth/actions';
import { useAppSelector } from '../redux/store';

const Profile = () => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const dispatch = useDispatch();

	return (
		<SafeAreaView style={styles.container}>
			<Text>User ID: {userId}</Text>
			<Button text='Log Out' onPress={() => dispatch(logOut())} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default Profile;
