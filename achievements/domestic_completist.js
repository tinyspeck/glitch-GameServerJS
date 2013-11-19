var name		= "Domestic Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted each furniture item at least once";
var status_text		= "It takes a certain dedication to craft every single piece of furniture item at least once. You have that dedication, Domestic Completist. Also, you have every single piece of furniture. Oh, and a badge.";
var last_published	= 1348797678;
var is_shareworthy	= 1;
var url		= "domestic-completist";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/domestic_completist_1339700608.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/domestic_completist_1339700608_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/domestic_completist_1339700608_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/domestic_completist_1339700608_40.png";
function on_apply(pc){
	
}
var conditions = {
	756 : {
		type	: "group_count",
		group	: "furniture_made",
		value	: "27"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 150
	}
};

//log.info("domestic_completist.js LOADED");

// generated ok (NO DATE)
