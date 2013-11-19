var name		= "Gastro-gnome";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ate 11 meals";
var status_text		= "Bon appetit! You're a card-carrying Gastro-gnome.";
var last_published	= 1338922953;
var is_shareworthy	= 0;
var url		= "gastro-gnome";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastro_gnome_1304983554.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastro_gnome_1304983554_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastro_gnome_1304983554_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/gastro_gnome_1304983554_40.png";
function on_apply(pc){
	
}
var conditions = {
	422 : {
		type	: "group_sum",
		group	: "meals_eaten",
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(15 * multiplier));
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
		"points"	: 15
	}
};

//log.info("gastro_gnome.js LOADED");

// generated ok (NO DATE)
