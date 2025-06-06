import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

import useDebounce from '~/hooks/useDebounce';

const DiscoverFriends = () => {
	const { t } = useTranslation('contact');

	const [search, setSearch] = useState('');
	const q = useDebounce(search, 400);

	return (
		<>
			<h2 className="text-2xl capitalize mb-4 px-8 py-6 bg-base-100 border-b border-base-content/15">{t('discover-new-friends')}</h2>
			<div className="mx bg-base-100 mx-8 p-8 rounded-xl shadow-sm">
				<div className="relative">
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						type="text"
						placeholder={t('type-something-to-search').capitalize()}
						className="!bg-base-300/70 !h-12 focus:!bg-base-200 transition-all duration-200 !px-12"
					/>
					<Search className="absolute left-[12px] top-[12px]" />
					<button className="size-6 rounded-full bg-base-300 hover:bg-base-content/15 right-[12px] top-[12px] absolute flex-center">
						<X size="16" />
					</button>
				</div>
			</div>
		</>
	);
};

export default DiscoverFriends;
