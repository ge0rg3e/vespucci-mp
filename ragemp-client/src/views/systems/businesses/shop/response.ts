const Data: ExpectedAny = {
	id: 'business:generalStore',
	title: 'General Store',
	payload: {
		business: {
			id: 21
		}
	},
	items: [
		{
			id: 'phone',
			type: 'item',
			data: {
				itemId: 7,
				prices: {
					cash: 2000
				},
				restrictions: {
					maxOwned: 1
				}
			},
			details: {
				name: 'Smartphone',
				description:
					'You can use this smartphone to communicate with other players and also to access applications.',
				properties: []
			}
		},
		{
			id: 'phoneCredit',
			type: 'shopItem',
			data: {
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Phone Credit',
				description: 'Top up your phone credit so you can make calls and receive messages.',
				image: 'generalStore/phoneCredit.png',
				properties: []
			}
		},
		{
			id: 'tablet',
			type: 'item',
			data: {
				itemId: 8,
				prices: {
					cash: 5000
				},
				restrictions: {
					minimumLevel: 3
				}
			},
			details: {
				name: 'Tablet',
				description:
					'You can use this tablet to access a wide range of applications that are designed exclusively for tablets.',
				properties: []
			}
		},
		{
			id: 'walkieTalkie',
			type: 'item',
			data: {
				itemId: 10,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Walkie Talkie',
				description: 'Use this walkie-talkie to communicate with other players over long distances.',
				properties: []
			}
		},
		{
			id: 'dices',
			type: 'item',
			data: {
				itemId: 11,
				prices: {
					cash: 100
				}
			},
			details: {
				name: 'Dices',
				description: 'Play dice games with other players.',
				properties: []
			}
		},
		{
			id: 'boombox',
			type: 'item',
			data: {
				itemId: 14,
				prices: {
					cash: 3000
				},
				restrictions: {
					minimumLevel: 6
				}
			},
			details: {
				name: 'Boombox',
				description: 'You can place this item on the ground and start listening to music with your friends.',
				properties: []
			}
		},
		{
			id: 'gasCanister',
			type: 'item',
			data: {
				itemId: 19,
				prices: {
					cash: 200
				},
				restrictions: {
					minimumLevel: 3
				}
			},
			details: {
				name: 'Gas Canister',
				description: 'This item can be used to fill your vehicle with gas.',
				properties: []
			}
		},
		{
			id: 'smokes',
			type: 'item',
			data: {
				itemId: 12,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Cigarettes',
				description: 'If you feel stressed or need to take a break, you may choose to smoke a cigarette.',
				properties: []
			}
		},
		{
			id: 'lighter',
			type: 'item',
			data: {
				itemId: 13,
				prices: {
					cash: 200
				}
			},
			details: {
				name: 'Lighter',
				description: 'Is used to light cigarettes or other smoking materials.',
				properties: []
			}
		},
		{
			id: 'zippingBags',
			type: 'item',
			data: {
				itemId: 16,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Zipping Bag',
				description: 'No description for now. Make a suggestion to the developer.',
				properties: []
			}
		},
		{
			id: 'rollingPaper',
			type: 'item',
			data: {
				itemId: 17,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Rolling Paper',
				description: 'No description for now. Make a suggestion to the developer.',
				properties: []
			}
		},
		{
			id: 'mechanicalToolkit',
			type: 'item',
			data: {
				itemId: 18,
				prices: {
					cash: 1000
				}
			},
			details: {
				name: 'Mechanical Tool Kit',
				description:
					'This item allows you to be a handyman and repair all kinds of things. Including your vehicle and other things.',
				properties: []
			}
		},
		{
			id: 'bandages',
			type: 'item',
			data: {
				itemId: 15,
				prices: {
					cash: 2000
				},
				restrictions: {
					maxOwned: 5
				}
			},
			details: {
				name: 'Bandages',
				description: 'If you get wounded, you can use this item to heal yourself.',
				properties: [
					{
						label: 'Health Points',
						value: '+ 30 HP'
					}
				]
			}
		},
		{
			id: 'chips',
			type: 'item',
			data: {
				itemId: 20,
				prices: {
					cash: 200
				}
			},
			details: {
				name: 'Chips',
				description: 'Enjoy these chips if you ever get hungry on the road.',
				properties: [
					{
						label: 'Hunger Points',
						value: '+ 10 FP'
					}
				]
			}
		},
		{
			id: 'sandwich',
			type: 'item',
			data: {
				itemId: 21,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Sandwich',
				description: 'Enjoy this sandwich if you ever get hungry on the road.',
				properties: [
					{
						label: 'Hunger Points',
						value: '+ 30 FP'
					}
				]
			}
		},
		{
			id: 'water',
			type: 'item',
			data: {
				itemId: 22,
				prices: {
					cash: 200
				}
			},
			details: {
				name: 'Water',
				description: 'If you ever get thirsty on the road, you can enjoy this bottle of fresh water.',
				properties: [
					{
						label: 'Thirst Points',
						value: '+ 30 TP'
					}
				]
			}
		},
		{
			id: 'beer',
			type: 'item',
			data: {
				itemId: 23,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Beer',
				description: 'Had a hard day at work? Then relax with a beer.',
				properties: [
					{
						label: 'Thirst Points',
						value: '+ 10 TP'
					}
				]
			}
		},
		{
			id: 'coffee',
			type: 'item',
			data: {
				itemId: 24,
				prices: {
					cash: 500
				}
			},
			details: {
				name: 'Coffee',
				description: 'Enjoy a nice coffee to go at the end of the day.',
				properties: [
					{
						label: 'Thirst Points',
						value: '+ 10 TP'
					}
				]
			}
		}
	],
	localInfo: {
		balance: {
			cash: 5000
		}
	}
};

export default Data;
