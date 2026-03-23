/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/dpth7k6sh/image/upload/**'
			},
			{
				protocol: 'http',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/dpth7k6sh/image/upload/**'
			}
		]
	}
};

export default nextConfig;
