var name		= "Series 2 Cubimal Wrangler";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all varieties of Series 2 Cubimals.";
var status_text		= "You got them all!";
var last_published	= 1339461120;
var is_shareworthy	= 0;
var url		= "series-2-cubimal-wrangler";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-11\/collection_cubimals_2_1339462180.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-11\/collection_cubimals_2_1339462180_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-11\/collection_cubimals_2_1339462180_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-11\/collection_cubimals_2_1339462180_40.png";
function on_apply(pc){
	
}
var conditions = {
	672 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_butler",
		value	: "1"
	},
	673 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_craftybot",
		value	: "1"
	},
	674 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_emobear",
		value	: "1"
	},
	675 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_firebogstreetspirit",
		value	: "1"
	},
	676 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_fox",
		value	: "1"
	},
	677 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_foxranger",
		value	: "1"
	},
	678 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_gardeningtoolsvendor",
		value	: "1"
	},
	679 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_gnome",
		value	: "1"
	},
	680 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_groddlestreetspirit",
		value	: "1"
	},
	681 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_hellbartender",
		value	: "1"
	},
	682 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_ilmenskiejones",
		value	: "1"
	},
	683 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_maintenancebot",
		value	: "1"
	},
	684 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_mealvendor",
		value	: "1"
	},
	685 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_phantom",
		value	: "1"
	},
	686 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_scionofpurple",
		value	: "1"
	},
	687 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_senorfunpickle",
		value	: "1"
	},
	688 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_sloth",
		value	: "1"
	},
	689 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_toolvendor",
		value	: "1"
	},
	690 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_trisor",
		value	: "1"
	},
	691 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "npc_cubimal_uraliastreetspirit",
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
	pc.createItemFromFamiliar("trophy_cubimal_2", 1);
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
			"class_id"	: "trophy_cubimal_2",
			"label"		: "Cubimal Series 2 Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_cubimals_2.js LOADED");

// generated ok (NO DATE)
