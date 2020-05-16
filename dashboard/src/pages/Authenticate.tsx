import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
	PageBackground,
	OnboardingContainer,
	OnboardingHeader,
	OnboardingInput,
	OnboardingButton,
	OnboardingDescription
} from './Onboarding';
import { useAuthenticateManagerMutation } from '../types';

const Authenticate = () => {
	const [, authenticateManager] = useAuthenticateManagerMutation();
	const { push } = useHistory();
	const { storeId } = useParams();
	// Query the store, make sure it exists.
	// If it doesn't, navigate back to the "landing" page.

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
						if (data?.authenticateManager) {
							localStorage.setItem('onboarding-email', email);
							push(`/store/${storeId}/verify-code`);
						}
					}}
				>
					{({ handleChange, isSubmitting }) => (
						<Form>
							<OnboardingHeader>Sign in to store</OnboardingHeader>
							<OnboardingDescription>
								Enter your email address below.
							</OnboardingDescription>
							<OnboardingInput
								name='email'
								onChange={handleChange('email')}
								placeholder='Your email address'
							/>
							<OnboardingButton type='submit' disabled={isSubmitting}>
								Send verification code
							</OnboardingButton>
						</Form>
					)}
				</Formik>
			</OnboardingContainer>
		</PageBackground>
	);
};

export default Authenticate;
