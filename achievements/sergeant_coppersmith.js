var name		= "Sergeant Coppersmith";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Vigorously rubbed, tugged and massaged 137 Plain Metal Ingots into Copper";
var status_text		= "When you rub and tug this many Plain Metal Ingots into Copper, they call you Coppersmith: Sergeant Coppersmith. (They call you other stuff, too.)";
var last_published	= 1348802537;
var is_shareworthy	= 1;
var url		= "sergeant-coppersmith";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sergeant_coppersmith_1315685808.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sergeant_coppersmith_1315685808_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sergeant_coppersmith_1315685808_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sergeant_coppersmith_1315685808_40.png";
function on_apply(pc){
	
}
var conditions = {
	461 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "175",
		value	: "137"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 50
	}
};

//log.info("sergeant_coppersmith.js LOADED");

// generated ok (NO DATE)
