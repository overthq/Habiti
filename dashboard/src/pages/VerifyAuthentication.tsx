import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
	PageBackground,
	OnboardingContainer,
	OnboardingHeader,
	OnboardingInput,
	OnboardingButton,
	OnboardingDescription
} from './Onboarding';
import { useVerifyManagerAuthenticationMutation } from '../types';
import useAccessToken from '../hooks/useAccessToken';

const VerifyAuthentication = () => {
	const [code, setCode] = React.useState('');
	const { saveAccessToken } = useAccessToken();
	const [
		,
		verifyManagerAuthentication
	] = useVerifyManagerAuthenticationMutation();
	const { push } = useHistory();
	const { storeId } = useParams();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCode(event.target.value);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const email = localStorage.getItem('onboarding-email');
		if (email) {
			const { data } = await verifyManagerAuthentication({ email, code });
			if (data?.verifyManagerAuthentication) {
				localStorage.removeItem('onboarding-email');
				saveAccessToken(data.verifyManagerAuthentication);
				push(`/store/${storeId}/dashboard`);
			}
		}
	};

	return (
		<PageBackground>
			<OnboardingContainer>
				<OnboardingHeader>Verify authentication</OnboardingHeader>
				<OnboardingDescription>
					A verification code has been sent to your email address. Please, enter
					it below:
				</OnboardingDescription>
				<form onSubmit={handleSubmit}>
					<OnboardingInput name='code' onChange={handleChange} />
					<OnboardingButton type='submit'>Verify Code</OnboardingButton>
				</form>
			</OnboardingContainer>
		</PageBackground>
	);
};

export default VerifyAuthentication;
