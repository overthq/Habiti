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
// On second thought, using a horizontal FlatList with programmatic scrolls is probably the only way to go.
// This component should also be refactored to use Formik, as the form state handling is terrible

// We can build the FlatList dynamically using this. It's also an interesting challenge to create the form initial state from this array.
// TODO: Add step for store logo upload. Find a way to crop images.
// Also remember to create a CRON job that cross-references every image url in the database with Cloudinary, and prune every image that is not referenced (as they are just dead objects).

const steps = [
	{
		title: 'Your brand',
		description: '',
		fields: [
			{
				name: 'name',
				placeholder: '',
				label: ''
			},
			{
				name: 'shortName',
				placeholder: '',
				label: ''
			}
		]
	},
	{
		title: 'Your online presence',
		description: '',
		fields: [
			{
				name: 'twitter',
				placeholder: '@storename',
				label: ''
			},
			{
				name: 'instagram',
				placeholder: '@storename',
				label: ''
			},
			{
				name: 'website',
				placeholder: 'https://storename.com',
				label: ''
			}
		]
	}
];

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
