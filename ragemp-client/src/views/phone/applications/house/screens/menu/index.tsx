import { PhoneState } from '@/views/phone';
import { AppState } from '../..';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import List from '@phone/components/ui/list';

import { formatNumber } from '@/utils/helpers';

const Component = () => {
	const { uiState, closeApplication } = PhoneState();

	const { data, setScreen, lang } = AppState();

	const menuItems = [
		{
			label: lang.get('Option:Renting'),
			payload: {
				type: 'redirect',
				screen: `renting`
			}
		},
		{
			label: lang.get('Option:Upgrades'),
			payload: {
				type: 'redirect',
				screen: `upgrades`
			}
		},
		{
			label: lang.get('Option:Interiors'),
			payload: {
				type: 'redirect',
				screen: `interiors`
			}
		},
		{
			label: lang.get('Option:SellToState'),
			payload: {
				type: `sellToState`
			}
		}
	];

	const onItemSelected = (entry: FixableAny) => {
		if (entry.payload.type === 'redirect') {
			setScreen(entry.payload.screen);
		} else {
			window.phone.showAlert({
				title: lang.get('SellToState:Title'),
				description: lang.get('SellToState:Description', {
					reward: formatNumber((20 / 100) * data.houseData.price, true)
				}),
				buttons: [
					{
						text: lang.get('SellToState:AcceptOffer'),
						color: 'blue',
						onSelection: ({ dismiss }) => {
							window.rpc.triggerServer(`sellHouseToState`);
							closeApplication(); // Once he sold his house he won't have access to this app anymore.
							dismiss();
						}
					},
					{
						text: lang.get('SellToState:RefuseOffer'),
						onSelection: ({ dismiss }) => dismiss(),
						color: 'red'
					}
				]
			});
		}
	};

	return (
		<div className="screen menu">
			<NavigationHeader theme="light" title={lang.get('WelcomeHome')} />
			<List
				loading={uiState.loading}
				theme="light"
				onSelection={onItemSelected}
				items={menuItems.map((item: FixableAny) => ({
					label: item.label,
					value:
						item.payload.type !== 'sellToState' ? (
							<div className="arrow-right">
								<i className="elm fa-solid fa-chevron-right"></i>
							</div>
						) : null,
					payload: item.payload
				}))}
			/>
		</div>
	);
};

export default Component;
