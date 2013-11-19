var name		= "Ace Propagationist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 401 Crops";
var status_text		= "O, frabjous day! You've planted your 401st crop! You've achieved Ace Propagationist status.";
var last_published	= 1348796047;
var is_shareworthy	= 1;
var url		= "ace-propagationist";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ace_propagationist_1304983834.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ace_propagationist_1304983834_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ace_propagationist_1304983834_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/ace_propagationist_1304983834_40.png";
function on_apply(pc){
	
}
var conditions = {
	186 : {
		type	: "group_sum",
		group	: "garden_plots_planted",
		value	: "401"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 150
	}
};

//log.info("ace_propagationist.js LOADED");

// generated ok (NO DATE)
