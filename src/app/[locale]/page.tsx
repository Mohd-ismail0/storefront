import { redirect } from 'next/navigation';

export default async function LocaleRedirect(props: { 
	params: Promise<{ locale: string }> 
}) {
	const { locale } = await props.params;
	
	// Redirect to default channel
	redirect(`/${locale}/default-channel`);
}