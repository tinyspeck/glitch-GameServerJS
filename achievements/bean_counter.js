var name		= "Bean Counter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Harvested 503 Beans";
var status_text		= "Clearly this Bean harvesting is more than just a hobby for you. You are now a fully fledged Bean Counter.";
var last_published	= 1336502563;
var is_shareworthy	= 0;
var url		= "bean-counter";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_1304984416.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_1304984416_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_1304984416_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bean_counter_1304984416_40.png";
function on_apply(pc){
	
}
var conditions = {
	289 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "bean_plain",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("bean_counter.js LOADED");

// generated ok (NO DATE)
