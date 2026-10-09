const anims: ExpectedAny = [
	{
		id: 0,
		name: { EN: 'Actions', RO: 'Acțiuni' },
		animations: [
			{
				id: 0,
				name: {
					EN: 'Scratch your ass',
					RO: 'Scarpina-te in fund'
				},
				ad: 'anim@heists@team_respawn@respawn_02',
				an: 'heist_spawn_02_ped_d',
				af: 8
			},
			{
				id: 1,
				name: { EN: 'Rub your neck', RO: 'Frecați-vă gâtul' },
				ad: 'amb@world_human_cop_idles@female@idle_a',
				an: 'idle_c',
				af: 8
			},
			{
				id: 2,
				name: { EN: 'Rub your palms', RO: 'Frecați-vă palmele' },
				ad: 'amb@world_human_cop_idles@female@idle_b',
				an: 'idle_d',
				af: 8
			},
			{
				id: 3,
				name: { EN: 'Rub your hands', RO: 'Frecați-vă mâinile' },
				ad: 'move_action@p_m_one@unarmed@idle@variations',
				an: 'idle_a',
				af: 8
			},
			{
				id: 4,
				name: { EN: 'Pick your nose', RO: 'Alege-ți nasul' },
				ad: 'anim@mp_player_intcelebrationfemale@nose_pick',
				an: 'nose_pick',
				af: 8
			},
			{
				id: 7,
				name: { EN: 'Cross arms-3', RO: 'Brațele încrucișate-3' },
				ad: 'anim@amb@business@bgen@bgen_no_work@',
				an: 'stand_phone_phoneputdown_idle_nowork',
				af: 9
			},
			{
				id: 8,
				name: { EN: 'Stretch fists-1', RO: 'Pumni întinși-1' },
				ad: 'anim@mp_player_intcelebrationfemale@knuckle_crunch',
				an: 'knuckle_crunch',
				af: 8
			},
			{
				id: 9,
				name: { EN: 'Stretch fists-2', RO: 'Pumni întinși-2' },
				ad: 'anim@mp_player_intincarknuckle_crunchbodhi@ps@',
				an: 'idle_a_fp',
				af: 8
			},
			{
				id: 10,
				name: {
					EN: 'Put something in your mouth',
					RO: 'Pune ceva în gură'
				},
				ad: 'mp_player_int_uppersmoke',
				an: 'mp_player_int_smoke_enter',
				af: 8
			},
			{
				id: 11,
				name: { EN: 'Throw up', RO: 'Vomita' },
				ad: 'move_m@drunk@transitions',
				an: 'slightly_to_idle',
				af: 8
			},
			{
				id: 12,
				name: {
					EN: 'Send something over the radio',
					RO: 'Trimite ceva prin radio'
				},
				ad: 'random@arrests',
				an: 'generic_radio_chatter',
				af: 49
			},
			{
				id: 13,
				name: { EN: 'Mechanic', RO: 'Mecanic' },
				ad: 'amb@world_human_vehicle_mechanic@male@base',
				an: 'base',
				af: 9
			},
			{
				id: 14,
				name: { EN: 'Guard posture', RO: 'Postura de gardă' },
				ad: 'missfbi4mcs_2',
				an: 'loop_sec_b',
				af: 9
			},
			{
				id: 18,
				name: {
					EN: 'Hands behind your back',
					RO: 'Mâinile la spate'
				},
				ad: 'anim@miss@low@fin@vagos@',
				an: 'idle_ped06',
				af: 8
			},
			{
				id: 19,
				name: {
					EN: 'Grab your stomach',
					RO: 'Prinde-ți stomacul'
				},
				ad: 'rcmpaparazzo1',
				an: 'idle',
				af: 8
			},
			{
				id: 20,
				name: {
					EN: 'Scratch your ass',
					RO: 'Scarpina-te in fund'
				},
				ad: 'anim@heists@team_respawn@respawn_02',
				an: 'heist_spawn_02_ped_d',
				af: 8
			},
			{
				id: 21,
				name: { EN: 'Rub your neck', RO: 'Frecați-vă gâtul' },
				ad: 'amb@world_human_cop_idles@female@idle_a',
				an: 'idle_c',
				af: 8
			},
			{
				id: 22,
				name: { EN: 'Rub your palms', RO: 'Frecați-vă palmele' },
				ad: 'amb@world_human_cop_idles@female@idle_b',
				an: 'idle_d',
				af: 8
			},
			{
				id: 23,
				name: { EN: 'Rub your hands', RO: 'Frecați-vă mâinile' },
				ad: 'move_action@p_m_one@unarmed@idle@variations',
				an: 'idle_a',
				af: 8
			},
			{
				id: 24,
				name: { EN: 'Pick your nose', RO: 'Alege-ți nasul' },
				ad: 'anim@mp_player_intcelebrationfemale@nose_pick',
				an: 'nose_pick',
				af: 8
			},
			{
				id: 25,
				name: { EN: 'Cross arms-1', RO: 'Brațele încrucișate-1' },
				ad: 'rcmme_amanda1',
				an: 'stand_loop_cop',
				af: 9
			},
			{
				id: 26,
				name: { EN: 'Cross arms-2', RO: 'Brațele încrucișate-2' },
				ad: 'amb@world_human_cop_idles@female@idle_b',
				an: 'idle_e',
				af: 8
			},
			{
				id: 27,
				name: { EN: 'Cross arms-3', RO: 'Brațele încrucișate-3' },
				ad: 'anim@amb@business@bgen@bgen_no_work@',
				an: 'stand_phone_phoneputdown_idle_nowork',
				af: 9
			},
			{
				id: 28,
				name: { EN: 'Stretch fists-1', RO: 'Pumni întinși-1' },
				ad: 'anim@mp_player_intcelebrationfemale@knuckle_crunch',
				an: 'knuckle_crunch',
				af: 8
			},
			{
				id: 29,
				name: { EN: 'Stretch fists-2', RO: 'Pumni întinși-2' },
				ad: 'anim@mp_player_intincarknuckle_crunchbodhi@ps@',
				an: 'idle_a_fp',
				af: 8
			},
			{
				id: 30,
				name: {
					EN: 'Put something in your mouth',
					RO: 'Pune ceva în gură'
				},
				ad: 'mp_player_int_uppersmoke',
				an: 'mp_player_int_smoke_enter',
				af: 8
			},
			{
				id: 31,
				name: { EN: 'Throw up', RO: 'Vomita' },
				ad: 'move_m@drunk@transitions',
				an: 'slightly_to_idle',
				af: 8
			}
		]
	},
	{
		id: 1,
		name: { EN: 'Indecent', RO: 'Indecent' },
		animations: [
			{
				id: 0,
				name: { EN: 'Sex 1', RO: 'Sexul 1' },
				ad: 'anim@mp_player_intcelebrationfemale@air_shagging',
				an: 'air_shagging',
				af: 8
			},
			{
				id: 1,
				name: { EN: 'Sex 2', RO: 'Sexul 2' },
				ad: 'anim@mp_player_intcelebrationfemale@dock',
				an: 'dock',
				af: 8
			},
			{
				id: 2,
				name: { EN: 'Dead body', RO: 'Cadavru' },
				ad: 'anim@melee@machete@streamed_core@',
				an: 'victim_front_takedown',
				af: 8
			},
			{
				id: 3,
				name: { EN: 'Breaking', RO: 'Spargere' },
				ad: 'creatures@rottweiler@melee@',
				an: 'victim_takedown_from_front',
				af: 8
			},
			{
				id: 4,
				name: { EN: 'Show Fak - 1', RO: 'Afișează Fak - 1' },
				ad: 'anim@mp_player_intupperfinger',
				an: 'idle_a_fp',
				af: 8
			},
			{
				id: 5,
				name: { EN: 'Show Fak - 2', RO: 'Afișează Fak - 2' },
				ad: 'anim@mp_player_intcelebrationmale@finger',
				an: 'finger',
				af: 8
			},
			{
				id: 6,
				name: { EN: 'Sex (Male)', RO: 'Genul masculin)' },
				ad: 'rcmpaparazzo_2',
				an: 'shag_action_a',
				af: 8
			},
			{
				id: 7,
				name: { EN: 'Sex (Woman)', RO: 'Sex (femeie)' },
				ad: 'rcmpaparazzo_2',
				an: 'shag_action_poppy',
				af: 8
			},
			{
				id: 9,
				name: { EN: 'Masturbate #2', RO: 'Masturbeaza-te #2' },
				ad: 'anim@mp_player_intcelebrationmale@wank',
				an: 'wank',
				af: 8
			},
			{
				id: 10,
				name: { EN: 'Shoot', RO: 'Trage' },
				ad: 'amb@world_human_superhero@male@space_pistol@idle_a',
				an: 'idle_b',
				af: 8
			},
			{
				id: 11,
				name: { EN: 'With a gun', RO: 'Cu un pistol' },
				ad: 'anim@deathmatch_intros@2hcombat_mgmale',
				an: 'intro_male_mg_c',
				af: 8
			},
			{
				id: 12,
				name: { EN: 'With a bat', RO: 'Cu o liliac' },
				ad: 'anim@deathmatch_intros@melee@2h',
				an: 'intro_male_melee_2h_b_gclub',
				af: 8
			},
			{
				id: 8,
				name: { EN: 'Masturbate #1', RO: 'Masturbeaza-te #1' },
				ad: 'anim@mp_player_intupperwank',
				an: 'idle_a',
				af: 49
			}
		]
	},
	{
		id: 2,
		name: { EN: 'Social', RO: 'Social' },
		animations: [
			{
				id: 0,
				name: { EN: 'Agree-1', RO: 'De acord-1' },
				ad: 'gestures@m@standing@casual',
				an: 'gesture_i_will',
				af: 8
			},
			{
				id: 1,
				name: { EN: 'Agree-2', RO: 'De acord-2' },
				ad: 'gestures@m@standing@fat',
				an: 'gesture_bye_soft',
				af: 8
			},
			{
				id: 2,
				name: { EN: 'Deny-1', RO: 'Nega-1' },
				ad: 'gestures@m@standing@casual',
				an: 'gesture_nod_no_hard',
				af: 8
			},
			{
				id: 3,
				name: { EN: 'Refuse-2', RO: 'Refuza-2' },
				ad: 'gestures@m@standing@casual',
				an: 'gesture_no_way',
				af: 8
			},
			{
				id: 4,
				name: { EN: 'Refuse-3', RO: 'Refuza-3' },
				ad: 'amb@code_human_in_car_mp_actions@nod@bodhi@ds@base',
				an: 'nod_no_fp',
				af: 8
			},
			{
				id: 5,
				name: { EN: 'To shrug', RO: 'Să ridic din umeri' },
				ad: 'gestures@m@standing@casual',
				an: 'gesture_what_soft',
				af: 8
			},
			{
				id: 6,
				name: { EN: 'To wave hands', RO: 'Să fluture mâinile' },
				ad: 'random@car_thief@victimpoints_ig_3',
				an: 'arms_waving',
				af: 8
			},
			{
				id: 7,
				name: { EN: 'Shrug-1', RO: 'Ridic din umeri-1' },
				ad: 'taxi_hail',
				an: 'forget_it',
				af: 8
			},
			{
				id: 8,
				name: { EN: 'Shrug-2', RO: 'Ridic din umeri-2' },
				ad: 'anim@mp_freemode_return@f@idle',
				an: 'idle_b',
				af: 8
			},
			{
				id: 9,
				name: { EN: 'Pray', RO: 'Roagă-te' },
				ad: 'pro_mcs_7_concat-0',
				an: 'cs_priest_dual-0',
				af: 8
			},
			{
				id: 10,
				name: { EN: 'Bow-1', RO: 'Arcul-1' },
				ad: 'anim@mp_player_intcelebrationpaired@f_f_sarcastic',
				an: 'sarcastic_right',
				af: 8
			},
			{
				id: 11,
				name: { EN: 'Bow-2', RO: 'Arcul-2' },
				ad: 'anim@mp_player_intcelebrationpaired@m_m_sarcastic',
				an: 'sarcastic_left',
				af: 8
			},
			{
				id: 12,
				name: { EN: 'Raise your hands', RO: 'Ridicați mâna' },
				ad: 'random@mugging3',
				an: 'handsup_standing_base',
				af: 49
			},
			{
				id: 13,
				name: {
					EN: 'Raise your hands on your knees',
					RO: 'Ridicați mâinile pe genunchi'
				},
				ad: 'random@arrests',
				an: 'kneeling_arrest_idle',
				af: 9
			},
			{
				id: 14,
				name: {
					EN: 'Hands behind head',
					RO: 'Mâinile în spatele capului'
				},
				ad: 'random@shop_robbery',
				an: 'kneel_loop_p',
				af: 9
			},
			{
				id: 15,
				name: {
					EN: 'Perform a military salute',
					RO: 'Efectuați un salut militar'
				},
				ad: 'anim@mp_player_intincarsalutestd@ds@',
				an: 'idle_a',
				af: 8
			},
			{
				id: 16,
				name: { EN: 'Whistle', RO: 'Fluier' },
				ad: 'taxi_hail',
				an: 'fp_hail_taxi',
				af: 8
			},
			{
				id: 17,
				name: {
					EN: 'Begging for mercy #1',
					RO: 'Cerșind milă #1'
				},
				ad: 'amb@code_human_cower@male@react_cowering',
				an: 'base_front',
				af: 9
			},
			{
				id: 18,
				name: {
					EN: 'Begging for mercy #2',
					RO: 'Cerșind milă #2'
				},
				ad: 'anim@heists@prison_heistunfinished_biz@popov_react',
				an: 'popov_cower',
				af: 9
			},
			{
				id: 19,
				name: { EN: 'Thumbs up', RO: 'Bravo' },
				ad: 'anim@mp_player_intcelebrationfemale@thumbs_up',
				an: 'thumbs_up',
				af: 8
			},
			{
				id: 20,
				name: { EN: 'Thumbs up', RO: 'Bravo' },
				ad: 'anim@mp_player_intincarthumbs_upbodhi@ds@',
				an: 'enter_fp',
				af: 8
			},
			{
				id: 21,
				name: { EN: 'Mock', RO: 'A-și bate joc' },
				ad: 'anim@arena@celeb@flat@solo@no_props@',
				an: 'taunt_e_player_b',
				af: 8
			},
			{
				id: 22,
				name: { EN: 'Call back', RO: 'Sună din nou' },
				ad: 'anim@mp_player_intcelebrationmale@call_me',
				an: 'call_me',
				af: 8
			},
			{
				id: 23,
				name: {
					EN: 'Lose consciousness',
					RO: 'Pierde cunoștința'
				},
				ad: 'missfam5_blackout',
				an: 'pass_out',
				af: 8
			},
			{
				id: 24,
				name: { EN: 'Show two fingers', RO: 'Arată două degete' },
				ad: 'amb@code_human_in_car_mp_actions@v_sign@bodhi@rps@base',
				an: 'idle_a',
				af: 8
			},
			{
				id: 25,
				name: { EN: 'Shhh', RO: 'Shhh' },
				ad: 'anim@mp_player_intcelebrationfemale@shush',
				an: 'shush',
				af: 8
			},
			{
				id: 26,
				name: { EN: 'Raspaltsovka-1', RO: 'Raspaltsovka-1' },
				ad: 'missmic4premiere',
				an: 'wave_b',
				af: 8
			},
			{
				id: 27,
				name: { EN: 'Raspaltsovka-2', RO: 'Raspaltsovka-2' },
				ad: 'amb@code_human_in_car_mp_actions@v_sign@std@rds@base',
				an: 'enter',
				af: 8
			},
			{
				id: 28,
				name: { EN: 'Tease-1', RO: 'Tachina-1' },
				ad: 'anim@mp_player_intcelebrationfemale@jazz_hands',
				an: 'jazz_hands',
				af: 8
			},
			{
				id: 29,
				name: { EN: 'Tease-2', RO: 'Tachina-2' },
				ad: 'anim@mp_player_intcelebrationfemale@thumb_on_ears',
				an: 'thumb_on_ears',
				af: 8
			},
			{
				id: 30,
				name: { EN: 'Tease-3', RO: 'Tachina-3' },
				ad: 'anim@mp_player_intcelebrationmale@thumb_on_ears',
				an: 'thumb_on_ears',
				af: 8
			},
			{
				id: 31,
				name: { EN: 'Fool', RO: 'Prost' },
				ad: 'anim@mp_player_intcelebrationfemale@you_loco',
				an: 'you_loco',
				af: 8
			},
			{
				id: 32,
				name: { EN: 'Think', RO: 'Gândi' },
				ad: 'amb@code_human_police_investigate@idle_a',
				an: 'idle_a',
				af: 8
			}
		]
	},
	{
		id: 3,
		name: { EN: 'Racks', RO: 'Rafturi' },
		animations: [
			{
				id: 0,
				name: { EN: 'Reason - 1', RO: 'Motivul - 1' },
				ad: 'anim@amb@board_room@diagram_blueprints@',
				an: 'idle_01_amy_skater_01',
				af: 9
			},
			{
				id: 1,
				name: { EN: 'Reason - 2', RO: 'Motivul - 2' },
				ad: 'anim@amb@board_room@diagram_blueprints@',
				an: 'look_around_02_amy_skater_01',
				af: 9
			},
			{
				id: 2,
				name: {
					EN: 'Hands to the sides',
					RO: 'Mâinile în lateral'
				},
				ad: 'amb@code_human_police_investigate@base',
				an: 'base',
				af: 9
			},
			{
				id: 3,
				name: { EN: 'Show biceps-1', RO: 'Arată biceps-1' },
				ad: 'amb@world_human_muscle_flex@arms_at_side@idle_a',
				an: 'idle_c',
				af: 8
			},
			{
				id: 4,
				name: { EN: 'Show biceps-2', RO: 'Arată biceps-2' },
				ad: 'amb@world_human_muscle_flex@arms_in_front@base',
				an: 'base',
				af: 8
			},
			{
				id: 5,
				name: {
					EN: 'Spread your arms to the sides',
					RO: 'Întinde-ți brațele în lateral'
				},
				ad: 'missfam5_yoga',
				an: 'c1_pose',
				af: 8
			},
			{
				id: 6,
				name: {
					EN: 'Spread your arms and legs out to the side',
					RO: 'Întinde-ți brațele și picioarele în lateral'
				},
				ad: 'missfam5_yoga',
				an: 'a2_pose',
				af: 8
			},
			{
				id: 8,
				name: {
					EN: 'Lean against the wall - 2',
					RO: 'Rezemați-vă de perete - 2'
				},
				ad: 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a',
				an: 'idle_a',
				af: 9
			},
			{
				id: 9,
				name: { EN: 'Stand up-1', RO: 'Ridică-te-1' },
				ad: 'anim@deathmatch_intros@unarmed',
				an: 'intro_male_unarmed_c',
				af: 8
			},
			{
				id: 10,
				name: { EN: 'Stand up-2', RO: 'Ridică-te-2' },
				ad: 'anim@deathmatch_intros@unarmed',
				an: 'intro_male_unarmed_a',
				af: 8
			},
			{
				id: 11,
				name: { EN: 'Stand up-3', RO: 'Ridică-te-3' },
				ad: 'anim@deathmatch_intros@unarmed',
				an: 'intro_male_unarmed_b',
				af: 8
			},
			{
				id: 12,
				name: { EN: 'Stand up-4', RO: 'Ridică-te-4' },
				ad: 'anim@deathmatch_intros@unarmed',
				an: 'intro_male_unarmed_d',
				af: 8
			},
			{
				id: 13,
				name: {
					EN: 'Lie on your side',
					RO: 'Întinde-te pe partea ta'
				},
				ad: 'amb@world_human_bum_slumped@male@laying_on_right_side@base',
				an: 'base',
				af: 9
			},
			{
				id: 14,
				name: {
					EN: 'Lie on your stomach',
					RO: 'Întinde-te pe burtă'
				},
				ad: 'amb@world_human_sunbathe@male@front@base',
				an: 'base',
				af: 9
			},
			{
				id: 15,
				name: { EN: 'Lie on your back', RO: 'Stați pe spate' },
				ad: 'missfbi1',
				an: 'cpr_pumpchest_idle',
				af: 9
			},
			{
				id: 16,
				name: { EN: 'Lie on the ground', RO: 'Culca pe pamant' },
				ad: 'amb@world_human_sunbathe@male@back@base',
				an: 'base',
				af: 9
			},
			{
				id: 17,
				name: { EN: 'Lie on a bed', RO: 'Întinde-te pe un pat' },
				ad: 'amb@prop_human_seat_sunlounger@male@base',
				an: 'base',
				af: 9
			},
			{
				id: 18,
				name: { EN: 'Sit down 1', RO: 'Așezați-vă 1' },
				ad: 'amb@prop_human_seat_chair@male@generic@base',
				an: 'base',
				af: 9
			},
			{
				id: 19,
				name: { EN: 'Sit down 2', RO: 'Stai jos 2' },
				ad: 'amb@prop_human_seat_chair@male@elbows_on_knees@base',
				an: 'base',
				af: 9
			},
			{
				id: 20,
				name: { EN: 'Sit down 3', RO: 'Așezați-vă 3' },
				ad: 'amb@prop_human_seat_chair@male@left_elbow_on_knee@base',
				an: 'base',
				af: 9
			},
			{
				id: 21,
				name: { EN: 'Sit down 4', RO: 'Stai jos 4' },
				ad: 'amb@prop_human_seat_chair@male@right_foot_out@base',
				an: 'base',
				af: 9
			},
			{
				id: 22,
				name: {
					EN: 'Sitting relaxed - 1',
					RO: 'Stând relaxat - 1'
				},
				ad: 'anim@amb@yacht@jacuzzi@seated@male@variation_01@',
				an: 'base',
				af: 9
			},
			{
				id: 23,
				name: {
					EN: 'Sitting relaxed - 2',
					RO: 'Stând relaxat - 2'
				},
				ad: 'anim@amb@office@seating@male@var_e@base@',
				an: 'base',
				af: 9
			},
			{
				id: 24,
				name: {
					EN: 'Sitting relaxed - 3',
					RO: 'Stând relaxat - 3'
				},
				ad: 'anim@amb@office@seating@male@var_d@base@',
				an: 'base',
				af: 9
			},
			{
				id: 25,
				name: {
					EN: 'Sitting relaxed - 4',
					RO: 'Stând relaxat - 4'
				},
				ad: 'anim@amb@office@seating@female@var_d@base@',
				an: 'base',
				af: 9
			},
			{
				id: 26,
				name: {
					EN: 'Sitting relaxed - 5',
					RO: 'Stând relaxat - 5'
				},
				ad: 'anim@amb@office@seating@female@var_c@base@',
				an: 'base',
				af: 9
			},
			{
				id: 27,
				name: { EN: 'Sit on the fence', RO: 'Stai pe gard' },
				ad: 'anim@amb@facility@briefing_room@seating@male@var_e@',
				an: 'base',
				af: 9
			},
			{
				id: 28,
				name: { EN: 'Sit back - 1', RO: 'Stai pe spate - 1' },
				ad: 'anim@amb@office@boardroom@crew@male@var_c@base_r@',
				an: 'base',
				af: 9
			},
			{
				id: 29,
				name: { EN: 'Sit back - 2', RO: 'Stai pe spate - 2' },
				ad: 'anim@amb@clubhouse@seating@male@var_c@base@',
				an: 'base',
				af: 9
			},
			{
				id: 30,
				name: {
					EN: 'Sitting back - 3',
					RO: 'Așezat pe spate - 3'
				},
				ad: 'amb@world_human_seat_steps@male@hands_in_lap@base',
				an: 'base',
				af: 9
			},
			{
				id: 31,
				name: { EN: 'Meditate-1', RO: 'Meditează-1' },
				ad: 'missfam5_yoga',
				an: 'f_yogapose_a',
				af: 8
			},
			{
				id: 32,
				name: { EN: 'Meditate-2', RO: 'Meditează-2' },
				ad: 'missfam5_yoga',
				an: 'c8_pose',
				af: 8
			},
			{
				id: 33,
				name: { EN: 'Meditate-3', RO: 'Meditează-3' },
				ad: 'missfam5_yoga',
				an: 'b4_fail_to_start',
				af: 8
			},
			{
				id: 34,
				name: { EN: 'Meditate-4', RO: 'Meditează-4' },
				ad: 'missfam5_yoga',
				an: 'start_to_c1',
				af: 8
			},
			{
				id: 35,
				name: { EN: 'Meditate-5', RO: 'Meditează-5' },
				ad: 'missfam5_yoga',
				an: 'start_to_a1',
				af: 8
			},
			{
				id: 36,
				name: { EN: 'Meditate-6', RO: 'Meditează-6' },
				ad: 'missfam5_yoga',
				an: 'a2_to_a3',
				af: 8
			},
			{
				id: 38,
				name: {
					EN: 'Sit on the ground - 1',
					RO: 'Stai pe pământ - 1'
				},
				ad: 'amb@world_human_stupor@male_looking_right@base',
				an: 'base',
				af: 9
			},
			{
				id: 39,
				name: {
					EN: 'Sit on the ground - 2',
					RO: 'Stați pe pământ - 2'
				},
				ad: 'anim@amb@business@bgen@bgen_no_work@',
				an: 'sit_phone_phoneputdown_idle_nowork',
				af: 9
			},
			{
				id: 40,
				name: {
					EN: 'Sit with your knee up',
					RO: 'Stai cu genunchiul sus'
				},
				ad: 'amb@world_human_seat_steps@male@elbows_on_knees@base',
				an: 'base',
				af: 9
			},
			{
				id: 41,
				name: { EN: 'Squat-1', RO: 'Squat-1' },
				ad: 'anim@miss@low@fin@lamar@',
				an: 'idle',
				af: 9
			},
			{
				id: 42,
				name: { EN: 'Squat-2', RO: 'Squat-2' },
				ad: 'amb@medic@standing@tendtodead@enter',
				an: 'enter',
				af: 8
			},
			{
				id: 43,
				name: { EN: 'Squat-3', RO: 'Squat-3' },
				ad: 'amb@medic@standing@kneel@base',
				an: 'base',
				af: 9
			}
		]
	},
	{
		id: 4,
		name: { EN: 'Dancing', RO: 'Dans' },
		animations: [
			{
				id: 0,
				name: { EN: 'Elbow dance 1', RO: 'Dansul cotului 1' },
				ad: 'misschinese2_crystalmazemcs1_ig',
				an: 'dance_loop_tao',
				af: 9
			},
			{
				id: 1,
				name: { EN: 'Elbow dance 2', RO: 'Dansul cotului 2' },
				ad: 'misschinese2_crystalmazemcs1_ig',
				an: 'dance_loop_tao',
				af: 9
			},
			{
				id: 2,
				name: { EN: 'Elbow dance 3', RO: 'Dansul cotului 3' },
				ad: 'misschinese2_crystalmazemcs1_cs',
				an: 'dance_loop_tao',
				af: 9
			},
			{
				id: 3,
				name: { EN: 'Quick step 1', RO: 'Pasul rapid 1' },
				ad: 'amb@world_human_jog_standing@female@base',
				an: 'base',
				af: 9
			},
			{
				id: 4,
				name: { EN: 'Quick step 2', RO: 'Pasul rapid 2' },
				ad: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
				an: 'med_center_up',
				af: 9
			},
			{
				id: 6,
				name: { EN: 'Trains 2', RO: 'Trenuri 2' },
				ad: 'anim@mp_player_intcelebrationfemale@raise_the_roof',
				an: 'raise_the_roof',
				af: 9
			},
			{
				id: 7,
				name: { EN: 'Trains 3', RO: 'Trenuri 3' },
				ad: 'anim@mp_player_intupperbanging_tunes',
				an: 'idle_a',
				af: 9
			},
			{
				id: 8,
				name: { EN: 'Trains 4', RO: 'Trenuri 4' },
				ad: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
				an: 'high_center_up',
				af: 9
			},
			{
				id: 9,
				name: { EN: 'Electro', RO: 'Electro' },
				ad: 'anim@mp_player_intcelebrationmale@cats_cradle',
				an: 'cats_cradle',
				af: 9
			},
			{
				id: 10,
				name: { EN: 'Mop Dance', RO: 'Mop Dance' },
				ad: 'anim@amb@nightclub@dancers@club_ambientpeds@med-hi_intensity',
				an: 'mi-hi_amb_club_10_v1_male^6',
				af: 9
			},
			{
				id: 11,
				name: { EN: 'Step', RO: 'Etapa' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity',
				an: 'hi_dance_facedj_09_v2_male^6',
				af: 9
			},
			{
				id: 12,
				name: { EN: 'Jumping dance', RO: 'Dans sărituri' },
				ad: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
				an: 'hi_dance_crowd_13_v2_male^6',
				af: 9
			},
			{
				id: 13,
				name: { EN: 'Tap dance 1', RO: 'Tap dans 1' },
				ad: 'special_ped@mountain_dancer@monologue_1@monologue_1a',
				an: 'mtn_dnc_if_you_want_to_get_to_heaven',
				af: 9
			},
			{
				id: 14,
				name: { EN: 'Tap dance 2', RO: 'Tap dans 2' },
				ad: 'special_ped@mountain_dancer@monologue_4@monologue_4a',
				an: 'mnt_dnc_verse',
				af: 9
			},
			{
				id: 15,
				name: { EN: 'Tap dance 3', RO: 'Tap dans 3' },
				ad: 'special_ped@mountain_dancer@monologue_3@monologue_3a',
				an: 'mnt_dnc_buttwag',
				af: 9
			},
			{
				id: 16,
				name: { EN: 'Freestyle dance', RO: 'Dans freestyle' },
				ad: 'anim@amb@nightclub@dancers@dixon_entourage@',
				an: 'mi_dance_facedj_15_v1_male^4',
				af: 9
			},
			{
				id: 17,
				name: { EN: 'Dance erratic', RO: 'Dans neregulat' },
				ad: 'anim@amb@nightclub@dancers@podium_dancers@',
				an: 'hi_dance_facedj_17_v2_male^5',
				af: 9
			},
			{
				id: 18,
				name: { EN: 'Athlete dance', RO: 'Dansul sportivului' },
				ad: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
				an: 'high_center',
				af: 9
			},
			{
				id: 19,
				name: { EN: 'Hip hop dance', RO: 'Dans hip hop' },
				ad: 'anim@amb@nightclub@dancers@crowddance_groups@hi_intensity',
				an: 'hi_dance_crowd_09_v1_female^6',
				af: 9
			},
			{
				id: 20,
				name: { EN: 'Dance with clapping', RO: 'Dans cu palme' },
				ad: 'anim@amb@nightclub@djs@black_madonna@',
				an: 'dance_b_idle_a_blamadon',
				af: 9
			},
			{
				id: 21,
				name: { EN: 'Dance guitarist', RO: 'Chitarist de dans' },
				ad: 'anim@amb@nightclub@dancers@crowddance_groups_transitions@from_hi_intensity',
				an: 'trans_dance_crowd_hi_to_li_09_v1_male^3',
				af: 9
			},
			{
				id: 22,
				name: { EN: 'Wuggie dance', RO: 'Dansul wuggie' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj@',
				an: 'hi_dance_facedj_09_v1_male^4',
				af: 9
			},
			{
				id: 23,
				name: { EN: 'Dance reeling', RO: 'Dans tăvăluindu-se' },
				ad: 'anim@amb@nightclub@dancers@crowddance_groups_transitions@from_hi_intensity',
				an: 'trans_dance_crowd_hi_to_mi_09_v1_male^2',
				af: 9
			},
			{
				id: 24,
				name: { EN: 'Crow step', RO: 'Pas de corb' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity',
				an: 'li_dance_facedj_09_v1_male^6',
				af: 9
			},
			{
				id: 25,
				name: { EN: 'Club step', RO: 'Pas de club' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_hi_intensity',
				an: 'trans_dance_facedj_hi_to_li_09_v1_male^6',
				af: 9
			},
			{
				id: 26,
				name: { EN: 'Clow dance', RO: 'Dansul clovilor' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_low_intensity',
				an: 'trans_dance_facedj_li_to_hi_07_v1_male^6',
				af: 9
			},
			{
				id: 27,
				name: {
					EN: 'Dancing out of boredom',
					RO: 'Dansând din plictiseală'
				},
				ad: 'anim@amb@nightclub@dancers@crowddance_groups_transitions@from_hi_intensity',
				an: 'trans_dance_crowd_hi_to_li__07_v1_male^6',
				af: 9
			},
			{
				id: 28,
				name: {
					EN: 'Dance while talking',
					RO: 'Dansează în timp ce vorbești'
				},
				ad: 'anim@amb@nightclub@dancers@crowddance_groups@low_intensity',
				an: 'li_dance_crowd_17_v1_male^6',
				af: 9
			},
			{
				id: 29,
				name: { EN: 'Bounce', RO: 'Sări' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_med_intensity',
				an: 'trans_dance_facedj_mi_to_li_09_v1_male^6',
				af: 9
			},
			{
				id: 30,
				name: { EN: 'Dance hip-hop', RO: 'Dansează hip-hop' },
				ad: 'anim@amb@nightclub@dancers@black_madonna_entourage@',
				an: 'hi_dance_facedj_09_v2_male^5',
				af: 9
			},
			{
				id: 31,
				name: {
					EN: 'Dance a little drunk',
					RO: 'Dansează puțin beat'
				},
				ad: 'anim@amb@nightclub@dancers@crowddance_single_props@',
				an: 'hi_dance_prop_09_v1_male^6',
				af: 9
			},
			{
				id: 32,
				name: { EN: 'Dance drunk', RO: 'Dansa beat' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj_transitions@',
				an: 'trans_dance_facedj_hi_to_mi_11_v1_female^6',
				af: 9
			},
			{
				id: 33,
				name: {
					EN: 'Dancing actively while drinking',
					RO: 'Dansează activ în timp ce bei'
				},
				ad: 'anim@amb@nightclub@dancers@tale_of_us_entourage@',
				an: 'mi_dance_prop_13_v2_male^4',
				af: 9
			},
			{
				id: 34,
				name: {
					EN: 'Dance with a buzz',
					RO: 'Dansează cu zgomot'
				},
				ad: 'anim@mp_player_intcelebrationfemale@uncle_disco',
				an: 'uncle_disco',
				af: 9
			},
			{
				id: 35,
				name: { EN: 'Dance shy', RO: 'Dansează timid' },
				ad: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_b@',
				an: 'high_center',
				af: 9
			},
			{
				id: 36,
				name: {
					EN: 'Dance with a glass in hand',
					RO: 'Dansează cu un pahar în mână'
				},
				ad: 'anim@amb@nightclub@dancers@crowddance_single_props@hi_intensity',
				an: 'hi_dance_prop_13_v1_male^6',
				af: 9
			},
			{
				id: 37,
				name: { EN: 'Lap dance 1', RO: 'Lap dance 1' },
				ad: 'mini@strip_club@lap_dance_2g@ld_2g_p2',
				an: 'ld_2g_p2_s1',
				af: 9
			},
			{
				id: 38,
				name: { EN: 'Lap dance 2', RO: 'Lap dance 2' },
				ad: 'mini@strip_club@lap_dance_2g@ld_2g_p3',
				an: 'ld_2g_p3_s2',
				af: 9
			},
			{
				id: 39,
				name: { EN: 'Lap dance 3', RO: 'Lap dance 3' },
				ad: 'amb@world_human_prostitute@cokehead@idle_a',
				an: 'idle_a',
				af: 9
			},
			{
				id: 40,
				name: { EN: 'Lap dance 4', RO: 'Lap dance 4' },
				ad: 'mp_safehouse',
				an: 'lap_dance_girl',
				af: 8
			},
			{
				id: 41,
				name: { EN: 'Drunken dance', RO: 'Dans beat' },
				ad: 'amb@world_human_partying@female@partying_beer@idle_a',
				an: 'idle_b',
				af: 9
			},
			{
				id: 42,
				name: { EN: 'Stagger drunk', RO: 'Se clătina beat' },
				ad: 'amb@world_human_prostitute@cokehead@idle_a',
				an: 'idle_c',
				af: 9
			},
			{
				id: 43,
				name: {
					EN: 'To stagger drunk and drink',
					RO: 'A se clătina beat și a bea'
				},
				ad: 'anim@amb@nightclub@dancers@crowddance_single_props_transitions@from_med_intensity',
				an: 'trans_crowd_prop_mi_to_li_11_v1_male^6',
				af: 9
			},
			{
				id: 44,
				name: { EN: 'Think', RO: 'Gândi' },
				ad: 'timetable@tracy@ig_8@idle_a',
				an: 'idle_a',
				af: 8
			},
			{
				id: 45,
				name: {
					EN: 'Lower back warm-up',
					RO: 'Încălzirea spatelui inferior'
				},
				ad: 'timetable@tracy@ig_5@idle_a',
				an: 'idle_a',
				af: 9
			},
			{
				id: 46,
				name: { EN: 'Hand warm-up', RO: 'Încălzirea mâinilor' },
				ad: 'timetable@tracy@ig_5@idle_a',
				an: 'idle_b',
				af: 9
			},
			{
				id: 47,
				name: { EN: 'Leg warm-up', RO: 'Încălzirea picioarelor' },
				ad: 'timetable@tracy@ig_5@idle_b',
				an: 'idle_e',
				af: 9
			},
			{
				id: 48,
				name: { EN: 'Carry on your back', RO: 'Du-te pe spate' },
				ad: 'oddjobs@assassinate@multi@yachttarget@lapdance',
				an: 'yacht_ld_f',
				af: 8
			},
			{
				id: 49,
				name: {
					EN: 'Want to go to the toilet',
					RO: 'Vreau să merg la toaletă'
				},
				ad: 'misscarsteal4@toilet',
				an: 'desperate_toilet_idle_a',
				af: 9
			},
			{
				id: 50,
				name: { EN: 'Glee 1', RO: 'Bucurie 1' },
				ad: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
				an: 'med_right_up',
				af: 9
			},
			{
				id: 51,
				name: { EN: 'Glee 2', RO: 'Bucurie 2' },
				ad: 'mini@strip_club@idles@dj@idle_04',
				an: 'idle_04',
				af: 9
			},
			{
				id: 52,
				name: { EN: 'Glee 3', RO: 'Bucurie 3' },
				ad: 'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
				an: 'high_center',
				af: 9
			},
			{
				id: 53,
				name: { EN: 'Glee 4', RO: 'Bucură-te 4' },
				ad: 'anim@amb@nightclub@dancers@crowddance_facedj@',
				an: 'hi_dance_facedj_09_v1_female^6',
				af: 9
			},
			{
				id: 54,
				name: {
					EN: 'Dance with your hips',
					RO: 'Dansează cu șoldurile'
				},
				ad: 'anim@amb@nightclub@lazlow@hi_podium@',
				an: 'danceidle_hi_06_base_laz',
				af: 9
			},
			{
				id: 55,
				name: { EN: 'Chicken', RO: 'Pui' },
				ad: 'anim@mp_player_intcelebrationfemale@chicken_taunt',
				an: 'chicken_taunt',
				af: 8
			}
		]
	},
	{
		id: 5,
		name: { EN: 'Physical exercise', RO: 'Exercițiu fizic' },
		animations: [
			{
				id: 0,
				name: { EN: 'Push up', RO: 'Împinge' },
				ad: 'amb@world_human_push_ups@male@base',
				an: 'base',
				af: 8
			},
			{
				id: 1,
				name: { EN: 'Download press', RO: 'Descarcă presa' },
				ad: 'amb@world_human_sit_ups@male@base',
				an: 'base',
				af: 8
			},
			{
				id: 2,
				name: {
					EN: 'Running in place spreading arms',
					RO: 'Alergând pe loc cu brațele întinse'
				},
				ad: 'amb@world_human_jog_standing@female@idle_a',
				an: 'idle_a',
				af: 8
			},
			{
				id: 3,
				name: { EN: 'Running in place', RO: 'Alergând pe loc' },
				ad: 'amb@world_human_jog_standing@male@base',
				an: 'base',
				af: 8
			},
			{
				id: 4,
				name: { EN: 'Warm up-1', RO: 'Încălzire-1' },
				ad: 'amb@world_human_muscle_flex@arms_at_side@idle_a',
				an: 'idle_a',
				af: 8
			},
			{
				id: 6,
				name: { EN: 'Run in place', RO: 'Fugi pe loc' },
				ad: 'amb@world_human_jog_standing@male@base',
				an: 'base',
				af: 8
			},
			{
				id: 7,
				name: { EN: 'Sway', RO: 'Legănare' },
				ad: 'anim@mp_player_intcelebrationmale@peace',
				an: 'peace',
				af: 9
			},
			{
				id: 8,
				name: {
					EN: 'Catch my breath',
					RO: 'Să-mi recapăt suflul'
				},
				ad: 'timetable@reunited@ig_2',
				an: 'jimmy_base',
				af: 8
			}
		]
	},
	{
		id: 6,
		name: { EN: 'Emotions', RO: 'Emoții' },
		animations: [
			{
				id: 0,
				name: { EN: 'Rejoice-1', RO: 'Bucură-te-1' },
				ad: 'missmic_4premiere',
				an: 'movie_prem_01_f_a',
				af: 8
			},
			{
				id: 1,
				name: { EN: 'Rejoice-2', RO: 'Bucură-te-2' },
				ad: 'mini@dartsoutro',
				an: 'darts_outro_03_guy2',
				af: 8
			},
			{
				id: 2,
				name: { EN: 'Rejoice-3', RO: 'Bucură-te-3' },
				ad: 'mini@dartsoutro',
				an: 'darts_outro_01_guy1',
				af: 8
			},
			{
				id: 3,
				name: { EN: 'Rejoice-4', RO: 'Bucură-te-4' },
				ad: 'anim@mp_player_intcelebrationfemale@freakout',
				an: 'freakout',
				af: 8
			},
			{
				id: 4,
				name: { EN: 'Clap your hands-1', RO: 'Bate din palme-1' },
				ad: 'missmic_4premiere',
				an: 'movie_prem_02_f_a',
				af: 8
			},
			{
				id: 6,
				name: { EN: 'Clap your hands-3', RO: 'Bate din palme-3' },
				ad: 'amb@world_human_cheering@male_a',
				an: 'base',
				af: 8
			},
			{
				id: 7,
				name: { EN: 'Clap your hands-4', RO: 'Bate din palme-4' },
				ad: 'amb@world_human_cheering@male_e',
				an: 'base',
				af: 8
			},
			{
				id: 8,
				name: { EN: 'Clap your hands-5', RO: 'Bate din palme-5' },
				ad: 'anim@mp_player_intcelebrationfemale@slow_clap',
				an: 'slow_clap',
				af: 8
			},
			{
				id: 9,
				name: { EN: 'Support-1', RO: 'Suport-1' },
				ad: 'amb@world_human_cheering@female_a',
				an: 'base',
				af: 8
			},
			{
				id: 10,
				name: { EN: 'Support-2', RO: 'Suport-2' },
				ad: 'amb@world_human_cheering@female_c',
				an: 'base',
				af: 8
			},
			{
				id: 11,
				name: { EN: 'Support-3', RO: 'Suport-3' },
				ad: 'amb@world_human_cheering@male_b',
				an: 'base',
				af: 8
			},
			{
				id: 12,
				name: { EN: 'Kiss-1', RO: 'Sărut-1' },
				ad: 'anim@mp_player_intcelebrationfemale@blow_kiss',
				an: 'blow_kiss',
				af: 8
			},
			{
				id: 13,
				name: { EN: 'Kiss-2', RO: 'Sărut-2' },
				ad: 'anim@mp_player_intcelebrationfemale@chin_brush',
				an: 'chin_brush',
				af: 8
			},
			{
				id: 14,
				name: { EN: 'Kiss-3', RO: 'Sărut-3' },
				ad: 'anim@mp_player_intcelebrationfemale@finger_kiss',
				an: 'finger_kiss',
				af: 8
			},
			{
				id: 15,
				name: { EN: 'Soothe', RO: 'Calma' },
				ad: 'amb@code_human_police_crowd_control@idle_a',
				an: 'idle_c',
				af: 8
			},
			{
				id: 16,
				name: { EN: 'Respect', RO: 'Respect' },
				ad: 'anim@mp_player_intcelebrationfemale@bro_love',
				an: 'bro_love',
				af: 8
			},
			{
				id: 17,
				name: { EN: 'Victory!', RO: 'Victorie!' },
				ad: 'anim@arena@celeb@flat@solo@no_props@',
				an: 'slide_a_player_a',
				af: 8
			},
			{
				id: 18,
				name: { EN: 'Back somersault', RO: 'Capulă înapoi' },
				ad: 'anim@arena@celeb@flat@solo@no_props@',
				an: 'flip_a_player_a',
				af: 8
			},
			{
				id: 19,
				name: {
					EN: 'In a misunderstanding',
					RO: 'Într-o neînțelegere'
				},
				ad: 'anim@arena@celeb@flat@solo@no_props@',
				an: 'wow_b_player_b',
				af: 8
			},
			{
				id: 20,
				name: { EN: 'Hand face', RO: 'Fața mâinii' },
				ad: 'anim@mp_player_intcelebrationfemale@face_palm',
				an: 'face_palm',
				af: 8
			},
			{
				id: 21,
				name: { EN: 'Disappointed', RO: 'Dezamăgit' },
				ad: 'mini@dartsoutro',
				an: 'darts_outro_03_guy1',
				af: 8
			},
			{
				id: 23,
				name: { EN: 'Guitar player', RO: 'Chitarist' },
				ad: 'anim@mp_player_intcelebrationfemale@air_guitar',
				an: 'air_guitar',
				af: 8
			},
			{
				id: 24,
				name: { EN: 'Rock', RO: 'Stâncă' },
				ad: 'amb@code_human_in_car_mp_actions@rock@bodhi@rps@base',
				an: 'idle_a',
				af: 8
			},
			{
				id: 25,
				name: { EN: 'Pinwheel', RO: 'Pinwheel' },
				ad: 'anim@arena@celeb@flat@solo@no_props@',
				an: 'cap_a_player_a',
				af: 8
			},
			{
				id: 5,
				name: { EN: 'Clap your hands-2', RO: 'Bate din palme-2' },
				ad: 'amb@world_human_cheering@female_d',
				an: 'base',
				af: 8
			}
		]
	},
	{
		id: 7,
		name: { EN: 'Gait styles', RO: 'Stiluri de mers' },
		animations: [
			{
				id: 0,
				name: { EN: 'Standard', RO: 'Standard' },
				style: ''
			},
			{
				id: 1,
				name: { EN: 'Tired', RO: 'Obosit' },
				style: 'ANIM_GROUP_MOVE_LEMAR_ALLEY'
			},
			{
				id: 2,
				name: { EN: 'With a fist', RO: 'Cu pumnul' },
				style: 'clipset@move@trash_fast_turn'
			},
			{
				id: 3,
				name: {
					EN: 'With an object in hand',
					RO: 'Cu un obiect în mână'
				},
				style: 'missfbi4prepp1_garbageman'
			},
			{
				id: 4,
				name: { EN: 'From a hangover', RO: 'Dintr-o mahmureală' },
				style: 'move_characters@franklin@fire'
			},
			{
				id: 5,
				name: { EN: 'Unhurried', RO: 'Fără grabă' },
				style: 'move_characters@Jimmy@slow@'
			},
			{
				id: 6,
				name: { EN: 'Tension', RO: 'Tensiune' },
				style: 'move_characters@michael@fire'
			},
			{
				id: 7,
				name: { EN: "Ladies' №1", RO: 'Doamnelor №1' },
				style: 'FEMALE_FAST_RUNNER'
			},
			{
				id: 8,
				name: { EN: "Ladies' #2", RO: 'Doamnelor №2' },
				style: 'move_f@flee@a'
			},
			{
				id: 9,
				name: { EN: 'Nervous', RO: 'Agitat' },
				style: 'move_f@scared'
			},
			{
				id: 10,
				name: { EN: 'Sexy', RO: 'Sexy' },
				style: 'move_f@sexy@a'
			},
			{
				id: 11,
				name: { EN: 'Limp', RO: 'Moale' },
				style: 'move_heist_lester'
			},
			{
				id: 12,
				name: { EN: 'Limp slightly', RO: 'Șchiopătează ușor' },
				style: 'move_injured_generic'
			},
			{
				id: 13,
				name: {
					EN: 'Limp with a cane',
					RO: 'Şchiopătează cu un baston'
				},
				style: 'move_lester_CaneUp'
			},
			{
				id: 14,
				name: { EN: 'Imposingly', RO: 'Impunător' },
				style: 'move_m@bag'
			},
			{
				id: 15,
				name: { EN: 'Cheeky', RO: 'Obraznic' },
				style: 'move_m@brave'
			},
			{
				id: 16,
				name: { EN: 'Cheeky (slow)', RO: 'Obraznic (lent)' },
				style: 'move_m@casual@d'
			},
			{
				id: 17,
				name: { EN: 'Stoned', RO: 'Cu pietre' },
				style: 'MOVE_M@BAIL_BOND_NOT_TAZERED'
			},
			{
				id: 18,
				name: { EN: 'Heavily stoned', RO: 'Puternic cu pietre' },
				style: 'MOVE_M@BAIL_BOND_TAZERED'
			},
			{
				id: 19,
				name: { EN: 'Sleepy', RO: 'Somnoros' },
				style: 'move_m@fire'
			},
			{
				id: 20,
				name: { EN: 'Gangster', RO: 'Gangster' },
				style: 'move_m@gangster@var_e'
			},
			{
				id: 21,
				name: { EN: 'Sleepy', RO: 'Somnoros' },
				style: 'move_m@gangster@var_f'
			},
			{
				id: 22,
				name: { EN: 'Gangster', RO: 'Gangster' },
				style: 'move_m@gangster@var_i'
			},
			{
				id: 23,
				name: { EN: 'Relaxed', RO: 'Relaxat' },
				style: 'move_m@JOG@'
			},
			{
				id: 24,
				name: { EN: 'Business', RO: 'Afaceri' },
				style: 'MOVE_P_M_ONE'
			},
			{
				id: 25,
				name: { EN: 'Evil', RO: 'Rău' },
				style: 'move_p_m_zero_janitor'
			},
			{
				id: 26,
				name: { EN: 'Stately (slow)', RO: 'Majestuos (lent)' },
				style: 'move_p_m_zero_slow'
			},
			{
				id: 27,
				name: { EN: 'Stylish', RO: 'Stilat' },
				style: 'MOVE_M@FEMME@'
			},
			{
				id: 28,
				name: { EN: 'Mafia', RO: 'Mafia' },
				style: 'MOVE_M@GANGSTER@NG'
			},
			{
				id: 29,
				name: { EN: 'Posh', RO: 'Şic' },
				style: 'MOVE_M@POSH@'
			},
			{
				id: 30,
				name: { EN: 'Cool', RO: 'Rece' },
				style: 'MOVE_M@TOUGH_GUY@'
			}
		]
	}
];

export default anims;
