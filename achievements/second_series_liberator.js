var name		= "Second Series Liberator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Set free one of each of the releasable Series 2 Cubimals";
var status_text		= "12 little series 2 cubimal friends are out there somewhere relishing their freedom thanks to you. Bravo, Liberator. And for your magnanimosity, a badge.";
var last_published	= 1348802515;
var is_shareworthy	= 1;
var url		= "second-series-liberator";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/second_series_liberator_1339702828.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/second_series_liberator_1339702828_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/second_series_liberator_1339702828_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/second_series_liberator_1339702828_40.png";
function on_apply(pc){
	
}
var conditions = {
	722 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_fox",
		value	: "1"
	},
	723 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_sloth",
		value	: "1"
	},
	724 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_emobear",
		value	: "1"
	},
	725 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_foxranger",
		value	: "1"
	},
	726 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_groddlestreetspirit",
		value	: "1"
	},
	727 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_uraliastreetspirit",
		value	: "1"
	},
	728 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_firebogstreetspirit",
		value	: "1"
	},
	729 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_gnome",
		value	: "1"
	},
	730 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_butler",
		value	: "1"
	},
	731 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_craftybot",
		value	: "1"
	},
	732 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_phantom",
		value	: "1"
	},
	733 : {
		type	: "counter",
		group	: "cubimals_freed",
		label	: "npc_cubimal_ilmenskiejones",
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

//log.info("second_series_liberator.js LOADED");

// generated ok (NO DATE)
