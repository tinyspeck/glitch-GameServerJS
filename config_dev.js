//#include config_base.js
//#include inc_data_swfs_locations_dev.js
//#include inc_data_maps_dev.js
//#include inc_data_sounds.js
//#include inc_data_overlays.js
//#include inc_data_street_upgrades_dev.js
//#include inc_data_pols_dev.js
//#include inc_data_swfs_avatar_dev.js
//#include inc_data_mapextras_dev.js
//#include inc_data_homes_dev.js
//#include inc_data_feats_dev.js

var familiar_tsid = 'I-FAMILIAR';
var web_api_url = 'http://dev.glitch.com/';
var world_api_url = 'http://dev.glitch.com/';
var web_root = 'http://dev.glitch.com';

var is_dev = true;
var is_prod = false;

var trant_growth_enabled = true;
var greeting_enabled = true;

var hell = {
	tsid: 'LM4107R9OLUTA',
	x: [366],
	y: [-194]
};

// A safe location when all else fails
var default_location = {
	tsid: 'LM4109NI2R640',
	x: 0,
	y: -53
};

var verb_radius = 800;
var force_intro = false;
var max_groups = 7;
var max_party_size = 71;
var garden_water_threshold = 60;
var garden_grow_multiplier = 0.1; // This is also in php config

var auction_delivery_time = 60;
var mail_delivery_time = 0;
var mail_delivery_time_with_attachment = 0;

var skill_points_per_second = 1;
var skill_learning_modifier_step = 0.05;

var emblem_favor_cost = 1000;
var emblem_favor_increment = 100;

var trant_growth_multiplier = 0.5; // Adjust this to globally speed up or slow down the rates

var rook_attack_strength = 5000;
var rook_attack_tracker = "RRO30BQ3QIB3G30";

var daily_quoin_limit = 100;

// where the newxp takes you after you finish it
var newxp_exits = [
	{
		tsid: 'LHH10I3CR7310LT',
		x: 1141,
		y: -80
	}
];

var food_energy_limit = 20;

var transit_instances = {
	'subway_1' : {
		'fare': 50,
		'type': 'subway',
		'vehicle': 'train',
		
		'map_background_url': 'http://c1.glitch.bz/img/maps/subway_map_bg_47802.jpg',
		'map_forwards_url': 'http://c1.glitch.bz/img/maps/subway_red_line_fg_48118.png',
		'map_backwards_url': 'http://c1.glitch.bz/img/maps/subway_blue_line_fg_48051.png',
		
		'forwards_name': 'Red Line',
		'backwards_name': 'Blue Line',
		
		'template_tsid': 'LHH197LP60O1B63',
		'x': 0,
		'y': -104,
		
		'min_capacity': 2,
		'max_capacity': 10,
		'initial_departure_timeout': 60, // seconds
		'departure_timeout': 10, // seconds
		'arrival_timeout': 30, // seconds
		
		'stations': {
			1: {
				'name': 'Station 1',
				'previous_stop': 3,
				'next_stop': 2,
				'tsid': 'LHH196BO60O10TN',
				'connects_to': 'LM411BNOGTUG2',
				'x': 0,
				'y': -136,
				'map_pos': [386, 226]
			},
			2: {
				'name': 'Station 2',
				'previous_stop': 1,
				'next_stop': 3,
				'tsid': 'LHH10I3CR7310LT',
				'connects_to': '',
				'x': 0,
				'y': -136,
				'map_pos': [289, 141]
			},
			3: {
				'name': 'Station 3',
				'previous_stop': 2,
				'next_stop': 1,
				'tsid': 'LM4109NI2R640',
				'connects_to': '',
				'x': 0,
				'y': -136,
				'map_pos': [328, 39]
			}
		}
	},

	'group_hall_ferry' : {
		'fare': 50,
		'type': 'ferry',
		'vehicle': 'ferry',

		'template_tsid': 'LHH197LP60O1B63',
		'x': 0,
		'y': -104,

		'min_capacity': 2,
		'max_capacity': 10,

		'initial_departure_timeout': 10, // seconds
		'departure_timeout': 10, // seconds
		'arrival_timeout': 30, // seconds

		'stations': {
			1: {
				'name': 'Dock',
				'previous_stop': 2,
				'next_stop': 2,
				'tsid': '',
				'connects_to': '',
				'x': 0,
				'y': -136
			},
			2: {
				'name': 'Group Hall',
				'previous_stop': 1,
				'next_stop': 1,
				'tsid': '',
				'connects_to': '',
				'x': 0,
				'y': -136
			}
		}
	}
};

var multiplayer_quest_locations = {
	'multiplayer_races' : [
		{
			title: 'Lumber Jacket',
			tsid: 'LHH11T4BCRP1AUV',
			num_players: 2,
			start_points: [{x: -398, y: 1612}, {x: 156, y: 1612}],
			race_type: 'finish_line'
		}
	],
	'amazing_race' : [
		{
			title: 'The Amazing Race',
			tsid: 'LHH10356VO22VMQ',
			num_players: 2,
			start_points: [{x: -575, y: 1897}, {x: 591, y: 1897}],
			race_type: 'finish_line'
		}
	],
	'grab_em_good' : [
		{
			title: 'Grab \'Em Good',
			tsid: 'LHH11ISH4P22GJ7',
			num_players: 2,
			start_points: [{x: -319, y: 757}, {x: 356, y: 753}],
			race_type: 'most_quoins'
		}
	],
	'hogtie_piggy' : [
		{
			title: 'The Great Hog Haul',
			tsid: 'LMF101VN6082AIG',
			num_players: 2,
			start_points: [{x: 120, y: -890}, {x: -150, y: -885}],
			race_type: 'piggy_race'
		}
	]
};

var greeting_locations = [
	// Forest Start
	{
		tsid: 'LHH101290922FDS',
		//x: [-1003, 542, -273],
		//y: [-147, -48, -43]
		x: [-1024],
		y: [-152],
		musicblock_position: [595, -49]
	},
	// Meadow Start
	{
		tsid: 'LHH102QO0922FOK',
		//x: [-949, 35, -499],
		//y: [-52, -63, -41]
		x: [-1003],
		y: [-54],
		musicblock_position: [1428, -145]
	},
	// Heights Start
	{
		tsid: 'LHH103NT0922A2S',
		//x: [-622, -673, 169],
		//y: [-1326, -455, -80]
		x: [-126],
		y: [-1326],
		musicblock_position: [-609, -1326]
	}
];

// For the 11 Secret Locations quest/achievement.
var secret_spots = [
	{ id: '11secrets_001',    tsid: 'LMF1AUFVIVC2HP6',    x:-1550,    y:-100 },
	{ id: '11secrets_002',    tsid: 'LMF1AUFVIVC2HP6',    x:1850,     y:-100 },
	{ id: '11secrets_003',    tsid: 'LMF1AUFVIVC2HP6',    x:-100,     y:-100 },
	{ id: '11secrets_004',    tsid: 'LMF1AUFVIVC2HP6',    x:-2800,    y:-100 },
	{ id: '11secrets_005',    tsid: 'LMF1AUFVIVC2HP6',    x:-750,     y:-400 },
	{ id: '11secrets_006',    tsid: 'LMF1AUFVIVC2HP6',    x:2934,     y:-348 },
	{ id: '11secrets_007',    tsid: 'LMF1AUFVIVC2HP6',    x:750,      y:-350 },
	{ id: '11secrets_008',    tsid: 'LMF1AVPVIVC2MMA',    x:-2309,    y:-248 },
	{ id: '11secrets_009',    tsid: 'LMF1AVPVIVC2MMA',    x:-838,     y:-368 },
	{ id: '11secrets_010',    tsid: 'LMF1AVPVIVC2MMA',    x:998,      y:-874 },
	{ id: '11secrets_011',    tsid: 'LMF1AVPVIVC2MMA',    x:2524,     y:-313 },
	{ id: '11secrets_012',    tsid: 'LMF1AVPVIVC2MMA',    x:2082,     y:-763 },
	{ id: '11secrets_013',    tsid: 'LMF1AVPVIVC2MMA',    x:113,      y:-883 },
	{ id: '11secrets_014',    tsid: 'LMF1AVPVIVC2MMA',    x:67,       y:-440 },
	{ id: '11secrets_015',    tsid: 'LMF1B000JVC2P8P',    x:-2590,    y:-325 },
	{ id: '11secrets_016',    tsid: 'LMF1B000JVC2P8P',    x:-478,     y:-877 },
	{ id: '11secrets_017',    tsid: 'LMF1B000JVC2P8P',    x:1040,     y:-528 },
	{ id: '11secrets_018',    tsid: 'LMF1B000JVC2P8P',    x:-212,     y:-644 },
	{ id: '11secrets_019',    tsid: 'LMF1B000JVC2P8P',    x:311,      y:-575 },
	{ id: '11secrets_020',    tsid: 'LMF1B000JVC2P8P',    x:1574,     y:-390 },
	{ id: '11secrets_021',    tsid: 'LMF1B000JVC2P8P',    x:684,      y:-557 }
];


// Hub ids which are "public", and should be sent in map data to the client
var public_hubs = [8,26,27,28,30,46];

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
	'0': 'Abbasid',
	'0': 'Alakol',
	'27': 'Baqala', // fake baqala for testing.
	'0': 'Bortola',
	'0': 'Chakra Phool',
	'26': 'Choru',
	'0': 'Groddle Forest',
	'0': 'Groddle Heights',
	'0': 'Groddle Meadow',
	'0': 'Ilmenskie Caverns',
	'0': 'Ilmenskie Deeps',
	'0': 'Ix',
	'0': 'Jethimadh',
	'0': 'Jethimadh Tower: Base',
	'0': 'Seam Streets',
	'0': 'Kajuu',
	'0': 'Shimla Mirch',
	'0': 'Uralia'
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
	'Uralia': 'None'
};

var shared_instance_manager = 'RMF169GO797263A';
var shared_instances = {
	color_game: {locations: ['LMF11017CL82K3U'], min_players: 2, max_players: 18, name: 'Color Game', can_retry: true},
	it_game: {locations: ['LMF19TBAB192699'], min_players: 3, max_players: 3, name: 'Game of Crowns', splash: 'games_it_game_splash', can_retry: true},
	math_mayhem: {locations: ['LMF19TBAB192699'], min_players: 2, max_players: 20, name: 'Math Mayhem', can_retry: true},
	race: {locations: ['LHH10356VO22VMQ'], min_players: 2, max_players: 2, name: 'Race', splash: 'games_race_splash', can_retry: false},
	quoin_grab: {locations: ['LHH11ISH4P22GJ7'], min_players: 2, max_players: 2, name: 'Grab \'Em Good', splash: 'games_quoin_grab_splash', can_retry: false},
	hogtie_piggy: {locations: ['LMF101VN6082AIG'], min_players: 2, max_players: 2, name: 'The Great Hog Haul', splash: 'games_hogtie_piggy_splash', can_retry: false}
};

var greeter_group = 'RMF10SPADI82AHO';
var level_limit = 60;

var live_help_groups = ['RMF103MJCLA24QB', 'RMF101E75EC2JO1'];
var newbie_live_help_groups = ['RRO1CLG7MTC31M3'];
var global_chat_groups = ['RMF104IKCLA2CDD'];
var trade_chat_groups = ['RPF57AP0G543BFS'];

var party_spaces = {
	test: {tsid: 'LMF1017U9KD2CTD', desc: "Totally cute party paddock, complete with rainbows. Contains: minable sparkly rocks, mixable cosmopolitans and a make-your-own cold taco bar.", img: "http://c1.glitch.bz/img/party/double_rainbow_67649.jpg", prices: {5:'3500', 10:'5500', 15:'10000', 30:'16000'}},
	mountain1: {tsid: 'LMF11AR6L9L2EAB', desc: "Partially constructed test level", img: "http://c1.glitch.bz/img/party/double_rainbow_67649.jpg", prices: {5:'3500', 10:'5500', 15:'10000', 30:'16000'}, rungs: [{yPos:0, height:400, freezeTime:25}, {yPos:-400, height:400, freezeTime:25}, {yPos:-800, height:400, freezeTime:20}, {yPos:-1600, height:400, freezeTime:20}, {yPos:-2400, height:400, freezeTime:15}, {yPos:-3200, height:400, freezeTime:12}, {yPos:-40000, height:400, freezeTime:12}, {yPos:-48000, height:400, freezeTime:10}] },
	mountain2: {tsid: 'LMF12LQTIEL20FC', desc: "A challenging mountain environment.", img: "http://c1.glitch.bz/img/party/double_rainbow_67649.jpg", prices: {5:'3500', 10:'5500', 15:'10000', 30:'16000'},
				rungs: [	{yPos:0, height:400, freezeTime:30, ids:null },
							{yPos:-400, height:400, freezeTime:30,  ids:["freeze_1_rung_1_1326333498704", "freeze_2_rung_1_1326333498706"]},
							{yPos:-800, height:400, freezeTime:30, ids:["freeze_1_rung_2_1326333498707", "freeze_2_rung_2_1326333498708"] },
							{yPos:-1600, height:400, freezeTime:30, ids:["freeze_1_rung_3_1326333498709", "freeze_2_rung_3_1326333498711"]},
							{yPos:-2400, height:400, freezeTime:30, ids:["freeze_1_rung_4_1326333498713", "freeze_2_rung_4_1326333498714"]},
							{yPos:-3200, height:400, freezeTime:30, ids:["freeze_1_rung_5_1326333498716", "freeze_2_rung_5_1326333498717"]}
							]
				},
	mountain3: {tsid: 'LMF5E6Q9TGL26CM', desc: "Test level with Stewart's physics.", img: "http://c1.glitch.bz/img/party/double_rainbow_67649.jpg", prices: {5:'3500', 10:'5500', 15:'10000', 30:'16000'},
				rungs: [	{yPos:0, height:500, freezeTime:50, ids:null },
							{yPos:-500, height:500, freezeTime:50,  ids:["freeze_1_rung_1_1326333498704", "freeze_2_rung_1_1326333498706"]},
							{yPos:-1000, height:500, freezeTime:50, ids:["freeze_1_rung_2_1326333498707", "freeze_2_rung_2_1326333498708"] },
							{yPos:-1500, height:500, freezeTime:50, ids:["freeze_1_rung_3_1326333498709", "freeze_2_rung_3_1326333498711"]},
							{yPos:-2000, height:500, freezeTime:50, ids:["freeze_1_rung_4_1326333498713", "freeze_2_rung_4_1326333498714"]},
							{yPos:-2500, height:500, freezeTime:50, ids:["freeze_1_rung_5_1326333498716", "freeze_2_rung_5_1326333498717"]}
							]
				}
};

var paradise_locations = {
	cloud_flight: {template_tsid: 'LPF34K88HTS2SKI', name: 'Cloud Flight'}
};

var recipe_xp_caps = true;

var buddy_limit = 1000;

var portal_group = 'RMF1113TT0H2BOT';

var teleportation_ok_streets = []; // Streets where teleportation targets/scripts are ok, even if locked, etc

home_limits.START_INT_TEMPLATE			= 'meadows_int_default__high';
home_limits.START_EXT_TEMPLATE			= 'meadow_ext_default_high';

var machine_rooms = [];

var sequence_object = 'RRO10CSPCT63JT4';
var enable_all_the_feats = true;

var newxp_locations = {
	newxp_intro: 'LRO11SK99EA3A51',
	newxp_training1: 'LRO11T9B9EA3QBI',
	newxp_training2: 'LRO11UFB9EA3IF8',
	newbie_island: 'LRO1134G93835FN'
};

var hi_variants_tracker = 'RRO1H69MIJC3T78';

var feature_hi_viral = true;
var feature_hi_records = true;
var feature_report_hi_records = true;