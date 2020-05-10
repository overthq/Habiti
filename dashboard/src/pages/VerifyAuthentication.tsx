import React from 'react';
import { PageBackground, OnboardingContainer } from './Onboarding';
import { useVerifyManagerAuthenticationMutation } from '../types';
import useAccessToken from '../hooks/useAccessToken';

const VerifyAuthentication = () => {
	const [code, setCode] = React.useState('');
	const { saveAccessToken } = useAccessToken();
	const email = localStorage.getItem('onboarding-email');
	const [
		{ data },
		verifyManagerAuthentication
	] = useVerifyManagerAuthenticationMutation();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCode(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		email && verifyManagerAuthentication({ email, code });
	};

	React.useEffect(() => {
		if (data?.verifyManagerAuthentication) {
			saveAccessToken(data.verifyManagerAuthentication);
		}
	}, [data]);

	return (
		<PageBackground>
			<OnboardingContainer>
				<h2>Verify authentication</h2>
				<p>
					A verification code has been sent to your email address. Please, enter
					it below:
				</p>
				<form onSubmit={handleSubmit}>
					<input name='code' onChange={handleChange} />
					<button type='submit'>Verify Code</button>
				</form>
			</OnboardingContainer>
		</PageBackground>
	);
};

export default VerifyAuthentication;
