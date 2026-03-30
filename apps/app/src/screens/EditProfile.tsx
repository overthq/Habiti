import React from 'react';
import { View } from 'react-native';

import EditProfileMain from '../components/edit-profile/EditProfileMain';
import useGoBack from '../hooks/useGoBack';
import { useCurrentUserQuery } from '../data/queries';

const EditProfile = () => {
	const { data, isLoading } = useCurrentUserQuery();
	useGoBack();

	if (isLoading || !data) return <View />;

	return <EditProfileMain currentUser={data} />;
};

export default EditProfile;
