import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useLanguageSync = () => {
	const { i18n } = useTranslation();

	useEffect(() => {
		i18n.changeLanguage(localStorage.getItem('lang') || 'en');
		i18n.on('languageChanged', (lng) => {
			localStorage.setItem('lang', lng);
		});
		return () =>
			i18n.off('languageChanged', (lng) => {
				localStorage.setItem('lang', lng);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export default useLanguageSync;
