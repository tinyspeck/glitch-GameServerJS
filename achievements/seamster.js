var name		= "Seamster";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Lovingly crafted 17 pieces of general fabric";
var status_text		= "You've created 17 tiny miracles in general fabric, soft yet pliable, strong yet fluid, it's like the fabric of time, except it's the fabric of fabric. Have a badge!";
var last_published	= 1340308008;
var is_shareworthy	= 0;
var url		= "seamster";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/seamster_1339698262.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/seamster_1339698262_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/seamster_1339698262_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/seamster_1339698262_40.png";
function on_apply(pc){
	
}
var conditions = {
	703 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "295",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 40
	}
};

//log.info("seamster.js LOADED");

// generated ok (NO DATE)
