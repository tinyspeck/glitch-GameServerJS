var name		= "Heavy Metallurgist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Professionally rubbed 41 Plain Metal Ingots into Molybdenum";
var status_text		= "When you rub Plain Metal Ingots into Molybdenum for the first time, you can congratulate yourself on a job well done. When you do it 41 times, you can bask in knowledge you've earned the title of Heavy Metallurgist. Not very heavy. But pretty heavy, man.";
var last_published	= 1348799110;
var is_shareworthy	= 1;
var url		= "heavy-metallurgist";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/heavy_metallurgist_1315685812.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/heavy_metallurgist_1315685812_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/heavy_metallurgist_1315685812_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/heavy_metallurgist_1315685812_40.png";
function on_apply(pc){
	
}
var conditions = {
	463 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "176",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 45
	}
};

//log.info("heavy_metallurgist.js LOADED");

// generated ok (NO DATE)
