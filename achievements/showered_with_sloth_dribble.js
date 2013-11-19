var name		= "Showered with Sloth-Dribble";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Spat at by a sloth 11 times";
var status_text		= "So much do the Sloths love you now that they spit snails at you without even needing a rod. Yes, you get showered by a fine mist of Sloth-dribble, but is it worth it? Yes! Because you also get a badge!";
var last_published	= 1348802551;
var is_shareworthy	= 1;
var url		= "showered-with-sloth-dribble";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/showered_with_sloth_dribble_1339708098.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/showered_with_sloth_dribble_1339708098_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/showered_with_sloth_dribble_1339708098_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/showered_with_sloth_dribble_1339708098_40.png";
function on_apply(pc){
	
}
var conditions = {
	763 : {
		type	: "counter",
		group	: "sloth",
		label	: "got_bonus_snails",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 100
	}
};

//log.info("showered_with_sloth_dribble.js LOADED");

// generated ok (NO DATE)
