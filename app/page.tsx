import { redirect } from 'next/navigation';

export default function Home() {
	redirect('/howItWorks');
	return null;
}
