import i18next, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

export const locales = {
	en: 'English', // Toàn cầu
	vi: 'Tiếng Việt', // Đông Nam Á
	es: 'Español', // Tây Ban Nha / Mỹ Latin
	fr: 'Français', // Châu Âu / Châu Phi
	de: 'Deutsch', // Trung Âu
	ru: 'Русский', // Đông Âu / Nga
	ar: 'العربية', // Trung Đông / Bắc Phi
	zh: '中文', // Trung Quốc
	hi: 'हिन्दी', // Ấn Độ
	ja: '日本語', // Nhật Bản
	pt: 'Português', // Brazil / Bồ Đào Nha
	ko: '한국어', // Hàn Quốc
	tr: 'Türkçe', // Thổ Nhĩ Kỳ
};

const options: InitOptions = {
	lng: 'en',
	defaultNS: 'layout',
	interpolation: {
		escapeValue: false,
	},
	debug: true,
	saveMissing: true,
	missingKeyHandler: (lng, ns, key) => {
		console.warn(`[i18next] Missing key: '${key}' in namespace: '${ns}', language: '${lng}'`);
	},
};

i18next.use(initReactI18next).use(HttpApi).init(options);
