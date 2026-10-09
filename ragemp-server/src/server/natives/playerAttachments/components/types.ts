declare global {
	interface PlayerVariables {
		attachments: Array<string>;
	}

	type PlayerAttachments = {
		id: RegisteredPlayerAttachmentIds;
		model: HashOrNumberOrString<string>;
		boneId: number; // Can be found here: https://wiki.rage.mp/index.php?title=Bones
		offset: Vector3;
		rotation: Vector3;
	};

	type RegisteredPlayerAttachmentIds =
		| 'phone'
		| 'hamburger'
		| 'donut'
		| 'water'
		| 'coffee'
		| 'hotdog'
		| 'taco'
		| 'sandwich'
		| 'fries'
		| 'ecola'
		| 'juice'
		| 'beer'
		| 'bandage'
		| 'medicKit'
		| 'walkieTalkie'
		| 'cigarette';
	// @Reminder:
	// Add this to other files types.ts:
	// type RegisteredPlayerAttachmentIds = 'newRegistered' | RegisteredPlayerAttachmentIds;
}

export {};
