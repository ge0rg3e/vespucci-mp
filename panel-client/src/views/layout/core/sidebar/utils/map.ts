import { Category } from './types';

const categories: Record<string, Category> = {
	main: {
		id: 'main',
		entries: [
			{
				id: 'dashboard',
				icon: 'fa-solid fa-home',
				onClick: {
					action: 'redirect',
					payload: '/'
				}
			},
			{
				id: 'unbanRequests',
				icon: 'fa-solid fa-rotate-left'
			},
			{
				id: 'complaints',
				icon: 'fa-solid fa-brake-warning',
				onClick: {
					action: 'redirect',
					payload: '/complaints'
				}
			},
			{
				id: 'tickets',
				icon: 'fa-solid fa-comments'
			}
		]
	},
	community: {
		id: 'community',
		entries: [
			{
				id: 'players',
				icon: 'fa-solid fa-user-tie',
				entries: [
					{
						id: 'searchForAPlayer',
						onClick: {
							action: 'redirect',
							payload: '/players/search'
						}
					},
					{
						id: 'onlinePlayers',
						onClick: {
							action: 'redirect',
							payload: '/players/list?filter=online'
						}
					},
					{
						id: 'bannedPlayers',
						onClick: {
							action: 'redirect',
							payload: '/players/list?filter=banned'
						}
					},
					{
						id: 'rankings',
						onClick: {
							action: 'redirect',
							payload: '/players/list?filter=rankings'
						}
					}
				]
			},
			{
				id: 'staff',
				icon: 'fa-solid fa-gavel',
				entries: [
					{
						id: 'staffListing'
					},
					{
						id: 'staffActivity'
					},
					{
						id: 'applyInStaff'
					}
				]
			}
		]
	},
	organisations: {
		id: 'organisations',
		entries: [
			{
				id: 'factions',
				icon: 'fa-solid fa-police-box',
				entries: [
					{
						id: 'listOfFactions'
					},
					{
						id: 'applyForLeader'
					}
				]
			},
			{
				id: 'wars',
				icon: 'fa-solid fa-person-rifle',
				entries: [
					{
						id: 'rankings'
					},
					{
						id: 'history'
					}
				]
			},
			{
				id: 'gangs',
				icon: 'fa-solid fa-knife-kitchen',
				entries: [
					{
						id: 'listOfGangs'
					},
					{
						id: 'rankings'
					},
					{
						id: 'activity'
					}
				]
			}
		]
	},
	economy: {
		id: 'economy',
		entries: [
			{
				id: 'dealership',
				icon: 'fa-solid fa-truck-plane'
			},
			{
				id: 'premiumShop',
				icon: 'fa-brands fa-shopify'
			},
			{
				id: 'properties',
				icon: 'fa-solid fa-house-turret',
				entries: [
					{
						id: 'houses'
					},
					{
						id: 'businesses'
					},
					{
						id: 'auctions'
					}
				]
			},
			{
				id: 'trading',
				icon: 'fa-sharp fa-solid fa-money-bill-trend-up',
				entries: [
					{
						id: 'cnnListings'
					},
					{
						id: 'autoBazar'
					}
				]
			}
		]
	},
	serverInformation: {
		id: 'serverInformation',
		entries: [
			{
				id: 'gameDevelopment',
				icon: 'fa-brands fa-codepen',
				entries: [
					{
						id: 'lastUpdates'
					},
					{
						id: 'reportABug'
					},
					{
						id: 'suggestions'
					},
					{
						id: 'applyForTester'
					}
				]
			},
			{
				id: 'management',
				icon: 'fa-solid fa-chess-king',
				entries: [
					{
						id: 'announcements'
					},
					{
						id: 'events'
					}
				]
			},

			{
				id: 'serverRules',
				icon: 'fa-solid fa-scale-balanced'
			},
			{
				id: 'wiki',
				icon: 'fa-solid fa-books'
			}
		]
	}
};

export default categories;
