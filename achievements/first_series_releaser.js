var name		= "First Series Releaser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set free one each of the releasable Series 1 Cubimals";
var status_text		= "There were only so many chicks you could house, so you set them, with some of their little friends, free. How kind you are! For your kindness: a badge.";
var last_published	= 1340307870;
var is_shareworthy	= 0;
var url		= "first-series-releaser";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/first_series_releaser_1339723073.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/first_series_releaser_1339723073_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/first_series_releaser_1339723073_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/first_series_releaser_1339723073_40.png";
function on_apply(pc){
	
}
var conditions = {
	709 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_piggy",
		value	: "1"
	},
	710 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_batterfly",
		value	: "1"
	},
	711 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_bureaucrat",
		value	: "1"
	},
	712 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_butterfly",
		value	: "1"
	},
	713 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_cactus",
		value	: "1"
	},
	714 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_chick",
		value	: "1"
	},
	715 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_crab",
		value	: "1"
	},
	716 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_firefly",
		value	: "1"
	},
	717 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_frog",
		value	: "1"
	},
	719 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_juju",
		value	: "1"
	},
	720 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_snoconevendor",
		value	: "1"
	},
	721 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_squid",
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 200
	}
};

//log.info("first_series_releaser.js LOADED");

// generated ok (NO DATE)
