import React from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';

export interface ModalProps {
	isOpen?: boolean;
	close?: () => void;
}

const overlayElement = document.getElementById('overlay');

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
	background-color: rgba(94, 94, 94, 0.5);
`;

const ModalContainer = styled.div`
	padding: 15px;
	border-radius: 6px;
	background-color: #ffffff;
	box-shadow: 0 4px 6px hsla(0, 0%, 0.2);
`;

const Modal: React.FC<ModalProps> = ({ children, isOpen, close }) => {
	const handleKeyDown = React.useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape' && close) {
				event.preventDefault();
				close();
			}
		},
		[close]
	);

	React.useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown, true);
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [isOpen, handleKeyDown]);

	if (!overlayElement || !isOpen) return null;

	return createPortal(
		<Overlay onClick={close}>
			<ModalContainer>{children}</ModalContainer>
		</Overlay>,
		overlayElement
	);
};

export default Modal;
