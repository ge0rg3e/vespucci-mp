import PhoneResponse from '../../phone/utils/response';

export const Responses: ExpectedAny = {
	data: {
		phoneNumber: `555666`
	},
	// messages: [], // for now.
	messages: [
		// Messages sent by you to a specific number and replied back
		{
			id: 1,
			createdAt: new Date('2023-07-02T10:00:00'),
			sender: {
				phoneNumber: '555666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '123456',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				}
			],
			content: {
				type: 'text',
				data: 'Hey, how are you doing?'
			}
		},
		{
			id: 2,
			createdAt: new Date('2023-07-02T10:01:00'),
			sender: {
				phoneNumber: '123456',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '555666',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				}
			],
			content: { type: 'text', data: "I'm good! How about you?" }
		},
		// Message with no reply.
		{
			id: 5,
			createdAt: new Date('2023-07-02T10:04:00'),
			sender: {
				phoneNumber: '555666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '234567',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				}
			],
			content: { type: 'text', data: "Let's meet up for lunch." }
		},

		// Message with reply back
		{
			id: 8,
			createdAt: new Date('2023-07-02T10:07:00'),
			sender: {
				phoneNumber: '555666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '876543',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				}
			],
			content: { type: 'text', data: 'Do you want to grab dinner tonight?' }
		},
		{
			id: 9,
			createdAt: new Date('2023-07-02T14:09:00'),
			sender: {
				phoneNumber: '876543',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '555666',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				}
			],
			content: { type: 'text', data: 'Yeah sure, that sounds good.' }
		},
		// A conversation between 3 players
		{
			id: 11,
			createdAt: new Date('2023-06-02T10:06:00'),
			sender: {
				phoneNumber: '789056',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '555666',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				},
				{
					phoneNumber: '876543',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				},
				{
					phoneNumber: '210987',
					deleted: false,
					seen: true,
					type: 'player',
					received: true,

					id: null
				}
			],
			content: {
				type: 'text',
				data: 'Hey guys! We still go to Vespucci beach this saturday, right?'
			}
		},
		{
			id: 12,
			createdAt: new Date('2023-06-02T10:08:00'),
			sender: {
				phoneNumber: '555666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '789056',
					deleted: false,
					seen: true,
					type: 'player',
					id: null
				},
				{
					phoneNumber: '876543',
					deleted: false,
					seen: true,
					type: 'player',
					id: null
				},
				{
					phoneNumber: '210987',
					deleted: false,
					seen: true,
					received: true,

					type: 'player',
					id: null
				}
			],
			content: {
				type: 'text',
				data: 'Yes. The others will come too, right?'
			}
		},
		{
			id: 13,
			createdAt: new Date('2023-06-02T10:12:00'),
			sender: {
				phoneNumber: '210987',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '789056',
					deleted: false,
					seen: true,
					type: 'player',
					id: null
				},
				{
					phoneNumber: '876543',
					deleted: false,
					seen: true,
					type: 'player',
					id: null
				},
				{
					phoneNumber: '555666',
					deleted: false,
					seen: true,
					received: true,

					type: 'player',
					id: null
				}
			],
			content: {
				type: 'text',
				data: 'Yea sure'
			}
		},
		// Messages from a stalker
		{
			id: 14,
			createdAt: new Date('2023-05-02T02:04:00'),
			sender: {
				phoneNumber: '444666',
				deleted: false,
				seen: true,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '555666',
					deleted: false,
					seen: true,
					received: true,

					type: 'player',
					id: null
				}
			],

			content: {
				type: 'text',
				data: 'I know where you live...'
			}
		},
		{
			id: 15,
			createdAt: new Date('2023-05-02T04:04:00'),
			sender: {
				phoneNumber: '444666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '555666',
					deleted: false,
					seen: true,
					received: true,

					type: 'player',
					id: null
				}
			],
			content: {
				type: 'text',
				data: 'Who is that woman with you on Facebook!!'
			}
		},
		{
			id: 16,
			createdAt: new Date('2023-05-02T08:04:00'),
			sender: {
				phoneNumber: '444666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '555666',
					deleted: false,

					seen: true,
					received: true,

					type: 'player',
					id: null
				}
			],
			content: {
				type: 'text',
				data: `Why won't you reply back!!`
			}
		},
		{
			id: 17,
			createdAt: new Date('2023-05-04T15:00:00'),
			sender: {
				phoneNumber: '555666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '444666',
					deleted: false,
					seen: true,
					received: true,
					type: 'player',
					id: null
				}
			],
			content: {
				type: 'text',
				data: `Fuck off`
			}
		},
		{
			id: 18,
			createdAt: new Date('2023-05-04T15:00:00'),
			sender: {
				phoneNumber: '555666',
				deleted: false,
				type: 'player',
				id: null
			},
			recipients: [
				{
					phoneNumber: '222666',
					deleted: false,
					seen: false,
					received: false,
					type: 'player',
					id: null
				}
			],
			content: {
				type: 'text',
				data: `Is this the right number?`
			}
		}
	],
	contacts: PhoneResponse.contacts // Imported.
};
