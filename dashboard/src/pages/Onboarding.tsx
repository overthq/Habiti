import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '../components/icons';
import { useCreateStoreMutation, useCreateManagerMutation } from '../types';

export const PageBackground = styled.main`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	background-color: #efefef;
`;

export const OnboardingContainer = styled.div`
	border-radius: 6px;
	background-color: #ffffff;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	padding: 20px;
	width: 600px;
	height: 500px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const OnboardingHeader = styled.h1`
	font-size: 32px;
	margin-bottom: 12px;
	text-align: center;
`;

export const OnboardingDescription = styled.p`
	font-size: 16px;
	text-align: center;
	margin-bottom: 16px;
`;

export const OnboardingInput = styled.input`
	height: 50px;
	width: 400px;
	border-radius: 8px;
	margin-bottom: 10px;
	border: 2px solid #777777;
	font-size: 16px;
	padding-left: 10px;
`;

export const OnboardingButton = styled.button`
	height: 50px;
	width: 400px;
	border: none;
	border-radius: 8px;
	background-color: #100100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	font-weight: bold;
	color: #ffffff;
	cursor: pointer;
`;

export const BackButton = styled.button`
	background: none;
	border: none;
	padding: 0;
`;

const steps = [
	{
		title: 'Describe your store',
		description: `We need basic information about your store, to personalize your experience, and make it easy for users to discover you.`,
		fields: [
			{
				name: 'storeName',
				placeholder: 'Name of your store'
			},
			{
				name: 'shortName',
				placeholder: 'Short name for store'
			}
		]
	},
	{
		title: 'Your personal information',
		description: '',
		fields: [
			{
				name: 'name',
				placeholder: 'Your name'
			},
			{
				name: 'email',
				placeholder: 'Your email address'
			}
		]
	}
];

const Onboarding = () => {
	const [step, setStep] = React.useState(0);
	const [, createStore] = useCreateStoreMutation();
	const [, createManager] = useCreateManagerMutation();
	const { push } = useHistory();

	const [state, dispatch] = React.useReducer(
		(p: any, n: any) => ({ ...p, ...n }),
		{
			storeName: '',
			shortName: '',
			name: '',
			email: ''
		}
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (step !== steps.length - 1) {
			return setStep(step + 1);
		}
		// Submit the information
		const { data } = await createStore({
			input: { name: state.storeName, shortName: state.shortName }
		});
		if (data?.createStore?._id) {
			await createManager({
				storeId: data.createStore._id,
				input: { name: state.name, email: state.email }
			});
			localStorage.setItem('onboarding-email', state.email);
			push(`/store/${data.createStore._id}/verify-code`);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ [event.target.name]: event.target.value });
	};

	return (
		<PageBackground>
			<OnboardingContainer>
				<form
					style={{ display: 'flex', flexDirection: 'column' }}
					onSubmit={handleSubmit}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						{step !== 0 && (
							<BackButton onClick={() => setStep(step - 1)}>
								<Icon name='chevronLeft' color='#000000' size={28} />
							</BackButton>
						)}

						<h2 style={{}}>{steps[step].title}</h2>
					</div>
					<p>{steps[step].description}</p>
					{steps[step].fields.map(({ name, placeholder }) => (
						<OnboardingInput
							key={name}
							name={name}
							placeholder={placeholder}
							onChange={handleChange}
						/>
					))}
					{step !== 0 && (
						<button onClick={() => setStep(step - 1)}>Back</button>
					)}
					<button type='submit'>
						{step !== steps.length - 1 ? 'Next' : 'Submit'}
					</button>
				</form>
			</OnboardingContainer>
		</PageBackground>
	);
};

export default Onboarding;
