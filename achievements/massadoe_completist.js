var name		= "Massadoe Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Massadoe";
var status_text		= "Wow, It's foggy down here! I almost didn't see you step in that guano back there. But guess what? The batterflies tell me you've been to everywhere there is to be in Massadoe! That, my friend, is something to be rewarded for. Maybe use this reward to buy some new shoes huh?";
var last_published	= 1353452638;
var is_shareworthy	= 1;
var url		= "massadoe-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/massadoe_completist_1347063083.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/massadoe_completist_1347063083_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/massadoe_completist_1347063083_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/massadoe_completist_1347063083_40.png";
function on_apply(pc){
	
}
var conditions = {
	793 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_110",
		value	: "20"
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
	pc.stats_add_currants(round_to_5(100 * multiplier));
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 100,
	"currants"	: 100,
	"favor"		: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("massadoe_completist.js LOADED");

// generated ok (NO DATE)
