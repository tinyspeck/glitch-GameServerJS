var name		= "Order of the Hoarder";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 211 Storage Display Boxes";
var status_text		= "With your 211 magnificently crafted Storage Display Boxes, you have truly joined - if not founded - the Order of the Hoarder. Take your commemorative badge, and display it with pride.";
var last_published	= 1348802180;
var is_shareworthy	= 1;
var url		= "order-of-the-hoarder";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/order_of_the_hoarder_1339718440.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/order_of_the_hoarder_1339718440_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/order_of_the_hoarder_1339718440_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/order_of_the_hoarder_1339718440_40.png";
function on_apply(pc){
	
}
var conditions = {
	705 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "255",
		value	: "211"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 200
	}
};

//log.info("order_of_the_hoarder.js LOADED");

// generated ok (NO DATE)
