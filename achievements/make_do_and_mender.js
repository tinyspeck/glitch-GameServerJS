var name		= "Make Do and Mender";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Restored 53 cultivation projects";
var status_text		= "Throwaway consumer culturist? You? No: you've restored a whole 53 of them, so they can continue giving up their harvests. AND: this badge. HECKES YEAH!";
var last_published	= 1348801544;
var is_shareworthy	= 1;
var url		= "make-do-and-mender";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/make_do_and_mender_1339702882.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/make_do_and_mender_1339702882_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/make_do_and_mender_1339702882_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/make_do_and_mender_1339702882_40.png";
function on_apply(pc){
	
}
var conditions = {
	785 : {
		type	: "group_sum",
		group	: "cultivation_projects_restored",
		value	: "53"
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
	pc.stats_add_favor_points("mab", round_to_5(400 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 400
	}
};

//log.info("make_do_and_mender.js LOADED");

// generated ok (NO DATE)
