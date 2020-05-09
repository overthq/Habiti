import React from 'react';
import { PageBackground, OnboardingContainer } from './Onboarding';
import { Formik } from 'formik';

const Authenticate = () => {
	return (
		<PageBackground>
			<OnboardingContainer>
				<Formik
					initialValues={{ email: '' }}
					onSubmit={async ({ email }) => {
						console.log(email);
					}}
				>
					{({ handleChange, handleSubmit, isSubmitting }) => (
						<form onSubmit={handleSubmit}>
							<input
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
