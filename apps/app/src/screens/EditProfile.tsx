import React from 'react';
import { View } from 'react-native';
import { useCurrentUserQuery } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import EditProfileMain from '../components/edit-profile/EditProfileMain';

const EditProfile: React.FC = () => {
	const [{ data, fetching }] = useCurrentUserQuery();
	useGoBack();

	if (fetching || !data) return <View />;

	return <EditProfileMain currentUser={data.currentUser} />;
};

export default EditProfile;
