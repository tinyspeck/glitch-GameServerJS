var name		= "Major Player";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Played Glitch for a sweetly life-affirming 11 hours";
var status_text		= "You're still here! It's our favorite thing about you. Honor your stick-to-it-iveness with the title Major Player.";
var last_published	= 1348801533;
var is_shareworthy	= 1;
var url		= "major-player";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/major_player_1304984812.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/major_player_1304984812_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/major_player_1304984812_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/major_player_1304984812_40.png";
function on_apply(pc){
	
}
var conditions = {
	358 : {
		type	: "group_sum",
		group	: "time_played",
		value	: "39600"
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
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400
};

//log.info("major_player.js LOADED");

// generated ok (NO DATE)
