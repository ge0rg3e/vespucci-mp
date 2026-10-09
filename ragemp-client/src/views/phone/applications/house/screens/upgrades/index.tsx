import { useState } from 'react';
import { AppState } from '../..';
import { fakeRPCEventResponse, formatNumber, interpetingRPCEvent } from '@/utils/helpers';

// Components

import NavigationHeader from '@phone/components/ui/navigationHeader';
import List from '@/views/phone/components/ui/list';
import Section from '@phone/components/ui/section';
import Card from '@phone/components/ui/card';
import ScrollableContainer from '@phone/components/ui/scrollableContainer';
import Button from '@phone/components/ui/button';

const Component = () => {
	const { data, lang, setScreen } = AppState();

	const [submitted, setSubmitted] = useState<boolean>(false);

	const nextLevelCost = data.houseData.upgradeLevel * 15000;
	const upgradeAvailable = data.houseData.upgradeLevel !== 3;

	const details = [
		{
			label: lang.get('Upgrades:Level'),
			value: data.houseData.upgradeLevel
		},
		{
			label: lang.get('Upgrades:NextLevelCost'),
			value: upgradeAvailable
				? formatNumber(nextLevelCost, true)
				: lang.get('Upgrades:NotAvailable')
		}
	];

	const getEntries = () => {
		const res: ExpectedAny = [];

		// Level 1

		res.push([
			{
				label: lang.get(`Upgrades:Healing`),
				description: lang.get('Upgrades:Healing-Description')
			},
			{
				label: lang.get('Upgrades:Safe'),
				description: lang.get('Upgrades:Safe-Description')
			}
		]);

		// Level 2

		res.push([
			// Level 2
			{
				label: lang.get('Upgrades:Renting'),
				description: lang.get('Upgrades:Renting-Description')
			}
			// {
			// 	label: lang.get('Upgrades:Wardrobe'),
			// 	description: lang.get('Upgrades:Wardrobe-Description')
			// }
		]);

		// Level 3

		res.push(
			[
				// Level 3
				{
					label: lang.get('Upgrades:StorageCloset'),
					description: lang.get('Upgrades:StorageCloset-Description')
				},
				/* eslint-disable */
				data.houseMeta.garage
					? {
							label: lang.get(`Upgrades:Garage`),
							description: lang.get(`Upgrades:GarageDescription`)
					  }
					: null
				/* eslint-enable */
			].filter((x) => x !== null)
		);

		return res;
	};

	const upgradeLevel = async () => {
		try {
			setSubmitted(true);
			fakeRPCEventResponse('Server', 'increaseHouseUpgradeLevel', 200, false);
			const res = await interpetingRPCEvent('Server', 'increaseHouseUpgradeLevel');
			setSubmitted(false);

			// He didn't had enough money
			if (res !== true) {
				window.phone.showAlert({
					title: lang.get('Upgrades:Alert-1-Title'),
					description: lang.get('Upgrades:Alert-1-Description'),
					buttons: [
						{
							text: `OK`,
							onSelection: ({ dismiss }) => {
								dismiss();
							}
						}
					]
				});
			}
		} catch (err) {
			window.phone.showAlert({
				title: lang.get('Upgrades:Alert-2-Title'),
				description: lang.get('Upgrades:Alert-2-Description'),
				buttons: [
					{
						text: `OK`,
						onSelection: ({ dismiss }) => {
							dismiss();
							setSubmitted(false);
						}
					}
				]
			});
		}
	};

	return (
		<div className="screen upgrades">
			<NavigationHeader
				goBack={() => setScreen('menu')}
				theme="light"
				title={lang.get('Upgrades:ScreenTitle')}
			/>
			<ScrollableContainer>
				<Section header={lang.get('Upgrades:Details')}>
					<List theme="light" items={details} />
				</Section>
				{getEntries().map((level: FixableAny, ix: number) => (
					<Section key={ix} header={lang.get('Upgrades:BenefitsAt', { val: ix + 1 })}>
						{level.map((entry: FixableAny, ix: number) => (
							<Card
								theme="light"
								key={ix}
								title={entry.label}
								content={entry.description}
							/>
						))}
					</Section>
				))}
			</ScrollableContainer>
			<div className={`app-navigation-footer ${!upgradeAvailable && `disabled-upgrade`}`}>
				<div className="text">
					{!upgradeAvailable
						? lang.get('Upgrades:YouReachedMaximumLevel')
						: `${lang.get('Upgrades:Cost')} ${formatNumber(nextLevelCost, true)}`}
				</div>
				{upgradeAvailable && (
					<Button
						variant="standard"
						theme="light"
						disabled={!upgradeAvailable || submitted === true}
						color="blue"
						onClick={upgradeLevel}
					>
						{lang.get('Upgrades:Button')}
					</Button>
				)}
			</div>
		</div>
	);
};

export default Component;
