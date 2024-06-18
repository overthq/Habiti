import Link from 'next/link';

const Header = () => {
	return (
		<nav style={{ padding: 16 }}>
			<Link href='/'>
				<p style={{ fontWeight: '500', fontSize: '1.1rem' }}>Habiti</p>
			</Link>
		</nav>
	);
};

export default Header;
