import { useTranslation } from 'react-i18next';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';

const ChatList = () => {
	const { t } = useTranslation('chat');
	const [tab, setTab] = useState(1);

	return (
		<div className="h-full bg-base-100 border px-5 py-4 border-base-content/15 sm:max-w-80 flex-1">
			<div className="flex items-center gap-2">
				<h2 className="text-2xl tracking-tighter capitalize py-2 font-medium">{t('recent')}</h2>
				<button className="size-10 bg-base-300 flex-center hover:shadow-sm hover:bg-base-content/10 rounded-full ml-auto transition-all duration-200">
					<Search size="18" />
				</button>
				<button className="size-10 bg-primary/90 hover:bg-primary rounded-full hover:shadow-sm text-white flex-center hover:*:size-6 transition-all duration-200">
					<Plus size="18" className="transition-all duration-200" />
				</button>
			</div>
			{/*tabs */}
			<div className="p-1 mt-4 bg-base-300 rounded-md *:data-[active=true]:bg-primary *:data-[active=true]:text-white text-sm flex gap-1 *:bg-base-100 *:rounded-md *:flex-1 *:py-1.5 *:capitalize *:transition-all *:duration-200">
				<button data-active={tab === 1} onClick={() => setTab(1)}>
					{t('all')}
				</button>
				<button data-active={tab === 2} onClick={() => setTab(2)}>
					{t('friends')}
				</button>
				<button data-active={tab === 3} onClick={() => setTab(3)}>
					{t('groups')}
				</button>
			</div>
		</div>
	);
};

export default ChatList;
