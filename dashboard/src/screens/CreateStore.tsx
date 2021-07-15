import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	useSharedValue,
	useAnimatedScrollHandler
} from 'react-native-reanimated';
import { useAddManagerMutation, useCreateStoreMutation } from '../types/api';
import Button from '../components/global/Button';
import { useAppSelector } from '../redux/store';
import { updatePreference } from '../redux/preferences/actions';
import Brand from '../components/create-store/Brand';
import Social from '../components/create-store/Social';
import StoreImage from '../components/create-store/StoreImage';

const { width } = Dimensions.get('window');

const steps = [
	{ title: 'Brand', component: <Brand /> },
	{ title: 'Social', component: <Social /> },
	{ title: 'StoreImage', component: <StoreImage /> }
];

const CreateStore: React.FC = () => {
	const [, createStore] = useCreateStoreMutation();
	const [, addManager] = useAddManagerMutation();
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [activeStepIndex, setActiveStepIndex] = React.useState(0);
	const listRef = React.useRef<FlatList>(null);
	const dispatch = useDispatch();
	const scrollX = useSharedValue(0);

	const toNext = () => {
		listRef.current?.scrollToIndex({
			animated: true,
			index: activeStepIndex + 1
		});
	};

	const handleViewableItemsChanged = React.useCallback(({ viewableItems }) => {
		viewableItems[0] && setActiveStepIndex(viewableItems[0].index);
	}, []);

	const handleScroll = useAnimatedScrollHandler({
		onScroll: ({ contentOffset: { x } }) => {
			scrollX.value = x;
		}
	});

	const isLastStep = activeStepIndex === steps.length - 1;

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

						if (data?.insert_stores_one?.id) {
							await addManager({
								userId,
								storeId: data.insert_stores_one.id
							});

							dispatch(
								updatePreference({ activeStore: data.insert_stores_one.id })
							);
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
							renderItem={({ item }) => item.component}
							onViewableItemsChanged={handleViewableItemsChanged}
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
