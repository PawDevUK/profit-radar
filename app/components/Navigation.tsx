import NavigationClient from './NavigationClient';
import { getAllPlatforms } from '../../lib/platforms';

export default async function Navigation() {
	const platforms = await getAllPlatforms();
	return <NavigationClient platforms={platforms} />;
}
