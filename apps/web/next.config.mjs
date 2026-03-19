import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {
		root: path.join(__dirname, '../..')
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/dpth7k6sh/image/upload/**'
			}
		]
	}
};

export default nextConfig;
