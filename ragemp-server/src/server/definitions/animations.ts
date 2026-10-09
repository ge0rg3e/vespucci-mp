export const Animation: Record<string, Animation> = {
	idle: {
		dist: 'anim@heists@heist_corona@team_idles@male_a',
		name: 'idle',
		flags: 1
	},
	idle2: {
		dist: 'anim@heists@heist_corona@team_idles@female_a',
		name: 'idle',
		flags: 1
	},
	idle3: {
		dist: 'anim@heists@humane_labs@finale@strip_club',
		name: 'ped_b_celebrate_loop',
		flags: 1
	},
	handsup: {
		dist: 'missminuteman_1ig_2',
		name: 'handsup_base',
		flags: 1 | 32 | 48 | 120
	},
	pee: {
		dist: 'misscarsteal2peeing',
		name: 'peeing_loop',
		flags: 1
	},
	sleep: {
		dist: 'timetable@tracy@sleep@',
		name: 'idle_c',
		flags: 1
	},
	sit: {
		dist: 'anim@amb@business@bgen@bgen_no_work@',
		name: 'sit_phone_phoneputdown_idle_nowork',
		flags: 1
	},
	sit2: {
		dist: 'rcm_barry3',
		name: 'barry_3_sit_loop',
		flags: 1
	},
	sit3: {
		dist: 'amb@world_human_picnic@male@idle_a',
		name: 'idle_a',
		flags: 1
	},
	wave: {
		dist: 'random@mugging5',
		name: '001445_01_gangintimidation_1_female_idle_b',
		flags: 1
	},
	twerk: {
		dist: 'switch@trevor@mocks_lapdance',
		name: '001443_01_trvs_28_idle_stripper',
		flags: 1
	},
	sitchair: {
		dist: 'timetable@ron@ig_5_p3',
		name: 'ig_5_p3_base',
		flags: 1
	},
	dance: {
		dist: 'anim@amb@nightclub@dancers@podium_dancers@',
		name: 'hi_dance_facedj_17_v2_male^5',
		flags: 1
	},
	dance2: {
		dist: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_b@',
		name: 'high_center_down',
		flags: 1
	},
	dance3: {
		dist: 'anim@amb@nightclub@mini@dance@dance_solo@male@var_a@',
		name: 'high_center',
		flags: 1
	},
	chill: {
		dist: 'switch@trevor@scares_tramp',
		name: 'trev_scares_tramp_idle_tramp',
		flags: 1
	},
	pullover: {
		dist: 'misscarsteal3pullover',
		name: 'pull_over_right',
		flags: 1
	},
	crossarms: {
		dist: 'amb@world_human_hang_out_street@female_arms_crossed@idle_a',
		name: 'idle_a',
		flags: 1 | 32 | 48 | 120
	},
	damn: {
		dist: 'gestures@m@standing@casual',
		name: 'gesture_damn',
		flags: 1
	},
	facepalm: {
		dist: 'random@car_thief@agitated@idle_a',
		name: 'agitated_idle_a',
		flags: 1
	},
	fightme: {
		dist: 'anim@deathmatch_intros@unarmed',
		name: 'intro_male_unarmed_c',
		flags: 1
	},
	lean: {
		dist: 'amb@world_human_leaning@female@wall@back@hand_up@idle_a',
		name: 'idle_a',
		flags: 1
	},
	mechanic: {
		dist: 'mini@repair',
		name: 'fixing_a_ped',
		flags: 1
	},
	meditate: {
		dist: 'rcmcollect_paperleadinout@',
		name: 'meditiate_idle',
		flags: 1
	},
	ok: {
		dist: 'anim@mp_player_intselfiedock',
		name: 'idle_a',
		flags: 1 | 32 | 48 | 120
	},
	salute: {
		dist: 'anim@mp_player_intincarsalutestd@ds@',
		name: 'idle_a',
		flags: 1
	},
	clap: {
		dist: 'amb@world_human_cheering@male_a',
		name: 'base',
		flags: 1
	},
	think: {
		dist: 'mp_cp_welcome_tutthink',
		name: 'b_think',
		flags: 1
	},
	lol: {
		dist: 'anim@arena@celeb@flat@paired@no_props@',
		name: 'laugh_a_player_b',
		flags: 1
	},
	statue: {
		dist: 'fra_0_int-1',
		name: 'cs_lamardavis_dual-1',
		flags: 1
	},
	gangsign: {
		dist: 'mp_player_int_uppergang_sign_a',
		name: 'mp_player_int_gang_sign_a',
		flags: 1
	},
	gangsign2: {
		dist: 'mp_player_int_uppergang_sign_b',
		name: 'mp_player_int_gang_sign_b',
		flags: 1
	},
	wait: {
		dist: 'random@shop_tattoo',
		name: '_idle_a',
		flags: 1
	},
	hora: {
		dist: 'special_ped@mountain_dancer@monologue_3@monologue_3a',
		name: 'mnt_dnc_buttwag',
		flags: 1
	}
};

type Animation = {
	dist: string;
	name: string;
	flags: number;
};
