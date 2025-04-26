import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
	return (
		<nav className='border-b'>
			<div className='container py-4 flex justify-between items-center'>
				<Link href='/'>
					<Image
						src='/images/habiti-wordmark-black.svg'
						alt='Habiti'
						height={30}
						width={85}
					/>
				</Link>
			</div>
		</nav>
	);
};

export default Header;
