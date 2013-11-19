var name		= "Professional Furniturerer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 101 furniture items";
var status_text		= "Like a true grafter, you put heart and soul (also wood, snails etc)  into 101 pieces of furniture. Sit back and appreciate the Professional standard of your Furniturerering. And your badge. Here's your badge.";
var last_published	= 1348802265;
var is_shareworthy	= 1;
var url		= "professional-furniturerer";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/professional_furniturerer_1339718075.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/professional_furniturerer_1339718075_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/professional_furniturerer_1339718075_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/professional_furniturerer_1339718075_40.png";
function on_apply(pc){
	
}
var conditions = {
	742 : {
		type	: "counter",
		group	: "furniture_items",
		label	: "made",
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

//log.info("professional_furniturerer.js LOADED");

// generated ok (NO DATE)
