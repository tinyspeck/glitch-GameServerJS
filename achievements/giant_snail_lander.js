var name		= "Giant Snail Lander";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Landed 10009 sloth-produced snails";
var status_text		= "Slowly Slowly catchee snailee, or so they say. And they're right: it took a while but you finally garnered 10009 snails. Hurrah!";
var last_published	= 1348798817;
var is_shareworthy	= 1;
var url		= "giant-snail-lander";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/giant_snail_lander_1339702818.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/giant_snail_lander_1339702818_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/giant_snail_lander_1339702818_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/giant_snail_lander_1339702818_40.png";
function on_apply(pc){
	
}
var conditions = {
	762 : {
		type	: "counter",
		group	: "sloth",
		label	: "snails_received",
		value	: "10009"
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
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(350 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 350
	}
};

//log.info("giant_snail_lander.js LOADED");

// generated ok (NO DATE)
