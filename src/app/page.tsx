import { redirect } from 'next/navigation';

export default function RootRedirect() {
	// Redirect to English locale by default
	redirect('/en');
}