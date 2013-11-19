var name		= "Corporate Cabinetmaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carefully crafted 13 cabinets";
var status_text		= "You made cabinets. Not everyone can make cabinets. But you can: and did.  You made 13 of them, and earned this beautiful badge. Now get out of here before I cry.";
var last_published	= 1348797364;
var is_shareworthy	= 1;
var url		= "corporate-cabinetmaker";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/corporate_cabinetmaker_1339700465.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/corporate_cabinetmaker_1339700465_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/corporate_cabinetmaker_1339700465_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/corporate_cabinetmaker_1339700465_40.png";
function on_apply(pc){
	
}
var conditions = {
	748 : {
		type	: "counter",
		group	: "furniture_cabinets",
		label	: "made",
		value	: "13"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 75
	}
};

//log.info("corporate_cabinetmaker.js LOADED");

// generated ok (NO DATE)
