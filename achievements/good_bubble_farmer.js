var name		= "Good Bubble Farmer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ever-so-carefully harvested 101 Bubbles";
var status_text		= "Bloop! Not many people know this, but 'Bloop!' means congratulations in the Bubble Farmer community. Now that you've achieved the level of Good Bubble Farmer, it's crucial that you know this.";
var last_published	= 1349313877;
var is_shareworthy	= 1;
var url		= "good-bubble-farmer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/good_bubble_farmer_1304984392.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/good_bubble_farmer_1304984392_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/good_bubble_farmer_1304984392_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/good_bubble_farmer_1304984392_40.png";
function on_apply(pc){
	
}
var conditions = {
	285 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "plain_bubble",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 15
	}
};

//log.info("good_bubble_farmer.js LOADED");

// generated ok (NO DATE)
