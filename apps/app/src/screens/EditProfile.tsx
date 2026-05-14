import React from 'react';
import { View } from 'react-native';

import EditProfileMain from '../components/edit-profile/EditProfileMain';
import { useCurrentUserQuery } from '../data/queries';

const EditProfile = () => {
	const { data, isLoading } = useCurrentUserQuery();

	if (isLoading || !data) return <View />;

	return <EditProfileMain currentUser={data.user} />;
};

export default EditProfile;
