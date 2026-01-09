import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface DecodedToken {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'user';
}

export function decodeToken(token: string): DecodedToken | null {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload) as DecodedToken;
	} catch {
		return null;
	}
}

export function getCurrentAdmin(): DecodedToken | null {
	const token = localStorage.getItem('accessToken');
	if (!token) return null;
	return decodeToken(token);
}
