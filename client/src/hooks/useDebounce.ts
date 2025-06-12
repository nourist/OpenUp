import { useState, useEffect } from 'react';

const useDebounce = (value: string | number, delay: number) => {
	const [debounceValue, setDebounceValue] = useState(value);

	useEffect(() => {
		const handle = setTimeout(() => {
			setDebounceValue(value);
		}, delay);
		return () => clearTimeout(handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return debounceValue;
};

export default useDebounce;
