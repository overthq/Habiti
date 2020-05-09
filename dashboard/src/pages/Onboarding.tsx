import React from 'react';
import styled from 'styled-components';

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
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
	padding: 20px;
`;

const Onboarding = () => {
	return (
		<PageBackground>
			<OnboardingContainer>Onboarding</OnboardingContainer>
		</PageBackground>
	);
};

export default Onboarding;
