import React, { useState, useEffect } from 'react';

// Types
interface Data {
	totalPrice: number;
	pricePerLiter: number;
	totalLiters: number;
}

// Component
const Component = () => {
	const [data, setData] = useState<Data | null>(null);

	const onEventReceiveData = (data: FixableAny) => {
		setData(JSON.parse(data));
	};

	useEffect(() => {
		setData({
			totalPrice: 250,
			pricePerLiter: 2,
			totalLiters: 4
		});

		window.rpc.on('updateGasPumpsInformation', onEventReceiveData);

		return () => {
			window.rpc.off('updateGasPumpsInformation', onEventReceiveData);
		};
	}, []);

	const formatNumbers = (nr: number) => {
		let str = `${nr}`;

		if (str.length < 2) {
			str = `0000${nr}`;
		} // 22

		if (str.length < 3) {
			str = `000${nr}`;
		} // 22

		if (str.length < 4) {
			str = `00${nr}`;
		} // 223

		if (str.length < 5) {
			str = `0${nr}`;
		} // 223

		if (str.length > 5) {
			str = str.slice(0, 5);
		}

		return Array.from(str);
	};

	if (data === null) return null;

	return (
		<div className="system-gasPumps">
			<div className="content">
				<div className="total-price">
					<div className="label">total price</div>

					<div className="value">
						{formatNumbers(data.totalPrice).map((n, ix) => (
							<div key={ix} className="number">
								{n}
							</div>
						))}
					</div>
				</div>

				<div className="info">
					<div className="price-liter">
						<div className="value">${data.pricePerLiter}</div>
						<div className="label">price per liter</div>
					</div>

					<div className="liters">
						<div className="value">{data.totalLiters}L</div>
						<div className="label">total liters</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Component;
