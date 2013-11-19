var name		= "Master of the Hi Coup";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Hit the Mega-Hi 311 times";
var status_text		= "It's nice to say Hi. And with all these matching signs, you got a new badge!";
var last_published	= 1351302650;
var is_shareworthy	= 1;
var url		= "master-of-the-hi-coup";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/master_of_the_hi_coup_1351296896.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/master_of_the_hi_coup_1351296896_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/master_of_the_hi_coup_1351296896_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/master_of_the_hi_coup_1351296896_40.png";
function on_apply(pc){
	
}
var conditions = {
	845 : {
		type	: "group_sum",
		group	: "hi_jackpot",
		value	: "311"
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
	pc.stats_add_xp(round_to_5(1500 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1500,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 250
	}
};

//log.info("master_of_the_hi_coup.js LOADED");

// generated ok (NO DATE)
