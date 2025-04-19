import { redirect } from 'react-router';

export async function clientLoader() {
	return redirect('/home');
}

export default function Component() {
	return <div>Catchall</div>;
}
