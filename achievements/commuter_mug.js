var name		= "Commuter Mug";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Rode the subway rails 251 times";
var status_text		= "Felicitations! You've fearlessly braved stepped-on toes and the stinky pits of your fellow travellers, thereby earning the title of Commuter Mug.";
var last_published	= 1348797097;
var is_shareworthy	= 1;
var url		= "commuter-mug";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-12\/commuter_mug_1315871159.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-12\/commuter_mug_1315871159_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-12\/commuter_mug_1315871159_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-12\/commuter_mug_1315871159_40.png";
function on_apply(pc){
	
}
var conditions = {
	555 : {
		type	: "counter",
		group	: "transit",
		label	: "subways_entered",
		value	: "251"
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
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
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
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("commuter_mug.js LOADED");

// generated ok (NO DATE)
