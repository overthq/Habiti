import Image from 'next/image';

import appProductScreen from '@/assets/app-product-screen.png';
import appStoreScreen from '@/assets/app-store-screen.png';

const Hero = () => {
	return (
		<div style={{ padding: '100px 0', textAlign: 'center' }}>
			<h1 style={{ fontSize: '2.8125rem', fontWeight: '700' }}>
				Online shopping, simplified.
			</h1>
			<p style={{ marginTop: 16, fontSize: '1.2rem' }}>
				Habiti helps shoppers and merchants manage their shopping activity in
				one place.
			</p>
			<div>
				<a
					href='https://forms.gle/VXQjP7gcMJvgZivA6'
					target='_blank'
					rel='noopener noreferrer'
				>
					<button
						style={{
							marginTop: 16,
							padding: '12px 24px',
							backgroundColor: '#108910',
							borderRadius: 4,
							color: '#FFFFFF',
							fontSize: '1.1rem',
							fontWeight: '500',
							border: 'none',
							cursor: 'pointer'
						}}
					>
						Request access
					</button>
				</a>
			</div>

			<div
				style={{
					marginTop: 32,
					display: 'flex',
					gap: 16,
					justifyContent: 'center'
				}}
			>
				<Image src={appStoreScreen} alt='App store screen' width={240} />
				<Image src={appProductScreen} alt='App product screen' width={240} />
			</div>
		</div>
	);
};

export default Hero;
