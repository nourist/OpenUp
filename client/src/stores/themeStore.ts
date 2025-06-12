import { create } from 'zustand';

type Mode = 'system' | 'light' | 'dark';

interface ThemeState {
	mode: Mode;
	theme: 'light' | 'dark';
	updateSystemTheme: () => void;
	setMode: (newMode: Mode) => void;
}

const useThemeStore = create<ThemeState>((set) => {
	const mode = (localStorage.getItem('mode') as Mode) || 'system';

	const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

	const theme = mode === 'system' ? getSystemTheme() : mode;

	return {
		mode,
		theme,
		getSystemTheme,
		updateSystemTheme: () => {
			if (mode === 'system') {
				set({ theme: getSystemTheme() });
			}
		},
		setMode: (newMode: Mode) => {
			localStorage.setItem('mode', newMode);
			set({ mode: newMode, theme: newMode === 'system' ? getSystemTheme() : newMode });
		},
	};
});

export default useThemeStore;
