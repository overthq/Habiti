import React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet
} from 'react-native';

// This onboarding process has to be a collection of screens,
// however, since there are no designs yet, it is easy to build this way.

const CreateStore = () => {
	const [name, setName] = React.useState('');
	const [shortName, setShortName] = React.useState('');
	const [twitterUsername, setTwitterUsername] = React.useState('');
	const [instagramUsername, setInstagramUsername] = React.useState('');
	const [websiteUrl, setWebsiteUrl] = React.useState('');

	const handleSubmit = () => {
		console.log('Doing something');
	};

	return (
		<View style={styles.container}>
			<TextInput value={name} onChangeText={setName} />
			<TextInput value={shortName} onChangeText={setShortName} />
			<TextInput value={twitterUsername} onChangeText={setTwitterUsername} />
			<TextInput
				value={instagramUsername}
				onChangeText={setInstagramUsername}
			/>
			<TextInput value={websiteUrl} onChangeText={setWebsiteUrl} />
			<TouchableOpacity onPress={handleSubmit}>
				<Text>Submit</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default CreateStore;
