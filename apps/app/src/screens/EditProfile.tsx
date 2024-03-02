import React from 'react';
import { View } from 'react-native';

import EditProfileMain from '../components/edit-profile/EditProfileMain';
import useGoBack from '../hooks/useGoBack';
import { useCurrentUserQuery } from '../types/api';

const EditProfile: React.FC = () => {
	const [{ data, fetching }] = useCurrentUserQuery();
	useGoBack();

	if (fetching || !data) return <View />;

	return <EditProfileMain currentUser={data.currentUser} />;
};

export default EditProfile;
