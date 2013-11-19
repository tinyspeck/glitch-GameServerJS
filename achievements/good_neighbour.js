var name		= "Good Neighbour";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Added 5 friends to your signpost";
var status_text		= "You've added five friends to your signpost. Doesn't that just make you feel warm and fuzzy inside? No? Well, what about this badge? WOO!";
var last_published	= 1340308178;
var is_shareworthy	= 0;
var url		= "good-neighbour";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/good_neighbour_1339702859.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/good_neighbour_1339702859_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/good_neighbour_1339702859_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/good_neighbour_1339702859_40.png";
function on_apply(pc){
	
}
var conditions = {
	766 : {
		type	: "counter",
		group	: "signpost",
		label	: "num_neighbors",
		value	: "5"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 50
	}
};

//log.info("good_neighbour.js LOADED");

// generated ok (NO DATE)
