import React from 'react';
import styled from 'styled-components';

const PageBackground = styled.main`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	background-color: #efefef;
`;

const OnboardingContainer = styled.div`
	border-radius: 6px;
	box-shadow: 0 1px 3px hsla(0, 0%, 0.2);
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
