export const generateFakeGraphData = (startDate: Date, numHours: number) => {
	const data = [];
	const currentDate = new Date(startDate);
	let currentValue = 0;
	for (let i = 0; i < numHours; i++) {
		const dataPoint = {
			date: currentDate.toISOString(),
			value: currentValue
		};
		data.push(dataPoint);
		currentValue += Math.floor(Math.random() * 25); // add a random value between 0 and 9
		currentDate.setHours(currentDate.getHours() + 1); // add one hour to the current date
	}
	return data;
};
