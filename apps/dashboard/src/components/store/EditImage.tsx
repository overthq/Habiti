import React from 'react';
import { View, Image } from 'react-native';

// Allow both image removal and replacement.

const EditImage: React.FC = () => {
	return (
		<View>
			<Image source={{ uri: '' }} />
		</View>
	);
};

export default EditImage;
