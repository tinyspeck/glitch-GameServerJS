var name		= "Bean Counter Pro";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 1009 Beans";
var status_text		= "Bean Counter Pro isn't just a title. It's a way of life. A way that involves a lot of Beans.";
var last_published	= 1348796766;
var is_shareworthy	= 1;
var url		= "bean-counter-pro";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_pro_1304984447.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_pro_1304984447_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_pro_1304984447_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_pro_1304984447_40.png";
function on_apply(pc){
	
}
var conditions = {
	295 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "bean_plain",
		value	: "1009"
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
	pc.stats_add_favor_points("spriggan", round_to_5(60 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 60
	}
};

//log.info("bean_counter_pro.js LOADED");

// generated ok (NO DATE)
