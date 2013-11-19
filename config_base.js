//#include inc_data_clothing.js
//#include inc_data_faces.js
//#include inc_data_skills.js
//#include achievements/inc_data_counters.js
//#include inc_data_imagination.js
//#include inc_data_homes.js
//#include inc_data_default_avatars.js

// this config file is for settings
// shared on dev & prod

var party_invite_timeout = 90; // in seconds
var max_geo_snapshots = 3;

var clothing_slots = {
	'hat'	: true,
	'coat'	: true,
	'shirt'	: true,
	'pants'	: true,
	'dress'	: true,
	'skirt'	: true,
	'shoes'	: true,
};
var face_slots = {
	'eyes'	: true,
	'ears'	: true,
	'nose'	: true,
	'mouth'	: true,
	'hair'	: true,
};
var face_color_slots = {
	'hair_color' : true,
	'skin_color' : true,
};
// min, max, def
var face_scaling_params = {
	'eye_scale'	: [0.65, 1.2, 0.9],
	'eye_height'	: [-5, 4, 1],
	'eye_dist'	: [-3, 2, -1],
	'ears_scale'	: [0.6, 1.2, 1],
	'ears_height'	: [-4, 1, 0],
	'nose_scale'	: [0.65, 1.45, 1],
	'nose_height'	: [-5, 6, 0],
	'mouth_scale'	: [0.75, 1.45, 1],
	'mouth_height'	: [-3, 4, 0],
};

// these are the physics properties that can be adjusted for the user/location
var physics_settables = {
	percentages: ['vx_max', 'vy_max', 'gravity', 'vy_jump', 'vx_accel_add_in_floor', 'vx_accel_add_in_air', 'friction_floor', 'friction_air', 'friction_thresh', 'vx_off_ladder', 'pc_scale', 'item_scale', 'y_cam_offset', 'multiplier_3_jump'],
	booleans: ['jetpack', 'can_3_jump', 'can_wall_jump']
};

//
// EC: don't fuck with these unless you are Eric, or in close communication with him
//

var physics_configs = {
	normal: {
		'vx_max': 335,
		'vy_max': 670,
		'gravity': 1190,
		'vy_jump': -570,
		'vx_accel_add_in_floor': 0.3,
		'vx_accel_add_in_air': 0.22,
		'friction_floor': 4.3,
		'friction_air': -0.22,
		'friction_thresh': 80,
		'vx_off_ladder': 300,
		'pc_scale': 1,
		'item_scale': 1,
		'jetpack': 0,
		'y_cam_offset': 150,
		'can_3_jump': 0,
		'multiplier_3_jump': 1,
		'can_wall_jump': 0
	},
	swim: {
		'vx_max': 219,
		'vy_max': 682,
		'gravity': 292,
		'vy_jump': -440,
		'vx_accel_add_in_floor': 0.5,
		'vx_accel_add_in_air': 0.5,
		'friction_floor': 4.154,
		'friction_air': 3.25,
		'friction_thresh': 127,
		'vx_off_ladder': 300,
		'pc_scale': 1,
		'item_scale': 1,
		'jetpack': 1,
		'y_cam_offset': 150,
		'can_3_jump': 0,
		'multiplier_3_jump': 1,
		'can_wall_jump': 0
	},
	icy: {
		'vx_max': 335,
		'vy_max': 670,
		'gravity': 1406,
		'vy_jump': -570,
		'vx_accel_add_in_floor': 0.116,
		'vx_accel_add_in_air': 0.22,
		'friction_floor': 0.792,
		'friction_air': -0.22,
		'friction_thresh': 37,
		'vx_off_ladder': 300,
		'pc_scale': 1,
		'item_scale': 1,
		'jetpack': 0,
		'y_cam_offset': 150,
		'can_3_jump': 0,
		'multiplier_3_jump': 1,
		'can_wall_jump': 0
	}
}

// do not send these to the client in itemDefs
var itemDef_skip_props = {
	'hasConditionalEmoteVerbs': 0, // this one is not used and should be never sent
	//'keys_in_location': 0, // this should be removed from skip_props if we ever want to turn on do_single_interaction_sp_keys in client
	//'keys_in_pack': 0, // this should be removed from here if we ever want to turn on do_single_interaction_sp_keys in client
	'verbs': 0, // this one is not used and should be skip_props sent
	'emote_verbs': 0 // this one is not used and should be never sent
}

// send these props on itemDefs only if the instance value is not the default value specified
var itemDef_default_values = {
	'admin_props'			: false,
	'is_hidden'				: false,
	'has_status'			: false,
	'in_foreground'			: false,
	'in_background'			: false,
	'not_selectable'		: false,
	'adjusted_scale'		: 1,
	'stackmax'				: 1,
	'obey_physics'			: true,
	'has_info'				: true,
	'has_infopage'			: true,
	'hasConditionalVerbs'	: true
};

var vowels = ['a','e','i','o','u'];
var game_month_lengths = [29,3,53,17,73,19,13,37,5,47,11,1];
var game_month_names = ['Primuary','Spork','Bruise','Candy','Fever','Junuary','Septa','Remember','Doom','Widdershins','Eleventy','Recurse'];

var numbers_to_words = {
	1	: 'first',
	2	: 'second',
	3	: 'third', 
	4	: 'fourth',
	5	: 'fifth',
	6	: 'sixth',
	7	: 'seventh',
	8	: 'eighth',
	9	: 'ninth',
	10	: 'tenth',
	11	: 'eleventh'
};

var invoking_slot_width = 300;

var buddies_cache_version = 5; // Increment this to bust the caches

var giants = [
	'alph',
	'cosma',
	'friendly',
	'grendaline',
	'humbaba',
	'lem',
	'mab',
	'pot',
	'spriggan',
	'ti',
	'zille'
];


var word_progress_map = {
	// word_progress data can include:
	// type - the id of word to use
	// gradient_top - optional - the top color in hex i.e. '#ffcc00'
	// gradient_bottom - optional - the bottom color in hex i.e. '#ffcc00'
	'assembling'	: {type:'assembling'},
	'disassembling'	: {type:'disassembling'},
	'embedding'		: {type:'embedding'},
	'harvest'		: {type:'harvest'},
	'installing'	: {type:'installing'},
	'massage'		: {type:'massage'},
	'milk'			: {type:'milk'},
	'nibble'		: {type:'nibble'},
	'pet'			: {type:'pet'},
	'revive'		: {type:'revive'},
	'scoop'			: {type:'scoop'},
	'squeeze'		: {type:'squeeze'},
	'uninstalling'	: {type:'uninstalling'},
	'water'			: {type:'water'},
	'mine'			: {type:'mine'},
	'scrape'		: {type:'scrape'},
	'repairing'		: {type:'repairing'},
	'crushing'		: {type:'crushing'},
	'digging'		: {type:'digdig'},
	'tend'			: {type:'tend'},
	'crystalmalizing' : {type:'crystlmlzng'},
	'clear'			: {type:'clear'},
	'smelting'		: {type:'smelting'},
	'spinning'		: {type:'spinning'}
};

var qa_groups = ['RDO6J4SR43M2EMT', 'RDO6KPBS43M2GSS'];

var home_limits = {

	START_BACKYARD_SEGMENTS		: 5,
	START_FRONTYARD_LEFT_SEGMENTS	: 3,	// was 3.333 in R1
	START_FRONTYARD_RIGHT_SEGMENTS	: 8,	// was 10.666 in R1

	MAX_BACKYARD_SEGMENTS		: 20,	// R3: 20 (150 * 20 = 3000)
	MAX_FRONTYARD_LEFT_SEGMENTS	: 20,	// R3: 20
	MAX_FRONTYARD_RIGHT_SEGMENTS	: 20,	// R3: 20

	START_WALL_SEGMENTS		: 7,	// this includes end caps!
	MIN_WALL_SEGMENTS		: 6,	// this includes end caps!
	MAX_WALL_SEGMENTS		: 20,	// this includes end caps!
	MAX_FLOORS			: 3,	// R2: 2, R3: 3

	UPGRADES_ARE_FREE		: false,

	START_TEXTURE_WALL		: 'grey_unfinished',
	START_TEXTURE_CEILING		: 'starter_crappy_ceiling',
	START_TEXTURE_FLOOR		: 'starter_crappy',

	START_INT_TEMPLATE		: 'meadows_int_default__high',
	START_EXT_TEMPLATE		: 'meadow_ext_default_high',
};

home_limits.FRONTYARD_EXPAND_COSTS = [
	100, 125, 156, 195, 244, 305, 381, 477, 596, 745,
	834, 935, 1047, 1172, 1313, 1471, 1647, 1845, 2066, 2314,
	2453, 2600, 2756, 2921, 3097, 3283, 3479, 3688,
];

home_limits.BACKYARD_EXPAND_COSTS = [
	200, 250, 313, 391, 488, 610, 763, 916, 1099, 1318,
	1582, 1898, 2278, 2734, 3281,
];

var disable_old_pols = true;

var brain_capacity_limit = 60;
var quoin_capacity_limit = 100;

var towers = {
        START_FLOORS		: 2,
	START_TEXTURE_FLOOR	: 'starter_crappy',
	START_TEXTURE_CEILING	: 'starter_crappy_ceiling',
	START_TEXTURE_WALL	: 'grey_unfinished',
	MAX_FLOORS		: 9,
};

// Level to iMG mappings
var qurazy_rewards = [
	10,
	15,
	20,
	25,
	30,
	35,
	40,
	45,
	50,
	55,
	65,
	75,
	85,
	95,
	105,
	117,
	129,
	141,
	153,
	165,
	180,
	195,
	210,
	225,
	240,
	255,
	270,
	285,
	300,
	315,
	335,
	355,
	375,
	395,
	415,
	435,
	455,
	475,
	495,
	515,
	535,
	555,
	575,
	595,
	615,
	635,
	655,
	675,
	695,
	715,
	735,
	755,
	775,
	795,
	815,
	835,
	855,
	875,
	895,
	915
];


//
// This is also copied into lib_giants.php. Please remember to make edits in both places
//

var giants_info = {
	'humbaba'	: {
		'name'		: 'Humbaba',
		'desc'		: 'Humbaba is the giant ruling over all creatures that walk, crawl, slither or sashay over Ur. One with the animals, Humbaba walks on all fours to be closer to them, and insists on them calling her by her first name. Which is kind of pointless, since she only has one name.',
		'gender'	: '(f.)',
		'followers'	: 'Humbabans',
		'giant_of'	: 'Walking Creatures',
		'personality'	: 'Gregarious, Belligerent',
		'skills'	: {'Animal Kinship' : 23, 'Animal Husbandry' : 30, 'Herdkeeping' : 21, 'Remote Herdkeeping' : 22, 'Fox Brushing' : 134, 'Fiber Arts' : 135}
	},
	'lem'		: {
		'name'		: 'Lem',
		'desc'		: 'Lem, the wanderer giant. Responsible for travel, directions, and knowledge. What Lem doesn’t know is not worth knowing. Also, what Lem doesn’t unknow is not worth unknowing. (That’s Lem’s favourite joke) (Lem doesn’t know many jokes).',
		'gender'	: '(m.)',
		'followers'	: 'Lemmings',
		'giant_of'	: 'Exploration',
		'personality'	: 'Open, Unavailable, Evasive',
		'skills'	: {'Teleportation' : 77, 'Penpersonship' : 82, 'Bureaucratic Arts' : 83}
	},
	'friendly'	: {
		'name'		: 'Friendly',
		'desc'		: 'Friendly is the overseer of darkness, nocturnal things, party-planning, of social activities and their most common lubricant, booze. Friendly by name, friendly by nature: unless you neglect to buy a round.',
		'gender'	: '(m.)',
		'followers'	: 'Friends',
		'giant_of'	: 'Night & Social Life',
		'personality'	: 'Empathetic, Meddlesome',
		'skills'	: {'Cocktail Crafting' : 44, 'Distilling' : 123, 'Blending' : 43, 'Eyeballery' : 115}
	},
	'spriggan'	: {
		'name'		: 'Spriggan',
		'desc'		: 'Before Spriggan, no giant had ever imagined a tree. After Spriggan, no giant ever needed to, because he had already imagined them all. Steadfast, persistent, and somewhat rigid, Spriggan is the slumbering Giant of all Trees and Plants. Or “Trants”.',
		'gender'	: '(m.)',
		'followers'	: 'Spriggots',
		'giant_of'	: 'Trees',
		'personality'	: 'Persistent, Evergreen, Rigid',
		'skills'	: {'Arborology' : 9, 'Botany' : 15, 'Woodworking' : 118, 'Fruit Changing' : 17, 'Spice Milling' : 19, 'Gasmogrification' : 20, 'Bubble Tuning' : 18}
	},
	'cosma'		: {
		'name'		: 'Cosma',
		'desc'		: 'As flighty and aimless as anything can be (if that thing is also giant-sized), Cosma is the Giant in charge of imagining up all things airborne. From the heaviest gas to cling to a cavern floor to the tiniest fart to escape from a butterfly, Cosma is the source of it all.',
		'gender'	: '(f.)',
		'followers'	: 'Cosmapolitans',
		'giant_of'	: 'Sky & Meditation',
		'personality'	: 'Levitous, Aimless',
		'skills'	: {'Meditative Arts' : 55, 'Levitation' : 79, 'Transcendental Radiation' : 62, 'Martial Imagination' : 114, 'Piety' : 110}
	},
	'mab'		: {
		'name'		: 'Mab',
		'desc'		: 'When the harvest needs bringing in, the crops need counting, and the job needs doing right, Mab, Giant of Soil and Harvests, first to lie down and start imagining Ur into being is the giant to look to.',
		'gender'	: '(f.)',
		'followers'	: 'Mabbites',
		'giant_of'	: 'Harvesting',
		'personality'	: 'Industrious, Greedy',
		'skills'	: {'Soil Appreciation' : 1, 'Croppery' : 14, 'Herbalism' : 107}
	},
	'ti'		: {
		'name'		: 'Tii',
		'desc'		: 'The Giant with power over all numbers. Odd or even, prime or not-prime, cubed or rooted, Tii keeps a cold, watchful eye over Ur. Tii sees all, knows all, calculates all. Never underestimate Tii. Tii has already correctly estimated you.',
		'gender'	: '(n/a)',
		'followers'	: "Ti'ites",
		'giant_of'	: 'Odd & Even Numbers',
		'personality'	: 'Cold, Reckoning',
		'skills'	: {'Alchemy' : 51, 'Element Handling' : 50, 'Intermediate Admixing' : 16, 'Crystallography' : 88, 'Potionmaking' : 127, 'Tincturing' : 132}
	},
	'grendaline'	: {
		'name'		: 'Grendaline',
		'desc'		: 'Grendaline, raised in a swamp, has an imagination as free-flowing as water. This makes sense, as water is what she spends most of her time imagining. If it sprinkles, drips, flows or gushes, Grendaline is your giant.',
		'gender'	: '(f.)',
		'followers'	: 'Grendalinians',
		'giant_of'	: 'Water',
		'personality'	: 'Loyal, Fierce',
		'skills'	: {'Light Green Thumb' : 6, 'Bog Specialization' : 85, 'Jellisac Hands' : 90}
	},
	'zille'		: {
		'name'		: 'Zille',
		'desc'		: 'Zille is the giant with dominion over the mountains. All rocks, caverns, hillocks, pingos, buttes and drumlins thank Zille for their existence. Zille, busy imagining up new flavours of gravel, acknowledges their thanks.',
		'gender'	: '(f.)',
		'followers'	: 'Zillots',
		'giant_of'	: 'Mountains',
		'personality'	: 'Friendly, Neurotic',
		'skills'	: {'Mining' : 52, 'Refining' : 54, 'Smelting' : 80, 'Metalworking' : 126}
	},
	'alph'		: {
		'name'		: 'Alph',
		'desc'		: 'Alph is the giant responsible for creating “things”. And also “stuff”. Approaching everything with the question “What IF?”, Alph is never happier than when the answer results in a complex wadjamacallit or a satisfyingly big boom.',
		'gender'	: '(m.)',
		'followers'	: 'Alphas',
		'giant_of'	: 'Creation',
		'personality'	: 'Playful, Inconsistent, Unreliable',
		'skills'	: {'Furnituremaking' : 99, 'Tinkering' : 72, 'Engineering' : 92, 'Fuelmaking' : 91, 'Blockmaking' : 93}
	},
	'pot'		: {
		'name'		: 'Pot',
		'desc'		: 'Round of belly and capacious of stomach Pot is the Giant of Prosperity, with dominion over anything edible, cookable, munchable or nibbleworthy. Pot himself is not munchable. Do not attempt to munch any giants.',
		'gender'	: '(m.)',
		'followers'	: 'Potians',
		'giant_of'	: 'Prosperity',
		'personality'	: 'Generous, Gluttonous, Impatient',
		'skills'	: {'EZ Cooking' : 35, 'Cheffery' : 36, 'Saucery' : 39, 'Grilling' : 40, 'Master Chef' : 47}
	}
	
};

// these need to match the variants in http://svn.tinyspeck.com/wsvn/main/item_swfs/hi_overlay.as
var hi_emote_variants = ['bats', 'birds', 'butterflies', 'cubes', 'flowers', 'hands', 'hearts', 'hi', 'pigs', 'rocketships', 'stars'];
var hi_emote_variants_color_map = {
	'bats':'#353535',
	'birds':'#9afe66',
	'butterflies':'#ce42ab',
	'cubes':'#45669c',
	'flowers':'#50c7cf',
	'hands':'#ffffff',
	'hearts':'#840607',
	'hi':'#f67e30',
	'pigs':'#ef7e6c',
	'rocketships':'#cb0303',
	'stars':'#ffd205'
}
var hi_emote_variants_name_map = {
	'bats':'Bats',
	'birds':'Birds',
	'butterflies':'Butterflies',
	'cubes':'Cubes',
	'flowers':'Flowers',
	'hands':'Hands',
	'hearts':'Hearts',
	'hi':'HI',
	'pigs':'Pigs',
	'rocketships':'Rockets',
	'stars':'Stars'
}

var hi_emote_base_mood = 5;
var hi_emote_bonus_mood = 10;
