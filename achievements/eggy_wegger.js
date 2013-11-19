var name		= "Eggy Wegger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Noshed on 23 eggs";
var status_text		= "Who likes their eggy-weggies? You do! You've earned the Eggy-Wegger badge.";
var last_published	= 1348797732;
var is_shareworthy	= 1;
var url		= "eggy-wegger";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/eggy_wegger_1304983527.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/eggy_wegger_1304983527_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/eggy_wegger_1304983527_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/eggy_wegger_1304983527_40.png";
function on_apply(pc){
	
}
var conditions = {
	51 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "egg_plain",
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 10
	}
};

//log.info("eggy_wegger.js LOADED");

// generated ok (NO DATE)
