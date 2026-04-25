import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/register')({
	component: Register
});

function Register() {
	return <div></div>;
}
