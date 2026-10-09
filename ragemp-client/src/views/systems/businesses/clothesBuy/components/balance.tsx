import { formatNumber } from '@/utils/helpers';
import { ComponentState } from '..';

const Component = () => {
	const { data } = ComponentState();

	return (
		<div className="comp-balance">
			<div className="text">
				<div className="content">
					<div className="values">
						<div className="cash">{formatNumber(data.balance.cash, true)}</div>
						<div className="bc">{formatNumber(data.balance.beachCoins, false)} BC</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Component;
