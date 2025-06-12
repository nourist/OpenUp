export const getShortName = (name: string) => {
	const arr = name.toUpperCase().split(' ');
	if (arr.length == 0) {
		return 'UR';
	} else if (arr.length == 1) {
		return arr[0][0] + arr[0][1];
	} else {
		return arr[0][0] + arr[arr.length - 1][0];
	}
};
