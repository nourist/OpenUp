import ReactDOM from 'react-dom/client';

import App from './App.tsx';

String.prototype.capitalize = function () {
	if (typeof this !== 'string') return '';
	const res = this.split('');

	if (res.length != 0) {
		res[0] = res[0].toUpperCase();
	}

	for (let i = 0; i < res.length; i++) {
		if (res[i] === '.') {
			if (i + 1 < res.length && res[i + 1] != ' ') {
				res[i + 1] = res[i + 1].toUpperCase();
			} else if (i + 2 < res.length && res[i + 1] == ' ' && res[i + 2] != ' ') {
				res[i + 2] = res[i + 2].toUpperCase();
			}
		}
	}

	return res.join('');
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<App />,
	// </React.StrictMode>,
);
