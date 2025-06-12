import { useEffect } from 'react';

import useThemeStore from '~/stores/themeStore';

const useThemeListener = () => {
	const { updateSystemTheme } = useThemeStore();

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		mediaQuery.addEventListener('change', updateSystemTheme);
		return () => mediaQuery.removeEventListener('change', updateSystemTheme);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export default useThemeListener;
