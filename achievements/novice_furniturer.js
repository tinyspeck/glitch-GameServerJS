var name		= "Novice Furniturer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 37 furniture items";
var status_text		= "Tirelessly, you toiled to create 37 pieces of furniture. Have yourself a nice cup of tea and a biscuit. And a badge. Here's your badge.";
var last_published	= 1348801944;
var is_shareworthy	= 1;
var url		= "novice-furniturer";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/novice_furniturer_1339717946.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/novice_furniturer_1339717946_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/novice_furniturer_1339717946_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/novice_furniturer_1339717946_40.png";
function on_apply(pc){
	
}
var conditions = {
	741 : {
		type	: "counter",
		group	: "furniture_items",
		label	: "made",
		value	: "37"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(70 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 70
	}
};

//log.info("novice_furniturer.js LOADED");

// generated ok (NO DATE)
