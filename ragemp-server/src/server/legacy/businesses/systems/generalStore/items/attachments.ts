mp.events.add('gamemodeStarted', () => {
	// Eating in use 24/7
	mp.playerAttachments.register('hamburger', 'prop_cs_burger_01', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('donut', 'prop_donut_01', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('water', 'prop_ld_flow_bottle', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('coffee', 'p_ing_coffeecup_01', 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('beer', 'prop_amb_beer_bottle', 28422, new mp.Vector3(0.0, 0.0, 0.06), new mp.Vector3(0.0, 15.0, 0.0));
	mp.playerAttachments.register('cigarette', 'ng_proc_cigarette01a', 64097, new mp.Vector3(0.02, 0.02, -0.008), new mp.Vector3(100.0, 0.0, 100.0));
	//
	// For the future
	mp.playerAttachments.register('hotdog', 'prop_cs_hotdog_01', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('taco', 'prop_taco_01', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('sandwich', 'prop_sandwich_01', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('fries', 'prop_food_bs_chips', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('ecola', 'prop_ecola_can', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.playerAttachments.register('juice', 'prop_ld_can_01', 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
});

// Useful for later
/**
 * mp.attachmentMngr.register("mining", "prop_tool_jackham", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("drinking_1", "prop_ld_can_01", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("drinking_2", "prop_ecola_can", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("drinking_3", "prop_ld_flow_bottle", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("telefon", "prop_player_phone_02", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("burger", "prop_cs_burger_01", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("cola", "prop_ecola_can", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("water-bottle", "prop_ld_flow_bottle", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
    mp.attachmentMngr.register("microfonwn", "p_ing_microphonel_01", 60309, new mp.Vector3(0.055, 0.05, 0.0), new mp.Vector3(240.0, 0.0, 0.0));
	mp.attachmentMngr.register("clipboard", "p_cs_clipboard", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("camerawn", "prop_v_cam_01", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("donut", "prop_donut_01", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("topor", "prop_ld_fireaxe", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("cigarette", "ng_proc_cigarette01a", 64097, new mp.Vector3(0.020, 0.02, -0.008), new mp.Vector3(100.0, 0.0, 100.0));
	mp.attachmentMngr.register("cigarettenolight", "prop_amb_ciggy_01", 64097, new mp.Vector3(0.020, 0.02, -0.008), new mp.Vector3(100.0, 0.0, 100.0));
	mp.attachmentMngr.register("cigarettepack", "prop_cigar_pack_01", 64016, new mp.Vector3(0.020, -0.05, -0.010), new mp.Vector3(100.0, 0.0, 0.0));
	mp.attachmentMngr.register("lighter", "ex_prop_exec_lighter_01", 4089, new mp.Vector3(0.020, -0.03, -0.010), new mp.Vector3(100.0, 0.0, 150.0));

	mp.attachmentMngr.register("cigarettenolightmouth", "prop_amb_ciggy_01", 47419, new mp.Vector3(0.015, -0.009, 0.003), new mp.Vector3(55.0, 0.0, 110.0));
	mp.attachmentMngr.register("cigarettelightmouth", "ng_proc_cigarette01a", 47419, new mp.Vector3(0.015, -0.009, 0.003), new mp.Vector3(55.0, 0.0, 110.0));

	mp.attachmentMngr.register("rod", "prop_fishing_rod_01", 60309, new mp.Vector3(-0.01, -0.01, 0.07), new mp.Vector3(0, 0, 0)); 
	mp.attachmentMngr.register("trashbag", "hei_prop_heist_binbag", 57005, new mp.Vector3(0.12, 0.0, 0.00), new mp.Vector3(25.0, 90, 90.0));
	mp.attachmentMngr.register("orange", "ng_proc_food_ornge1a", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("sack", "p_cs_sack_01_s", 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("sack2", "p_cs_sack_01_s", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("colet", "prop_horo_box_02", 28422, new mp.Vector3(0.00, -0.10, -0.15), new mp.Vector3(30.0, 0, 0));
	mp.attachmentMngr.register("NoddlesCutie", "prop_ff_noodle_02", 28422, new mp.Vector3(0.00, -0.10, -0.15), new mp.Vector3(30.0, 0, 0));
	mp.attachmentMngr.register("PungaMancare", "prop_food_bag1", 28422, new mp.Vector3(0.03, 0.00, -0.32), new mp.Vector3(0, 0, 100.0));
	mp.attachmentMngr.register("PungaHamburger", "prop_food_bs_bag_01", 28422, new mp.Vector3(0.03, 0.00, -0.28), new mp.Vector3(0, 0, 100.0));
	mp.attachmentMngr.register("PungaPui", "prop_food_cb_bag_01", 28422, new mp.Vector3(0.03, 0.00, -0.35), new mp.Vector3(0, 0, 100.0));
	mp.attachmentMngr.register("CutiePizza", "prop_pizza_box_01", 28422, new mp.Vector3(0.00, 0.0, -0.15), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("CutiePizza2", "prop_pizza_box_02", 28422, new mp.Vector3(0.00, -0.10, -0.15), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("PungaMancare2", "hei_prop_hei_paper_bag", 28422, new mp.Vector3(0.00, 0.00, -0.15), new mp.Vector3(0, 0, 100.0));
	mp.attachmentMngr.register("PompaBenzina", "prop_cs_fuel_nozle", 60309, new mp.Vector3(0.04, 0.05, 0.02), new mp.Vector3(180, 90, 90));
	mp.attachmentMngr.register("Catuse", "p_cs_cuffs_02_s", 60309, new mp.Vector3(-0.04, 0.06, 0.02), new mp.Vector3(65, -100.0, 180));
	mp.attachmentMngr.register("Phone", "ifruit_12", 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("PistolTest", 403140669, 23553, new mp.Vector3(0.056, -0.08, 0.02), new mp.Vector3(180, 155.0, -20));
	mp.attachmentMngr.register("Knuckle", "w_me_knuckle", 58271, new mp.Vector3(0.00, 0.03, -0.08), new mp.Vector3(0.0, 90.0, 0.0));
	mp.attachmentMngr.register("elecbag", "prop_cs_heist_bag_01", 57005, new mp.Vector3(0.0, 0.0, -0.25), new mp.Vector3(85.0, 90, 180.0));
	mp.attachmentMngr.register("tablet", "prop_cs_tablet", 60309, new mp.Vector3(0.03, 0.002, -0.0), new mp.Vector3(10.0, 160.0, 0.0));
	mp.attachmentMngr.register("policetape", "prop_police_tape_roll", 57005, new mp.Vector3(0.15, 0.00, -0.05), new mp.Vector3(0, 0, 0));
	mp.attachmentMngr.register("pickaxe", "prop
 */
