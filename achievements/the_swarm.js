var name		= "The Swarm";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Raced a cubimal as part of a 31-cubimal mega-race extravaganza";
var status_text		= "You must feel honoured to be a part of one of the most mystical events in the world of the cubimals: the swarm. Your cubimal is shivering with joy having been one of the 31-strong swarm, and that's down to you. Huzzah!";
var last_published	= 1348802931;
var is_shareworthy	= 1;
var url		= "the-swarm";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/the_swarm_1340238852.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/the_swarm_1340238852_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/the_swarm_1340238852_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-20\/the_swarm_1340238852_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(550 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 550,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 100
	}
};

//log.info("the_swarm.js LOADED");

// generated ok (NO DATE)
