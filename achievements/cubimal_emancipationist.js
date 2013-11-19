var name		= "Cubimal Emancipationist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Freed 251 Cubimals";
var status_text		= "Bound in racing servitude, 251 Cubimals were straining to be free.Thanks to you, they are. Words are not enough: so here's a badge. FREEDOM!";
var last_published	= 1348797396;
var is_shareworthy	= 1;
var url		= "cubimal-emancipationist";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-21\/cubimal_emancipationist_1340313072.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-21\/cubimal_emancipationist_1340313072_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-21\/cubimal_emancipationist_1340313072_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-21\/cubimal_emancipationist_1340313072_40.png";
function on_apply(pc){
	
}
var conditions = {
	708 : {
		type	: "group_sum",
		group	: "cubimals_freed",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(1500 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(300 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1500,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 300
	}
};

//log.info("cubimal_emancipationist.js LOADED");

// generated ok (NO DATE)
