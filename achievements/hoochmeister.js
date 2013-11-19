var name		= "Hoochmeister";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wet your whistle 79 times";
var status_text		= "Your whistle is thoroughly wetted. Congratulation! You're a bona fide Hoochmeister.";
var last_published	= 1348799163;
var is_shareworthy	= 1;
var url		= "hoochmeister";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hoochmeister_1304983774.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hoochmeister_1304983774_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hoochmeister_1304983774_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hoochmeister_1304983774_40.png";
function on_apply(pc){
	
}
var conditions = {
	175 : {
		type	: "counter",
		group	: "items_drank",
		label	: "alcohol",
		value	: "79"
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
	pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 50
	}
};

//log.info("hoochmeister.js LOADED");

// generated ok (NO DATE)
