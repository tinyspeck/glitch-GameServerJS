var name		= "Decent Citizen";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave 11 gifts to other players";
var status_text		= "Aw... doesn't giving feel good? And now let's give something to you: a Decent Citizen badge.";
var last_published	= 1338927054;
var is_shareworthy	= 0;
var url		= "decent-citizen";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_citizen_1304984031.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_citizen_1304984031_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_citizen_1304984031_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/decent_citizen_1304984031_40.png";
function on_apply(pc){
	
}
var conditions = {
	221 : {
		type	: "group_sum",
		group	: "items_given",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(5 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 5
	}
};

//log.info("decent_citizen.js LOADED");

// generated ok (NO DATE)
