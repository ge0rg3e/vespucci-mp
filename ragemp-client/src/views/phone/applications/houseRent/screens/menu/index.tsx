import { PhoneState } from '@/views/phone';
import { AppState } from '../..';
import { formatNumber } from '@/utils/helpers';

// Components
import NavigationHeader from '@phone/components/ui/navigationHeader';
import List from '@phone/components/ui/list';
import Section from '@phone/components/ui/section';
import Button from '@phone/components/ui/button';
import ScrollableContainer from '@phone/components/ui/scrollableContainer';

const Component = () => {
	const { uiState, closeApplication } = PhoneState();

	const { data, lang } = AppState();

	const menuItems = [
		{
			label: lang.get('HouseID'),
			value: data.houseData.id || 0
		},
		{
			label: lang.get('OwnerName'),
			value: data.houseData.ownerName || '-'
		},
		{
			label: lang.get('UpgradeLevel'),
			value: data.houseData.upgradeLevel || 1
		},
		{
			label: lang.get('RentCost'),
			value: lang.get(`PerHour`, {
				value: formatNumber(data.houseData.rentPrice || 25, true)
			})
		},
		{
			label: lang.get('Tenants'),
			value: data.houseData.tenants ? data.houseData.tenants.length : 0
		}
	];

	const leaveThisRent = async () => {
		window.phone.showAlert({
			title: lang.get('ConfirmEviction:Title'),
			description: lang.get('ConfirmEviction:Description'),
			buttons: [
				{
					text: lang.get('ConfirmEviction:Confirm'),
					color: 'red',
					onSelection: ({ dismiss }) => {
						window.rpc.triggerServer(`leaveHouseRent`);
						closeApplication(); // Once he sold his house he won't have access to this app anymore.
						dismiss();
					}
				},
				{
					text: lang.get('ConfirmEviction:Cancel'),
					onSelection: ({ dismiss }) => dismiss(),
					color: 'blue'
				}
			]
		});
	};

	return (
		<div className="screen menu">
			<NavigationHeader theme="light" title={lang.get('WelcomeHome')} />
			<ScrollableContainer>
				<Section header={lang.get('YourRentHeading')}>
					<List
						theme="light"
						items={menuItems.map((item: FixableAny) => ({
							label: item.label,
							value: item.value
						}))}
					/>
				</Section>
			</ScrollableContainer>
			<div className={`app-navigation-footer`}>
				<Button
					disabled={uiState.loading}
					onClick={leaveThisRent}
					theme="light"
					variant="standard"
					color="blue"
				>
					{lang.get('LeaveThisRent')}
				</Button>
			</div>
		</div>
	);
};

export default Component;
