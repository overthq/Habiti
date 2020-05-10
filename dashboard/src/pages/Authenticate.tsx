import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import {
	PageBackground,
	OnboardingContainer,
	OnboardingInput
} from './Onboarding';
import { useAuthenticateManagerMutation } from '../types';

const Authenticate = () => {
	const [, authenticateManager] = useAuthenticateManagerMutation();
	const { push } = useHistory();
	const { storeId } = useParams();

	return (
		<PageBackground>
			<OnboardingContainer>
				<Formik
					initialValues={{ email: '' }}
					onSubmit={async ({ email }) => {
						const { data } = await authenticateManager({
							storeId,
							email
						});
						console.log(data);
						push(`/store/${storeId}/verify-code`);
					}}
				>
					{({ handleChange, handleSubmit, isSubmitting }) => (
						<form onSubmit={handleSubmit}>
							<h2>Log in to store</h2>
							<OnboardingInput
								name='email'
								onChange={handleChange('email')}
								placeholder='Your email address'
							/>
							<button type='submit' disabled={isSubmitting}>
								Submit
							</button>
						</form>
					)}
				</Formik>
			</OnboardingContainer>
		</PageBackground>
	);
};

export default Authenticate;
