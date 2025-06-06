import { useSearchParams } from 'react-router';

import ContactSidebar from '~/components/ContactSidebar';
import DiscoverFriends from '~/components/DiscoverFriends';

const Contacts = () => {
	const [searchParams] = useSearchParams();

	const tab = Number(searchParams.get('tab')) || 1;

	return (
		<>
			<ContactSidebar />
			<div className="flex-1 bg-base-200 sm:block hidden">{tab === 6 && <DiscoverFriends />}</div>
		</>
	);
};

export default Contacts;
