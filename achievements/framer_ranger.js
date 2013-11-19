var name		= "Framer Ranger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 23 frames for wall decorations";
var status_text		= "Because any wise glitch knows that a decoration without a frame is just a piece of colourful something thrown at the wall, you made frames. 23 of them, in fact, you Wise little Framer Ranger, you.";
var last_published	= 1348798482;
var is_shareworthy	= 1;
var url		= "framer-ranger";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/framer_ranger_1339700449.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/framer_ranger_1339700449_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/framer_ranger_1339700449_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/framer_ranger_1339700449_40.png";
function on_apply(pc){
	
}
var conditions = {
	745 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "274",
		value	: "23"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 100
	}
};

//log.info("framer_ranger.js LOADED");

// generated ok (NO DATE)
