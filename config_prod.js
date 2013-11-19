//#include config_base.js
//#include inc_data_swfs_locations_prod.js
//#include inc_data_maps_prod.js
//#include inc_data_sounds.js
//#include inc_data_overlays.js
//#include inc_data_street_upgrades_prod.js
//#include inc_data_pols_prod.js
//#include inc_data_swfs_avatar_prod.js
//#include inc_data_mapextras_prod.js
//#include inc_data_homes_prod.js
//#include inc_data_feats_prod.js

var familiar_tsid = 'I-FAMILIAR';
var web_api_url = 'http://www.glitch.com/';
var world_api_url = 'http://staging.glitch.com/';
var web_root = 'http://www.glitch.com';

var is_dev = false;
var is_prod = true;

var trant_growth_enabled = true;
var greeting_enabled = true;

var hell = {
	tsid: 'LA5PPFP86NF2FOS',
	x: [-910, -814, -712],
	y: [-357, -357, -357]
};

// A safe location when all else fails
var default_location = {
	tsid: 'LLIF6R3R9GE1GQB',
	x: -468,
	y: -111
};

var verb_radius = 800;
var force_intro = true;
var max_groups = 20;
var max_party_size = 71;
var garden_water_threshold = 3600;
var garden_grow_multiplier = 1.0; // This is also in php config

var auction_delivery_time = 600;
var mail_delivery_time = 0;
var mail_delivery_time_with_attachment = 7*60;

var acl_keys_per_house_limit = 100;
var acl_keys_per_player_limit = 100;

var all_players = [];

var skill_points_per_second = 10;
var skill_learning_modifier_step = 0.05;
var emblem_favor_cost = 1000;
var emblem_favor_increment = 100;

var daily_quoin_limit = 100;

var trant_growth_multiplier = 1.00; // Adjust this to globally speed up or slow down the rates

var rook_attack_strength = 5000;
var rook_attack_tracker = "RHFNA9M6TPB3SS0";

// where the newxp takes you after you finish it
var newxp_exits = [
//Alakol	
	{
		tsid: 'LCRR4REARA12CM5',
		x: -2295,
		y: -1300
	},
	{
		tsid: 'LHV1AMP8TL02B40',
		x: -2355,
		y: -1300
	},
	{
		tsid: 'LLI17P0T8J029N7',
		x: 2344,
		y: -1300
	},
	{
		tsid: 'LHV1CIQLVL02C6H',
		x: -2355,
		y: -1300
	},
	{
		tsid: 'LHV1IHMG1312A0S',
		x: 2421,
		y: -1300
	},
	{
		tsid: 'LCRL3F8I3L12O0J',
		x: 2525,
		y: -1300
	},
	{
		tsid: 'LCR12D911T12E57',
		x: 2457,
		y: -1300
	},
	{
		tsid: 'LCR8F1FLBI12F2H',
		x: 2320,
		y: -1300
	},
	{
		tsid: 'LCR137T2HK123RR',
		x: -2355,
		y: -1300
	},
	{
		tsid: 'LHVTUCELRV02V9I',
		x: 2293,
		y: -1300
	},
//Andra
	{
		tsid: 'LA51701PF262LC8',
		x: -800,
		y: -1300
	},
	{
		tsid: 'LA5FUB7R0N627KI',
		x: -414,
		y: -2700
	},
	{
		tsid: 'LA58KK7B9O522PC',
		x: 380,
		y: -2700
	},
	{
		tsid: 'LA517MT2M262D0F',
		x: -2280,
		y: -1300
	},	
	{
		tsid: 'LA519RU9M462NJ1',
		x: 2367,
		y: -1300
	},
	{
		tsid: 'LA51BMHT2562Q3D',
		x: -2207,
		y: -1300
	},
	{
		tsid: 'LA55645B8O528MI',
		x: -2525,
		y: -1300
	},
//Aranna
	{
		tsid: 'LHVSU0QSQIA2TIM',
		x: 2434,
		y: -1300
	},
	{
		tsid: 'LHV1KT9J0LA2IIA',
		x: -1425,
		y: -1300
	},
	{
		tsid: 'LHVT10TNRIA23L2',
		x: -262,
		y: -1300
	},
	{
		tsid: 'LHV1H71LPKA2P7G',
		x: -2488,
		y: -1300
	},
	{
		tsid: 'LHV23IAU9LA2E7A',
		x: 2267,
		y: -1300
	},
	{
		tsid: 'LHVT0JVHRIA2IE9',
		x: -2354,
		y: -1300
	},
//Besara
	{
		tsid: 'LA912UEGE492F2G',
		x: 2301,
		y: -1300
	},
	{
		tsid: 'LA91O38QQ192K8J',
		x: -2357,
		y: -1300
	},
	{
		tsid: 'LA912LITC492EU2',
		x: 808,
		y: -1300
	},
	{
		tsid: 'LA9143HLH4929K7',
		x: -2357,
		y: -1300
	},
	{
		tsid: 'LA9FDN44SG92SDQ',
		x: -2287,
		y: -1300
	},
	{
		tsid: 'LA9I92MRBE92S8Q',
		x: 2297,
		y: -1300
	},
	{
		tsid: 'LA9111H84492V1K',
		x: 2345,
		y: -1300
	},
	{
		tsid: 'LA9BRBV8Q492K6R',
		x: -2322,
		y: -1300
	},
	{
		tsid: 'LA99NEQK1F92ICE',
		x: -2355,
		y: -1300
	},
//Bortola
	{
		tsid: 'LIF8I91P8J02A85',
		x: 1521,
		y: -1700
	},
	{
		tsid: 'LHVMCDF3LA32K2R',
		x: 1786,
		y: -1500
	},
	{
		tsid: 'LIF13QL5IG02UAI',
		x: -1950,
		y: -1500
	},
	{
		tsid: 'LHVQM0MUB032B5S',
		x: -1712,
		y: -1500
	},
	{
		tsid: 'LHVLJEBAJ832SJA',
		x: 1655,
		y: -1500
	},
	{
		tsid: 'LHVMHDIBNA32QPF',
		x: 1935,
		y: -1500
	},
	{
		tsid: 'LHV8NMVAGE228A2',
		x: -1775,
		y: -1500
	},
	{
		tsid: 'LHVVLBM1VL22A6Q',
		x: -1382,
		y: -1500
	},
	{
		tsid: 'LIFNRF3P0E02J90',
		x: 1821,
		y: -1500
	},
	{
		tsid: 'LHVD0VVK8U2262J',
		x: -1777,
		y: -1500
	},
//Groddle Forest
	{
		tsid: 'LCR1UERKPIN1G7N',
		x: -2473,
		y: -1300
	},
	{
		tsid: 'LCR103UREMK11MT',
		x: -2201,
		y: -1300
	},
	{
		tsid: 'LCR143M18PK1774',
		x: -2364,
		y: -1300
	},
	{
		tsid: 'LCR10S7GVKJ1ABI',
		x: -2525,
		y: -1300
	},
	{
		tsid: 'LCR13CE52PK1L81',
		x: -2415,
		y: -1300
	},
	{
		tsid: 'LLIF37ASJFE1AVQ',
		x: 2182,
		y: -1300
	},
	{
		tsid: 'LCR13O9VQEM1M3P',
		x: -2423,
		y: -1300
	},
	{
		tsid: 'LLIF3AQTOFE19OR',
		x: 2373,
		y: -1300
	},
//Groddle Heights
	{
		tsid: 'LCR10K63BQL14PE',
		x: -1389,
		y: -1600
	},
	{
		tsid: 'LCR1460502K1790',
		x: 2306,
		y: -1300
	},
	{
		tsid: 'LCR131F8U1K1PF9',
		x: 2311,
		y: -1300
	},
	{
		tsid: 'LCR1OU9H34K19OE',
		x: -160,
		y: -2300
	},
	{
		tsid: 'LCRHJHOFQNL1PHP',
		x: 1489,
		y: -1600
	},
	{
		tsid: 'LCR12NU45AM12BB',
		x: -1563,
		y: -1600
	},
//Groddle Meadow
	{
		tsid: 'LCR11JA67NJ15N3',
		x: -2400,
		y: -1300
	},
	{
		tsid: 'LCRO4M7LH5L1QOO',
		x: -2392,
		y: -1300
	},
	{
		tsid: 'LCRVT5V0BDO1HLF',
		x: 2508,
		y: -1300
	},
	{
		tsid: 'LCR11DNA3EL10TD',
		x: -2443,
		y: -1300
	},
	{
		tsid: 'LCR111KI08O1HLB',
		x: -2501,
		y: -1300
	},
	{
		tsid: 'LLI334UG2UD1IKQ',
		x: 2358,
		y: -1300
	},
	{
		tsid: 'LCR10K0NLRK1GKE',
		x: 2390,
		y: -1300
	},
	{
		tsid: 'LLI32HBOUTD1GQV',
		x: 2438,
		y: -1300
	},
	{
		tsid: 'LCR1664750O1D23',
		x: 1242,
		y: -1600
	},
	{
		tsid: 'LCRHSGTEION115H',
		x: 2080,
		y: -1300
	},
//Jethimadh
	{
		tsid: 'LIFN3FI0TNU10PS',
		x: -2190,
		y: -1400
	},
	{
		tsid: 'LIF1SGGD7EU12T5',
		x: 1074,
		y: -1400
	},
	{
		tsid: 'LIF1609JRKV151E',
		x: 1859,
		y: -1400
	},
	{
		tsid: 'LIF15S7VPRV1DIP',
		x: 283,
		y: -1500
	},
	{
		tsid: 'LIFMGTCIQGU13TS',
		x: 2478,
		y: -1150
	},
	{
		tsid: 'LIFN5CQH1OU1P61',
		x: -1900,
		y: -1400
	},
//Kajuu
	{
		tsid: 'LHV1BIOIL142P25',
		x: 2657,
		y: -1300
	},
	{
		tsid: 'LHV3ISF18352QIP',
		x: -2427,
		y: -1300
	},
	{
		tsid: 'LHV17CFO5V327AJ',
		x: 2262,
		y: -1300
	},
	{
		tsid: 'LHVHP2BJI652O9S',
		x: 2328,
		y: -1300
	},
	{
		tsid: 'LHV1FUFU9442AKR',
		x: 2333,
		y: -1300
	},
	{
		tsid: 'LHV2JBHA9152QAS',
		x: -2722,
		y: -1300
	},
//Muufo
	{
		tsid: 'LA9KL58B1D82CDV',
		x: -2390,
		y: -1300
	},
	{
		tsid: 'LA9KKVJDTC829U8',
		x: 2428,
		y: -1300
	},
	{
		tsid: 'LA9KL68C1D825IA',
		x: -2462,
		y: -1300
	},
	{
		tsid: 'LA9T11KPMD82B1S',
		x: -2372,
		y: -1300
	},
	{
		tsid: 'LA9GLRKMQF82961',
		x: 2440,
		y: -1300
	},
	{
		tsid: 'LA961CLV4G8252G',
		x: -2405,
		y: -1300
	},
	{
		tsid: 'LA9BSVRN5I82JIQ',
		x: 2406,
		y: -1300
	},
	{
		tsid: 'LA9L02KJ2D829LS',
		x: 2325,
		y: -1300
	},
//Rasana
	{
		tsid: 'LUV1V6AR27G26QO',
		x: 2599,
		y: -1300
	},
	{
		tsid: 'LUVTKR868NF27QG',
		x: -2459,
		y: -1300
	},
	{
		tsid: 'LUVQMVII88F2O29',
		x: 2468,
		y: -1300
	},
	{
		tsid: 'LUVL8CLKD5F2TNB',
		x: 2310,
		y: -1300
	},
	{
		tsid: 'LUVUVJBM5DF2UR6',
		x: -2484,
		y: -1300
	},
	{
		tsid: 'LUVL2G4TQ7F2L1T',
		x: -1213,
		y: -1300
	},
	{
		tsid: 'LUVMBSKJQ5F289H',
		x: -2296,
		y: -1300
	},
	{
		tsid: 'LUVNUGNGN5F2BOT',
		x: 2270,
		y: -1300
	},
	{
		tsid: 'LUVCMP7BM7F2JET',
		x: -495,
		y: -1300
	},
//Salatu
	{
		tsid: 'LIFE9GRB8S62L1H',
		x: 695,
		y: -1300
	},
	{
		tsid: 'LIFQMHF4MT72V9Q',
		x: 2389,
		y: -1300
	},
	{
		tsid: 'LIF16SBFB972GLK',
		x: 2400,
		y: -1300
	},
	{
		tsid: 'LIF14KB3T872MAH',
		x: 470,
		y: -1300
	},
	{
		tsid: 'LIF1AQ6CK972734',
		x: -305,
		y: -1300
	},
	{
		tsid: 'LIFCLLMITT727LH',
		x: 2418,
		y: -1300
	},
	{
		tsid: 'LIF18TO5NB72AMR',
		x: 2522,
		y: -1300
	},
	{
		tsid: 'LIFR3G1FFE72K0S',
		x: -2401,
		y: -1300
	},
//Shimla Mirch
	{
		tsid: 'LTJ103NK29K1TNJ',
		x: 834,
		y: -1300
	},
	{
		tsid: 'LTJ112E9DIO1BPE',
		x: 2335,
		y: -1300
	},
	{
		tsid: 'LTJ13ELOLPQ1DP3',
		x: -2388,
		y: -1300
	},
	{
		tsid: 'LLI599R12JI1216',
		x: 2488,
		y: -1300
	},
	{
		tsid: 'LLI57EKC2HI1EH8',
		x: 2395,
		y: -1300
	},
//Tamila
	{
		tsid: 'LIFIEGBN9E72ILT',
		x: 2397,
		y: -1300
	},
	{
		tsid: 'LIF16PJS9972LC8',
		x: 2331,
		y: -1300
	},
	{
		tsid: 'LIF153KDV872SE5',
		x: -2318,
		y: -1300
	},
	{
		tsid: 'LIF7SHGS3E72T8L',
		x: 2414,
		y: -1300
	},
	{
		tsid: 'LIFVTRAAJE72GHD',
		x: -2315,
		y: -1300
	},
	{
		tsid: 'LIF16GDJ89724E3',
		x: 2435,
		y: -1300
	},
	{
		tsid: 'LIF16IHL8972EAC',
		x: -2381,
		y: -1300
	}
];

var food_energy_limit = 20;

// GFJ-Gregarious Grange-Jutuan Central-Onto Parada-Somewhat Sump-GFJ
var transit_instances = {
	'subway_1' : {
		'fare': 50,
		'type': 'subway',
		'vehicle': 'train',
		
		'map_background_url': 'http://c1.glitch.bz/img/maps/subway_map_bg_59215.jpg',
		'map_forwards_url': 'http://c1.glitch.bz/img/maps/subway_red_line_fg_59215.png',
		'map_backwards_url': 'http://c1.glitch.bz/img/maps/subway_blue_line_fg_59215.png',
		
		'forwards_name': 'Red Line',
		'backwards_name': 'Blue Line',
		
		'template_tsid': 'LTJ101M7R9O1HTT',
		'x': 0,
		'y': -59,
		
		'min_capacity': 3,
		'max_capacity': 10,
		'initial_departure_timeout': 60, // seconds
		'departure_timeout': 10, // seconds
		'arrival_timeout': 30, // seconds
		
		'stations': {

			1: {
				'name': 'Groddle Forest Junction',
				'previous_stop': 2,
				'next_stop': 6,
				'tsid': 'LCRC6VC9MAO1Q7F',
				'connects_to': 'LLI3272LOTD1B1F',
				'x': 0,
				'y': -136,
				'map_pos': [475, 270]
			},

			6: {
				'name': 'Tallish Crest',
				'previous_stop': 1,
				'next_stop': 7,
				'tsid': 'LM11D0VDR9229EC',
				'connects_to': 'LCR103T98QJ1SC9',
				'x': 0,
				'y': -136,
				'map_pos': [409, 205]
			},
			
			7: {
				'name': 'Torpan Cleft',
				'previous_stop': 6,
				'next_stop': 9,
				'tsid': 'LHV6B54D0F22B95',
				'connects_to': 'LCR241CP4Q129I1',
				'x': 0,
				'y': -136,
				'map_pos': [437, 102]
			},
			
			9: {
				'name': 'Mallos Means',
				'previous_stop': 7,
				'next_stop': 10,
				'tsid': 'LHV2CQPL1E32QM8',
				'connects_to': 'LHV1L41MCD32O4A',
				'x': 0,
				'y': -136,
				'map_pos': [519, 41]
			},
			
			10: {
				'name': 'Pitika Parse',
				'previous_stop': 9,
				'next_stop': 11,
				'tsid': 'LHVEBJCBRG52LSB',
				'connects_to': 'LHVE9CULH652BV2',
				'x': 0,
				'y': -136,
				'map_pos': [413, 28]
			},

			11: {
				'name': 'Kongu Hop',
				'previous_stop': 10,
				'next_stop': 12,
				'tsid': 'LA59OB99RE92267',
				'connects_to': 'LA51CGIGKK62NV8',
				'x': 0,
				'y': -136,
				'map_pos': [279, 37]
			},

			12: {
				'name': 'Thiruvan Thrive',
				'previous_stop': 11,
				'next_stop': 3,
				'tsid': 'LIF63N5UTE92SVD',
				'connects_to': 'LIFI9G70SV72H3C',
				'x': 0,
				'y': -136,
				'map_pos': [320, 105]
			},
			
			3: {
				'name': 'Gregarious Grange',
				'previous_stop': 12,
				'next_stop': 8,
				'tsid': 'LCR177QO65T1EON',
				'connects_to': 'LLI32G3NUTD100I',
				'x': 0,
				'y': -136,
				'map_pos': [324, 266]
			},

			8: {
				'name': 'Eastern Approach',
				'previous_stop': 3,
				'next_stop': 4,
				'tsid': 'LHV1U3M48M22D54',
				'connects_to': 'LIF2IUQJQ571TFL',
				'x': 0,
				'y': -136,
				'map_pos': [118, 175]
			},
			
			4: {
				'name': 'Jutuan Central',
				'previous_stop': 8,
				'next_stop': 5,
				'tsid': 'LTJ102S2J102N7O',
				'connects_to': 'LTJ8GSQV1IV1FBE',
				'x': 0,
				'y': -136,
				'map_pos': [223, 425]
			},
			
			5: {
				'name': 'Onto Parada',
				'previous_stop': 4,
				'next_stop': 2,
				'tsid': 'LIF6CR9OO302G5V',
				'connects_to': 'LIF10HE4JTU1S7P',
				'x': 0,
				'y': -136,
				'map_pos': [365, 423]
			},
			
			2: {
				'name': 'Somewhat Sump',
				'previous_stop': 5,
				'next_stop': 1,
				'tsid': 'LTJJSECBMAO13RH',
				'connects_to': 'LLI57DI72HI153U',
				'x': 0,
				'y': -136,
				'map_pos': [263, 367]
			}

		}
	}
};

var multiplayer_quest_locations = {
	'amazing_race' : [
		{
			title: 'The Amazing Race',
			tsid: 'LIF10A4HV3P17BU',
			num_players: 2,
			start_points: [{x: -575, y: 1897}, {x: 591, y: 1897}],
			race_type: 'finish_line'
		}
	],
	'canyon_run' : [
		{
			title: 'Canyon Run',
			tsid: 'LIF1H6AFJ9P19UJ',
			num_players: 2,
			start_points: [{x: -4672, y: -293}, {x: -4778, y: -416}],
			race_type: 'finish_line'
		}
	],
	'grab_em_good' : [
		{
			title: 'Grab \'Em Good',
			tsid: 'LIF11MB3O8P1TAR',
			num_players: 2,
			start_points: [{x: -319, y: 757}, {x: 356, y: 753}],
			race_type: 'most_quoins'
		}
	],
	'lava_leap' : [
		{
			title: 'Lava Leap',
			tsid: 'LIF107M5ORP1DQ5',
			num_players: 2,
			start_points: [{x: -2857, y: -385}, {x: -2938, y: -211}],
			race_type: 'finish_line'
		}
	],
	'crystal_climb' : [
		{
			title: 'Crystal Climb',
			tsid: 'LHV1BEMOK14268R',
			num_players: 2,
			start_points: [{x: 655, y: -165}, {x: -655, y: -165}],
			race_type: 'finish_line'
		}
	],
	'space_race' : [
		{
			title: 'Space Race',
			tsid: 'LHV1BCTKK142N8F',
			num_players: 2,
			start_points: [{x: -3940, y: -340}, {x: -3940, y: -485}],
			race_type: 'finish_line'
		}
	],
	'star_sprint' : [
		{
			title: 'Star Sprint',
			tsid: 'LHV1BF1QK142P0V',
			num_players: 2,
			start_points: [{x: 60, y: -375}, {x: -100, y: -375}],
			race_type: 'finish_line'
		}
	],
	'time_warp' : [
		{
			title: 'Time Warp',
			tsid: 'LHV1BDAMK142HAO',
			num_players: 2,
			start_points: [{x: -4745, y: -95}, {x: -4745, y: -243}],
			race_type: 'finish_line'
		}
	],
	'hogtie_piggy' : [
		{
			title: 'The Great Hog Haul',
			tsid: 'LHVLC8CI3Q62P8T',
			num_players: 2,
			start_points: [{x: 120, y: -890}, {x: -150, y: -885}],
			race_type: 'piggy_race'
		}
	],
	'cloudhopolis' : [
		{
			title: 'Cloudhopolis',
			tsid: 'LDO3V27SHQ13BAI',
			num_players: 2,
			start_points: [{x: 260, y: -383}, {x: 1262, y: -383}],
			race_type: 'quoins_in_time'
		}
	]
};

var greeting_locations = [
	/*// Forest Start 1
	{
		tsid: 'LCR1G73RL7T1VKI',
		//x: [-1003, 542, -273],
		//y: [-147, -48, -43]
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},
	// Forest Start 2
	{
		tsid: 'LDO4U6RN50D2L74',
		//x: [-1003, 542, -273],
		//y: [-147, -48, -43]
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},
	// Forest Start 3
	{
		tsid: 'LDO11O4750D2CFE',
		//x: [-1003, 542, -273],
		//y: [-147, -48, -43]
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},
	// Forest Start 4
	{
		tsid: 'LDOP37CA40D2FNT',
		//x: [-1003, 542, -273],
		//y: [-147, -48, -43]
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},*/


	/*// Meadow Start
	{
		tsid: 'LCR1IH8KM7T1HGH',
		//x: [-949, 35, -499],
		//y: [-52, -63, -41]
		x: [-1003],
		y: [-54],
		musicblock_position: [1428, -145]
	},

	// Heights Start 1
	{
		tsid: 'LIFN0JKR42D20CB',
		//x: [-622, -673, 169],
		//y: [-1326, -455, -80]
		x: [-815],
		y: [-98],
		musicblock_position: [524, -89]
	},
	// Heights Start 2
	{
		tsid: 'LIF4PVDIK2D2KCT',
		//x: [-622, -673, 169],
		//y: [-1326, -455, -80]
		x: [-815],
		y: [-98],
		musicblock_position: [524, -89]
	},*/


	// Alakol Start 1
	{
		tsid: 'LNVKFBM3PVC2GDD',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},
	// Alakol Start 2
	{
		tsid: 'LNVRJVDNB0D2GJ9',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},
	// Alakol Start 3
	{
		tsid: 'LNV57FNCD0D2059',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},
	// Alakol Start 4
	{
		tsid: 'LNV6FEDKD0D2J3O',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},


	// Muufo Start 1
	{
		tsid: 'LHVHDUF7PVC2D3E',
		x: [-984],
		y: [-133],
		musicblock_position: [951, -119]
	},
	// Muufo Start 2
	{
		tsid: 'LHVC6LAT70D23MG',
		x: [-984],
		y: [-133],
		musicblock_position: [951, -119]
	},
	// Muufo Start 3
	{
		tsid: 'LHVDQMOA80D245R',
		x: [-984],
		y: [-133],
		musicblock_position: [951, -119]
	},


	// Bortola Start 1
	{
		tsid: 'LA9U0VLRB0D2JES',
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},
	// Bortola Start 2
	{
		tsid: 'LA9U90TVB0D2EAH',
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},
	// Bortola Start 3
	{
		tsid: 'LA9TEC6GB0D2B2M',
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},
	// Bortola Start 4
	{
		tsid: 'LA9S5T1LA0D27NG',
		x: [-1024],
		y: [-152],
		musicblock_position: [-58, -287]
	},


	// Salatu Start 1
	{
		tsid: 'LHF2R7NJE0D2JOC',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},
	// Salatu Start 2
	{
		tsid: 'LHF3UJS8F0D2CCC',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},
	// Salatu Start 3
	{
		tsid: 'LHF358MNE0D27A3',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	},
	// Salatu Start 4
	{
		tsid: 'LHF1FNLTD0D28PT',
		x: [-1378],
		y: [-195],
		musicblock_position: [-1085, -177]
	}
];

// For the 11 Secret Locations quest/achievement.
var secret_spots = [
	{ id: '11spots_aranna_01', tsid: 'LHVT10TNRIA23L2', x:-1262, y:-864 },
	{ id: '11spots_aranna_02', tsid: 'LHV1H71LPKA2P7G', x:1176, y:-851 },
	{ id: '11spots_aranna_03', tsid: 'LHVGSE15MQA2OGE', x:1999, y:-802 },
	{ id: '11spots_aranna_04', tsid: 'LHV1HKHRSKA2CR9', x:2841, y:-618 },
	{ id: '11spots_aranna_05', tsid: 'LHVMK86NP7B26E6', x:2392, y:-702 },
	{ id: '11spots_kalavana_01', tsid: 'LA91SD0IEQA24L5', x:2402, y:-564 },
	{ id: '11spots_kalavana_02', tsid: 'LA9M05J386A296V', x:-658, y:-720 },
	{ id: '11spots_kalavana_03', tsid: 'LA931JPPT8A2LPU', x:-2073, y:-704 },
	{ id: '11spots_kalavana_04', tsid: 'LA9I8CS028A2O5F', x:-733, y:-860 },
	{ id: '11spots_kalavana_05', tsid: 'LA9T7IFRDIA2N0K', x:-1850, y:-600 },
	{ id: '11spots_besara_01', tsid: 'LA9G6MA4P6923PH', x:-949, y:-874 },
	{ id: '11spots_besara_02', tsid: 'LA95G0P137927B4', x:155, y:-827 },
	{ id: '11spots_besara_03', tsid: 'LA9ELDLMNE92JHO', x:2943, y:-799 },
	{ id: '11spots_besara_04', tsid: 'LA91O38QQ192K8J', x:-487, y:-751 },
	{ id: '11spots_besara_05', tsid: 'LA9I92MRBE92S8Q', x:-2877, y:-841 },
	{ id: '11spots_besara_06', tsid: 'LA99NEQK1F92ICE', x:2857, y:-769 },
	{ id: '11spots_besara_07', tsid: 'LA9BRBV8Q492K6R',	x:-1482, y:-74 },
	{ id: '11spots_tamila_01', tsid: 'LIF7SHGS3E72T8L', x:-2798, y:-798 },
	{ id: '11spots_tamila_02', tsid: 'LIFF11B2RE72HMI', x:-2902, y:-764 },
	{ id: '11spots_tamila_03', tsid: 'LIF16GDJ89724E3', x:-118, y:-741 },
	{ id: '11spots_tamila_04', tsid: 'LIF160988972VND', x:-687, y:-811 },
	{ id: '11spots_tamila_05', tsid: 'LIF152TCV8720Q6', x:2690, y:-820 },
	{ id: '11spots_muufo_01', tsid: 'LA9NT2E8FF8243N', x:-988, y:-615 },
	{ id: '11spots_muufo_02', tsid: 'LA961CLV4G8252G', x:-2197, y:-795 },
	{ id: '11spots_muufo_03', tsid: 'LA9S90EJ0G8241N', x:140, y:-838 },
	{ id: '11spots_muufo_04', tsid: 'LA9IHQQSCF820VN', x:-1566, y:-748 },
	{ id: '11spots_muufo_05', tsid: 'LA92VDUR8D82E3F', x:357, y:-674 },
	{ id: '11spots_muufo_06', tsid: 'LA9KL81E1D82ABT', x:1148, y:-790 },
	{ id: '11spots_bortola_01', tsid: 'LHVAKM1MR032IGJ', x:-26, y:-682 },
	{ id: '11spots_bortola_02', tsid: 'LHV1HT5F4D32GNM', x:1466, y:-1024 },
	{ id: '11spots_bortola_03', tsid: 'LIF38KRD8S12HAR', x:1162, y:-642 },
	{ id: '11spots_bortola_04', tsid: 'LHV1H1EHOF32UJM', x:1153, y:-994 }, 
	{ id: '11spots_bortola_05', tsid: 'LIFU7EN0HN12ETM', x:-2247, y:-1072 },
	{ id: '11spots_bortola_06', tsid: 'LIFNRF3P0E02J90', x:-1671, y:-927 },
	{ id: '11spots_kajuu_01', tsid: 'LHV4AC2C3C42172', x:795, y:-898 },
	{ id: '11spots_kajuu_02', tsid: 'LHV15B8HEQ32SN0', x:-589, y:-2231 },
	{ id: '11spots_kajuu_03', tsid: 'LHV1FUFU9442AKR', x:2856, y:-699 }, 
	{ id: '11spots_kajuu_04', tsid: 'LHV15C8IEQ322UG', x:-585, y:-2266 },
	{ id: '11spots_kajuu_05', tsid: 'LHV15EUNEQ32FCI', x:-2906, y:-604 },
	{ id: '11spots_kajuu_06', tsid: 'LHV1BIOIL142P25', x:2914, y:-796 },
	{ id: '11spots_andra_01', tsid: 'LA55645B8O528MI', x:-2853, y:-720 },
	{ id: '11spots_andra_02', tsid:	'LA5DVVGJQQ5237U', x:-670, y:-761 },
	{ id: '11spots_andra_03', tsid: 'LA5VDIGU3G525F9', x:91, y:-1508 },
	{ id: '11spots_andra_04', tsid:	'LA51B2OQAK623EF', x:-2851, y:-605 },
	{ id: '11spots_andra_05', tsid:	'LA51701PF262LC8', x:2756, y:-694 },
	{ id: '11spots_andra_06', tsid:	'LA51BNNOEK629KG', x:2730, y:-670 },
	{ id: '11spots_salatu_01', tsid: 'LIFQMHF4MT72V9Q', x:2575, y:-525 }, 
	{ id: '11spots_salatu_02', tsid: 'LIFF72DU3O727EA', x:158, y:-181 },
	{ id: '11spots_salatu_03', tsid: 'LIF14KB3T872MAH', x:-2913, y:-855 },
	{ id: '11spots_salatu_04', tsid: 'LIFKPQEDFG722M5', x:2696, y:-843 },
	{ id: '11spots_salatu_05', tsid: 'LIFFIRQ00P729BS', x:2155, y:-318 },
	{ id: '11spots_salatu_06', tsid: 'LIFJP2UC80820D3', x:2798, y:-587 },
	{ id: '11spots_alakol_01', tsid: 'LCRTAJK5UN124GG', x:-2845, y:-607 },
	{ id: '11spots_alakol_02', tsid: 'LHV1HLGUT212JNT', x:-2662, y:-807 },
	{ id: '11spots_alakol_03', tsid: 'LCR146VPNK12CTU', x:-535, y:-1982 },
	{ id: '11spots_alakol_04', tsid: 'LHVQU18N3O021A5', x:2413, y:-863 },
	{ id: '11spots_alakol_05', tsid: 'LCR29V8S4Q12IF4', x:856, y:-753 },
	{ id: '11spots_alakol_06', tsid: 'LHV1E645M21278O', x:2909, y:-732 },
	{ id: '11spots_groddleheights_01',	tsid: 'LCR10K63BQL14PE', x:-1850, y:-1050 },
	{ id: '11spots_groddleheights_02', tsid: 'LCR10H9E3QJ1E2P', x:258, y:-734 },
	{ id: '11spots_groddleheights_03', tsid: 'LCR12NU45AM12BB', x:440, y:-1014 },
	{ id: '11spots_groddleheights_04', tsid: 'LCR103T98QJ1SC9', x:-517, y:-700 },
	{ id: '11spots_groddleheights_05', tsid: 'LCR16BA1SSL1P7K', x:-2847, y:-687 },
	{ id: '11spots_groddleheights_06', tsid: 'LCR16AUURSL1KTM', x:2828, y:-497 },
	{ id: '11spots_groddlemeadow_01', tsid: 'LCR14062REM1QIR', x:-1556, y:-855 },
	{ id: '11spots_groddlemeadow_02', tsid: 'LCR13VM1REM1GHI', x:1216, y:-871 },
	{ id: '11spots_groddlemeadow_03', tsid: 'LCR11JA67NJ15N3', x:845, y:-287 },
	{ id: '11spots_groddlemeadow_04', tsid: 'LCR10M2FUJK177P', x:-2923, y:-314 },
	{ id: '11spots_groddlemeadow_05', tsid:	'LLI334UG2UD1IKQ', x:-2433, y:-882 },
	{ id: '11spots_groddleforest_01', tsid: 'LLI2V30ECRD1GAU', x:-227, y:-562 },
	{ id: '11spots_groddleforest_02', tsid:	'LLI2HHRC84F1TJ6', x:-2881, y:-796 },
	{ id: '11spots_groddleforest_03', tsid:	'LCR13M5UQEM15TA', x:1713, y:-712 },
	{ id: '11spots_groddleforest_04', tsid: 'LLI2V0UN7RD1T2J', x:1772, y:-443 },
	{ id: '11spots_groddleforest_05',	tsid: 'LLI3272LOTD1B1F', x:-2824, y:-946 },
	{ id: '11spots_groddleforest_06', tsid:	'LCR14HPKPBK1U25', x:812, y:-689 },
	{ id: '11spots_shimlamirch_01', tsid: 'LTJLTCN21IQ1URB', x:1792,  y:-365 },
	{ id: '11spots_shimlamirch_02', tsid: 'LTJ1024R2DQ1B5S', x:536,   y:-511 },
	{ id: '11spots_shimlamirch_03', tsid: 'LTJ102LVLDQ1NGH', x:707,   y:-518 },
	{ id: '11spots_shimlamirch_04', tsid: 'LTJ10B0UHQQ172V', x:315,   y:-447 },
	{ id: '11spots_shimlamirch_05', tsid: 'LTJ11KEKAKO196V', x:-1371, y:-753 },
	{ id: '11spots_jethimadh_01',   tsid: 'LA97L62229522GS', x:1080,  y:-784 },
	{ id: '11spots_jethimadh_02', 	tsid: 'LIF12UPTEUV14ON', x:-838,  y:-578 },
	{ id: '11spots_jethimadh_03',   tsid: 'LIFMVP96ONU12CO', x:-975,  y:-579 },
	{ id: '11spots_jethimadh_04',  	tsid: 'LIF1609JRKV151E', x:-2334, y:-929 },
	{ id: '11spots_jethimadh_05', 	tsid: 'LIF13FGQHKV1E72', x:-1704, y:-873 },
	{ id: '11spots_chakraphool_01', tsid: 'LTJ154SP8102KIG', x:2875,  y:-685 },
	{ id: '11spots_chakraphool_02', tsid: 'LTJ10HO3FAV1HDD', x:-555,  y:-1323 },
	{ id: '11spots_chakraphool_03', tsid: 'LTJ1539P8102B2F', x:-407,  y:-739 },
	{ id: '11spots_chakraphool_04', tsid: 'LTJ10KOCHTU1N89', x:-2811, y:-622 },
	{ id: '11spots_chakraphool_05', tsid: 'LIFDIDJT0GU1CR8', x:-2183, y:-975 },
	{ id: '11spots_ilmenskie_caverns_01', tsid:	'LLI107JLRU11EM2', x:126, y:-192 },
	{ id: '11spots_ilmenskie_caverns_02', tsid: 'LHH101L162117H2', x:-49, y:-759 },
	{ id: '11spots_ilmenskie_caverns_03', tsid: 'LHH112FHF411BUI', x:723, y:-765 },
	{ id: '11spots_ilmenskie_caverns_04', tsid: 'LLI101QQRA211SM', x:-462, y:-461 },
	{ id: '11spots_ilmenskie_caverns_05', tsid: 'LHH12E1QP611OPA', x:-221, y:1066 },
	{ id: '11spots_ilmenskie_deeps_01',	 tsid: 'LA91JU4QQ712DJN', x:-698, y:-594 },
	{ id: '11spots_ilmenskie_deeps_02', tsid: 'LM112V6OCA126K1', x:-662, y:-110 },
	{ id: '11spots_ilmenskie_deeps_03', tsid: 'LA9DNT3I2U22RS7', x:-2187, y:-1001 },
	{ id: '11spots_ilmenskie_deeps_04', tsid: 'LA9QKFSST732VNK', x:670, y:368 },
	{ id: '11spots_ilmenskie_deeps_05', tsid: 'LA9ENT2CRE22NFB', x:-686, y:619 }
];

// Hub ids which are "public", and should be sent in map data to the client
var public_hubs = [27,40,50,51,56,58,63,64,66,71,72,75,76,78,85,86,88,89,90,91,92,93,95,97,98,99,100,101,102,105,106,107,108,109,110,112,113,114,116,119,120,121,123,125,126,128,131,133,136,137,140,141,142,143];

var population_controls = {
	'npc_piggy': {
		per_width: 7,
		min_max: 18,
		max_max: 40
	},
	'npc_butterfly': {
		per_width: 4,
		min_max: 6,
		max_max: 20
	},
	'npc_chicken': {
		per_width: 4,
		min_max: 6,
		max_max: 20
	}
};

var hubs = {
	'26': 'Abbasid',
	'76': 'Alakol',
	'86': 'Baqala',
	'75': 'Bortola',
	'72': 'Chakra Phool',
	'90': 'Choru',
	'56': 'Groddle Forest',
	'64': 'Groddle Heights',
	'58': 'Groddle Meadow',
	'50': 'Ilmenskie Caverns',
	'78': 'Ilmenskie Deeps',
	'27': 'Ix',
	'71': 'Jethimadh',
	'77': 'Jethimadh Tower: Base',
	'66': 'Seam Streets',
	'85': 'Kajuu',
	'63': 'Shimla Mirch',
	'51': 'Uralia',
	'91': 'Zhambu',
	'95': 'Xalanga',
	'109': 'Rasana',
	'100': 'Vantalu'
};

var regions = {
	'Abbasid': 'None',
	'Alakol': 'None',
	'Baqala': 'Savanna',
	'Bortola': 'None',
	'Chakra Phool': 'None',
	'Choru': 'Savanna',
	'Groddle Forest': 'None',
	'Groddle Heights': 'None',
	'Groddle Meadow': 'None',
	'Ilmenskie Caverns': 'None',
	'Ilmenskie Deeps': 'None',
	'Ix': 'None',
	'Jethimadh': 'None',
	'Jethimadh Tower: Base': 'None',
	'Seam Streets': 'None',
	'Kajuu': 'None',
	'Shimla Mirch': 'None',
	'Uralia': 'None',
	'Zhambu': 'Savanna',
	'Xalanga': 'Savanna',
	'Rasana': 'None',
	'Vantalu': 'None'
};

var greeter_group = 'RCRIG222NHV17I8';
var level_limit = 60;

var buddy_limit = 1000;

var shared_instance_manager = 'RA93I1335592VFS';
var shared_instances = {
	color_game: {locations: ['LHVM01TACH92TQF'], min_players: 9, max_players: 24, name: 'Color Game', can_retry: true},
	it_game: {locations: ['LHV2H026E492IAF'], min_players: 4, max_players: 5, name: 'Game of Crowns', splash: 'games_it_game_splash', can_retry: true, min_retry_players: 3},
	math_mayhem: {locations: ['LHV2H026E492IAF'], min_players: 4, max_players: 20, name: 'Math Mayhem', can_retry: true},
	race: {locations: ['LIF10A4HV3P17BU', 'LIF1H6AFJ9P19UJ', 'LIF107M5ORP1DQ5', 'LHV1BEMOK14268R', 'LHV1BCTKK142N8F', 'LHV1BF1QK142P0V', 'LHV1BDAMK142HAO'],
		min_players: 2, max_players: 2, name: 'Race', splash: 'games_race_splash', can_retry: false},
	quoin_grab: {locations: ['LIF11MB3O8P1TAR'], min_players: 2, max_players: 2, name: 'Grab \'Em Good', splash: 'games_quoin_grab_splash', can_retry: false},
	hogtie_piggy: {locations: ['LHVLC8CI3Q62P8T'], min_players: 2, max_players: 2, name: 'The Great Hog Haul', splash: 'games_hogtie_piggy_splash', can_retry: false},
	cloudhopolis: {locations: ['LDO3V27SHQ13BAI'], min_players: 2, max_players: 2, name: 'Cloudhopolis', splash: 'games_cloudhopolis_splash', can_retry: false}
};

//var live_help_groups = ['RA512UITCLA22AD', 'RHV1ET81VDC2UDV'];
var live_help_groups = ['RA512UITCLA22AD'];
var newbie_live_help_groups = ['RUV56KGAMTC3BUT'];
var global_chat_groups = ['RA9118JTCLA204I'];
var trade_chat_groups = ['RA5DT5I72543L5R'];

var public_machine_rooms = ['LCR101Q98A12EHH', 'LIF16EM56A12FSB', 'LA9MU59GB792T80'];

var party_spaces = {
	nylon: {tsid: 'LDOK0A8OG1E2C7O', desc: "Perfect underwater pool party hang-out. Ingredients for juices, smoothies and Grog, plus complimentary DIY three-course pescetarian meal.", img: "http://c1.glitch.bz/img/party/nylon_phool_67649.jpg", prices: {5:'3500', 10:'5500', 15:'10000', 30:'16000'}},
	rainbow: {tsid: 'LDOGBH4BG1E2BM0', desc: "Totally cute party paddock, complete with rainbows. Contains: minable sparkly rocks, mixable cosmopolitans and a make-your-own cold taco bar.", img: "http://c1.glitch.bz/img/party/double_rainbow_67649.jpg", prices: {5:'2000', 10:'3000', 15:'6000', 30:'9250'}},
	pitchen: {tsid: 'LDOGNQICG1E2PNI', desc: "Miniature Ur for Glitchean giants. Rental includes minables, ingredients for nibbles, snacks and sammiches, and DIY fancy-cocktail bar.", img: "http://c1.glitch.bz/img/party/pitchen_lilliputt_67649.jpg", prices: {5:'3000', 10:'4500', 15:'8500', 30:'13250'}},
	moon: {tsid: 'LDOBUP8IR8E2IPH', desc: "Secluded lunar location, with sparkly moonrock. Provisions provided: complimentary cocktail bar and other refreshments.", img: "http://c1.glitch.bz/img/party/toxic_moon_67649.jpg", prices: {5:'3000', 10:'4500', 15:'8500', 30:'13250'}},
	mazzala: {tsid: 'LDOE67MFL6E2FBR', desc: "Atmospheric five-room party lodge. Contains: DIY hearty party feast (gumbo, sammiches etc), beer, booze, and \"other refreshments\".", img: "http://c1.glitch.bz/img/party/shimla_shack_67649.jpg", prices: {5:'3000', 10:'4500', 15:'8500', 30:'13250'}},
	halloween: {tsid: 'LDOG1ST9G1E2EV5', desc: "Something something halloween", img: "http://c1.glitch.bz/img/party/shimla_shack_67649.jpg", prices: {5:'3000', 10:'4500', 15:'8500', 30:'13250'}},
	glitchmas: {tsid: 'LDOOS17UPNJ2HT7', desc: "One temporary wonderland, perfect for holiday get-togethers and winterly fun. When activated, this icy private party spot includes trees for decorating, ingredients for heart-warming drinkables and a DIY pie bar.", img: "http://c1.glitch.bz/img/party/winter_wingding_76754.png", prices: {5:'2000', 10:'3000', 15:'6000', 30:'9250'}},
	val_holla: {tsid: 'LUVNGTHAGP93U34', desc: "Soar to new heights in this quoin-heavy party space. Grab a bunch of your closest friends, and get ready to Party Shardy!", img: "http://c1.glitch.bz/img/party/valholla_116968.jpg", prices: {5:'5000', 10:'8500', 15:'15000', 30:'25000'}},
	aquarius: {tsid: 'LUVU11R1HP9341R', desc: "Swim, float & drift your way around this quoin-laden party space. And, remember … quoining is always more fun with friends!", img: "http://c1.glitch.bz/img/party/aquarius_116968.jpg", prices: {5:'5000', 10:'8500', 15:'15000', 30:'25000'}}
};

var paradise_locations = {
	abysmal_thrill: {template_tsid: 'LHF5NUH5UT53VSG', name: 'Abysmal Thrill'},
	aerial_boost: {template_tsid: 'LHF1CF7EER5306P', name: 'Aerial Boost'},
	arbor_hollow: {template_tsid: 'LHFDKS616Q23NT6', name: 'Arbor Hollow'},
	beam_me_down: {template_tsid: 'LHF12N7BER53E0U', name: 'Beam Me Down'},
	bippity_bop: {template_tsid: 'LHFS1L44SR53F5O', name: 'Bippity Bop'},
	cloud_flight: {template_tsid: 'LHFOLH3T7I23A8M', name: 'Cloud Flight'},
	cloud_rings: {template_tsid: 'LHFVPPKQSR53T1L', name: 'Cloud Rings'},
	drafty_uplift: {template_tsid: 'LHFRHB1SKR53402', name: 'Drafty Uplift'},
	mountain_scaling: {template_tsid: 'LHFSE9JCDR53EG8', name: 'Mountain Scaling'},
	radial_heights: {template_tsid: 'LHFR8BRSVT33AE0', name: 'Radial Heights'},
	sky_plunge: {template_tsid: 'LHFO01RM7I238UN', name: 'Sky Plunge'},
	slip_n_slide: {template_tsid: 'LHFQVU11DR53IKB', name: "Slip 'N Slide"},
	starlit_night: {template_tsid: 'LHFD3EU3SH2307J', name: 'Starlit Night'},
	updraft: {template_tsid: 'LHF9DQTKQT53RDI', name: 'Updraft'}
};

var recipe_xp_caps = true;

var portal_group = 'RIFQS6N3PLH2TL4';

var teleportation_ok_streets = ['LDOOSA8V29J24I3', 'LA9QUBPI49J2MOB', 'LUV1CSSE49J2P2C']; // Streets where teleportation targets/scripts are ok, even if locked, etc
var machine_rooms = ['LCR101Q98A12EHH', 'LIF16EM56A12FSB', 'LA9MU59GB792T80'];

var sequence_object = 'RHVH9NN4DT63PKE';
var enable_all_the_feats = false;

var newxp_locations = {
	newxp_intro: 'LIFBFC7TDJ535UL',
	newxp_training1: 'LIFBLMAVDJ53NP1',
	newxp_training2: 'LIFD0KCDEJ53L7K',
	ezcooking_1: 'LIFII3UBRFB3KBE',
	soilappreciation_1: 'LHFS40864GB396O',
	lightgreenthumb_1: 'LHVMSAEVLFB39K2',
	animalkinship_1: 'LHF8PTQ7RFB3PRB',
	firebog_4_high: 'LHVK21706023QDG',
	meadow_ext_default_high: 'LHVK3RM06023CON',
	uralia_2_high: 'LHVK5M5160236QE',
	newbie_island: 'LA952QGCH3D31E2'
};

var hi_variants_tracker = 'RIFUKAGPIJC358O';

var feature_hi_viral = true;
var feature_hi_records = true;
var feature_report_hi_records = true;
