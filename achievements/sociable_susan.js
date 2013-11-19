var name		= "Sociable Susan";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 23 different home streets";
var status_text		= "On a visiting spree? Swinging by to see pals? Whatever you're doing, you've visited 23 home streets, and earned yourself a badge for it. Ker-CHING!";
var last_published	= 1348802849;
var is_shareworthy	= 1;
var url		= "sociable-susan";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/sociable_susan_1340931474.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/sociable_susan_1340931474_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/sociable_susan_1340931474_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-28\/sociable_susan_1340931474_40.png";
function on_apply(pc){
	
}
var conditions = {
	778 : {
		type	: "group_count",
		group	: "player_streets_visited",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 50
	}
};

//log.info("sociable_susan.js LOADED");

// generated ok (NO DATE)
