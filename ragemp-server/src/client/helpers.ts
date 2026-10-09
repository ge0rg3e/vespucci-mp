export const formatNumber = (number: number, includeMoneySymbol = false, decalsNumbers = 0) => {
	let str = parseInt(String(number))
		.toFixed(decalsNumbers)
		.replace(/(.)(?=(\d{3})+$)/g, '$1,');
	if (includeMoneySymbol === true) {
		str = `$${str}`;
	}
	return str;
};
