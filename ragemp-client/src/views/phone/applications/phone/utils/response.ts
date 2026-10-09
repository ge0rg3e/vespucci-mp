const SimulatedResponse: ExpectedAny = {
	data: {
		localInfo: {
			number: `555666`,
			credits: 2500
		}
	},
	contacts: [
		{
			id: 1,
			name: 'John Doe',
			number: '123456',
			type: 'player',
			contactId: 2,
			creatorId: 1
		},
		{
			id: 2,
			name: 'Jane Smith',
			number: '987654',
			type: 'player',
			contactId: 3,
			creatorId: 1
		},
		{
			id: 3,
			name: 'Mario Rossi',
			number: '345678',
			type: 'player',
			contactId: 4,
			creatorId: 2
		},
		{
			id: 4,
			name: 'Emily Johnson',
			number: '876543',
			type: 'player',
			contactId: 5,
			creatorId: 2
		},
		{
			id: 5,
			name: 'Luca Bianchi',
			number: '234567',
			type: 'player',
			contactId: 6,
			creatorId: 3
		},
		{
			id: 6,
			name: 'Sophia Davis',
			number: '765432',
			type: 'player',
			contactId: 7,
			creatorId: 3
		},
		{
			id: 7,
			name: 'Francesco Esposito',
			number: '456789',
			type: 'player',
			contactId: 8,
			creatorId: 4
		},
		{
			id: 8,
			name: 'Olivia Martinez',
			number: '654321',
			type: 'player',
			contactId: 9,
			creatorId: 4
		},
		{
			id: 9,
			name: 'Alessandro Russo',
			number: '567890',
			type: 'player',
			contactId: 10,
			creatorId: 5
		},
		{
			id: 10,
			name: 'Isabella Anderson',
			number: '432109',
			type: 'player',
			contactId: 11,
			creatorId: 5
		},
		{
			id: 11,
			name: 'Giovanni Ferrari',
			number: '678905',
			type: 'player',
			contactId: 12,
			creatorId: 6
		},
		{
			id: 12,
			name: 'Mia Taylor',
			number: '321098',
			type: 'player',
			contactId: 13,
			creatorId: 6
		},
		{
			id: 13,
			name: 'Marco Marino',
			number: '789056',
			type: 'player',
			contactId: 14,
			creatorId: 7
		},
		{
			id: 14,
			name: 'Ava Scott',
			number: '210987',
			type: 'player',
			contactId: 15,
			creatorId: 7
		},
		{
			id: 15,
			name: 'Riccardo Barbieri',
			number: '890567',
			type: 'player',
			contactId: 16,
			creatorId: 8
		},
		{
			id: 16,
			name: 'Sofia Phillips',
			number: '109876',
			type: 'player',
			contactId: 17,
			creatorId: 8
		},
		{
			id: 17,
			name: 'Matteo De Luca',
			number: '905678',
			type: 'player',
			contactId: 18,
			creatorId: 9
		},
		{
			id: 18,
			name: 'Grace Clark',
			number: '098765',
			type: 'player',
			contactId: 19,
			creatorId: 9
		},
		{
			id: 19,
			name: 'Lorenzo Rizzo',
			number: '567890',
			type: 'player',
			contactId: 20,
			creatorId: 10
		},
		{
			id: 20,
			name: 'Lily Turner',
			number: '765432',
			type: 'player',
			contactId: 21,
			creatorId: 10
		}
	],
	recentCalls: [
		{
			uuid: 'cbb8ed9b-9d2f-4a16-9b41-73854e99a7a1',
			callMissed: false,
			date: '2023-06-23T09:30:00.000Z',
			phoneNumber: '123456',
			isCaller: false
		},
		{
			uuid: 'd8a9c9c5-4f5d-4f2b-8f48-d0b85036b74e',
			callMissed: false,
			date: '2023-06-23T10:15:00.000Z',
			isCaller: true,
			phoneNumber: '987654'
		},
		{
			uuid: 'fe704bd7-8271-491f-9eae-882ec999b8b9',
			callMissed: false,
			date: '2023-06-23T11:00:00.000Z',
			phoneNumber: '345678',
			isCaller: false
		},
		{
			uuid: '7d6ef7d9-3db3-4d6a-b0ce-eb4e737854e5',
			callMissed: false,
			date: '2023-06-23T11:45:00.000Z',
			phoneNumber: '876543',
			isCaller: true
		},
		{
			uuid: '92c18e32-8a6c-4e6d-85b2-c72bead8b93a',
			callMissed: true,
			date: '2023-06-23T12:30:00.000Z',
			phoneNumber: '234567',
			isCaller: false
		},
		{
			uuid: '1b2b8a9b-5374-4ad1-a734-90682ad37dcd',
			callMissed: false,
			date: '2023-06-23T13:15:00.000Z',
			phoneNumber: '765432',
			isCaller: false
		},
		{
			uuid: '1b2b8a9b-5374-4ad1-a734-90682ad37dcd',
			callMissed: false,
			date: '2023-06-23T13:15:00.000Z',
			phoneNumber: '552912',
			isCaller: false
		},
		{
			uuid: '1b2b8a9b-5374-4ad1-a734-90682ad37dcd',
			callMissed: true,
			date: '2023-06-23T13:15:00.000Z',
			phoneNumber: '552912',
			isCaller: true
		}
	]
};

export const SimulatedResponseShareNumber = [
	{
		id: 10,
		name: 'Grace Clark'
	},
	{
		id: 35,
		name: 'Lorenzo Rizzo'
	},
	{
		id: 55,
		name: 'Lily Turner'
	}
];

export default SimulatedResponse;
