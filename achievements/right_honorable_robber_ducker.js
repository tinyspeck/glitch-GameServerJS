var name		= "Right Honorable Robber-Ducker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Deftly ducked 509 nefarious Juju Bandits";
var status_text		= "You've smoothly eluded the grabby little hands of 509 Juju Bandits, and there's only one thing can be said to that: Robber ducker, you're the one.";
var last_published	= 1348802491;
var is_shareworthy	= 1;
var url		= "right-honorable-robber-ducker";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/right_honorable_robber_ducker_1315686139.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/right_honorable_robber_ducker_1315686139_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/right_honorable_robber_ducker_1315686139_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/right_honorable_robber_ducker_1315686139_40.png";
function on_apply(pc){
	
}
var conditions = {
	575 : {
		type	: "counter",
		group	: "juju_bandits",
		label	: "escaped",
		value	: "509"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 200
	}
};

//log.info("right_honorable_robber_ducker.js LOADED");

// generated ok (NO DATE)
