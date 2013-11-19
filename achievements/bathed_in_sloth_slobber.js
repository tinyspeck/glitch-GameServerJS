var name		= "Bathed in Sloth-Slobber";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Spat at by a sloth 101 times";
var status_text		= "Sure your clothes are soaked through with the sticky slobber of 101 sloths that just won't wash out, but it's worth it for the snails, right? And the badge! Yay badges!";
var last_published	= 1348796760;
var is_shareworthy	= 1;
var url		= "bathed-in-sloth-slobber";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bathed_in_sloth_slobber_1339708101.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bathed_in_sloth_slobber_1339708101_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bathed_in_sloth_slobber_1339708101_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bathed_in_sloth_slobber_1339708101_40.png";
function on_apply(pc){
	
}
var conditions = {
	764 : {
		type	: "counter",
		group	: "sloth",
		label	: "got_bonus_snails",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 250
	}
};

//log.info("bathed_in_sloth_slobber.js LOADED");

// generated ok (NO DATE)
