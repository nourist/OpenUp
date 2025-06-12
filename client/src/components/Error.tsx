import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
	children?: React.ReactNode;
	onRefresh?: () => void;
	keys?: (string | number)[][];
	className?: string;
}

const Error = ({ children, onRefresh, keys = [], className = '' }: Props) => {
	const { t } = useTranslation('error');

	const queryClient = useQueryClient();

	return (
		<div className={`flex-center h-full w-full flex-col gap-2 ${className}`}>
			<h1 className="text-base-content/60 text-3xl font-semibold">(╯°□°）╯︵ ┻━┻</h1>
			<p className="text-base-content/70 capitalize">
				{t('error')}: {children}
			</p>
			<button
				className="bg-primary text-neutral-content capitalize py-2 rounded-lg px-4"
				onClick={onRefresh || (() => keys.forEach((item) => queryClient.invalidateQueries({ queryKey: item, exact: true })))}
			>
				{t('refresh')}
			</button>
		</div>
	);
};

export default Error;
