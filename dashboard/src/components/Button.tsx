import styled from 'styled-components';

interface ButtonProps {
	color: string;
	textColor: string;
}

const Button = styled.button<ButtonProps>`
	border-radius: 8px;
	background-color: ${({ color }) => color};
	color: ${({ textColor }) => textColor};
	font-weight: 500;
	font-size: 16px;
	padding: 0.5rem 0.75rem;
	border: none;
	cursor: pointer;
`;

export default Button;
