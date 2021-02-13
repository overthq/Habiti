import React from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	FlatList,
	Dimensions,
	Animated
} from 'react-native';
import { Formik, useFormikContext } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddManagerMutation, useCreateStoreMutation } from '../types/api';
import Button from '../components/global/Button';
import authStyles from '../styles/auth';
import { useAppSelector } from '../redux/store';

const { width } = Dimensions.get('window');

const steps = [
	{
		title: 'Your brand',
		description: '',
		fields: [
			{
				name: 'name',
				placeholder: 'Market',
				label: 'Store name'
			},
			{
				name: 'shortName',
				placeholder: 'market',
				label: 'Store short name'
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
				label: 'Twitter username'
			},
			{
				name: 'instagram',
				placeholder: '@storename',
				label: 'Instagram username'
			},
			{
				name: 'website',
				placeholder: 'https://storename.com',
				label: 'Website URL'
			}
		]
	}
];

interface FormStepProps {
	step: typeof steps[-1];
}

const FormStep: React.FC<FormStepProps> = ({ step }) => {
	const { handleChange, handleBlur } = useFormikContext();

	return (
		<View style={styles.formStep}>
			<Text style={styles.title}>{step.title}</Text>
			{step.fields.map(({ name, placeholder, label }) => (
				<View key={name}>
					<Text style={authStyles.inputLabel}>{label}</Text>
					<TextInput
						style={authStyles.input}
						placeholder={placeholder}
						onChangeText={handleChange(name)}
						onBlur={handleBlur('name')}
					/>
				</View>
			))}
		</View>
	);
};

const CreateStore: React.FC = () => {
	const [, createStore] = useCreateStoreMutation();
	const [, addManager] = useAddManagerMutation();
	const accessToken = useAppSelector(({ auth }) => auth.accessToken);
	const [activeStepIndex, setActiveStepIndex] = React.useState(0);
	const listRef = React.useRef<FlatList>(null);
	const scrollX = new Animated.Value(0);

	const toNext = () => {
		listRef.current?.scrollToIndex({
			animated: true,
			index: activeStepIndex + 1
		});
	};

	const handleScroll = Animated.event([
		{ nativeEvent: { contentOffset: { x: scrollX } } }
	]);

	const isLastStep = activeStepIndex === steps.length - 1;

	const userId = React.useMemo(() => {
		if (accessToken) {
			const claims = JSON.parse(atob(accessToken.split('.')[1]));
			return claims.market['x-hasura-user-id'];
		}
		throw new Error('User id not found');
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<Formik
				initialValues={{
					name: '',
					shortName: '',
					twitter: '',
					instagram: '',
					website: ''
				}}
				onSubmit={async values => {
					try {
						const { data } = await createStore({
							input: { name: values.name, short_name: values.shortName }
						});

						if (data?.insert_stores?.returning[0].id) {
							addManager({
								userId,
								storeId: data.insert_stores?.returning[0].id
							});
						}
					} catch (error) {
						console.log(error);
					}
				}}
			>
				{({ handleSubmit }) => (
					<View style={{ flex: 1 }}>
						<FlatList
							ref={listRef}
							horizontal
							decelerationRate='fast'
							snapToInterval={width}
							showsHorizontalScrollIndicator={false}
							data={steps}
							keyExtractor={s => s.title}
							renderItem={({ item }) => <FormStep step={item} />}
							onMomentumScrollEnd={({
								nativeEvent: {
									contentOffset: { x }
								}
							}) => {
								const sliderIndex = x ? x / width : 0;
								setActiveStepIndex(sliderIndex);
							}}
							onScroll={handleScroll}
						/>
						<Button
							text={isLastStep ? 'Submit' : 'Next'}
							onPress={isLastStep ? handleSubmit : toNext}
						/>
					</View>
				)}
			</Formik>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		marginBottom: 16
	},
	description: {
		fontSize: 16
	},
	input: {
		fontSize: 16,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: '#D3D3D3',
		paddingLeft: 8,
		height: 40
	},
	formStep: {
		width,
		paddingHorizontal: 16
	}
});

export default CreateStore;
