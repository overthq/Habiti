import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const IndexPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');

		if (accessToken) {
			navigate('/home');
		} else {
			navigate('/login');
		}
	}, [navigate]);

	return null;
};

export default IndexPage;
