import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: 'src/locales',
					dest: '',
				},
			],
		}),
		svgr({
			svgrOptions: { exportType: 'default', ref: true, titleProp: true },
			include: '**/*.svg',
		}),
	],
	resolve: {
		alias: {
			// eslint-disable-next-line no-undef
			'~': path.resolve(__dirname, './src'),
		},
	},
});
