export const defaultValues = {
	male: {
		top: {
			drawableId: 15,
			textureId: 0,
			isAddon: false
		},
		torso: {
			drawableId: 15,
			textureId: 0,
			isAddon: false
		},
		undershirt: {
			drawableId: 15, // On male is naked on female is just some bikini.
			textureId: 0,
			isAddon: false
		},
		pants: {
			drawableId: 21,
			textureId: 0,
			isAddon: false
		},
		shoes: {
			drawableId: 34,
			textureId: 0,
			isAddon: false
		},
		hat: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		glasses: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		mask: {
			drawableId: 0,
			textureId: 0,
			isAddon: false
		},
		accessory: {
			drawableId: 0,
			textureId: 0,
			isAddon: false
		},
		earings: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		watches: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		bracelets: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		backpack: {
			drawableId: 0,
			textureId: 0,
			isAddon: false
		}
	},
	female: {
		top: {
			drawableId: 5,
			textureId: 7,
			isAddon: false
		},
		torso: {
			drawableId: 4,
			textureId: 0,
			isAddon: false
		},
		undershirt: {
			drawableId: 3, // On male is naked on female is just some bikini.
			textureId: 0,
			isAddon: false
		},
		pants: {
			drawableId: 15,
			textureId: 0,
			isAddon: false
		},
		shoes: {
			drawableId: 35,
			textureId: 0,
			isAddon: false
		},
		hat: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		glasses: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		mask: {
			drawableId: 0,
			textureId: 0,
			isAddon: false
		},
		accessory: {
			drawableId: 0,
			textureId: 0,
			isAddon: false
		},
		earings: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		watches: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		bracelets: {
			drawableId: -1,
			textureId: 0,
			isAddon: false
		},
		backpack: {
			drawableId: 0,
			textureId: 0,
			isAddon: false
		}
	}
};

const sameAppearanceSettings: ExpectedAny = {
	// Hair
	hairModel: 0,
	hairColor1: 0,
	hairColor2: 0,
	// Eyes & eyeBrows
	eyeColor: 0,
	eyebrows: 0,
	eyebrowsColor: 0,
	eyeSize: 0,
	browHeight: 0,
	browWidth: 0,
	// Beard
	beardModel: 255,
	beardColor: 0,
	mouthSize: 0,
	// Nose features
	noseWidth: 0,
	noseHeight: 0,
	noseLength: 0,
	noseBridge: 0,
	noseTip: 0,
	noseBridgeShift: 0,
	// Cheekbone feature
	cheekboneHeight: 0,
	cheekboneWidth: 0,
	cheeksWidth: 0,
	// Jaw features
	jawWidth: 0,
	jawHeight: 0,
	// Chin features
	chinLength: 0,
	chinPosition: 0,
	chinWidth: 0,
	chinShape: 0,
	// Neck feature
	neckWidth: 0,
	// Body features
	makeup: 255,
	lipstick: 255,
	lipstickColor: 0,
	moles: 255,
	blush: 255,
	blushColor: 0,
	blemishes: 255,
	bodyBlemishes: 255,
	ageing: 255,
	chestHair: 255
};

export const defaultAppearances = {
	male: {
		// Shape
		motherShape: 0,
		fatherShape: 0,
		shapeResemblance: 0.5,
		skinResemblance: 0.5,
		...sameAppearanceSettings
	},
	female: {
		// Shape
		motherShape: 0,
		fatherShape: 0,
		shapeResemblance: 0.5,
		skinResemblance: 0.5,
		...sameAppearanceSettings
	}
};
