var name		= "Hill of Beams";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Knocked up 107 Beams";
var status_text		= "You've made 107 beams. Blimey, that's a bunch of beams. A Hill of Beams in a crazy world. A beam bonanza. Behold: a badge.";
var last_published	= 1348799144;
var is_shareworthy	= 1;
var url		= "hill-of-beams";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hill_of_beams_1339697769.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hill_of_beams_1339697769_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hill_of_beams_1339697769_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hill_of_beams_1339697769_40.png";
function on_apply(pc){
	
}
var conditions = {
	694 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "278",
		value	: "107"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 100
	}
};

//log.info("hill_of_beams.js LOADED");

// generated ok (NO DATE)
