var name		= "Series 1 Cubimal Wrangler";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all varieties of Series 1 Cubimals.";
var status_text		= "You got them all!";
var last_published	= 1339461112;
var is_shareworthy	= 0;
var url		= "series-1-cubimal-wrangler";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-07\/collection_cubimals_1315426168.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-07\/collection_cubimals_1315426168_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-07\/collection_cubimals_1315426168_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-07\/collection_cubimals_1315426168_40.png";
function on_apply(pc){
	
}
var conditions = {
	437 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_batterfly",
		value	: "1"
	},
	438 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_bureaucrat",
		value	: "1"
	},
	439 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_butterfly",
		value	: "1"
	},
	440 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_cactus",
		value	: "1"
	},
	441 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_chick",
		value	: "1"
	},
	442 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_crab",
		value	: "1"
	},
	443 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_deimaginator",
		value	: "1"
	},
	444 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_dustbunny",
		value	: "1"
	},
	445 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_firefly",
		value	: "1"
	},
	446 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_frog",
		value	: "1"
	},
	447 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_greeterbot",
		value	: "1"
	},
	448 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_gwendolyn",
		value	: "1"
	},
	449 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_helga",
		value	: "1"
	},
	450 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_juju",
		value	: "1"
	},
	451 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_magicrock",
		value	: "1"
	},
	452 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_piggy",
		value	: "1"
	},
	453 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_rook",
		value	: "1"
	},
	454 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_rube",
		value	: "1"
	},
	455 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_smuggler",
		value	: "1"
	},
	456 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_snoconevendor",
		value	: "1"
	},
	457 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_squid",
		value	: "1"
	},
	458 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_unclefriendly",
		value	: "1"
	},
	459 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_yeti",
		value	: "1"
	},
};
function onComplete(pc){ // generated from rewards
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_achievement_modifier();
	if (/completist/i.exec(this.name)) { 
		 var level = pc.stats_get_level(); 
		 if (level > 4) {  
				multiplier *= (pc.stats_get_level()/4); 
		} 
	} 
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	pc.metabolics_add_mood(round_to_5(500 * multiplier));
	pc.metabolics_add_energy(round_to_5(500 * multiplier));
	pc.stats_add_favor_points("humbaba", round_to_5(200 * multiplier));
	pc.createItemFromFamiliar("trophy_cubimal", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 2000,
	"mood"		: 500,
	"energy"	: 500,
	"favor"		: {
		"giant"		: "humbaba",
		"points"	: 200
	},
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_cubimal",
			"label"		: "Cubimal Series 1 Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_cubimals.js LOADED");

// generated ok (NO DATE)
