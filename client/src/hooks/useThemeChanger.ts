import { useEffect } from 'react';

import useThemeStore from '~/stores/themeStore';

const useThemeChanger = () => {
	const { theme } = useThemeStore();

	useEffect(() => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme);
	}, [theme]);
};

export default useThemeChanger;
