var name		= "Xalanga Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Xalanga";
var status_text		= "BOOM! You have systematically strutted down every street in Xalanga, a dusty region as exotic-sounding as it is sensibly grid-based. And for this - and just because you're awesome - you get a Xalanga Completist Badge.";
var last_published	= 1350066594;
var is_shareworthy	= 1;
var url		= "xalanga-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/xalanga_completist_1316577434.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/xalanga_completist_1316577434_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/xalanga_completist_1316577434_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/xalanga_completist_1316577434_40.png";
function on_apply(pc){
	
}
var conditions = {
	598 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_95",
		value	: "40"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 50
	}
};

//log.info("xalanga_completist.js LOADED");

// generated ok (NO DATE)
