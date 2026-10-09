const floydApartment = () => {
	const coords = {
		x: -1150.703,
		y: -1520.713,
		z: 10.633
	};

	const props = ['swap_clean_apt', 'swap_sofa_A', 'swap_wade_sofa_A', 'swap_mrJam_A', 'swap_mrJam_B', 'swap_mrJam_C', 'layer_whiskey'];
	const intId = mp.game.interior.getInteriorAtCoords(coords.x, coords.y, coords.z);

	props.forEach((ent: string) => mp.game.interior.enableInteriorProp(intId, ent));
	mp.game.interior.refreshInterior(intId);

	// Doors
	mp.game.object.doorControl(0xdbd14dcb, -1149.71, -1521.09, 10.78, true, 0.0, 50.0, 0.0); // lock the door.
};

const franklinAuntHouse = () => {
	const coords = {
		x: -14.217,
		y: -1440.508,
		z: 31.102
	};

	const props = ['V_57_GangBandana', 'V_57_Safari', 'V_57_FranklinStuff'];
	const intId = mp.game.interior.getInteriorAtCoords(coords.x, coords.y, coords.z);

	// For each prop..
	props.forEach(async (ent: string) => mp.game.interior.enableInteriorProp(intId, ent));

	mp.game.interior.refreshInterior(intId);
};

const michaelHouse = () => {
	const coords = {
		x: -815.696,
		y: 178.503,
		z: 72.153
	};

	const props = [`V_Michael_M_items`, `V_Michael_D_items`, `V_Michael_S_items`, `V_Michael_L_Items`, `V_Michael_FameShame`, `Michael_premier`, `V_Michael_bed_tidy`];
	const intId = mp.game.interior.getInteriorAtCoords(coords.x, coords.y, coords.z);

	// For each prop..
	props.forEach(async (ent: string) => mp.game.interior.enableInteriorProp(intId, ent));

	// Refresh interior..
	mp.game.interior.refreshInterior(intId);

	// Doors
	mp.game.object.doorControl(mp.game.joaat('v_ilev_mm_door'), -806.2817, 186.0246, 72.62405, true, 0.0, 50.0, 0.0); //  door to the garage
	mp.game.object.doorControl(mp.game.joaat('prop_ld_garaged_01'), -815.2816, 185.975, 72.99993, true, 0.0, 50.0, 0.0); // garage door itself
};

const trevorTrailer = () => {
	// Doors
	mp.game.object.doorControl(mp.game.joaat('v_ilev_trevtraildr'), 1972.769, 3815.366, 33.66326, true, 0.0, 50.0, 0.0); // main door
};

franklinAuntHouse();
floydApartment();
michaelHouse();
trevorTrailer();
